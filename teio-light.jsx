import { useState, useEffect } from "react";

// --- Light Monochrome Design System ---
const C = {
  bg: "#FAFAF8",
  bgWarm: "#F5F3EF",
  bgCard: "#FFFFFF",
  bgCardHover: "#F8F7F5",
  border: "#E8E6E2",
  borderLight: "#F0EEEA",
  borderDark: "#D4D1CC",
  textPrimary: "#1A1A1A",
  textSecondary: "#5C5C5C",
  textTertiary: "#999894",
  textMuted: "#C4C2BD",
  accent: "#1A1A1A",
  accentSoft: "#2C2C2C",
  warmAccent: "#8B7355",    // warm brown for subtle Eastern warmth
  warmAccentLight: "#B09A7C",
  vermillion: "#C4513D",    // 朱色 - only for seal
  vermillionBg: "#C4513D0A",
};

const Divider = ({ style = {} }) => (
  <div style={{ height: "1px", background: C.border, width: "100%", ...style }} />
);

const SectionLabel = ({ children, right, delay = 0 }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 14,
      animation: `lightFadeIn 0.5s ease-out ${delay}s both`,
    }}
  >
    <span
      style={{
        fontSize: 9,
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
      <span style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
        {right}
      </span>
    )}
  </div>
);

