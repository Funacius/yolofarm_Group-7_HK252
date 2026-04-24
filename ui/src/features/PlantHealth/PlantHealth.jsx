import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import plantHealthApi from "../../api/plantHealthApi";
import { getDefaultAreaId } from "../../config/env";
import PlantHealthSummary from "./components/PlantHealthSummary";

export default function PlantHealth() {
  const areaId = getDefaultAreaId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await plantHealthApi.getInferences({
          area_id: areaId,
          limit: 200,
        });

        if (!cancelled) {
          setRows(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Khong tai duoc du lieu suc khoe cay.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [areaId]);

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <PageHeader
        title="Plant Health"
        subtitle="Thong ke so luong trai cay va cac nhom benh da duoc nhan dien."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <PlantHealthSummary rows={rows} />
      )}
    </Box>
  );
}
