"""
Gateway serial ↔ OhStem MQTT (mqtt.ohstem.vn).
Khớp backend: api/app/config/channel-map.js — V1..V4 cảm biến, V10/V11 bơm.

Cấu hình: biến môi trường hoặc file .env cạnh script (python-dotenv).
"""
import os
import sys
import time
import random

import serial
import serial.tools.list_ports

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

import paho.mqtt.client as mqtt

# --- OhStem MQTT (Server) ---
OHSTEM_MQTT_HOST = os.environ.get("OHSTEM_MQTT_HOST", "mqtt.ohstem.vn")
OHSTEM_MQTT_PORT = int(os.environ.get("OHSTEM_MQTT_PORT", "1883"))
OHSTEM_MQTT_USER = os.environ.get("OHSTEM_MQTT_USER", "")
OHSTEM_MQTT_PASSWORD = os.environ.get("OHSTEM_MQTT_PASSWORD", "")
# Ví dụ: username/feeds → topic username/feeds/V1 ...
OHSTEM_TOPIC_PREFIX = os.environ.get("OHSTEM_TOPIC_PREFIX", "").rstrip("/")

# Subscribe: lệnh bơm (khớp V10/V11)
SUBSCRIBE_SUFFIXES = ["V10", "V11"]

# Publish: TAG từ serial → suffix OhStem
PUBLISH_TAGS = {
    "TEMP": "V1",
    "HUMI": "V2",
    "MOISTURE": "V3",
    "LIGHT": "V4",
}

OHSTEM_TO_SERIAL_PUMP = {"V10": "pump-1", "V11": "pump-2"}

SERIAL_PORT = os.environ.get("SERIAL_PORT", "").strip()
SERIAL_BAUD = int(os.environ.get("SERIAL_BAUD", "115200"), 10)
# Nối sau mỗi lệnh ghi (ví dụ \n hoặc \r\n) nếu firmware đọc theo dòng — mặc định rỗng = !tag:val#
SERIAL_COMMAND_SUFFIX = os.environ.get("SERIAL_COMMAND_SUFFIX", "").replace(
    "\\n", "\n"
).replace("\\r", "\r")
_SERIAL_DBG = os.environ.get("SERIAL_DEBUG", "").strip().lower()
SERIAL_DEBUG = _SERIAL_DBG in ("1", "true", "yes", "on")
# Windows: COM bận (MakeCode/Arduino) hoặc lỗi driver — chỉ MQTT + dữ liệu giả lập
_DISABLE = os.environ.get("DISABLE_SERIAL", "").strip().lower()
DISABLE_SERIAL = _DISABLE in ("1", "true", "yes", "on")

mqtt_client = None
ser = None
# Serial an toàn khi COM lỗi (WriteFile / ClearCommError): đóng cổng + backoff mở lại
_serial_port_name = None
_serial_next_retry = 0.0
_serial_backoff_sec = 5.0
_serial_last_err_log = -1e9  # log lỗi đầu tiên ngay (không chờ 30s)
_SERIAL_ERR_LOG_INTERVAL = 30.0


def normalize_pump_payload(p: str) -> str:
    u = (p or "").strip().upper()
    if u in ("1", "ON", "TRUE"):
        return "ON"
    if u in ("0", "OFF", "FALSE", ""):
        return "OFF"
    return u


def _topic(suffix: str) -> str:
    if not OHSTEM_TOPIC_PREFIX:
        return suffix
    return f"{OHSTEM_TOPIC_PREFIX}/{suffix}"


def publish_value(suffix: str, value) -> None:
    global mqtt_client
    if not OHSTEM_TOPIC_PREFIX:
        print("[OhStem] Bỏ qua publish: chưa set OHSTEM_TOPIC_PREFIX.")
        return
    if mqtt_client is None:
        return
    topic = _topic(suffix)
    mqtt_client.publish(topic, str(value), qos=0)
    print(f"Đã publish {value} → {topic}")


