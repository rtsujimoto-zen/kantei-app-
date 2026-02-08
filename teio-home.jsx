import { useState, useEffect, useRef } from "react";

// --- Neo-Imperial Design System ---
const COLORS = {
  ink: "#0A0A0F",
  inkDeep: "#050508",
  inkSoft: "#12121A",
  gold: "#C9A84C",
  goldLight: "#E8D48B",
  goldDim: "#8B7A3A",
  copper: "#B87333",
  copperLight: "#D4956A",
  silver: "#A8A8B3",
  silverDim: "#6B6B78",
  parchment: "#F5E6C8",
  blood: "#8B2500",
  jade: "#2E8B57",
  void: "rgba(10,10,15,0.95)",
};

// Ink particle system
const InkParticle = ({ delay, x, size }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: "-10px",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${COLORS.gold}15, transparent)`,
      animation: `inkFall ${8 + Math.random() * 6}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      opacity: 0,
      filter: "blur(1px)",
    }}
  />
);

// Seal stamp component (印鑑)
const ImperialSeal = ({ text, size = 48 }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `2px solid ${COLORS.blood}`,
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "rotate(-8deg)",
      position: "relative",
      opacity: 0.85,
    }}
  >
    <span
      style={{
        color: COLORS.blood,
        fontSize: size * 0.35,
        fontWeight: 900,
        letterSpacing: "-1px",
        lineHeight: 1,
        fontFamily: "'Noto Serif JP', serif",
      }}
    >
      {text}
    </span>
    <div
      style={{
        position: "absolute",
        inset: 3,
        border: `1px solid ${COLORS.blood}50`,
        borderRadius: "2px",
      }}
    />
  </div>
);

// Glowing divider
const GoldDivider = ({ width = "60%" }) => (
  <div
    style={{
      width,
      height: "1px",
      background: `linear-gradient(90deg, transparent, ${COLORS.gold}60, ${COLORS.goldLight}90, ${COLORS.gold}60, transparent)`,
      margin: "0 auto",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "-3px",
        transform: "translateX(-50%)",
        width: "6px",
        height: "6px",
        background: COLORS.gold,
        borderRadius: "50%",
        boxShadow: `0 0 8px ${COLORS.gold}60`,
      }}
    />
  </div>
);

// Five Elements indicator
const FiveElementsBadge = ({ element, small = false }) => {
  const elements = {
    木: { color: "#4A7C59", bg: "#4A7C5920", label: "Wood" },
    火: { color: "#C75B39", bg: "#C75B3920", label: "Fire" },
    土: { color: "#B8860B", bg: "#B8860B20", label: "Earth" },
    金: { color: "#C0C0C0", bg: "#C0C0C020", label: "Metal" },
    水: { color: "#4682B4", bg: "#4682B420", label: "Water" },
  };
  const el = elements[element];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: small ? 4 : 6,
        padding: small ? "2px 8px" : "4px 12px",
        background: el.bg,
        border: `1px solid ${el.color}40`,
        borderRadius: "20px",
        fontSize: small ? 10 : 12,
        color: el.color,
        fontFamily: "'Noto Serif JP', serif",
        letterSpacing: "0.5px",
      }}
    >
      <span style={{ fontSize: small ? 12 : 16 }}>{element}</span>
      {!small && (
        <span style={{ opacity: 0.7, fontSize: 10 }}>{el.label}</span>
      )}
    </span>
  );
};

