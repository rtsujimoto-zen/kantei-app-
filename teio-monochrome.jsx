import { useState, useEffect, useRef } from "react";

// --- Monochrome Design System (Co-Star inspired) ---
const C = {
  black: "#000000",
  bg: "#050505",
  card: "#0C0C0C",
  cardHover: "#111111",
  border: "#1A1A1A",
  borderLight: "#252525",
  textPrimary: "#FFFFFF",
  textSecondary: "#999999",
  textTertiary: "#555555",
  textMuted: "#333333",
  accent: "#FFFFFF", // monochrome = white is the accent
  red: "#FF3B30", // single color accent for critical moments
  redDim: "#661A16",
};

// Minimal divider
const Divider = ({ style = {} }) => (
  <div
    style={{
      height: "1px",
      background: C.border,
      width: "100%",
      ...style,
    }}
  />
);

// Section header - editorial style
const SectionLabel = ({ children, right, delay = 0 }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "0 24px",
      marginBottom: 12,
      animation: `monoFadeIn 0.5s ease-out ${delay}s both`,
    }}
  >
    <span
      style={{
        fontSize: 10,
        fontWeight: 500,
        color: C.textTertiary,
        letterSpacing: "4px",
        textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {children}
    </span>
    {right && (
      <span
        style={{
          fontSize: 10,
          color: C.textTertiary,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {right}
      </span>
    )}
  </div>
);

// Monochrome card
const MonoCard = ({ children, style = {}, onClick, delay = 0 }) => (
  <div
    onClick={onClick}
    className="mono-card"
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 0,
      padding: "20px",
      position: "relative",
      cursor: onClick ? "pointer" : "default",
      animation: `monoSlideUp 0.5s ease-out ${delay}s both`,
      transition: "background 0.2s ease, border-color 0.2s ease",
      ...style,
    }}
  >
    {children}
  </div>
);

// Score bar - brutalist style
const ScoreBar = ({ label, value, maxValue = 100, delay = 0 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      animation: `monoFadeIn 0.4s ease-out ${delay}s both`,
    }}
  >
    <span
      style={{
        fontSize: 11,
        color: C.textSecondary,
        width: 44,
        flexShrink: 0,
        fontFamily: "'Noto Serif JP', serif",
        fontWeight: 300,
      }}
    >
      {label}
    </span>
    <div
      style={{
        flex: 1,
        height: 1,
        background: C.border,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -1,
          height: 3,
          width: `${(value / maxValue) * 100}%`,
          background: C.textPrimary,
          transition: "width 1s ease-out",
        }}
      />
    </div>
    <span
      style={{
        fontSize: 11,
        color: C.textPrimary,
        width: 24,
        textAlign: "right",
        fontFamily: "'DM Mono', monospace",
        fontWeight: 500,
      }}
    >
      {value}
    </span>
  </div>
);

