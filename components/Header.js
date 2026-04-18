import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="container mb-6">
      <div
        className="glass"
        style={{
          borderRadius: "24px",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              position: "relative",
              width: "110px",
              height: "34px",
            }}
          >
            <Image
              src="/sunyta.png"
              alt="Sunyta"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <div
            style={{
              width: "1px",
              height: "28px",
              background: "var(--border)",
            }}
          />

          <div>
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>
              Premium Demo
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
              <span className="gradient-text">Vouch</span> Intent Demo
            </div>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