const LightCard = ({ children, style = {}, onClick, delay = 0, elevated = false }) => (
  <div
    onClick={onClick}
    className="light-card"
    style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 2,
      padding: "20px",
      position: "relative",
      cursor: onClick ? "pointer" : "default",
      animation: `lightSlideUp 0.5s ease-out ${delay}s both`,
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxShadow: elevated ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

const ScoreBar = ({ label, value, delay = 0 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      animation: `lightFadeIn 0.4s ease-out ${delay}s both`,
    }}
  >
    <span
      style={{
        fontSize: 11,
        color: C.textSecondary,
        width: 44,
        flexShrink: 0,
        fontFamily: "'Noto Serif JP', serif",
        fontWeight: 400,
      }}
    >
      {label}
    </span>
    <div style={{ flex: 1, height: 2, background: C.borderLight, position: "relative", borderRadius: 1 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${value}%`,
          background: C.textPrimary,
          borderRadius: 1,
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

// Imperial Seal - vermillion on white
const Seal = ({ text, size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `1.5px solid ${C.vermillion}`,
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "rotate(-6deg)",
      position: "relative",
      background: C.vermillionBg,
    }}
  >
    <span
      style={{
        color: C.vermillion,
        fontSize: size * 0.4,
        fontWeight: 700,
        fontFamily: "'Noto Serif JP', serif",
        lineHeight: 1,
      }}
    >
      {text}
    </span>
  </div>
);

export default function TeioLight() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("home");
  const [dailyRevealed, setDailyRevealed] = useState(false);

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
        
        @keyframes lightSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lightFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .teio-light::-webkit-scrollbar { display: none; }
        
        .light-card:hover {
          border-color: ${C.borderDark} !important;
        }
        .light-card:active {
          background: ${C.bgCardHover} !important;
        }
        
        .nav-light {
          transition: opacity 0.2s ease;
        }
        .nav-light:active {
          opacity: 0.4 !important;
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
        {/* Scrollable content */}
        <div
          className="teio-light"
          style={{
            position: "absolute",
            inset: 0,
            bottom: 60,
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 1,
          }}
        >
          {/* --- HEADER --- */}
          <div
            style={{
              padding: "52px 24px 0",
              animation: "lightFadeIn 0.6s ease-out",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: C.textTertiary,
                  letterSpacing: "2px",
                }}
              >
                {hours}:{minutes} · 旧暦十四日 · 望月
              </div>
            </div>
            <Seal text="帝" size={30} />
          </div>

          {/* --- BRAND --- */}
          <div
            style={{
              padding: "28px 24px 0",
              animation: "lightSlideUp 0.6s ease-out 0.1s both",
            }}
          >
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 44,
                fontWeight: 300,
                color: C.textPrimary,
                letterSpacing: "14px",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              TEIŌ
            </h1>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 8,
                color: C.textMuted,
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              Imperial Studies
            </div>
          </div>

          <div style={{ padding: "24px 24px 0" }}>
            <Divider />
          </div>

          {/* --- YOUR TYPE --- */}
          <div
            style={{
              padding: "24px 24px 0",
              animation: "lightSlideUp 0.6s ease-out 0.2s both",
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
                    marginBottom: 10,
                  }}
                >
                  Your Type
                </div>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 200,
                    color: C.textPrimary,
                    letterSpacing: "6px",
                    lineHeight: 1,
                  }}
                >
                  {userData.type}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 40,
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
                    color: C.textMuted,
                    letterSpacing: "2px",
                    marginTop: 4,
                  }}
                >
                  /100 TODAY
                </div>
              </div>
            </div>

            {/* Type metadata */}
            <div
              style={{
                display: "flex",
                gap: 0,
                borderTop: `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
                background: C.bgWarm,
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
                    borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 7,
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
                      fontSize: 10,
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
          <div
            style={{
              padding: "32px 24px 0",
              animation: "lightSlideUp 0.6s ease-out 0.3s both",
            }}
          >
            <SectionLabel delay={0.3}>Daily Counsel</SectionLabel>
            <div
              style={{
                background: C.bgWarm,
                border: `1px solid ${C.borderLight}`,
                borderRadius: 2,
                padding: "28px 24px",
                position: "relative",
              }}
            >
              {/* Decorative vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 16,
                  bottom: 16,
                  width: 2,
                  background: C.warmAccent,
                  opacity: 0.3,
                }}
              />
              <p
                style={{
                  fontSize: 21,
                  fontWeight: 300,
                  color: C.textPrimary,
                  lineHeight: 2.1,
                  letterSpacing: "1.5px",
                  fontFamily: "'Noto Serif JP', serif",
                  opacity: dailyRevealed ? 1 : 0,
                  transform: dailyRevealed ? "none" : "translateY(6px)",
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
                  fontSize: 9,
                  color: C.textTertiary,
                  opacity: dailyRevealed ? 1 : 0,
                  transition: "opacity 0.6s ease-out 0.4s",
                  letterSpacing: "0.5px",
                }}
              >
                — 庚寅の日、金の気が高まる時
              </div>
            </div>
          </div>

          <div style={{ padding: "28px 24px 0" }}>
            <Divider />
          </div>

          {/* --- FORTUNE --- */}
          <div style={{ padding: "24px 24px 0" }}>
            <SectionLabel delay={0.35}>Fortune</SectionLabel>
            <LightCard delay={0.4} elevated style={{ padding: "24px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "総合運", value: 87 },
                  { label: "仕事運", value: 92 },
                  { label: "金　運", value: 65 },
                  { label: "対人運", value: 78 },
                  { label: "健康運", value: 83 },
                ].map((item, i) => (
                  <ScoreBar key={i} label={item.label} value={item.value} delay={0.45 + i * 0.05} />
                ))}
              </div>
            </LightCard>
          </div>

          {/* --- BIORHYTHM --- */}
          <div style={{ padding: "24px 24px 0" }}>
            <SectionLabel right="Feb 8 – 14" delay={0.55}>Biorhythm</SectionLabel>
            <LightCard delay={0.6} elevated style={{ padding: "24px 20px" }}>
              <svg viewBox="0 0 300 76" style={{ width: "100%", height: "auto" }}>
                {/* Grid */}
                {[0, 20, 40, 60].map((y) => (
                  <line key={y} x1="0" y1={y} x2="300" y2={y} stroke={C.borderLight} strokeWidth="0.5" />
                ))}
                {[0, 50, 100, 150, 200, 250, 300].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="60" stroke={C.borderLight} strokeWidth="0.5" strokeDasharray="2,4" />
                ))}

                {/* Area fill */}
                <path
                  d="M0,28 L50,20 L100,24 L150,12 L200,16 L250,22 L300,26 L300,60 L0,60 Z"
                  fill={`${C.textPrimary}06`}
                />

                {/* Line */}
                <polyline
                  points="0,28 50,20 100,24 150,12 200,16 250,22 300,26"
                  fill="none"
                  stroke={C.textPrimary}
                  strokeWidth="1.5"
                />

                {/* Data points */}
                {[[0,28],[50,20],[100,24],[150,12],[200,16],[250,22],[300,26]].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r={i === 0 ? 4 : 2.5}
                      fill={i === 0 ? C.textPrimary : C.bgCard}
                      stroke={C.textPrimary} strokeWidth={i === 0 ? 0 : 1.5}
                    />
                    {i === 3 && (
                      <>
                        <circle cx={x} cy={y} r="8" fill="none" stroke={C.textPrimary} strokeWidth="0.5" opacity="0.3" />
                        <text x={x} y={y - 12} textAnchor="middle" fill={C.textSecondary}
                          fontSize="7" fontFamily="'DM Mono', monospace">PEAK</text>
                      </>
                    )}
                  </g>
                ))}

                {/* Day labels */}
                {["今日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
                  <text key={i} x={i * 50} y="74" textAnchor="middle"
                    fill={i === 0 ? C.textPrimary : C.textTertiary}
                    fontSize="8" fontFamily="'Noto Serif JP', serif"
                    fontWeight={i === 0 ? 500 : 300}>
                    {day}
                  </text>
                ))}
              </svg>
            </LightCard>
          </div>

          {/* --- COORDINATES (Direction + Lucky) --- */}
          <div style={{ padding: "24px 24px 0" }}>
            <SectionLabel delay={0.65}>Coordinates</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LightCard delay={0.7} elevated style={{ padding: "20px" }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 8,
                  color: C.textMuted, letterSpacing: "2px", marginBottom: 16, textTransform: "uppercase",
                }}>
                  Direction
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { dir: "南東", active: true },
                    { dir: "南", active: true },
                    { dir: "北", active: false },
                    { dir: "西", active: false },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: item.active ? C.textPrimary : "transparent",
                          border: `1.5px solid ${item.active ? C.textPrimary : C.textMuted}`,
                        }}
                      />
                      <span style={{
                        fontFamily: "'Noto Serif JP', serif", fontSize: 13,
                        color: item.active ? C.textPrimary : C.textMuted,
                        fontWeight: item.active ? 400 : 300, letterSpacing: "2px",
                      }}>
                        {item.dir}
                      </span>
                    </div>
                  ))}
                </div>
              </LightCard>

              <LightCard delay={0.75} elevated style={{ padding: "20px" }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 8,
                  color: C.textMuted, letterSpacing: "2px", marginBottom: 16, textTransform: "uppercase",
                }}>
                  Lucky
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "色", value: "銀白", color: "#A8A8A8" },
                    { label: "数", value: "7 · 16" },
                    { label: "時", value: "15:00–17:00" },
                    { label: "食", value: "白い食材" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 8,
                        color: C.textMuted, letterSpacing: "1px", marginBottom: 4,
                      }}>
                        {item.label}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {item.color && (
                          <div style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: item.color, border: `1px solid ${C.border}`,
                          }} />
                        )}
                        <span style={{
                          fontFamily: "'Noto Serif JP', serif", fontSize: 12,
                          color: C.textSecondary, fontWeight: 300, letterSpacing: "1px",
                        }}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </LightCard>
            </div>
          </div>

          {/* --- QUICK ACTIONS --- */}
          <div style={{ padding: "28px 24px 0" }}>
            <Divider />
          </div>
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { kanji: "卜", label: "今日の卦", sub: "DIVINATION" },
                { kanji: "策", label: "戦略相談", sub: "AI COUNSEL" },
                { kanji: "命", label: "命式詳細", sub: "NATAL CHART" },
                { kanji: "相", label: "相性診断", sub: "COMPATIBILITY" },
              ].map((action, i) => (
                <LightCard key={i} delay={0.8 + i * 0.05} onClick={() => {}} elevated style={{ padding: "24px 20px" }}>
                  <div style={{
                    fontSize: 30, fontWeight: 200, color: C.textPrimary,
                    fontFamily: "'Noto Serif JP', serif", marginBottom: 12, lineHeight: 1,
                  }}>
                    {action.kanji}
                  </div>
                  <div style={{
                    fontSize: 12, color: C.textSecondary, fontWeight: 400,
                    letterSpacing: "1px", marginBottom: 3,
                  }}>
                    {action.label}
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 8,
                    color: C.textMuted, letterSpacing: "2px",
                  }}>
                    {action.sub}
                  </div>
                </LightCard>
              ))}
            </div>
          </div>

          {/* --- PROMPT DATA --- */}
          <div style={{ padding: "28px 24px 0" }}>
            <Divider />
          </div>
          <div style={{ padding: "24px 24px 0" }}>
            <SectionLabel delay={0.9}>Prompt Data</SectionLabel>
            <LightCard delay={0.95} style={{ padding: "20px", background: C.bgWarm }}>
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
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  color: C.textTertiary, letterSpacing: "0.5px",
                }}>
                  TAP TO COPY · AI軍師に渡す
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="5" y="5" width="8" height="8" rx="1" stroke={C.textTertiary} strokeWidth="1.2" />
                  <path d="M3 11V3h8" stroke={C.textTertiary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </LightCard>
          </div>

          {/* --- FOOTER --- */}
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 8,
              color: C.textMuted, letterSpacing: "4px", textTransform: "uppercase",
            }}>
              The art of sovereign wisdom
            </div>
          </div>

          <div style={{ height: 72 }} />
        </div>

        {/* --- BOTTOM NAV --- */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: C.bg,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            paddingBottom: 4,
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
              className="nav-light"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                cursor: "pointer",
                opacity: activeTab === tab.id ? 1 : 0.3,
                padding: "8px 14px",
                transition: "opacity 0.2s ease",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontFamily: "'Noto Serif JP', serif",
                  fontWeight: activeTab === tab.id ? 500 : 300,
                  color: C.textPrimary,
                  letterSpacing: "2px",
                }}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div style={{ width: 16, height: 1.5, background: C.textPrimary, borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