// Main Home Screen - Monochrome Version
export default function TeioMonochrome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("home");
  const [dailyRevealed, setDailyRevealed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDailyRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);

  const hours = currentTime.getHours();
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");

  const userData = {
    type: "帝星",
    typeCode: "IMP-Au",
    element: "金",
    elementEn: "Metal",
    rarity: 3.2,
    dayPillar: "庚寅",
    todayScore: 87,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&family=DM+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        
        @keyframes monoSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes monoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes typeReveal {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0% 0 0); }
        }
        
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes pulseOnce {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .teio-mono::-webkit-scrollbar { display: none; }
        
        .mono-card:hover {
          border-color: ${C.borderLight} !important;
        }
        .mono-card:active {
          background: ${C.cardHover} !important;
        }
        
        .nav-mono {
          transition: opacity 0.2s ease;
        }
        .nav-mono:active {
          opacity: 0.5 !important;
        }
        
        .counsel-text {
          position: relative;
        }
        .counsel-text::after {
          content: '';
          display: inline-block;
          width: 2px;
          height: 1em;
          background: ${C.textPrimary};
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: cursorBlink 1s step-end infinite;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          height: "100vh",
          background: C.bg,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Noto Serif JP', serif",
        }}
      >
        {/* Subtle scanline effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 20,
            opacity: 0.015,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          }}
        />

        {/* Scrollable content */}
        <div
          className="teio-mono"
          onScroll={(e) => setScrollY(e.target.scrollTop)}
          style={{
            position: "absolute",
            inset: 0,
            bottom: 64,
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 1,
          }}
        >
          {/* --- HEADER --- */}
          <div
            style={{
              padding: "56px 24px 0",
              animation: "monoFadeIn 0.6s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: C.textTertiary,
                    letterSpacing: "3px",
                    marginBottom: 2,
                  }}
                >
                  {hours}:{minutes} · 旧暦十四日
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: C.textMuted,
                    letterSpacing: "2px",
                  }}
                >
                  望月 · 庚寅日
                </div>
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: C.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  帝
                </span>
              </div>
            </div>
          </div>

          {/* --- BRAND --- */}
          <div
            style={{
              padding: "32px 24px 8px",
              animation: "monoSlideUp 0.6s ease-out 0.1s both",
            }}
          >
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48,
                fontWeight: 300,
                color: C.textPrimary,
                letterSpacing: "16px",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              TEIŌ
            </h1>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: C.textMuted,
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              Imperial Studies
            </div>
          </div>

          <div style={{ padding: "20px 24px" }}>
            <Divider />
          </div>

          {/* --- YOUR TYPE --- */}
          <div
            style={{
              padding: "0 24px",
              animation: "monoSlideUp 0.6s ease-out 0.2s both",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: C.textTertiary,
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Your Type
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 200,
                    color: C.textPrimary,
                    letterSpacing: "8px",
                    lineHeight: 1,
                    fontFamily: "'Noto Serif JP', serif",
                  }}
                >
                  {userData.type}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 36,
                    fontWeight: 300,
                    color: C.textPrimary,
                    lineHeight: 1,
                  }}
                >
                  {userData.todayScore}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: C.textTertiary,
                    letterSpacing: "2px",
                    marginTop: 4,
                  }}
                >
                  /100 TODAY
                </div>
              </div>
            </div>

            {/* Type metadata - inline */}
            <div
              style={{
                display: "flex",
                gap: 0,
                borderTop: `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {[
                { label: "CODE", value: userData.typeCode },
                { label: "ELEMENT", value: `${userData.element} ${userData.elementEn}` },
                { label: "PILLAR", value: userData.dayPillar },
                { label: "RARITY", value: `${userData.rarity}%` },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRight:
                      i < 3 ? `1px solid ${C.border}` : "none",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 8,
                      color: C.textMuted,
                      letterSpacing: "2px",
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: C.textSecondary,
                      fontWeight: 500,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- DAILY COUNSEL --- */}
          <div style={{ padding: "32px 24px 0" }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: C.textTertiary,
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Daily Counsel
            </div>
            <div
              style={{
                animation: "monoSlideUp 0.6s ease-out 0.3s both",
              }}
            >
              <p
                className={dailyRevealed ? "" : ""}
                style={{
                  fontSize: 22,
                  fontWeight: 200,
                  color: C.textPrimary,
                  lineHeight: 2,
                  letterSpacing: "2px",
                  fontFamily: "'Noto Serif JP', serif",
                  opacity: dailyRevealed ? 1 : 0,
                  transform: dailyRevealed ? "none" : "translateY(8px)",
                  transition: "all 0.8s ease-out",
                }}
              >
                追うのではなく、
                <br />
                引き寄せる存在になれ。
              </p>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: C.textMuted,
                  opacity: dailyRevealed ? 1 : 0,
                  transition: "opacity 0.6s ease-out 0.4s",
                }}
              >
                — 庚寅の日、金の気が高まる時
              </div>
            </div>
          </div>

          <div style={{ padding: "28px 24px" }}>
            <Divider />
          </div>

          {/* --- FORTUNE BREAKDOWN --- */}
          <div style={{ padding: "0 24px" }}>
            <SectionLabel delay={0.35}>Fortune</SectionLabel>
          </div>
          <div style={{ padding: "0 24px" }}>
            <MonoCard delay={0.4} style={{ padding: "24px 20px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {[
                  { label: "総合運", value: 87 },
                  { label: "仕事運", value: 92 },
                  { label: "金　運", value: 65 },
                  { label: "対人運", value: 78 },
                  { label: "健康運", value: 83 },
                ].map((item, i) => (
                  <ScoreBar
                    key={i}
                    label={item.label}
                    value={item.value}
                    delay={0.45 + i * 0.05}
                  />
                ))}
              </div>
            </MonoCard>
          </div>

          {/* --- BIORHYTHM --- */}
          <div style={{ padding: "24px 24px 0" }}>
            <SectionLabel right="Feb 8 – 14" delay={0.55}>
              Biorhythm
            </SectionLabel>
          </div>
          <div style={{ padding: "0 24px" }}>
            <MonoCard delay={0.6} style={{ padding: "24px 20px" }}>
              <svg
                viewBox="0 0 300 72"
                style={{ width: "100%", height: "auto" }}
              >
                {/* Grid */}
                {[0, 24, 48, 72].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="300"
                    y2={y}
                    stroke={C.border}
                    strokeWidth="0.5"
                  />
                ))}
                {[0, 50, 100, 150, 200, 250, 300].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="72"
                    stroke={C.border}
                    strokeWidth="0.5"
                    strokeDasharray="2,4"
                  />
                ))}

                {/* Main line */}
                <polyline
                  points="0,30 50,22 100,26 150,14 200,18 250,24 300,28"
                  fill="none"
                  stroke={C.textPrimary}
                  strokeWidth="1.5"
                />

                {/* Data points */}
                {[
                  [0, 30],
                  [50, 22],
                  [100, 26],
                  [150, 14],
                  [200, 18],
                  [250, 24],
                  [300, 28],
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={i === 0 ? 4 : 2.5}
                      fill={i === 0 ? C.textPrimary : C.bg}
                      stroke={C.textPrimary}
                      strokeWidth={i === 0 ? 0 : 1}
                    />
                    {i === 3 && (
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        fill={C.textSecondary}
                        fontSize="8"
                        fontFamily="'DM Mono', monospace"
                      >
                        PEAK
                      </text>
                    )}
                  </g>
                ))}

                {/* Day labels */}
                {["今日", "月", "火", "水", "木", "金", "土"].map(
                  (day, i) => (
                    <text
                      key={i}
                      x={i * 50}
                      y="68"
                      textAnchor="middle"
                      fill={i === 0 ? C.textPrimary : C.textTertiary}
                      fontSize="8"
                      fontFamily="'Noto Serif JP', serif"
                      fontWeight={i === 0 ? 500 : 300}
                    >
                      {day}
                    </text>
                  )
                )}
              </svg>
            </MonoCard>
          </div>

          {/* --- LUCKY / DIRECTION --- */}
          <div style={{ padding: "24px 24px 0" }}>
            <SectionLabel delay={0.65}>Coordinates</SectionLabel>
          </div>
          <div
            style={{
              padding: "0 24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
            }}
          >
            {/* Direction */}
            <MonoCard
              delay={0.7}
              style={{
                borderRight: "none",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 8,
                  color: C.textMuted,
                  letterSpacing: "2px",
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}
              >
                Direction
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  { dir: "南東", active: true },
                  { dir: "南", active: true },
                  { dir: "北", active: false },
                  { dir: "西", active: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        background: item.active
                          ? C.textPrimary
                          : "transparent",
                        border: `1px solid ${item.active ? C.textPrimary : C.textMuted}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Noto Serif JP', serif",
                        fontSize: 13,
                        color: item.active
                          ? C.textPrimary
                          : C.textMuted,
                        fontWeight: item.active ? 400 : 200,
                        letterSpacing: "2px",
                      }}
                    >
                      {item.dir}
                    </span>
                  </div>
                ))}
              </div>
            </MonoCard>

            {/* Lucky */}
            <MonoCard delay={0.75} style={{ padding: "20px" }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 8,
                  color: C.textMuted,
                  letterSpacing: "2px",
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}
              >
                Lucky
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {[
                  { label: "色", value: "銀白" },
                  { label: "数", value: "7 · 16" },
                  { label: "時", value: "15:00–17:00" },
                  { label: "食", value: "白い食材" },
                ].map((item, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 8,
                        color: C.textMuted,
                        letterSpacing: "1px",
                        marginBottom: 3,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Noto Serif JP', serif",
                        fontSize: 13,
                        color: C.textSecondary,
                        fontWeight: 300,
                        letterSpacing: "1px",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </MonoCard>
          </div>

          {/* --- QUICK ACTIONS --- */}
          <div style={{ padding: "32px 24px 0" }}>
            <Divider />
          </div>
          <div
            style={{
              padding: "24px 24px 0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
            }}
          >
            {[
              { kanji: "卜", label: "今日の卦", sub: "DIVINATION" },
              { kanji: "策", label: "戦略相談", sub: "AI COUNSEL" },
              { kanji: "命", label: "命式詳細", sub: "NATAL CHART" },
              { kanji: "相", label: "相性診断", sub: "COMPATIBILITY" },
            ].map((action, i) => (
              <MonoCard
                key={i}
                delay={0.8 + i * 0.05}
                onClick={() => {}}
                style={{
                  padding: "24px 20px",
                  borderRight: i % 2 === 0 ? "none" : undefined,
                  borderBottom: i < 2 ? "none" : undefined,
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 200,
                    color: C.textPrimary,
                    fontFamily: "'Noto Serif JP', serif",
                    marginBottom: 12,
                    lineHeight: 1,
                  }}
                >
                  {action.kanji}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textSecondary,
                    fontFamily: "'Noto Serif JP', serif",
                    fontWeight: 300,
                    letterSpacing: "1px",
                    marginBottom: 2,
                  }}
                >
                  {action.label}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8,
                    color: C.textMuted,
                    letterSpacing: "2px",
                  }}
                >
                  {action.sub}
                </div>
              </MonoCard>
            ))}
          </div>

          {/* --- PROMPT DATA (nod to the uploaded screenshot) --- */}
          <div style={{ padding: "32px 24px 0" }}>
            <SectionLabel delay={0.9}>Prompt Data</SectionLabel>
          </div>
          <div style={{ padding: "0 24px" }}>
            <MonoCard delay={0.95} style={{ padding: "20px" }}>
              <pre
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: C.textTertiary,
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
{`── 命式 ──
日主: 庚 (金)
日柱: 庚寅 ─ 月柱: 己卯 ─ 年柱: 戊辰

── 五行エネルギー分布 ──
木: 29  火: 0  土: 92  金: 45  水: 36

── 十二運 ──
絶 → 帝旺 → 養`}
              </pre>
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: C.textMuted,
                    letterSpacing: "1px",
                  }}
                >
                  TAP TO COPY · AI軍師に渡す
                </span>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    border: `1px solid ${C.textMuted}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 10, color: C.textMuted }}>
                    ⎘
                  </span>
                </div>
              </div>
            </MonoCard>
          </div>

          {/* --- FOOTER --- */}
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 8,
                color: C.textMuted,
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              The art of sovereign wisdom
            </div>
          </div>

          <div style={{ height: 80 }} />
        </div>

        {/* --- BOTTOM NAV --- */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            background: C.bg,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            paddingBottom: 6,
            zIndex: 10,
          }}
        >
          {[
            { id: "home", label: "天命" },
            { id: "divine", label: "占術" },
            { id: "counsel", label: "軍師" },
            { id: "diary", label: "記録" },
            { id: "learn", label: "修学" },
          ].map((tab) => (
            <div
              key={tab.id}
              className="nav-mono"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                opacity: activeTab === tab.id ? 1 : 0.25,
                padding: "8px 16px",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontFamily: "'Noto Serif JP', serif",
                  fontWeight: activeTab === tab.id ? 500 : 200,
                  color: C.textPrimary,
                  letterSpacing: "2px",
                }}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div
                  style={{
                    width: 16,
                    height: 1,
                    background: C.textPrimary,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