def on_connect(client, userdata, flags, rc):
    if rc != 0:
        print(f"Lỗi kết nối OhStem MQTT, mã: {rc}")
        return
    print("Kết nối thành công đến OhStem Server (mqtt.ohstem.vn)...")
    if not OHSTEM_TOPIC_PREFIX:
        print("CẢNH BÁO: OHSTEM_TOPIC_PREFIX trống — không subscribe/publish được.")
        return
    for suf in SUBSCRIBE_SUFFIXES:
        t = _topic(suf)
        client.subscribe(t, qos=0)
        print("Đã subscribe:", t)


def on_subscribe(client, userdata, mid, granted_qos):
    print("Subscribe xác nhận (mid=%s)" % mid)


def on_disconnect(client, userdata, rc):
    if rc != 0:
        print(f"Ngắt kết nối OhStem MQTT (rc={rc})")


def _log_serial_error(msg: str) -> None:
    global _serial_last_err_log
    now = time.time()
    if now - _serial_last_err_log >= _SERIAL_ERR_LOG_INTERVAL:
        print(msg)
        _serial_last_err_log = now


def _close_serial() -> None:
    global ser, isMicrobitConnected
    if ser is not None:
        try:
            ser.close()
        except Exception:
            pass
        ser = None
    isMicrobitConnected = False


def _schedule_serial_retry() -> None:
    global _serial_next_retry, _serial_backoff_sec
    _serial_next_retry = time.time() + _serial_backoff_sec
    _serial_backoff_sec = min(_serial_backoff_sec * 2.0, 120.0)


def _reset_serial_backoff() -> None:
    global _serial_backoff_sec
    _serial_backoff_sec = 5.0


def _handle_serial_failure(exc: BaseException, action: str) -> None:
    _log_serial_error(f"{action}: {exc} — đóng COM, sẽ thử mở lại sau {_serial_backoff_sec:.0f}s")
    _close_serial()
    _schedule_serial_retry()


def _try_open_serial(port_name: str) -> bool:
    global ser, isMicrobitConnected
    try:
        ser = serial.Serial(
            port=port_name,
            baudrate=SERIAL_BAUD,
            timeout=0.05,
            write_timeout=2,
            dsrdtr=False,
            rtscts=False,
            xonxoff=False,
        )
        isMicrobitConnected = True
        _reset_serial_backoff()
        print(f"Đã mở Serial: {port_name} @ {SERIAL_BAUD}")
        return True
    except (serial.SerialException, OSError, PermissionError) as e:
        ser = None
        isMicrobitConnected = False
        _log_serial_error(f"Không mở được {port_name}: {e}")
        _schedule_serial_retry()
        return False


def on_message(client, userdata, msg):
    topic = msg.topic or ""
    payload = (msg.payload or b"").decode("utf-8", errors="replace").strip()
    suffix = topic.rstrip("/").split("/")[-1].upper()
    print(f"Lệnh từ OhStem: {topic} -> {payload}")

    pump_tag = OHSTEM_TO_SERIAL_PUMP.get(suffix)
    if pump_tag and isMicrobitConnected and ser is not None and ser.is_open:
        val = normalize_pump_payload(payload)
        command = f"!{pump_tag}:{val}#{SERIAL_COMMAND_SUFFIX}"
        try:
            data = command.encode("UTF-8")
            ser.write(data)
            ser.flush()
            print(f"Đã gửi xuống Serial: {command!r}")
            if SERIAL_DEBUG:
                print(f"  [SERIAL_DEBUG] bytes={data!r}")
        except (OSError, PermissionError, serial.SerialException) as e:
            _handle_serial_failure(e, "Lỗi ghi Serial")


