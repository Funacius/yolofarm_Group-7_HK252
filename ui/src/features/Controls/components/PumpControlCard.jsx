import PumpSwitch from "../../../components/common/PumpSwitch";

export default function PumpControlCard({
  title,
  checked,
  subtitle,
  onToggle,
}) {
  return (
    <PumpSwitch
      title={title}
      checked={checked}
      subtitle={subtitle}
      onChange={onToggle}
    />
  );
}