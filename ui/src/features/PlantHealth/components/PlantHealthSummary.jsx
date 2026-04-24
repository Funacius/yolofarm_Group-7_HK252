import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";

const PLANT_TABS = [
  {
    key: "tomato",
    label: "Ca chua",
    accentColor: "#d9485f",
    categories: [
      { key: "healthy", label: "Healthy", accentColor: "#16a34a" },
      {
        key: "bacterial_spot",
        label: "Bacterial Spot",
        accentColor: "#f59e0b",
      },
      { key: "leaf_mold", label: "Leaf Mold", accentColor: "#8b5cf6" },
      { key: "late_blight", label: "Late Blight", accentColor: "#2563eb" },
    ],
  },
  {
    key: "apple",
    label: "Tao",
    accentColor: "#22c55e",
    categories: [
      { key: "healthy", label: "Healthy", accentColor: "#16a34a" },
      { key: "apple_scab", label: "Apple Scab", accentColor: "#f59e0b" },
      { key: "black_rot", label: "Black Rot", accentColor: "#111827" },
      {
        key: "cedar_apple_rust",
        label: "Cedar Apple Rust",
        accentColor: "#ea580c",
      },
    ],
  },
];

const LABEL_ALIASES = {
  tomato: {
    healthy: ["tomato_healthy", "tomato healthy"],
    bacterial_spot: [
      "tomato_bacterial_spot",
      "bacterial_spot",
      "tomato bacterial spot",
    ],
    leaf_mold: ["tomato_leaf_mold", "leaf_mold", "tomato leaf mold"],
    late_blight: [
      "tomato_late_blight",
      "late_blight",
      "tomato late blight",
    ],
  },
  apple: {
    healthy: ["apple_healthy", "apple healthy"],
    apple_scab: ["apple_scab", "apple scab"],
    black_rot: ["black_rot", "black rot"],
    cedar_apple_rust: ["cedar_apple_rust", "cedar apple rust"],
  },
};

function normalizeLabel(label) {
  return String(label || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function detectPlant(label) {
  const normalized = normalizeLabel(label);
  if (normalized.includes("tomato")) return "tomato";
  if (normalized.includes("apple")) return "apple";

  const tomatoKnown = Object.values(LABEL_ALIASES.tomato).flat();
  if (tomatoKnown.includes(normalized)) return "tomato";

  const appleKnown = Object.values(LABEL_ALIASES.apple).flat();
  if (appleKnown.includes(normalized)) return "apple";

  return null;
}

function mapCategory(plantKey, label) {
  const normalized = normalizeLabel(label);
  const aliases = LABEL_ALIASES[plantKey];

  return (
    Object.entries(aliases).find(([, accepted]) =>
      accepted.includes(normalized)
    )?.[0] || null
  );
}

function summarizeCounts(rows) {
  return rows.reduce(
    (acc, row) => {
      const plantKey = detectPlant(row?.label);
      if (!plantKey) return acc;

      const categoryKey = mapCategory(plantKey, row?.label);
      if (!categoryKey) return acc;

      acc[plantKey].total += 1;
      acc[plantKey].counts[categoryKey] += 1;
      return acc;
    },
    {
      tomato: {
        total: 0,
        counts: {
          healthy: 0,
          bacterial_spot: 0,
          leaf_mold: 0,
          late_blight: 0,
        },
      },
      apple: {
        total: 0,
        counts: {
          healthy: 0,
          apple_scab: 0,
          black_rot: 0,
          cedar_apple_rust: 0,
        },
      },
    }
  );
}

function CountCard({ title, value, accentColor, helperText }) {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        p: 3,
        minHeight: 148,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
        borderTop: `6px solid ${accentColor}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>
        {title}
      </Typography>

      <Box>
        <Typography
          sx={{
            fontSize: 34,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
            mb: 1,
          }}
        >
          {value}
        </Typography>

        <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
          {helperText}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PlantHealthSummary({ rows = [] }) {
  const [activeTab, setActiveTab] = useState("tomato");
  const summaries = useMemo(() => summarizeCounts(rows), [rows]);
  const currentTab =
    PLANT_TABS.find((tab) => tab.key === activeTab) || PLANT_TABS[0];
  const currentSummary = summaries[currentTab.key];

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(240,249,255,0.92))",
        borderRadius: "24px",
        p: { xs: 2.5, md: 3 },
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        border: "1px solid rgba(226, 232, 240, 0.9)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
            Thong ke suc khoe trai cay
          </Typography>
          <Typography sx={{ fontSize: 15, color: "#64748b", mt: 0.5 }}>
            Tong hop so lan nhan dien theo tung nhom cay.
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{
            minHeight: 44,
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 999,
              backgroundColor: currentTab.accentColor,
            },
            "& .MuiTab-root": {
              minHeight: 44,
              textTransform: "none",
              fontWeight: 700,
            },
          }}
        >
          {PLANT_TABS.map((tab) => (
            <Tab key={tab.key} value={tab.key} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CountCard
            title="Tong so luong"
            value={currentSummary.total}
            accentColor={currentTab.accentColor}
            helperText={`Tong so mau ${currentTab.label.toLowerCase()} da duoc nhan dien.`}
          />
        </Grid>

        {currentTab.categories.map((category) => (
          <Grid key={category.key} size={{ xs: 12, sm: 6, lg: 3 }}>
            <CountCard
              title={category.label}
              value={currentSummary.counts[category.key]}
              accentColor={category.accentColor}
              helperText={`So luong mau thuoc nhom ${category.label.toLowerCase()}.`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
