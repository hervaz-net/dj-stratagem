import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "D&J Stratagem — Find the work. Price it. Build it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "65px 76px",
        backgroundColor: "#0b1118",
        backgroundImage:
          "radial-gradient(ellipse at 80% 10%, rgba(245, 139, 66, .22), transparent 40%)",
        color: "#f5f2eb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            width: 54,
            height: 54,
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #d87c37",
            borderRadius: 10,
            color: "#f08c46",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          D/J
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <strong style={{ fontSize: 24 }}>D&amp;J</strong>
          <span style={{ color: "#9ba3a9", fontSize: 12, letterSpacing: 4 }}>
            STRATAGEM
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <span
          style={{
            color: "#e8904f",
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Nine modes · One desk
        </span>
        <strong
          style={{
            maxWidth: 970,
            fontSize: 84,
            letterSpacing: -6,
            lineHeight: 0.98,
          }}
        >
          Find the work. Price it. Build it.
        </strong>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#a7adb3", fontSize: 16 }}>
        <span>Construction work, connected.</span>
        <span>LOS ANGELES · SOUTHERN CALIFORNIA</span>
      </div>
    </div>,
    size,
  );
}
