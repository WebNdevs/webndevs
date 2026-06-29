export default function HeroConnections() {
  return (
    <>
      {/* ==========================================
          Outer Framework
      ========================================== */}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden
      >
        {/* ===============================
            Center Connections
        =============================== */}

        {[
          [300, 80],
          [470, 150],
          [520, 300],
          [470, 450],
          [300, 520],
          [130, 450],
          [80, 300],
          [130, 150],
        ].map(([x, y], index) => (
          <line
            key={index}
            x1="300"
            y1="300"
            x2={x}
            y2={y}
            stroke="rgba(34,197,94,.08)"
            strokeWidth="1.2"
          />
        ))}

        {/* ===============================
            Outer Ring Polygon
        =============================== */}

        <polygon
          points="
            300,80
            470,150
            520,300
            470,450
            300,520
            130,450
            80,300
            130,150
          "
          stroke="rgba(34,197,94,.06)"
          strokeWidth="1"
          fill="none"
        />

        {/* ===============================
            Inner Ring
        =============================== */}

        <circle
          cx="300"
          cy="300"
          r="170"
          stroke="rgba(255,255,255,.05)"
          strokeWidth="1"
          fill="none"
        />

        {/* ===============================
            Outer Ring
        =============================== */}

        <circle
          cx="300"
          cy="300"
          r="220"
          stroke="rgba(34,197,94,.08)"
          strokeDasharray="6 8"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* ==========================================
          Connection Nodes
      ========================================== */}

      {[
        { top: "13%", left: "50%" },
        { top: "26%", left: "79%" },
        { top: "50%", left: "87%" },
        { top: "74%", left: "79%" },
        { top: "87%", left: "50%" },
        { top: "74%", left: "21%" },
        { top: "50%", left: "13%" },
        { top: "26%", left: "21%" },
      ].map((node, index) => (
        <span
          key={index}
          className="
            absolute

            h-2.5
            w-2.5

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-[#22C55E]/70

            shadow-[0_0_12px_rgba(34,197,94,.6)]
          "
          style={node}
        />
      ))}
    </>
  );
}