def _build_mqtt_client():
    global mqtt_client
    cid = os.environ.get("OHSTEM_MQTT_CLIENT_ID", "yolofarm_iot_py")
    try:
        c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, client_id=cid)
    except AttributeError:
        c = mqtt.Client(client_id=cid)
    if OHSTEM_MQTT_USER or OHSTEM_MQTT_PASSWORD:
        c.username_pw_set(OHSTEM_MQTT_USER or None, OHSTEM_MQTT_PASSWORD or None)
    c.on_connect = on_connect
    c.on_disconnect = on_disconnect
    c.on_message = on_message
    c.on_subscribe = on_subscribe
    try:
        c.connect(OHSTEM_MQTT_HOST, OHSTEM_MQTT_PORT, keepalive=60)
    except OSError as e:
        print(f"Không kết nối được OhStem broker {OHSTEM_MQTT_HOST}:{OHSTEM_MQTT_PORT}: {e}")
        sys.exit(1)
    c.loop_start()
    mqtt_client = c


_build_mqtt_client()


def get_port_name():
    if SERIAL_PORT:
        return SERIAL_PORT
    ports = serial.tools.list_ports.comports()
    hints = (
        "USB Serial",
        "USB-SERIAL",
        "CH340",
        "CP210",
        "Silicon Labs",
        "mbed",
        "Yolo",
        "Micro:bit",
    )
    for p in ports:
        desc = f"{p.description or ''} {p.manufacturer or ''}"
        if any(h.lower() in desc.lower() for h in hints):
            return p.device
    for p in ports:
        if p.device.upper().startswith("COM"):
            return p.device
    return None


isMicrobitConnected = False
serial_port = None if DISABLE_SERIAL else get_port_name()
if DISABLE_SERIAL:
    print("DISABLE_SERIAL=1 — bỏ qua COM (chỉ MQTT + dữ liệu giả lập).")
elif serial_port:
    _serial_port_name = serial_port
    _try_open_serial(serial_port)
else:
    print("Không tìm thấy cổng serial — chỉ MQTT OhStem + dữ liệu giả lập.")


mess = ""


def readSerial():
    global mess
    if ser is None or not ser.is_open:
        return
    try:
        chunk = ser.read(4096)
        if chunk:
            mess += chunk.decode("UTF-8", errors="replace")
    except (OSError, PermissionError, serial.SerialException) as e:
        _handle_serial_failure(e, "Lỗi đọc Serial")
        return
    while ("#" in mess) and ("!" in mess):
        start = mess.find("!")
        end = mess.find("#")
        if start < end:
            processData(mess[start : end + 1])
        if end == len(mess) - 1:
            mess = ""
        else:
            mess = mess[end + 1 :]


def processData(data):
    data = data.replace("!", "").replace("#", "")
    splitData = data.split(":")

    if len(splitData) >= 2:
        tag = splitData[0]
        value = splitData[1]

        if tag in PUBLISH_TAGS:
            suffix = PUBLISH_TAGS[tag]
            publish_value(suffix, value)


def simulate_sensor_data():
    temp_value = round(random.uniform(25.0, 35.0), 1)
    humi_value = round(random.uniform(50.0, 80.0), 1)
    light_value = random.randint(10, 100)
    moisture_value = random.randint(20, 90)

    fake_data = {
        "TEMP": temp_value,
        "HUMI": humi_value,
        "LIGHT": light_value,
        "MOISTURE": moisture_value,
    }

    print("\n--- GỬI DỮ LIỆU TEST LÊN OHSTEM ---")
    for tag, value in fake_data.items():
        if tag in PUBLISH_TAGS:
            suffix = PUBLISH_TAGS[tag]
            publish_value(suffix, value)
    print("-----------------------------------")


while True:
    now = time.time()
    if (
        _serial_port_name
        and not isMicrobitConnected
        and now >= _serial_next_retry
    ):
        _try_open_serial(_serial_port_name)

    if isMicrobitConnected and ser is not None and ser.is_open:
        try:
            readSerial()
        except Exception as e:
            _log_serial_error(f"Lỗi đọc dữ liệu: {e}")
    else:
        simulate_sensor_data()

    time.sleep(15)