// Card component with glassmorphism
const GlassCard = ({
  children,
  style = {},
  onClick,
  glow = false,
  delay = 0,
}) => (
  <div
    onClick={onClick}
    style={{
      background: `linear-gradient(135deg, rgba(20,20,30,0.8), rgba(15,15,22,0.6))`,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${glow ? COLORS.gold + "30" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "16px",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      animation: `fadeSlideUp 0.6s ease-out both`,
      animationDelay: `${delay}s`,
      transition: "border-color 0.3s ease, transform 0.2s ease",
      ...style,
    }}
  >
    {glow && (
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `radial-gradient(ellipse at 30% 20%, ${COLORS.gold}08, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
    )}
    {children}
  </div>
);

// Main Home Screen
export default function TeioHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("home");
  const [showDailyReveal, setShowDailyReveal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setShowDailyReveal(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  const handleScroll = (e) => {
    setScrollY(e.target.scrollTop);
  };

  const hours = currentTime.getHours();
  const greeting =
    hours < 6
      ? "夜明け前"
      : hours < 12
        ? "朝の刻"
        : hours < 17
          ? "昼の刻"
          : hours < 21
            ? "宵の刻"
            : "夜の刻";

  const lunarDay = 14; // mock
  const lunarPhase = "望月"; // full moon mock

  // Mock user data
  const userData = {
    type: "帝星",
    typeEn: "Imperial Star",
    element: "金",
    rarity: 3.2,
    dayPillar: "庚寅",
    todayScore: 87,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&family=Zen+Old+Mincho:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes inkFall {
          0% { opacity: 0; transform: translateY(-10px) scale(0.5); }
          10% { opacity: 0.4; }
          50% { opacity: 0.2; transform: translateY(50vh) scale(1); }
          90% { opacity: 0; }
          100% { opacity: 0; transform: translateY(100vh) scale(0.5); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px ${COLORS.gold}10; }
          50% { box-shadow: 0 0 30px ${COLORS.gold}25; }
        }
        
        @keyframes brushStroke {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0% 0 0); }
        }
        
        @keyframes sealStamp {
          0% { transform: rotate(-8deg) scale(2); opacity: 0; }
          60% { transform: rotate(-8deg) scale(0.95); opacity: 1; }
          80% { transform: rotate(-8deg) scale(1.02); }
          100% { transform: rotate(-8deg) scale(1); opacity: 0.85; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes scoreReveal {
          0% { stroke-dashoffset: 251; }
          100% { stroke-dashoffset: var(--target-offset); }
        }
        
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .teio-home::-webkit-scrollbar { display: none; }
        
        .nav-item { 
          transition: all 0.3s ease;
        }
        .nav-item:active {
          transform: scale(0.92);
        }
        
        .card-press:active {
          transform: scale(0.98) !important;
          transition: transform 0.1s ease !important;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold});
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          height: "100vh",
          background: COLORS.ink,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Noto Serif JP', serif",
        }}
      >
        {/* Ambient ink particles */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <InkParticle
              key={i}
              delay={i * 1.5}
              x={10 + Math.random() * 80}
              size={3 + Math.random() * 4}
            />
          ))}
        </div>

        {/* Background gradient - responds to scroll */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50vh",
            background: `radial-gradient(ellipse at 50% ${Math.max(0, 20 - scrollY * 0.05)}%, ${COLORS.gold}06 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 0.3s ease",
          }}
        />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="teio-home"
          onScroll={handleScroll}
          style={{
            position: "absolute",
            inset: 0,
            bottom: 72,
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 1,
            scrollBehavior: "smooth",
          }}
        >
          {/* --- HEADER --- */}
          <div
            style={{
              padding: "52px 24px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              animation: "fadeIn 0.8s ease-out",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.silverDim,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: 4,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {greeting}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: COLORS.silver,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ opacity: 0.5 }}>
                  {lunarPhase} · 旧暦{lunarDay}日
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ImperialSeal text="帝" size={36} />
            </div>
          </div>

          {/* --- BRAND MARK --- */}
          <div
            style={{
              textAlign: "center",
              padding: "16px 24px 8px",
              animation: "fadeSlideUp 0.8s ease-out both",
              animationDelay: "0.1s",
            }}
          >
            <h1
              className="shimmer-text"
              style={{
                fontFamily: "'Zen Old Mincho', serif",
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "12px",
                marginBottom: 2,
              }}
            >
              TEIŌ
            </h1>
            <div
              style={{
                fontSize: 9,
                color: COLORS.goldDim,
                letterSpacing: "6px",
                fontFamily: "'Cormorant Garamond', serif",
                textTransform: "uppercase",
              }}
            >
              Imperial Studies
            </div>
          </div>

          <div style={{ padding: "12px 24px" }}>
            <GoldDivider width="40%" />
          </div>

          {/* --- YOUR TYPE CARD --- */}
          <div style={{ padding: "8px 20px 0" }}>
            <GlassCard glow={true} delay={0.2} style={{ padding: "24px" }}>
              <div
                className="card-press"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: COLORS.goldDim,
                      letterSpacing: "3px",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Your Destiny Type
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: COLORS.parchment,
                      fontFamily: "'Zen Old Mincho', serif",
                      letterSpacing: "4px",
                      marginBottom: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    {userData.type}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.goldDim,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      letterSpacing: "1px",
                      marginBottom: 16,
                    }}
                  >
                    {userData.typeEn}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <FiveElementsBadge element={userData.element} />
                    <span
                      style={{
                        fontSize: 10,
                        color: COLORS.copper,
                        padding: "3px 10px",
                        border: `1px solid ${COLORS.copper}30`,
                        borderRadius: "20px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      日柱 {userData.dayPillar}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: COLORS.goldLight,
                        opacity: 0.7,
                      }}
                    >
                      全体の{userData.rarity}%
                    </span>
                  </div>
                </div>

                {/* Circular score */}
                <div
                  style={{
                    position: "relative",
                    width: 72,
                    height: 72,
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="72"
                    height="72"
                    viewBox="0 0 72 72"
                    style={{
                      transform: "rotate(-90deg)",
                    }}
                  >
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke={`${COLORS.gold}15`}
                      strokeWidth="3"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke={`url(#goldGrad)`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="188.5"
                      strokeDashoffset={188.5 * (1 - userData.todayScore / 100)}
                      style={{
                        animation: "scoreReveal 1.5s ease-out 0.5s both",
                        "--target-offset":
                          188.5 * (1 - userData.todayScore / 100),
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="goldGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor={COLORS.gold} />
                        <stop offset="100%" stopColor={COLORS.goldLight} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: COLORS.goldLight,
                        fontFamily: "'Cormorant Garamond', serif",
                        lineHeight: 1,
                      }}
                    >
                      {userData.todayScore}
                    </span>
                    <span
                      style={{
                        fontSize: 8,
                        color: COLORS.goldDim,
                        letterSpacing: "1px",
                      }}
                    >
                      TODAY
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* --- DAILY COUNSEL (軍師の一言) --- */}
          <div style={{ padding: "12px 20px 0" }}>
            <GlassCard delay={0.35} style={{ padding: "20px 24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 16,
                    background: `linear-gradient(${COLORS.gold}, ${COLORS.goldDim})`,
                    borderRadius: 2,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: COLORS.goldDim,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  軍師の一言 · Daily Counsel
                </span>
              </div>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: COLORS.parchment,
                  fontFamily: "'Noto Serif JP', serif",
                  fontWeight: 300,
                  opacity: showDailyReveal ? 1 : 0,
                  transform: showDailyReveal
                    ? "translateY(0)"
                    : "translateY(8px)",
                  transition: "all 0.8s ease-out",
                  letterSpacing: "0.5px",
                }}
              >
                追うのではなく、
                <br />
                引き寄せる存在になれ。
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: COLORS.silverDim,
                  marginTop: 12,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  opacity: showDailyReveal ? 0.6 : 0,
                  transition: "opacity 1s ease-out 0.3s",
                }}
              >
                — 庚寅の日、金の気が高まる時
              </p>
            </GlassCard>
          </div>

          {/* --- BENTO GRID --- */}
          <div style={{ padding: "12px 20px 0" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "auto auto",
                gap: 12,
              }}
            >
              {/* Fortune Categories */}
              <GlassCard
                delay={0.45}
                style={{ padding: "18px", gridColumn: "1" }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: COLORS.goldDim,
                    letterSpacing: "2px",
                    marginBottom: 14,
                    fontFamily: "'Cormorant Garamond', serif",
                    textTransform: "uppercase",
                  }}
                >
                  五運
                </div>
                {[
                  { label: "総合運", score: 87, color: COLORS.gold },
                  { label: "仕事運", score: 92, color: COLORS.jade },
                  { label: "金 運", score: 65, color: COLORS.copper },
                  { label: "対人運", score: 78, color: COLORS.silver },
                  { label: "健康運", score: 83, color: COLORS.copperLight },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: i < 4 ? 10 : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: COLORS.silver,
                        width: 38,
                        flexShrink: 0,
                        letterSpacing: "1px",
                      }}
                    >
                      {item.label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 3,
                        background: `${item.color}15`,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.score}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                          borderRadius: 2,
                          animation: `fadeIn 0.6s ease-out ${0.6 + i * 0.1}s both`,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: item.color,
                        width: 22,
                        textAlign: "right",
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {item.score}
                    </span>
                  </div>
                ))}
              </GlassCard>

              {/* Lucky Elements */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  gridColumn: "2",
                }}
              >
                <GlassCard delay={0.5} style={{ padding: "18px" }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: COLORS.goldDim,
                      letterSpacing: "2px",
                      marginBottom: 12,
                      fontFamily: "'Cormorant Garamond', serif",
                      textTransform: "uppercase",
                    }}
                  >
                    吉方位
                  </div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Compass rose */}
                    <svg
                      viewBox="0 0 100 100"
                      style={{ width: "100%", height: "100%" }}
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={`${COLORS.gold}15`}
                        strokeWidth="0.5"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="28"
                        fill="none"
                        stroke={`${COLORS.gold}10`}
                        strokeWidth="0.5"
                      />
                      {/* Direction markers */}
                      {["北", "東", "南", "西"].map((dir, i) => {
                        const angle = i * 90 - 90;
                        const rad = (angle * Math.PI) / 180;
                        const x = 50 + 44 * Math.cos(rad);
                        const y = 50 + 44 * Math.sin(rad);
                        const isLucky = dir === "南" || dir === "東";
                        return (
                          <text
                            key={dir}
                            x={x}
                            y={y + 3}
                            textAnchor="middle"
                            fill={isLucky ? COLORS.gold : COLORS.silverDim}
                            fontSize="8"
                            fontFamily="'Noto Serif JP', serif"
                            fontWeight={isLucky ? 600 : 300}
                          >
                            {dir}
                          </text>
                        );
                      })}
                      {/* Lucky direction highlight */}
                      <line
                        x1="50"
                        y1="50"
                        x2="72"
                        y2="50"
                        stroke={COLORS.gold}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="72"
                        stroke={COLORS.gold}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="3"
                        fill={COLORS.gold}
                        opacity="0.8"
                      />
                    </svg>
                  </div>
                </GlassCard>

                <GlassCard delay={0.55} style={{ padding: "16px 18px" }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: COLORS.goldDim,
                      letterSpacing: "2px",
                      marginBottom: 10,
                      fontFamily: "'Cormorant Garamond', serif",
                      textTransform: "uppercase",
                    }}
                  >
                    Lucky
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{ fontSize: 10, color: COLORS.silverDim }}
                      >
                        色
                      </span>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #C0C0C0, #E8E8E8)",
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        />
                        <span
                          style={{ fontSize: 10, color: COLORS.parchment }}
                        >
                          銀白
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{ fontSize: 10, color: COLORS.silverDim }}
                      >
                        数
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: COLORS.parchment,
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        7 · 16
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{ fontSize: 10, color: COLORS.silverDim }}
                      >
                        時
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: COLORS.parchment,
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        15:00–17:00
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Biorhythm / Weekly Trend */}
              <GlassCard
                delay={0.6}
                style={{ padding: "18px", gridColumn: "1 / -1" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: COLORS.goldDim,
                      letterSpacing: "2px",
                      fontFamily: "'Cormorant Garamond', serif",
                      textTransform: "uppercase",
                    }}
                  >
                    運勢バイオリズム · 7 Days
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      color: COLORS.silverDim,
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    Feb 8 – 14
                  </span>
                </div>
                <svg
                  viewBox="0 0 300 80"
                  style={{ width: "100%", height: "auto" }}
                >
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 20}
                      x2="300"
                      y2={i * 20}
                      stroke={`${COLORS.gold}08`}
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Area fill */}
                  <path
                    d="M0,35 C20,30 40,20 60,15 C80,10 100,25 120,20 C140,15 160,8 180,12 C200,16 220,28 240,25 C260,22 280,35 300,30 L300,80 L0,80 Z"
                    fill={`url(#areaGrad)`}
                  />
                  {/* Line */}
                  <path
                    d="M0,35 C20,30 40,20 60,15 C80,10 100,25 120,20 C140,15 160,8 180,12 C200,16 220,28 240,25 C260,22 280,35 300,30"
                    fill="none"
                    stroke={COLORS.gold}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Today marker */}
                  <circle cx="0" cy="35" r="4" fill={COLORS.gold} />
                  <circle
                    cx="0"
                    cy="35"
                    r="7"
                    fill="none"
                    stroke={COLORS.gold}
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  {/* Peak marker */}
                  <circle
                    cx="180"
                    cy="8"
                    r="3"
                    fill={COLORS.goldLight}
                    opacity="0.6"
                  />
                  <text
                    x="180"
                    y="-2"
                    textAnchor="middle"
                    fill={COLORS.goldLight}
                    fontSize="7"
                    fontFamily="'Cormorant Garamond', serif"
                    opacity="0.7"
                  >
                    Peak
                  </text>
                  {/* Day labels */}
                  {["今日", "月", "火", "水", "木", "金", "土"].map(
                    (day, i) => (
                      <text
                        key={i}
                        x={i * 50}
                        y="76"
                        textAnchor="middle"
                        fill={
                          i === 0 ? COLORS.gold : `${COLORS.silverDim}`
                        }
                        fontSize="7"
                        fontFamily="'Noto Serif JP', serif"
                        fontWeight={i === 0 ? 500 : 300}
                      >
                        {day}
                      </text>
                    )
                  )}
                  <defs>
                    <linearGradient
                      id="areaGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="80"
                    >
                      <stop
                        offset="0%"
                        stopColor={COLORS.gold}
                        stopOpacity="0.15"
                      />
                      <stop
                        offset="100%"
                        stopColor={COLORS.gold}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </GlassCard>
            </div>
          </div>

          {/* --- QUICK ACTIONS --- */}
          <div style={{ padding: "16px 20px 0" }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                paddingBottom: 4,
              }}
            >
              {[
                { icon: "卜", label: "今日の卦", sub: "易占い" },
                { icon: "策", label: "戦略相談", sub: "AI軍師" },
                { icon: "命", label: "命式詳細", sub: "四柱推命" },
                { icon: "相", label: "相性診断", sub: "人間関係" },
              ].map((action, i) => (
                <GlassCard
                  key={i}
                  delay={0.7 + i * 0.05}
                  onClick={() => {}}
                  style={{
                    padding: "16px",
                    minWidth: 100,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="card-press"
                    style={{
                      fontSize: 24,
                      color: COLORS.gold,
                      marginBottom: 8,
                      fontFamily: "'Zen Old Mincho', serif",
                      fontWeight: 700,
                      animation: `gentleFloat 3s ease-in-out infinite`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  >
                    {action.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.parchment,
                      marginBottom: 2,
                      letterSpacing: "1px",
                    }}
                  >
                    {action.label}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: COLORS.silverDim,
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {action.sub}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* --- FOOTER SPACE --- */}
          <div style={{ height: 100 }} />
        </div>

        {/* --- BOTTOM NAV --- */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 72,
            background: `linear-gradient(to top, ${COLORS.inkDeep}, ${COLORS.inkDeep}F0, ${COLORS.inkDeep}00)`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            paddingBottom: 8,
            zIndex: 10,
            borderTop: `1px solid ${COLORS.gold}08`,
          }}
        >
          {[
            { id: "home", icon: "命", label: "天命" },
            { id: "divine", icon: "占", label: "占術" },
            { id: "counsel", icon: "策", label: "軍師" },
            { id: "diary", icon: "記", label: "記録" },
            { id: "learn", icon: "学", label: "修学" },
          ].map((tab) => (
            <div
              key={tab.id}
              className="nav-item"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                cursor: "pointer",
                opacity: activeTab === tab.id ? 1 : 0.4,
                transition: "opacity 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontFamily: "'Zen Old Mincho', serif",
                  fontWeight: 700,
                  color:
                    activeTab === tab.id ? COLORS.gold : COLORS.silver,
                  transition: "color 0.3s ease",
                }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  fontSize: 8,
                  letterSpacing: "1px",
                  color:
                    activeTab === tab.id ? COLORS.goldDim : COLORS.silverDim,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: COLORS.gold,
                    boxShadow: `0 0 6px ${COLORS.gold}60`,
                    marginTop: -1,
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
