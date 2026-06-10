import BracketTab from "./BracketTab";
import { useState, useEffect, useCallback, useRef } from "react";

// ── Supabase Config ───────────────────────────────────────────────────────────
const SUPABASE_URL = "https://hhhijbdvcasbpmcefmef.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaGlqYmR2Y2FzYnBtY2VmbWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjE1NjIsImV4cCI6MjA5NjU5NzU2Mn0.X62bsKGeYVxJ1td8n71mVnY-33iHvlR5a3p56drT3oQ";

const sb = {
  async select() {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/participants?select=*&order=registered_at.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return r.json();
  },
  async insert(row) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/participants`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(row)
    });
    return r.json();
  },
  async update(id, patch) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/participants?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(patch)
    });
    return r.json();
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/participants?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  },
  async deleteAll() {
    await fetch(`${SUPABASE_URL}/rest/v1/participants?id=gt.0`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

// ── Teams ─────────────────────────────────────────────────────────────────────
const TEAMS = [
  { id: "spain",       name: "إسبانيا",          en: "Spain",        flag: "🇪🇸", odds: 18.2 },
  { id: "france",      name: "فرنسا",             en: "France",       flag: "🇫🇷", odds: 17.0 },
  { id: "england",     name: "إنجلترا",           en: "England",      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", odds: 12.5 },
  { id: "brazil",      name: "البرازيل",          en: "Brazil",       flag: "🇧🇷", odds: 11.1 },
  { id: "portugal",    name: "البرتغال",          en: "Portugal",     flag: "🇵🇹", odds: 9.5  },
  { id: "argentina",   name: "الأرجنتين",         en: "Argentina",    flag: "🇦🇷", odds: 9.5  },
  { id: "germany",     name: "ألمانيا",           en: "Germany",      flag: "🇩🇪", odds: 6.5  },
  { id: "netherlands", name: "هولندا",            en: "Netherlands",  flag: "🇳🇱", odds: 4.8  },
  { id: "morocco",     name: "المغرب",            en: "Morocco",      flag: "🇲🇦", odds: 3.0  },
  { id: "belgium",     name: "بلجيكا",            en: "Belgium",      flag: "🇧🇪", odds: 2.5  },
  { id: "croatia",     name: "كرواتيا",           en: "Croatia",      flag: "🇭🇷", odds: 1.5  },
  { id: "uruguay",     name: "أوروغواي",          en: "Uruguay",      flag: "🇺🇾", odds: 1.5  },
  { id: "colombia",    name: "كولومبيا",          en: "Colombia",     flag: "🇨🇴", odds: 1.3  },
  { id: "italy",       name: "إيطاليا",           en: "Italy",        flag: "🇮🇹", odds: 1.2  },
  { id: "usa",         name: "الولايات المتحدة",  en: "USA",          flag: "🇺🇸", odds: 1.8  },
  { id: "mexico",      name: "المكسيك",           en: "Mexico",       flag: "🇲🇽", odds: 1.6  },
  { id: "japan",       name: "اليابان",           en: "Japan",        flag: "🇯🇵", odds: 0.9  },
  { id: "senegal",     name: "السنغال",           en: "Senegal",      flag: "🇸🇳", odds: 0.7  },
  { id: "southkorea",  name: "كوريا الجنوبية",   en: "South Korea",  flag: "🇰🇷", odds: 0.6  },
  { id: "denmark",     name: "الدنمارك",          en: "Denmark",      flag: "🇩🇰", odds: 0.8  },
  { id: "switzerland", name: "سويسرا",            en: "Switzerland",  flag: "🇨🇭", odds: 0.7  },
  { id: "australia",   name: "أستراليا",          en: "Australia",    flag: "🇦🇺", odds: 0.4  },
  { id: "ecuador",     name: "الإكوادور",         en: "Ecuador",      flag: "🇪🇨", odds: 0.4  },
  { id: "austria",     name: "النمسا",            en: "Austria",      flag: "🇦🇹", odds: 0.5  },
  { id: "saudiarabia", name: "السعودية",          en: "Saudi Arabia", flag: "🇸🇦", odds: 0.3  },
];

const MAX_PER_TEAM = 3;
const JERSEY_SIZES = ["XS","S","M","L","XL","XXL","XXXL"];

const TEAM_JERSEYS = {
  spain:       { home: { color:"#c60b1e", accent:"#f1bf00", label:"أحمر" },   away: { color:"#002fa7", accent:"#ffffff", label:"أزرق داكن" },  third: { color:"#000000", accent:"#c60b1e", label:"أسود" } },
  france:      { home: { color:"#002395", accent:"#ed2939", label:"أزرق" },   away: { color:"#ffffff", accent:"#002395", label:"أبيض" },       third: { color:"#ed2939", accent:"#002395", label:"أحمر" } },
  england:     { home: { color:"#ffffff", accent:"#cf111a", label:"أبيض" },   away: { color:"#1e3a5f", accent:"#ffffff", label:"أزرق كحلي" },  third: { color:"#cf111a", accent:"#ffffff", label:"أحمر" } },
  brazil:      { home: { color:"#f7d000", accent:"#009c3b", label:"أصفر" },   away: { color:"#009c3b", accent:"#f7d000", label:"أخضر" },       third: { color:"#002776", accent:"#f7d000", label:"أزرق" } },
  portugal:    { home: { color:"#8b0000", accent:"#006600", label:"أحمر داكن" }, away: { color:"#006600", accent:"#8b0000", label:"أخضر" },   third: { color:"#ffffff", accent:"#8b0000", label:"أبيض" } },
  argentina:   { home: { color:"#74acdf", accent:"#ffffff", label:"أزرق فاتح" }, away: { color:"#ffffff", accent:"#74acdf", label:"أبيض" },   third: { color:"#2d2d2d", accent:"#74acdf", label:"رمادي داكن" } },
  germany:     { home: { color:"#ffffff", accent:"#000000", label:"أبيض" },   away: { color:"#000000", accent:"#ffffff", label:"أسود" },       third: { color:"#d40000", accent:"#000000", label:"أحمر" } },
  netherlands: { home: { color:"#ff6600", accent:"#ffffff", label:"برتقالي" }, away: { color:"#002fa7", accent:"#ff6600", label:"أزرق" },      third: { color:"#ffffff", accent:"#ff6600", label:"أبيض" } },
  morocco:     { home: { color:"#c1272d", accent:"#006233", label:"أحمر" },   away: { color:"#ffffff", accent:"#c1272d", label:"أبيض" },       third: { color:"#006233", accent:"#c1272d", label:"أخضر" } },
  belgium:     { home: { color:"#1a1a1a", accent:"#ef3340", label:"أسود" },   away: { color:"#ef3340", accent:"#1a1a1a", label:"أحمر" },       third: { color:"#0032a0", accent:"#ef3340", label:"أزرق" } },
  croatia:     { home: { color:"#ff0000", accent:"#ffffff", label:"أحمر مربعات" }, away: { color:"#002868", accent:"#ff0000", label:"أزرق داكن" }, third: { color:"#ffffff", accent:"#002868", label:"أبيض" } },
  uruguay:     { home: { color:"#5aaad5", accent:"#ffffff", label:"أزرق سماوي" }, away: { color:"#000000", accent:"#5aaad5", label:"أسود" },   third: { color:"#ffffff", accent:"#5aaad5", label:"أبيض" } },
  colombia:    { home: { color:"#fcd116", accent:"#003087", label:"أصفر" },   away: { color:"#003087", accent:"#fcd116", label:"أزرق" },       third: { color:"#ce1126", accent:"#fcd116", label:"أحمر" } },
  italy:       { home: { color:"#003399", accent:"#ffffff", label:"أزرق أزوري" }, away: { color:"#ffffff", accent:"#003399", label:"أبيض" },   third: { color:"#000000", accent:"#003399", label:"أسود" } },
  usa:         { home: { color:"#ffffff", accent:"#002868", label:"أبيض" },   away: { color:"#002868", accent:"#bf0a30", label:"أزرق كحلي" }, third: { color:"#bf0a30", accent:"#ffffff", label:"أحمر" } },
  mexico:      { home: { color:"#006847", accent:"#ffffff", label:"أخضر" },   away: { color:"#ffffff", accent:"#006847", label:"أبيض" },       third: { color:"#ce1126", accent:"#006847", label:"أحمر" } },
  japan:       { home: { color:"#00205b", accent:"#bc002d", label:"أزرق سامورائي" }, away: { color:"#ffffff", accent:"#00205b", label:"أبيض" }, third: { color:"#bc002d", accent:"#00205b", label:"أحمر" } },
  senegal:     { home: { color:"#00853f", accent:"#fdef42", label:"أخضر" },   away: { color:"#ffffff", accent:"#00853f", label:"أبيض" },       third: { color:"#e31b23", accent:"#fdef42", label:"أحمر" } },
  southkorea:  { home: { color:"#cd2e3a", accent:"#003478", label:"أحمر" },   away: { color:"#003478", accent:"#cd2e3a", label:"أزرق داكن" }, third: { color:"#ffffff", accent:"#cd2e3a", label:"أبيض" } },
  denmark:     { home: { color:"#c60c30", accent:"#ffffff", label:"أحمر" },   away: { color:"#ffffff", accent:"#c60c30", label:"أبيض" },       third: { color:"#000000", accent:"#c60c30", label:"أسود" } },
  switzerland: { home: { color:"#ff0000", accent:"#ffffff", label:"أحمر" },   away: { color:"#ffffff", accent:"#ff0000", label:"أبيض" },       third: { color:"#1a1a1a", accent:"#ff0000", label:"أسود" } },
  australia:   { home: { color:"#00843d", accent:"#ffd700", label:"أخضر" },   away: { color:"#ffffff", accent:"#00843d", label:"أبيض" },       third: { color:"#002868", accent:"#ffd700", label:"أزرق" } },
  ecuador:     { home: { color:"#ffd100", accent:"#003087", label:"أصفر" },   away: { color:"#003087", accent:"#ffd100", label:"أزرق" },       third: { color:"#ce1126", accent:"#ffd100", label:"أحمر" } },
  austria:     { home: { color:"#ed2939", accent:"#ffffff", label:"أحمر" },   away: { color:"#ffffff", accent:"#ed2939", label:"أبيض" },       third: { color:"#1a1a1a", accent:"#ed2939", label:"أسود" } },
  saudiarabia: { home: { color:"#006c35", accent:"#ffffff", label:"أخضر" },   away: { color:"#ffffff", accent:"#006c35", label:"أبيض" },       third: { color:"#1a1a1a", accent:"#006c35", label:"أسود" } },
};

const JERSEY_KIT_TYPES = [
  { id: "home",  label: "الطقم الأول"   },
  { id: "away",  label: "الطقم الثاني" },
  { id: "third", label: "الطقم الثالث" },
];

// ── Jersey Image ──────────────────────────────────────────────────────────────
const jerseyImageCache = {};

async function fetchJerseyImage(teamId, kitType, teamName, teamEn) {
  const cacheKey = `${teamId}_${kitType}`;
  if (jerseyImageCache[cacheKey]) return jerseyImageCache[cacheKey];
  const kit = TEAM_JERSEYS[teamId]?.[kitType] || { color:"#888", accent:"#fff", label:"" };
  const kitLabels = { home:"home first kit", away:"away second kit", third:"third alternate kit" };
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 2000,
        messages: [{ role: "user", content: `Create a detailed, realistic SVG illustration of a ${teamEn} ${kitLabels[kitType]} football jersey for World Cup 2026.
Main color: ${kit.color}
Accent/trim color: ${kit.accent}
Style: ${kit.label}
${teamId === "croatia" && kitType === "home" ? "Pattern: red and white checkerboard squares" : ""}
${teamId === "argentina" && kitType === "home" ? "Pattern: light blue and white vertical stripes" : ""}
Return ONLY a valid SVG (viewBox="0 0 200 220") of just the jersey shirt, front view, no player, detailed fabric texture.` }]
      })
    });
    const d = await r.json();
    const text = d.content?.[0]?.text || "";
    const svgMatch = text.match(/<svg[\s\S]*<\/svg>/i);
    if (svgMatch) {
      jerseyImageCache[cacheKey] = { type: "svg", data: svgMatch[0] };
      return jerseyImageCache[cacheKey];
    }
  } catch {}
  return null;
}

function JerseyCard({ teamId, kitType, teamName, teamEn, size = 110, showName = "", showNumber = "" }) {
  const [imgData, setImgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const kit = TEAM_JERSEYS[teamId]?.[kitType] || { color:"#888", accent:"#fff", label:"" };

  useEffect(() => {
    if (!teamId) return;
    const cacheKey = `${teamId}_${kitType}`;
    if (jerseyImageCache[cacheKey]) { setImgData(jerseyImageCache[cacheKey]); return; }
    setLoading(true);
    fetchJerseyImage(teamId, kitType, teamName, teamEn).then(data => {
      setImgData(data); setLoading(false);
    });
  }, [teamId, kitType]);

  const FallbackSVG = () => {
    const isChecker = teamId === "croatia" && kitType === "home";
    const isStripes = (teamId === "argentina" || teamId === "uruguay") && kitType === "home";
    const isPinstripe = (teamId === "germany" || teamId === "spain") && kitType === "home";
    return (
      <svg width={size} height={size*1.1} viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg"
        style={{filter:"drop-shadow(0 6px 16px rgba(0,0,0,0.6))"}}>
        <defs>
          {isChecker && <pattern id={`chk_${kitType}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill={kit.color}/><rect x="10" width="10" height="10" fill={kit.accent}/><rect y="10" width="10" height="10" fill={kit.accent}/><rect x="10" y="10" width="10" height="10" fill={kit.color}/></pattern>}
          {isStripes && <pattern id={`str_${kitType}`} x="0" y="0" width="24" height="1" patternUnits="userSpaceOnUse"><rect width="14" height="220" fill={kit.color}/><rect x="14" width="10" height="220" fill={kit.accent}/></pattern>}
          {isPinstripe && <pattern id={`pin_${kitType}`} x="0" y="0" width="12" height="1" patternUnits="userSpaceOnUse"><rect width="10" height="220" fill={kit.color}/><rect x="10" width="2" height="220" fill={kit.accent} opacity="0.3"/></pattern>}
          <filter id={`shadow_${kitType}`}><feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.4"/></filter>
          <linearGradient id={`shine_${kitType}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="white" stopOpacity="0.15"/><stop offset="50%" stopColor="white" stopOpacity="0"/><stop offset="100%" stopColor="black" stopOpacity="0.1"/></linearGradient>
        </defs>
        <path d="M20 38 L8 110 L62 118 L70 40 Z" fill={isChecker?`url(#chk_${kitType})`:isStripes?`url(#str_${kitType})`:isPinstripe?`url(#pin_${kitType})`:kit.color} stroke={kit.accent} strokeWidth="2" filter={`url(#shadow_${kitType})`}/>
        <path d="M180 38 L192 110 L138 118 L130 40 Z" fill={isChecker?`url(#chk_${kitType})`:isStripes?`url(#str_${kitType})`:isPinstripe?`url(#pin_${kitType})`:kit.color} stroke={kit.accent} strokeWidth="2"/>
        <path d="M70 40 L62 118 L55 205 L145 205 L138 118 L130 40 Q100 58 70 40 Z" fill={isChecker?`url(#chk_${kitType})`:isStripes?`url(#str_${kitType})`:isPinstripe?`url(#pin_${kitType})`:kit.color} stroke={kit.accent} strokeWidth="2" filter={`url(#shadow_${kitType})`}/>
        <path d="M70 40 L62 118 L55 205 L145 205 L138 118 L130 40 Q100 58 70 40 Z" fill={`url(#shine_${kitType})`}/>
        <path d="M20 38 L8 110 L62 118 L70 40 Z" fill={`url(#shine_${kitType})`}/>
        <path d="M180 38 L192 110 L138 118 L130 40 Z" fill={`url(#shine_${kitType})`}/>
        <path d="M82 42 Q100 62 118 42" fill="none" stroke={kit.accent} strokeWidth="5" strokeLinecap="round"/>
        <path d="M84 42 Q100 56 116 42" fill={kit.color} stroke={kit.accent} strokeWidth="1"/>
        <line x1="24" y1="58" x2="16" y2="88" stroke={kit.accent} strokeWidth="6" opacity="0.7" strokeLinecap="round"/>
        <line x1="176" y1="58" x2="184" y2="88" stroke={kit.accent} strokeWidth="6" opacity="0.7" strokeLinecap="round"/>
        <circle cx="76" cy="85" r="10" fill={kit.accent} opacity="0.7"/>
        <text x="76" y="89" textAnchor="middle" fontSize="9" fill={kit.color} fontWeight="900">⚽</text>
        {showNumber && <text x="100" y="165" textAnchor="middle" fontSize="44" fontWeight="900" fill={kit.accent} fontFamily="'Bebas Neue',Arial,sans-serif">{showNumber}</text>}
        {showName && <text x="100" y="130" textAnchor="middle" fontSize="13" fontWeight="700" fill={kit.accent} fontFamily="Cairo,Arial,sans-serif" letterSpacing="2">{showName.slice(0,9).toUpperCase()}</text>}
        <line x1="56" y1="204" x2="144" y2="204" stroke={kit.accent} strokeWidth="3" opacity="0.6"/>
      </svg>
    );
  };

  if (loading) return <div style={{width:size,height:size*1.1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}><div style={{fontSize:"1.6rem",animation:"spin 1s linear infinite"}}>⟳</div><div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.4)"}}>جاري التحميل...</div></div>;
  if (imgData?.type === "svg") return <div style={{width:size,height:size*1.1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}><div dangerouslySetInnerHTML={{__html: imgData.data}} style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}/>{(showName||showNumber)&&<div style={{position:"absolute",bottom:"14%",left:0,right:0,textAlign:"center"}}>{showName&&<div style={{fontSize:"0.55rem",fontWeight:700,color:kit.accent,letterSpacing:1,opacity:0.9}}>{showName.slice(0,9).toUpperCase()}</div>}{showNumber&&<div style={{fontSize:"1.4rem",fontWeight:900,color:kit.accent,fontFamily:"'Bebas Neue',sans-serif",lineHeight:1}}>{showNumber}</div>}</div>}</div>;
  return <FallbackSVG />;
}

// ── Countdown ─────────────────────────────────────────────────────────────────
const REGISTRATION_DEADLINE = new Date("2026-06-11T15:00:00Z");

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  function getTimeLeft() {
    const diff = REGISTRATION_DEADLINE - Date.now();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, diff };
  }
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);
  return timeLeft;
}

function CountdownBanner() {
  const t = useCountdown();
  if (!t) return <div style={{background:"rgba(255,60,60,0.15)",border:"1px solid rgba(255,60,60,0.4)",borderRadius:12,padding:"10px 16px",textAlign:"center",marginBottom:16,fontSize:"0.85rem",color:"#ff8888"}}>🔒 انتهى وقت التسجيل — البطولة انطلقت!</div>;
  const urgent = t.diff < 86400000;
  return (
    <div style={{background:urgent?"rgba(255,60,60,0.12)":"rgba(212,175,55,0.1)",border:`1px solid ${urgent?"rgba(255,60,60,0.4)":"rgba(212,175,55,0.3)"}`,borderRadius:12,padding:"12px 16px",marginBottom:16,textAlign:"center"}}>
      <div style={{fontSize:"0.72rem",color:"var(--muted)",marginBottom:6,letterSpacing:1}}>⏱ يُغلق التسجيل عند انطلاق أول مباراة</div>
      <div style={{display:"flex",justifyContent:"center",gap:10,alignItems:"center"}}>
        {[{v:t.d,l:"يوم"},{v:t.h,l:"ساعة"},{v:t.m,l:"دقيقة"},{v:t.s,l:"ثانية"}].map(({v,l})=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:urgent?"2rem":"1.7rem",color:urgent?"#ff6666":"var(--gold)",lineHeight:1,textShadow:urgent?"0 0 16px rgba(255,80,80,0.5)":"0 0 12px rgba(212,175,55,0.5)",minWidth:42,background:"rgba(0,0,0,0.25)",borderRadius:8,padding:"4px 6px",border:`1px solid ${urgent?"rgba(255,60,60,0.3)":"rgba(212,175,55,0.2)"}`}}>{String(v).padStart(2,"0")}</div>
            <div style={{fontSize:"0.6rem",color:"var(--muted)",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NEW: Supabase Realtime via WebSocket ──────────────────────────────────────
function useSupabaseRealtime(onEvent) {
  useEffect(() => {
    let ws;
    let hbInterval;
    let retryTimeout;
    let retries = 0;

    function connect() {
      try {
        ws = new WebSocket(`wss://hhhijbdvcasbpmcefmef.supabase.co/realtime/v1/websocket?apikey=${SUPABASE_KEY}&vsn=1.0.0`);

        ws.onopen = () => {
          retries = 0;
          ws.send(JSON.stringify({
            topic: "realtime:public:participants",
            event: "phx_join",
            payload: {
              config: {
                broadcast: { self: false },
                presence: { key: "" },
                postgres_changes: [{ event: "*", schema: "public", table: "participants" }]
              }
            },
            ref: "join_1"
          }));
          hbInterval = setInterval(() => {
            if (ws.readyState === 1) ws.send(JSON.stringify({ topic: "phoenix", event: "heartbeat", payload: {}, ref: "hb" }));
          }, 25000);
        };

        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (msg.event === "postgres_changes" && msg.payload?.data) {
              onEvent(msg.payload.data);
            }
          } catch {}
        };

        ws.onclose = () => {
          clearInterval(hbInterval);
          if (retries < 6) {
            retryTimeout = setTimeout(connect, Math.min(2000 * Math.pow(1.5, retries), 30000));
            retries++;
          }
        };

        ws.onerror = () => ws.close();
      } catch {}
    }

    connect();
    return () => {
      clearInterval(hbInterval);
      clearTimeout(retryTimeout);
      if (ws) ws.close();
    };
  }, []);
}

// ── NEW: Browser Notifications ────────────────────────────────────────────────
function requestNotifPermission() {
  if (typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
}

function sendNotif(title, body) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    try { new Notification(title, { body, icon: "⚽" }); } catch {}
  }
}

// ── NEW: Share Card ───────────────────────────────────────────────────────────
function shareWhatsApp(p, prob) {
  const text = `🏆 كأس العالم 2026 — بطاقة مشاركتي\n\n👤 ${p.name}\n${p.team_flag} ${p.team_name}\n📊 احتمال الفوز: ${prob}%\n👕 ${p.jersey?.name} #${p.jersey?.number}\n\nسجّل مشاركتك 👇\nhttps://wc2026-olive.vercel.app`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
}

// ── NEW: CSV Export ───────────────────────────────────────────────────────────
function exportCSV(participants) {
  const BOM = "﻿";
  const headers = ["الاسم","المنتخب","لون الطقم","المقاس","اسم الطباعة","رقم الطباعة","تاريخ التسجيل"];
  const rows = participants.map(p => [
    p.name,
    `${p.team_flag} ${p.team_name}`,
    p.jersey?.color || "",
    p.jersey?.size || "",
    p.jersey?.name || "",
    p.jersey?.number || "",
    p.registered_at ? new Date(p.registered_at).toLocaleDateString("ar-SA") : "-"
  ]);
  const csv = BOM + [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `WC2026_participants.csv`; a.click();
  URL.revokeObjectURL(url);
}

// ── NEW: Winner Page ──────────────────────────────────────────────────────────
function WinnerPage({ winnerTeamId, participants, odds, onClose }) {
  const team = TEAMS.find(t => t.id === winnerTeamId);
  const winners = participants.filter(p => p.team_id === winnerTeamId);
  const losers = participants.filter(p => p.team_id !== winnerTeamId);

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"linear-gradient(135deg,#042e12,#064e2a,#042e12)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",overflow:"auto",direction:"rtl"}}>
      <style>{`@keyframes confettiFall{from{transform:translateY(-20px) rotate(0deg);opacity:1}to{transform:translateY(100vh) rotate(720deg);opacity:0}}@keyframes bounceIn{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
      {Array.from({length:20}).map((_,i)=>(
        <div key={i} style={{position:"fixed",top:"-20px",left:`${Math.random()*100}%`,width:8,height:8,borderRadius:"50%",background:["#ffd700","#4cff88","#ff6b6b","#44ddff","#ff9f43"][i%5],animation:`confettiFall ${2+Math.random()*3}s ${Math.random()*2}s infinite`}}/>
      ))}
      <div style={{fontSize:"5rem",animation:"bounceIn 0.8s ease",marginBottom:12}}>🏆</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2rem,8vw,4rem)",color:"#ffd700",letterSpacing:4,textShadow:"0 0 40px rgba(255,215,0,0.8)",marginBottom:8}}>الفائز بكأس العالم 2026</div>
      <div style={{fontSize:"5rem",marginBottom:8}}>{team?.flag}</div>
      <div style={{fontSize:"2rem",fontWeight:900,color:"#ffffff",marginBottom:24}}>{team?.name}</div>

      {winners.length > 0 && (
        <div style={{background:"rgba(255,215,0,0.12)",border:"2px solid #ffd700",borderRadius:20,padding:"20px 28px",marginBottom:20,maxWidth:400,width:"100%"}}>
          <div style={{fontSize:"1rem",fontWeight:900,color:"#ffd700",marginBottom:12}}>🎉 المشاركون الفائزون</div>
          {winners.map(w => (
            <div key={w.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,215,0,0.2)"}}>
              {w.photo ? <img src={w.photo} style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",border:"2px solid #ffd700"}}/> : <span style={{fontSize:"1.6rem"}}>{w.team_flag}</span>}
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:900,color:"#fff"}}>{w.name}</div>
                <div style={{fontSize:"0.74rem",color:"#ffd700"}}>👕 {w.jersey?.name} #{w.jersey?.number} • {w.jersey?.size}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {losers.length > 0 && (
        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"12px 18px",marginBottom:20,maxWidth:400,width:"100%",fontSize:"0.82rem",color:"rgba(255,255,255,0.6)"}}>
          <div style={{marginBottom:6,color:"rgba(255,255,255,0.8)"}}>💰 المشاركون الخاسرون ({losers.length} شخص) — يساهمون في تكلفة التيشرت</div>
          {losers.map(l => <span key={l.id} style={{marginLeft:6}}>{l.team_flag} {l.name}</span>)}
        </div>
      )}

      <button onClick={onClose} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:12,padding:"10px 28px",color:"#fff",fontFamily:"Cairo,sans-serif",fontSize:"0.9rem",cursor:"pointer",marginTop:8}}>إغلاق</button>
    </div>
  );
}

// ── NEW: Stats Tab ────────────────────────────────────────────────────────────
function StatsTab({ participants, odds }) {
  const teamCounts = {};
  participants.forEach(p => { teamCounts[p.team_id] = (teamCounts[p.team_id] || 0) + 1; });
  const teamsWithParticipants = TEAMS.filter(t => teamCounts[t.id] > 0).sort((a,b) => (teamCounts[b.id]||0) - (teamCounts[a.id]||0));
  const maxCount = Math.max(...Object.values(teamCounts), 1);

  return (
    <>
      <div className="card">
        <div className="card-title">📊 إحصائيات المشاركين</div>
        <div className="card-sub">{participants.length} مشارك • {teamsWithParticipants.length} منتخب مختار</div>
        {teamsWithParticipants.length === 0
          ? <div className="empty"><div className="ei">📊</div><p>لا يوجد مشاركون بعد</p></div>
          : teamsWithParticipants.map(team => {
            const cnt = teamCounts[team.id] || 0;
            const pct = Math.round((cnt / participants.length) * 100);
            const barW = Math.round((cnt / maxCount) * 100);
            const prob = odds[team.id] || team.odds;
            return (
              <div key={team.id} style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:"1.4rem"}}>{team.flag}</span>
                    <span style={{fontSize:"0.88rem",fontWeight:700}}>{team.name}</span>
                  </div>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>{pct}% من المشاركين</span>
                    <span style={{fontSize:"0.82rem",fontWeight:900,color:"var(--gold)"}}>{cnt}/{MAX_PER_TEAM}</span>
                  </div>
                </div>
                <div style={{height:10,background:"rgba(255,255,255,0.07)",borderRadius:5,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${barW}%`,background:`linear-gradient(90deg,var(--gold),#b8962e)`,borderRadius:5,transition:"width 1s ease"}}/>
                </div>
                <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                  {participants.filter(p => p.team_id === team.id).map(p => (
                    <span key={p.id} style={{fontSize:"0.72rem",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"2px 8px",color:"var(--white)"}}>{p.name}</span>
                  ))}
                </div>
              </div>
            );
          })
        }
      </div>

      <div className="card">
        <div className="card-title" style={{fontSize:"1rem"}}>👕 توزيع المقاسات</div>
        {(() => {
          const sizes = {};
          participants.forEach(p => { const s = p.jersey?.size||"?"; sizes[s] = (sizes[s]||0)+1; });
          return Object.entries(sizes).sort((a,b)=>b[1]-a[1]).map(([s,c]) => (
            <div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{minWidth:50,fontWeight:700,color:"var(--gold)"}}>{s}</span>
              <div style={{flex:1,height:8,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(c/participants.length)*100}%`,background:"linear-gradient(90deg,#44ddff,#0099cc)",borderRadius:4}}/>
              </div>
              <span style={{fontSize:"0.78rem",color:"var(--muted)"}}>{c} شخص</span>
            </div>
          ));
        })()}
      </div>
    </>
  );
}

// ── Claude API helpers ────────────────────────────────────────────────────────
async function fetchLiveOdds() {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: `Search for the latest 2026 FIFA World Cup winner odds/probabilities from BetMGM, DraftKings, or ESPN today. Return ONLY a JSON object with these exact team IDs as keys and win probability % as values: spain, france, england, brazil, portugal, argentina, germany, netherlands, morocco, belgium, croatia, uruguay, colombia, italy, usa, mexico, japan, senegal, southkorea, denmark, switzerland, australia, ecuador, austria, saudiarabia. Return ONLY the JSON, nothing else.` }]
      })
    });
    const d = await r.json();
    const tb = d.content?.find(b => b.type === "text");
    if (!tb) return null;
    const m = tb.text.replace(/```json|```/g,"").trim().match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  } catch { return null; }
}

async function generateJerseyPreview(name, number, teamName, teamFlag, color, size) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 600,
        messages: [{ role: "user", content: `أنت مساعد مسابقة كأس العالم. المشارك "${name}" اختار منتخب "${teamFlag} ${teamName}" وطلب الطقم ${color} بمقاس ${size} مع الاسم "${name}" والرقم ${number} مطبوعَين عليه. اكتب وصفاً قصيراً ومتحمساً باللغة العربية (3-4 جمل) يصف شكله وهو يلبس هذا التيشرت ويحتفل بفوز منتخبه في كأس العالم 2026. اجعله شخصياً وممتعاً.` }]
      })
    });
    const d = await r.json();
    return d.content?.[0]?.text || null;
  } catch { return null; }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function probColor(p) { return p >= 12 ? "#4cff88" : p >= 6 ? "#44ddff" : p >= 2 ? "#ffcc44" : "#ff8866"; }
function barGrad(p) { return p >= 12 ? "linear-gradient(90deg,#4cff88,#00cc66)" : p >= 6 ? "linear-gradient(90deg,#44ddff,#0099cc)" : p >= 2 ? "linear-gradient(90deg,#ffcc44,#cc8800)" : "linear-gradient(90deg,#ff8866,#cc4422)"; }
function tierClass(p) { return p >= 12 ? "tier-top" : p >= 6 ? "tier-high" : p >= 2 ? "tier-mid" : "tier-low"; }

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Bebas+Neue&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--gold:#d4af37;--gold-light:#f0d060;--green-deep:#064e2a;--white:#f4f4f0;--card-bg:rgba(4,30,16,0.92);--glass:rgba(255,255,255,0.06);--muted:#a0b8a8}
  body{font-family:'Cairo',sans-serif;background:var(--green-deep);color:var(--white);min-height:100vh;direction:rtl;overflow-x:hidden}
  .pitch-bg{min-height:100vh;background:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(0,0,0,0.07) 40px,rgba(0,0,0,0.07) 80px),linear-gradient(135deg,#053d20 0%,#064e2a 40%,#053d20 100%)}
  .hdr{background:linear-gradient(180deg,rgba(0,0,0,.85),rgba(0,0,0,.4));padding:18px 24px 14px;text-align:center;border-bottom:2px solid var(--gold)}
  .hdr-trophy{font-size:2.6rem;line-height:1}
  .hdr-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.5rem,5vw,2.5rem);letter-spacing:3px;color:var(--gold);text-shadow:0 0 30px rgba(212,175,55,.6);margin:4px 0 2px}
  .hdr-sub{font-size:0.82rem;color:var(--muted)}
  .hdr-live{display:inline-flex;align-items:center;gap:6px;background:rgba(212,175,55,.12);border:1px solid var(--gold);border-radius:20px;padding:3px 12px;font-size:0.73rem;color:var(--gold);margin-top:7px}
  .live-dot{width:7px;height:7px;background:#4cff88;border-radius:50%;animation:pulse 1.4s infinite;box-shadow:0 0 6px #4cff88}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
  .nav{display:flex;justify-content:center;gap:6px;padding:14px 12px 0;flex-wrap:wrap}
  .nav-btn{background:var(--glass);border:1px solid rgba(212,175,55,.3);color:var(--muted);border-radius:10px;padding:7px 13px;font-family:'Cairo',sans-serif;font-size:0.8rem;font-weight:600;cursor:pointer;transition:all .2s}
  .nav-btn:hover{border-color:var(--gold);color:var(--white)}
  .nav-btn.active{background:linear-gradient(135deg,var(--gold),#b8962e);border-color:var(--gold);color:#000;box-shadow:0 4px 16px rgba(212,175,55,.35)}
  .main{max-width:700px;margin:0 auto;padding:18px 14px 70px}
  .card{background:var(--card-bg);border:1px solid rgba(212,175,55,.22);border-radius:20px;padding:24px 20px;backdrop-filter:blur(12px);box-shadow:0 8px 40px rgba(0,0,0,.5);margin-bottom:16px}
  .card-title{font-size:1.2rem;font-weight:900;color:var(--gold);text-align:center;margin-bottom:6px}
  .card-sub{font-size:0.8rem;color:var(--muted);text-align:center;margin-bottom:20px}
  .prize-box{background:linear-gradient(135deg,rgba(212,175,55,.15),rgba(212,175,55,.04));border:1px solid rgba(212,175,55,.4);border-radius:12px;padding:12px 14px;margin-bottom:18px;text-align:center;font-size:0.84rem;color:var(--gold-light)}
  .prize-box b{display:block;font-size:0.95rem;margin-bottom:4px}
  .lbl{font-size:0.78rem;font-weight:700;color:var(--muted);margin-bottom:5px;letter-spacing:.4px}
  .inp{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:11px 13px;color:var(--white);font-family:'Cairo',sans-serif;font-size:0.95rem;outline:none;transition:border-color .2s;margin-bottom:14px;text-align:right}
  .inp:focus{border-color:var(--gold)}
  .inp::placeholder{color:rgba(255,255,255,.3)}
  .sel{width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:11px 13px;color:var(--white);font-family:'Cairo',sans-serif;font-size:0.9rem;outline:none;margin-bottom:14px;cursor:pointer}
  .sel option{background:#1a3a25;color:var(--white)}
  .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .steps{display:flex;justify-content:center;gap:6px;margin-bottom:20px;align-items:center}
  .step{display:flex;align-items:center;gap:5px;font-size:0.74rem;color:var(--muted)}
  .step-num{width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0}
  .step.active .step-num{background:var(--gold);border-color:var(--gold);color:#000}
  .step.done .step-num{background:rgba(76,255,136,.2);border-color:#4cff88;color:#4cff88}
  .step-line{width:18px;height:1px;background:rgba(255,255,255,.15)}
  .team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:7px;margin-bottom:16px;max-height:300px;overflow-y:auto;padding-left:4px}
  .team-grid::-webkit-scrollbar{width:3px}
  .team-grid::-webkit-scrollbar-thumb{background:var(--gold);border-radius:2px}
  .t-tile{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:11px;padding:9px 5px 7px;text-align:center;cursor:pointer;transition:all .18s;position:relative}
  .t-tile:hover{border-color:rgba(212,175,55,.5);transform:translateY(-2px)}
  .t-tile.sel-t{border-color:var(--gold);background:rgba(212,175,55,.16);box-shadow:0 0 14px rgba(212,175,55,.28)}
  .t-tile.sel-t::after{content:'✓';position:absolute;top:4px;left:6px;font-size:.65rem;color:var(--gold);font-weight:900}
  .t-tile.full{opacity:.4;cursor:not-allowed}
  .t-flag{font-size:1.5rem;display:block;margin-bottom:3px}
  .t-name{font-size:0.68rem;font-weight:700;line-height:1.2}
  .t-odds{font-size:0.62rem;color:var(--gold);margin-top:2px;font-weight:600}
  .t-count{font-size:0.6rem;color:var(--muted)}
  .tier-top{border-color:rgba(212,175,55,.32)!important}
  .tier-high{border-color:rgba(100,180,255,.22)!important}
  .tier-mid{border-color:rgba(100,255,150,.18)!important}
  .tier-low{border-color:rgba(200,200,200,.12)!important}
  .btn{width:100%;background:linear-gradient(135deg,var(--gold),#b8962e);border:none;border-radius:12px;padding:13px;font-family:'Cairo',sans-serif;font-size:1rem;font-weight:900;color:#000;cursor:pointer;transition:all .2s;box-shadow:0 4px 18px rgba(212,175,55,.38)}
  .btn:hover{transform:translateY(-2px);box-shadow:0 6px 26px rgba(212,175,55,.52)}
  .btn:disabled{opacity:.35;cursor:not-allowed;transform:none}
  .btn-outline{background:transparent;border:1.5px solid var(--gold);color:var(--gold);box-shadow:none;margin-top:8px}
  .btn-outline:hover{background:rgba(212,175,55,.12)}
  .btn-sm{padding:7px 13px;font-size:0.78rem;width:auto;border-radius:8px}
  .btn-danger{background:rgba(255,60,60,.15);border:1px solid rgba(255,60,60,.3);color:#ff7777;box-shadow:none}
  .btn-green{background:rgba(76,255,136,.15);border:1px solid rgba(76,255,136,.3);color:#4cff88;box-shadow:none}
  .btn-whatsapp{background:linear-gradient(135deg,#25d366,#128c7e);border:none;color:#fff;box-shadow:0 4px 14px rgba(37,211,102,.35)}
  .terms-wrap{max-height:56vh;overflow-y:auto;margin-bottom:18px;padding-left:4px}
  .terms-wrap::-webkit-scrollbar{width:3px}
  .terms-wrap::-webkit-scrollbar-thumb{background:var(--gold);border-radius:2px}
  .terms-section{margin-bottom:20px}
  .terms-section-title{display:flex;align-items:center;gap:8px;font-size:0.9rem;font-weight:900;color:var(--gold);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(212,175,55,.2)}
  .terms-item{display:flex;gap:10px;margin-bottom:9px;font-size:0.82rem;line-height:1.7;color:rgba(244,244,240,.85)}
  .terms-item-icon{flex-shrink:0;font-size:1rem;margin-top:1px}
  .terms-accept-row{display:flex;align-items:flex-start;gap:10px;padding:12px;background:rgba(212,175,55,.07);border:1px solid rgba(212,175,55,.25);border-radius:10px;margin-bottom:14px;cursor:pointer}
  .terms-accept-row .cb{width:20px;height:20px;border:2px solid var(--gold);border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;margin-top:2px}
  .terms-accept-row.checked .cb{background:var(--gold)}
  .terms-accept-row span{font-size:0.82rem;line-height:1.6;color:var(--white)}
  .upd-bar{background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.2);border-radius:10px;padding:9px 13px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-size:0.76rem}
  .upd-time{color:var(--muted)}
  .upd-btn{background:rgba(212,175,55,.13);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:'Cairo',sans-serif;font-size:0.73rem;font-weight:700;padding:5px 11px;cursor:pointer;transition:all .2s}
  .upd-btn:hover{background:rgba(212,175,55,.26)}
  .upd-btn:disabled{opacity:.4;cursor:not-allowed}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .spin{animation:spin 1s linear infinite;display:inline-block}
  .p-card{background:var(--card-bg);border-radius:14px;padding:14px 16px;margin-bottom:10px;border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:12px;position:relative;overflow:hidden;transition:transform .18s,box-shadow .18s;cursor:pointer}
  .p-card:hover{transform:translateY(-2px);box-shadow:0 6px 22px rgba(0,0,0,.4)}
  .p-card::before{content:'';position:absolute;right:0;top:0;bottom:0;width:4px;border-radius:0 14px 14px 0}
  .r1::before{background:linear-gradient(180deg,#ffd700,#b8860b);box-shadow:-2px 0 12px rgba(255,215,0,.5)}
  .r2::before{background:linear-gradient(180deg,#c0c0c0,#808080)}
  .r3::before{background:linear-gradient(180deg,#cd7f32,#8b4513)}
  .rn::before{background:rgba(255,255,255,.08)}
  .r-badge{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;min-width:28px;text-align:center;line-height:1}
  .r1 .r-badge{color:#ffd700;text-shadow:0 0 10px rgba(255,215,0,.55)}
  .r2 .r-badge{color:#c0c0c0}
  .r3 .r-badge{color:#cd7f32}
  .rn .r-badge{color:var(--muted)}
  .p-flag{font-size:2.1rem;flex-shrink:0}
  .p-info{flex:1;min-width:0}
  .p-name{font-size:0.92rem;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .p-team{font-size:0.75rem;color:var(--muted);margin-top:1px}
  .p-changed{font-size:0.65rem;color:#4cff88}
  .p-prob{text-align:center;min-width:60px}
  .p-val{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;line-height:1}
  .p-lbl{font-size:0.62rem;color:var(--muted)}
  .p-bar-wrap{position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,.05);border-radius:0 0 14px 14px}
  .p-bar{height:100%;border-radius:0 0 14px 14px;transition:width 1.2s ease}
  .empty{text-align:center;padding:50px 20px;color:var(--muted)}
  .empty .ei{font-size:3rem;margin-bottom:10px}
  .loading-overlay{text-align:center;padding:60px 20px;color:var(--muted)}
  .loading-overlay .spin-big{font-size:2.5rem;display:block;animation:spin 1s linear infinite;margin-bottom:12px}
  .g-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}
  .g-card{background:var(--card-bg);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:11px 9px;display:flex;flex-direction:column;align-items:center;gap:5px}
  .g-flag{font-size:1.7rem}
  .g-name{font-size:0.74rem;font-weight:700;text-align:center}
  .g-bar-wrap{width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden}
  .g-bar-fill{height:100%;border-radius:2px}
  .g-pct{font-size:0.7rem;color:var(--gold);font-weight:700}
  .g-rank{font-size:0.62rem;color:var(--muted)}
  .a-row{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:0.8rem}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px)}
  .modal{background:#0a2d18;border:1px solid rgba(212,175,55,.3);border-radius:20px;padding:24px 20px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto;position:relative}
  .modal::-webkit-scrollbar{width:3px}
  .modal::-webkit-scrollbar-thumb{background:var(--gold);border-radius:2px}
  .modal-close{position:absolute;top:14px;left:14px;background:rgba(255,255,255,.08);border:none;border-radius:8px;color:var(--white);font-size:1rem;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .jersey-preview{background:linear-gradient(135deg,rgba(212,175,55,.1),rgba(0,0,0,.3));border:1px solid rgba(212,175,55,.2);border-radius:14px;padding:16px;margin:14px 0;text-align:center}
  .jersey-big{font-size:5rem;line-height:1}
  .jersey-tag{display:inline-block;background:rgba(212,175,55,.15);border:1px solid var(--gold);border-radius:20px;padding:4px 14px;font-size:0.78rem;color:var(--gold);margin-top:6px}
  .ai-preview{background:rgba(76,255,136,.06);border:1px solid rgba(76,255,136,.2);border-radius:12px;padding:14px;margin:12px 0;font-size:0.84rem;line-height:1.75;color:#c8ffd8}
  .ai-loading{text-align:center;padding:16px;color:var(--muted);font-size:0.84rem}
  .toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%) translateY(100px);background:linear-gradient(135deg,#064e2a,#0c7a40);border:1px solid var(--gold);border-radius:14px;padding:12px 22px;color:var(--white);font-weight:700;font-size:0.87rem;text-align:center;z-index:999;transition:transform .4s cubic-bezier(.34,1.56,.64,1);min-width:240px;pointer-events:none}
  .toast.show{transform:translateX(-50%) translateY(0)}
  .reg-closed-banner{background:rgba(255,60,60,.1);border:1px solid rgba(255,60,60,.35);border-radius:12px;padding:14px;text-align:center;margin-bottom:16px;color:#ff8888;font-size:0.86rem}
  @media(max-width:480px){
    .team-grid{grid-template-columns:repeat(auto-fill,minmax(82px,1fr))}
    .g-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr))}
    .p-flag{font-size:1.7rem}
    .p-val{font-size:1.35rem}
    .nav-btn{padding:6px 9px;font-size:0.75rem}
  }
`;

// ── Terms Content ─────────────────────────────────────────────────────────────
const TERMS = [
  { icon:"👕", title:"الجائزة", items:[
    { icon:"🏆", text:"الجائزة هي تيشرت المنتخب الفائز بكأس العالم 2026 (أصلي)." },
    { icon:"💰", text:"تُموَّل الجائزة بالتساوي من جميع المشاركين الخاسرين — يُقسَّم سعر التيشرت على عدد الخاسرين ويدفع كل منهم حصته." },
    { icon:"🎽", text:"في حال الفوز، يحق للفائز اختيار الاسم والرقم ولون الطقم والمقاس المطبوعَين على التيشرت." },
    { icon:"🤝", text:"إذا فاز أكثر من شخص بنفس المنتخب، تُقسَّم تكلفة التيشرتات على جميع الخاسرين." },
  ]},
  { icon:"🗳️", title:"التسجيل والتصويت", items:[
    { icon:"📋", text:"يجب التسجيل قبل انطلاق البطولة (11 يونيو 2026). لا يُقبَل التسجيل بعد انطلاق المباراة الأولى." },
    { icon:"🔄", text:"يُسمح بتغيير اختيار المنتخب مرة واحدة فقط، خلال 24 ساعة بعد انتهاء دور المجموعات. بعدها يصبح التصويت نهائياً." },
    { icon:"⚠️", text:"لا يمكن اختيار نفس المنتخب لأكثر من 3 أشخاص مختلفين. بعد اكتمال الحد، يُغلَق المنتخب." },
    { icon:"🚫", text:"لا يُسمح بالتسجيل بأكثر من اسم واحد. أي تلاعب يؤدي إلى الإلغاء الفوري." },
  ]},
  { icon:"🎽", title:"بيانات التيشرت", items:[
    { icon:"✍️", text:"يجب على كل مشارك إدخال الاسم والرقم المراد طباعتهما على التيشرت عند التسجيل." },
    { icon:"🎨", text:"يجب اختيار لون الطقم (أول / ثاني / ثالث) والمقاس من القائمة المتاحة." },
    { icon:"📸", text:"يمكن إضافة صورة شخصية اختيارية لمعرفة شكل التيشرت — الصورة للمعاينة فقط ولا تُشارَك." },
    { icon:"📦", text:"بيانات التيشرت مُلزِمة عند الفوز. لا يمكن تعديلها بعد انتهاء دور المجموعات." },
  ]},
  { icon:"⚖️", title:"أحكام عامة", items:[
    { icon:"📊", text:"الترتيب يعكس احتمالات أسواق الرهان العالمية ويتغير بعد كل جولة من المباريات." },
    { icon:"☁️", text:"البيانات تُحفَظ على السحابة ومشتركة بين جميع المشاركين في الوقت الفعلي." },
    { icon:"📱", text:"المسابقة للاستخدام الشخصي بين الأصدقاء والعائلة فقط." },
    { icon:"✅", text:"بالمشاركة، يُقِرّ المشارك بقراءة هذه الشروط والموافقة عليها كاملةً." },
  ]},
];

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("terms");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [odds, setOdds] = useState(() => { const o = {}; TEAMS.forEach(t => { o[t.id] = t.odds; }); return o; });
  const [loadingOdds, setLoadingOdds] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [adminInput, setAdminInput] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [searchTeam, setSearchTeam] = useState("");
  const [modalP, setModalP] = useState(null);
  const [aiPreview, setAiPreview] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [regName, setRegName] = useState("");
  const [regTeam, setRegTeam] = useState(null);
  const [regJerseyName, setRegJerseyName] = useState("");
  const [regJerseyNum, setRegJerseyNum] = useState("");
  const [regJerseyColor, setRegJerseyColor] = useState("home");
  const [regJerseySize, setRegJerseySize] = useState("L");
  const [regPhoto, setRegPhoto] = useState(null);
  const [voteChangeTarget, setVoteChangeTarget] = useState(null);
  const [voteChangeTeam, setVoteChangeTeam] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── NEW state ──
  const [regOpen, setRegOpen] = useState(() => localStorage.getItem("regOpen") !== "false");
  const [winnerTeamId, setWinnerTeamId] = useState(() => localStorage.getItem("winnerTeamId") || null);
  const [showWinnerPage, setShowWinnerPage] = useState(() => !!localStorage.getItem("winnerTeamId"));
  const [rtConnected, setRtConnected] = useState(false);
  const prevParticipantIds = useRef(new Set());

  const fileRef = useRef();

  // ── Request notification permission ──
  useEffect(() => { requestNotifPermission(); }, []);

  // ── Initial load ──
  const loadParticipants = useCallback(async () => {
    try {
      const data = await sb.select();
      if (Array.isArray(data)) {
        setParticipants(data);
        prevParticipantIds.current = new Set(data.map(p => p.id));
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadParticipants(); }, [loadParticipants]);

  // ── NEW: Supabase Realtime (replaces polling) ──
  useSupabaseRealtime((event) => {
    if (event.type === "INSERT" && event.record) {
      setParticipants(prev => {
        if (prev.find(p => p.id === event.record.id)) return prev;
        sendNotif("مشارك جديد! 🎉", `${event.record.name} اختار ${event.record.team_flag} ${event.record.team_name}`);
        return [...prev, event.record];
      });
      setRtConnected(true);
    } else if (event.type === "UPDATE" && event.record) {
      setParticipants(prev => prev.map(p => p.id === event.record.id ? event.record : p));
      setRtConnected(true);
    } else if (event.type === "DELETE" && event.old_record) {
      setParticipants(prev => prev.filter(p => p.id !== event.old_record.id));
    }
  });

  const showToast = (msg, dur = 3200) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), dur);
  };

  const teamCount = (tid) => participants.filter(p => p.team_id === tid).length;

  // ── Register ──
  const isRegClosed = !regOpen || REGISTRATION_DEADLINE <= new Date();

  const handleRegister = async () => {
    if (submitting) return;
    if (isRegClosed) return showToast("🔒 التسجيل مغلق حالياً");
    if (!regName.trim()) return showToast("⚠️ اكتب اسمك");
    if (!regTeam) return showToast("⚠️ اختر منتخبك");
    if (!regJerseyName.trim()) return showToast("⚠️ أدخل الاسم للطباعة على التيشرت");
    if (!regJerseyNum.trim()) return showToast("⚠️ أدخل الرقم للطباعة على التيشرت");
    const duplicate = participants.find(p => p.name.trim().toLowerCase() === regName.trim().toLowerCase());
    if (duplicate) return showToast("⚠️ هذا الاسم مسجل مسبقاً");
    if (teamCount(regTeam) >= MAX_PER_TEAM) return showToast(`⚠️ هذا المنتخب وصل الحد الأقصى (${MAX_PER_TEAM} أشخاص)`);
    setSubmitting(true);
    const team = TEAMS.find(t => t.id === regTeam);
    const row = { name: regName.trim(), team_id: regTeam, team_name: team.name, team_flag: team.flag, jersey: { name: regJerseyName.trim(), number: regJerseyNum.trim(), color: regJerseyColor, size: regJerseySize }, photo: regPhoto, vote_changed: false, can_change_vote: true };
    try {
      const latest = await sb.select();
      if (Array.isArray(latest)) {
        const serverDup = latest.find(p => p.name.trim().toLowerCase() === regName.trim().toLowerCase());
        if (serverDup) { setSubmitting(false); return showToast("⚠️ هذا الاسم مسجل مسبقاً"); }
        setParticipants(latest);
      }
      const res = await sb.insert(row);
      if (Array.isArray(res) && res[0]) {
        setParticipants(prev => [...prev, res[0]]);
        showToast(`🎉 تم تسجيل ${regName.trim()} — ${team.flag} ${team.name}`);
        setRegName(""); setRegTeam(null); setRegStep(1);
        setRegJerseyName(""); setRegJerseyNum(""); setRegJerseyColor("home"); setRegJerseySize("L"); setRegPhoto(null);
        setTimeout(() => setTab("leaderboard"), 1200);
      } else {
        showToast("❌ فشل التسجيل — حاول مجدداً");
      }
    } catch { showToast("❌ خطأ في الاتصال"); }
    finally { setSubmitting(false); }
  };

  const handleUpdateOdds = useCallback(async () => {
    setLoadingOdds(true);
    const fresh = await fetchLiveOdds();
    setLoadingOdds(false);
    if (fresh) {
      setOdds(prev => ({ ...prev, ...fresh }));
      setLastUpdate(new Date().toLocaleTimeString("ar-SA"));
      showToast("✅ تم تحديث الاحتمالات");
    } else { showToast("⚠️ تعذّر التحديث — آخر بيانات محفوظة"); }
  }, []);

  const openModal = async (p) => {
    setModalP(p); setAiPreview(""); setAiLoading(true);
    const colorLbl = JERSEY_KIT_TYPES.find(c => c.id === p.jersey?.color)?.label || p.jersey?.color;
    const text = await generateJerseyPreview(p.jersey?.name, p.jersey?.number, p.team_name, p.team_flag, colorLbl, p.jersey?.size);
    setAiPreview(text || ""); setAiLoading(false);
  };

  const handleVoteChange = async () => {
    if (!voteChangeTeam) return showToast("⚠️ اختر المنتخب الجديد");
    if (teamCount(voteChangeTeam) >= MAX_PER_TEAM) return showToast(`⚠️ هذا المنتخب وصل الحد الأقصى`);
    const team = TEAMS.find(t => t.id === voteChangeTeam);
    try {
      await sb.update(voteChangeTarget, { team_id: voteChangeTeam, team_name: team.name, team_flag: team.flag, vote_changed: true, can_change_vote: false });
      await loadParticipants();
      showToast(`✅ تم تغيير التصويت إلى ${team.flag} ${team.name}`);
      setVoteChangeTarget(null); setVoteChangeTeam(null);
    } catch { showToast("❌ فشل التغيير"); }
  };

  // ── NEW: Admin toggle reg ──
  const toggleReg = () => {
    const next = !regOpen;
    setRegOpen(next);
    localStorage.setItem("regOpen", next ? "true" : "false");
    showToast(next ? "✅ التسجيل مفتوح الآن" : "🔒 تم إغلاق التسجيل");
  };

  // ── NEW: Declare winner ──
  const declareWinner = (teamId) => {
    setWinnerTeamId(teamId);
    setShowWinnerPage(true);
    localStorage.setItem("winnerTeamId", teamId);
  };

  const leaderboard = [...participants].sort((a, b) => (odds[b.team_id] || 0) - (odds[a.team_id] || 0));
  const topProb = Math.max(...leaderboard.map(p => odds[p.team_id] || 0), 1);
  const filteredTeams = TEAMS.filter(t => t.name.includes(searchTeam) || t.en.toLowerCase().includes(searchTeam.toLowerCase()));
  const guideSorted = [...TEAMS].sort((a, b) => (odds[b.id] || b.odds) - (odds[a.id] || a.odds));
  const maxGuideP = odds[guideSorted[0]?.id] || guideSorted[0]?.odds || 1;
  const colorLabel = (id) => JERSEY_KIT_TYPES.find(c => c.id === id)?.label || id;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── NEW: Winner Page ── */}
      {showWinnerPage && winnerTeamId && (
        <WinnerPage
          winnerTeamId={winnerTeamId}
          participants={participants}
          odds={odds}
          onClose={() => { setShowWinnerPage(false); }}
        />
      )}

      <div className="pitch-bg">
        {/* Header */}
        <div className="hdr">
          <div className="hdr-trophy">🏆</div>
          <div className="hdr-title">WORLD CUP 2026</div>
          <div className="hdr-sub">مسابقة التوقع — اختر منتخبك والفائز يكسب التيشرت</div>
          <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
            <div className="hdr-live">
              <span className="live-dot"/>
              {rtConnected ? "Realtime • متصل مباشرة" : "جاري الاتصال..."}
            </div>
            {!regOpen && <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,60,60,.12)",border:"1px solid rgba(255,60,60,.4)",borderRadius:20,padding:"3px 12px",fontSize:"0.73rem",color:"#ff8888"}}>🔒 التسجيل مغلق</div>}
          </div>
        </div>

        {/* Nav */}
        <div className="nav">
          <button className={`nav-btn${tab==="terms"?" active":""}`} onClick={()=>setTab("terms")}>📜 الشروط</button>
          <button className={`nav-btn${tab==="register"?" active":""}`} onClick={()=>setTab("register")}>📝 سجّل</button>
          <button className={`nav-btn${tab==="leaderboard"?" active":""}`} onClick={()=>setTab("leaderboard")}>🏅 الترتيب</button>
          <button className={`nav-btn${tab==="stats"?" active":""}`} onClick={()=>setTab("stats")}>📊 إحصائيات</button>
          <button className={`nav-btn${tab==="guide"?" active":""}`} onClick={()=>setTab("guide")}>🌍 الدليل</button>           <button className={`nav-btn${tab==="bracket"?" active":""}`} onClick={()=>setTab("bracket")}>🗺️ الخريطة</button>
          <button className={`nav-btn${tab==="admin"?" active":""}`} onClick={()=>setTab("admin")}>⚙️</button>
        </div>

        <div className="main">

          {/* ══ TERMS ══ */}
          {tab === "terms" && (
            <div className="card">
              <div className="card-title">📜 الشروط والأحكام</div>
              <div className="card-sub">اقرأ الشروط كاملاً قبل التسجيل</div>
              <div className="terms-wrap">
                {TERMS.map((sec, si) => (
                  <div key={si} className="terms-section">
                    <div className="terms-section-title"><span style={{fontSize:"1.1rem"}}>{sec.icon}</span>{sec.title}</div>
                    {sec.items.map((item, ii) => (
                      <div key={ii} className="terms-item">
                        <span className="terms-item-icon">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className={`terms-accept-row${termsAccepted?" checked":""}`} onClick={()=>setTermsAccepted(v=>!v)}>
                <div className="cb">{termsAccepted&&<span style={{color:"#000",fontWeight:900,fontSize:"0.8rem"}}>✓</span>}</div>
                <span>أقرّ بأنني قرأت الشروط والأحكام كاملةً وأوافق عليها، وأتعهد بالالتزام بها طوال فترة المسابقة.</span>
              </div>
              <button className="btn" disabled={!termsAccepted} onClick={()=>setTab("register")}>موافق — انتقل للتسجيل ←</button>
            </div>
          )}

          {/* ══ REGISTER ══ */}
          {tab === "register" && (
            <div className="card">
              <div className="card-title">سجّل مشاركتك 🎯</div>
              {isRegClosed && (
                <div className="reg-closed-banner">
                  🔒 التسجيل مغلق حالياً — {regOpen ? "انتهى وقت التسجيل" : "أُوقف التسجيل من الإدارة"}
                </div>
              )}
              {!isRegClosed && (
                <>
                  <div className="steps">
                    {["المعلومات","المنتخب","التيشرت"].map((s,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                        {i>0&&<div className="step-line"/>}
                        <div className={`step${regStep===i+1?" active":regStep>i+1?" done":""}`}>
                          <div className="step-num">{regStep>i+1?"✓":i+1}</div>
                          <span style={{fontSize:"0.72rem",color:regStep===i+1?"var(--gold)":"var(--muted)"}}>{s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <CountdownBanner />
                  <div className="prize-box">
                    <b>👕 الجائزة: تيشرت المنتخب الفائز أصلي</b>
                    تُوزَّع التكلفة على المشاركين الخاسرين بالتساوي
                  </div>

                  {regStep === 1 && (
                    <>
                      <div className="lbl">اسمك الكامل</div>
                      <input className="inp" placeholder="اكتب اسمك هنا..." value={regName}
                        onChange={e=>setRegName(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&regName.trim()&&setRegStep(2)} />
                      <button className="btn" disabled={!regName.trim()} onClick={()=>setRegStep(2)}>التالي ←</button>
                      {!termsAccepted&&<div style={{textAlign:"center",marginTop:10,fontSize:"0.75rem",color:"#ffaa44"}}>⚠️ لم توافق على الشروط بعد — <span style={{color:"var(--gold)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>setTab("terms")}>اقرأها هنا</span></div>}
                    </>
                  )}

                  {regStep === 2 && (
                    <>
                      <input className="inp" placeholder="🔍 ابحث عن منتخب..." value={searchTeam}
                        onChange={e=>setSearchTeam(e.target.value)}
                        style={{marginBottom:10,fontSize:"0.86rem",padding:"9px 13px"}} />
                      {regTeam&&<div style={{textAlign:"center",marginBottom:10,fontSize:"0.86rem",color:"var(--gold)"}}>✓ اخترت: {TEAMS.find(t=>t.id===regTeam)?.flag} {TEAMS.find(t=>t.id===regTeam)?.name}</div>}
                      <div className="team-grid">
                        {filteredTeams.map(team=>{
                          const p=odds[team.id]||team.odds, cnt=teamCount(team.id), full=cnt>=MAX_PER_TEAM;
                          return (
                            <div key={team.id} className={`t-tile ${tierClass(p)}${regTeam===team.id?" sel-t":""}${full?" full":""}`}
                              onClick={()=>!full&&setRegTeam(team.id)}>
                              <span className="t-flag">{team.flag}</span>
                              <div className="t-name">{team.name}</div>
                              <div className="t-odds">~{p}%</div>
                              <div className="t-count">{full?"🔒 ممتلئ":`${cnt}/${MAX_PER_TEAM}`}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>setRegStep(1)}>→ رجوع</button>
                        <button className="btn btn-sm" style={{flex:2}} disabled={!regTeam} onClick={()=>setRegStep(3)}>التالي ←</button>
                      </div>
                    </>
                  )}

                  {regStep === 3 && (
                    <>
                      <div style={{textAlign:"center",marginBottom:14,padding:"10px",background:"rgba(212,175,55,.08)",borderRadius:10,fontSize:"0.84rem",color:"var(--gold-light)"}}>
                        {TEAMS.find(t=>t.id===regTeam)?.flag} {TEAMS.find(t=>t.id===regTeam)?.name} — هذه البيانات ستُطبَع على تيشرتك عند الفوز
                      </div>
                      <div className="lbl">الاسم المطبوع على التيشرت</div>
                      <input className="inp" placeholder="مثال: Mohammed" value={regJerseyName} onChange={e=>setRegJerseyName(e.target.value)} />
                      <div className="lbl">الرقم المطبوع على التيشرت</div>
                      <input className="inp" placeholder="مثال: 10" value={regJerseyNum}
                        onChange={e=>setRegJerseyNum(e.target.value.replace(/[^0-9]/g,"").slice(0,2))} />
                      <div className="lbl" style={{marginBottom:10}}>اختر طقمك 👕</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
                        {JERSEY_KIT_TYPES.map(kit => (
                          <div key={kit.id} onClick={()=>setRegJerseyColor(kit.id)}
                            style={{border:regJerseyColor===kit.id?"2px solid var(--gold)":"2px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"12px 6px 8px",background:regJerseyColor===kit.id?"rgba(212,175,55,0.12)":"rgba(255,255,255,0.04)",cursor:"pointer",textAlign:"center",boxShadow:regJerseyColor===kit.id?"0 0 16px rgba(212,175,55,0.3)":"none",transition:"all 0.18s",position:"relative"}}>
                            {regJerseyColor===kit.id&&<div style={{position:"absolute",top:6,left:8,fontSize:"0.65rem",color:"var(--gold)",fontWeight:900}}>✓</div>}
                            <JerseyCard teamId={regTeam} kitType={kit.id} teamName={TEAMS.find(t=>t.id===regTeam)?.name} teamEn={TEAMS.find(t=>t.id===regTeam)?.en} size={90} showName={regJerseyName} showNumber={regJerseyNum}/>
                            <div style={{fontSize:"0.72rem",fontWeight:700,color:regJerseyColor===kit.id?"var(--gold)":"var(--muted)",marginTop:4}}>{kit.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="lbl" style={{marginBottom:8}}>المقاس</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                        {JERSEY_SIZES.map(s=>(
                          <button key={s} onClick={()=>setRegJerseySize(s)}
                            style={{padding:"7px 14px",borderRadius:8,cursor:"pointer",fontFamily:"Cairo,sans-serif",fontSize:"0.82rem",fontWeight:700,border:regJerseySize===s?"2px solid var(--gold)":"1.5px solid rgba(255,255,255,0.15)",background:regJerseySize===s?"rgba(212,175,55,0.18)":"rgba(255,255,255,0.05)",color:regJerseySize===s?"var(--gold)":"var(--muted)",transition:"all 0.15s"}}>{s}</button>
                        ))}
                      </div>
                      <div className="lbl">صورتك الشخصية <span style={{color:"var(--muted)",fontWeight:400}}>(اختياري)</span></div>
                      <div style={{border:"1.5px dashed rgba(212,175,55,.3)",borderRadius:10,padding:"14px",textAlign:"center",marginBottom:14,cursor:"pointer",fontSize:"0.82rem",color:"var(--muted)"}} onClick={()=>fileRef.current?.click()}>
                        {regPhoto
                          ? <><img src={regPhoto} alt="" style={{width:60,height:60,borderRadius:"50%",objectFit:"cover",border:"2px solid var(--gold)"}}/><br/><span style={{color:"var(--gold)",fontSize:"0.75rem"}}>✓ تم رفع الصورة</span></>
                          : <><span style={{fontSize:"1.5rem"}}>📸</span><br/>اضغط لإضافة صورة<br/><span style={{fontSize:"0.72rem"}}>سنريك شكلك وأنت تلبس التيشرت</span></>
                        }
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
                        onChange={e=>{
                          const f=e.target.files?.[0]; if(!f) return;
                          const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d'); const img=new Image();
                          const url=URL.createObjectURL(f);
                          img.onload=()=>{ const MAX=800; let w=img.width,h=img.height; if(w>h){if(w>MAX){h=h*MAX/w;w=MAX;}}else{if(h>MAX){w=w*MAX/h;h=MAX;}} canvas.width=w; canvas.height=h; ctx.drawImage(img,0,0,w,h); URL.revokeObjectURL(url); setRegPhoto(canvas.toDataURL('image/jpeg',0.85)); };
                          img.onerror=()=>{ const r=new FileReader(); r.onload=ev=>setRegPhoto(ev.target.result); r.readAsDataURL(f); };
                          img.src=url;
                        }} />
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>setRegStep(2)}>→ رجوع</button>
                        <button className="btn btn-sm" style={{flex:2}} disabled={!regJerseyName.trim()||!regJerseyNum.trim()||submitting} onClick={handleRegister}>
                          {submitting ? <span><span className="spin">⟳</span> جاري التسجيل...</span> : "تأكيد التسجيل ✓"}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ LEADERBOARD ══ */}
          {tab === "leaderboard" && (
            <>
              <div className="upd-bar">
                <div className="upd-time">
                  {lastUpdate?`آخر تحديث: ${lastUpdate}`:"BetMGM / DraftKings"}
                  <span style={{marginRight:8,color:"#4cff88",fontSize:"0.7rem"}}>● {participants.length} مشارك</span>
                </div>
                <button className="upd-btn" onClick={handleUpdateOdds} disabled={loadingOdds}>
                  {loadingOdds?<span className="spin">⟳</span>:"⟳"} تحديث
                </button>
              </div>
              <CountdownBanner />

              {voteChangeTarget&&(
                <div className="card" style={{marginBottom:14}}>
                  <div className="card-title" style={{fontSize:"1rem",marginBottom:10}}>🔄 تغيير التصويت</div>
                  <div style={{background:"rgba(68,221,255,.07)",border:"1px solid rgba(68,221,255,.25)",borderRadius:10,padding:"10px 12px",marginBottom:12,fontSize:"0.8rem",color:"#a0e8ff"}}>متاح مرة واحدة فقط بعد انتهاء دور المجموعات</div>
                  <input className="inp" placeholder="🔍 ابحث..." value={searchTeam} onChange={e=>setSearchTeam(e.target.value)} style={{marginBottom:10,fontSize:"0.84rem",padding:"9px 13px"}} />
                  <div className="team-grid" style={{maxHeight:200}}>
                    {filteredTeams.map(team=>{
                      const p=odds[team.id]||team.odds, cnt=teamCount(team.id), full=cnt>=MAX_PER_TEAM;
                      return <div key={team.id} className={`t-tile ${tierClass(p)}${voteChangeTeam===team.id?" sel-t":""}${full?" full":""}`} onClick={()=>!full&&setVoteChangeTeam(team.id)}><span className="t-flag">{team.flag}</span><div className="t-name">{team.name}</div><div className="t-odds">~{p}%</div></div>;
                    })}
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>{setVoteChangeTarget(null);setVoteChangeTeam(null);}}>إلغاء</button>
                    <button className="btn btn-sm" style={{flex:2}} disabled={!voteChangeTeam} onClick={handleVoteChange}>تأكيد التغيير</button>
                  </div>
                </div>
              )}

              {loading
                ? <div className="loading-overlay"><span className="spin-big">⟳</span>جاري تحميل المشاركين...</div>
                : leaderboard.length === 0
                  ? <div className="empty"><div className="ei">🎯</div><p>لا يوجد مشاركون بعد<br/>ادعُ أصدقاءك يسجلوا!</p></div>
                  : leaderboard.map((p,i)=>{
                    const prob=odds[p.team_id]||0;
                    const rc=i===0?"r1":i===1?"r2":i===2?"r3":"rn";
                    const ri=i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`;
                    return (
                      <div key={p.id} className={`p-card ${rc}`} onClick={()=>openModal(p)}>
                        <div className="r-badge">{ri}</div>
                        {p.photo ? <img src={p.photo} style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",border:"2px solid var(--gold)",flexShrink:0}} alt=""/> : <div className="p-flag">{p.team_flag}</div>}
                        <div className="p-info">
                          <div className="p-name">{p.name}</div>
                          <div className="p-team">{p.team_flag} {p.team_name} • {p.jersey?.size}</div>
                          {p.vote_changed&&<div className="p-changed">🔄 غيّر تصويته</div>}
                        </div>
                        <div className="p-prob">
                          <div className="p-val" style={{color:probColor(prob)}}>{prob}%</div>
                          <div className="p-lbl">احتمال الفوز</div>
                        </div>
                        {p.can_change_vote&&!p.vote_changed&&(
                          <button className="btn btn-sm btn-outline" style={{fontSize:"0.68rem",padding:"5px 8px",width:"auto",minWidth:0}}
                            onClick={e=>{e.stopPropagation();setVoteChangeTarget(p.id);setVoteChangeTeam(null);}}>🔄</button>
                        )}
                        <div className="p-bar-wrap"><div className="p-bar" style={{width:`${Math.round((prob/topProb)*100)}%`,background:barGrad(prob)}}/></div>
                      </div>
                    );
                  })
              }
              {!loading&&leaderboard.length>0&&<div style={{textAlign:"center",marginTop:14,fontSize:"0.73rem",color:"var(--muted)"}}>{leaderboard.length} مشارك • اضغط على أي بطاقة لرؤية بيانات التيشرت</div>}
            </>
          )}

          {/* ══ STATS ══ */}
          {tab === "bracket" && <BracketTab participants={participants} adminUnlocked={adminUnlocked} />}            {tab === "stats" && <StatsTab participants={participants} odds={odds} />}

          {/* ══ GUIDE ══ */}
          {tab === "guide" && (
            <>
              <div className="card" style={{marginBottom:14}}>
                <div className="card-title">🌍 دليل المنتخبات</div>
                <div className="card-sub">من الأقوى للأضعف — احتمالات أسواق الرهان العالمية</div>
                <div className="g-grid">
                  {guideSorted.map((team,i)=>{
                    const p=odds[team.id]||team.odds;
                    return (
                      <div key={team.id} className="g-card">
                        <div className="g-flag">{team.flag}</div>
                        <div className="g-name">{team.name}</div>
                        <div className="g-bar-wrap"><div className="g-bar-fill" style={{width:`${Math.round((p/maxGuideP)*100)}%`,background:barGrad(p)}}/></div>
                        <div className="g-pct">~{p}%</div>
                        <div className="g-rank">#{i+1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="card" style={{fontSize:"0.8rem",lineHeight:1.75,color:"rgba(244,244,240,.8)"}}>
                <div style={{color:"var(--gold)",fontWeight:700,marginBottom:8}}>📌 كيف تقرأ الاحتمالات؟</div>
                <div>• <span style={{color:"#4cff88"}}>12%+</span> — الأوفر حظاً بقوة</div>
                <div>• <span style={{color:"#44ddff"}}>6–12%</span> — مرشح جدي</div>
                <div>• <span style={{color:"#ffcc44"}}>2–6%</span> — منتخب قوي وله فرصة</div>
                <div>• <span style={{color:"#ff8866"}}>أقل من 2%</span> — مفاجأة محتملة!</div>
                <div style={{marginTop:8,color:"var(--muted)",fontSize:"0.76rem"}}>تتغير الاحتمالات بعد كل جولة — اضغط "تحديث" في صفحة الترتيب.</div>
              </div>
            </>
          )}

          {/* ══ ADMIN ══ */}
          {tab === "admin" && (
            <>
              {!adminUnlocked ? (
                <div className="card">
                  <div className="card-title" style={{marginBottom:16}}>🔒 لوحة الإدارة</div>
                  <div className="lbl">كلمة المرور</div>
                  <input className="inp" type="password" placeholder="أدخل كلمة المرور..." value={adminInput}
                    onChange={e=>setAdminInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"){if(adminInput==="admin2026"){setAdminUnlocked(true);showToast("🔓 تم الدخول");setAdminInput("");}else showToast("❌ كلمة المرور خاطئة");}}} />
                  <button className="btn" onClick={()=>{
                    if(adminInput==="admin2026"){setAdminUnlocked(true);showToast("🔓 تم فتح الإدارة");setAdminInput("");}
                    else showToast("❌ كلمة المرور خاطئة");
                  }}>دخول</button>
                </div>
              ) : (
                <>
                  <div className="card">
                    <div className="card-title" style={{fontSize:"0.95rem",marginBottom:12}}>👥 المشاركون ({participants.length})</div>
                    {participants.length===0
                      ? <div style={{color:"var(--muted)",fontSize:"0.82rem"}}>لا يوجد مشاركون</div>
                      : participants.map(p=>(
                        <div key={p.id} className="a-row">
                          <span>{p.team_flag}</span>
                          <span style={{flex:1}}>{p.name}</span>
                          <span style={{color:"var(--muted)"}}>{p.jersey?.size}</span>
                          <span style={{color:"var(--gold)",minWidth:42,textAlign:"center"}}>{odds[p.team_id]||0}%</span>
                          <button style={{background:"none",border:"none",color:"#4cff88",cursor:"pointer",fontSize:"0.76rem",fontFamily:"Cairo,sans-serif",padding:"2px 5px"}}
                            onClick={async()=>{await sb.update(p.id,{can_change_vote:true,vote_changed:false});await loadParticipants();showToast("✅ تم تفعيل تغيير التصويت");}}>🔓</button>
                          <button className="btn btn-danger btn-sm"
                            onClick={async()=>{await sb.delete(p.id);setParticipants(prev=>prev.filter(x=>x.id!==p.id));}}>حذف</button>
                        </div>
                      ))
                    }
                  </div>

                  <div className="card">
                    <div className="card-title" style={{fontSize:"0.95rem",marginBottom:12}}>⚙️ إجراءات</div>

                    {/* Toggle registration */}
                    <button className={`btn ${regOpen?"btn-danger":"btn-green"}`} style={{marginBottom:8}} onClick={toggleReg}>
                      {regOpen ? "🔒 إغلاق التسجيل يدوياً" : "🔓 فتح التسجيل"}
                    </button>

                    {/* Update odds */}
                    <button className="btn" style={{marginBottom:8}} onClick={handleUpdateOdds} disabled={loadingOdds}>
                      {loadingOdds?"⟳ جاري التحديث...":"⟳ تحديث الاحتمالات الآن"}
                    </button>

                    {/* Refresh list */}
                    <button className="btn btn-green" style={{marginBottom:8}} onClick={loadParticipants}>🔄 تحديث القائمة</button>

                    {/* NEW: CSV Export */}
                    <button className="btn btn-outline" style={{marginBottom:8}} onClick={()=>{exportCSV(participants);showToast("✅ تم تصدير ملف CSV");}}>
                      📥 تصدير Excel / CSV
                    </button>

                    {/* NEW: Declare winner */}
                    <div style={{marginTop:8,marginBottom:8}}>
                      <div className="lbl">🏆 الإعلان عن الفائز</div>
                      <select className="sel" style={{marginBottom:8}} onChange={e => {
                        if (e.target.value) {
                          if (window.confirm(`تأكيد: إعلان ${TEAMS.find(t=>t.id===e.target.value)?.name} فائزاً بكأس العالم؟`)) {
                            declareWinner(e.target.value);
                            showToast("🏆 تم الإعلان عن الفائز!");
                          }
                          e.target.value = "";
                        }
                      }}>
                        <option value="">اختر المنتخب الفائز...</option>
                        {TEAMS.map(t => <option key={t.id} value={t.id}>{t.flag} {t.name}</option>)}
                      </select>
                      {winnerTeamId && (
                        <div style={{display:"flex",gap:8,alignItems:"center",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:10,padding:"8px 12px",marginBottom:8}}>
                          <span>{TEAMS.find(t=>t.id===winnerTeamId)?.flag}</span>
                          <span style={{flex:1,fontSize:"0.84rem",color:"var(--gold)"}}>{TEAMS.find(t=>t.id===winnerTeamId)?.name} — الفائز المُعلَن</span>
                          <button className="btn btn-sm btn-outline" onClick={()=>setShowWinnerPage(true)}>عرض</button>
                          <button className="btn btn-sm btn-danger" onClick={()=>{setWinnerTeamId(null);setShowWinnerPage(false);localStorage.removeItem("winnerTeamId");}}>إلغاء</button>
                        </div>
                      )}
                    </div>

                    {/* Delete all */}
                    <button className="btn btn-danger" onClick={async()=>{
                      if(window.confirm("⚠️ حذف جميع المشاركين؟ لا يمكن التراجع.")){
                        await sb.deleteAll(); setParticipants([]); showToast("تم حذف جميع المشاركين");
                      }
                    }}>🗑️ إعادة تعيين المسابقة</button>
                  </div>

                  <div style={{textAlign:"center",marginTop:8}}>
                    <button style={{background:"none",border:"none",color:"var(--muted)",fontSize:"0.76rem",cursor:"pointer",fontFamily:"Cairo,sans-serif"}} onClick={()=>setAdminUnlocked(false)}>تسجيل خروج</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Toast */}
        <div className={`toast${toast.show?" show":""}`}>{toast.msg}</div>

        {/* ══ JERSEY MODAL ══ */}
        {modalP&&(
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModalP(null)}>
            <div className="modal">
              <button className="modal-close" onClick={()=>setModalP(null)}>✕</button>
              <div style={{textAlign:"center",marginBottom:8}}>
                <div style={{fontSize:"2rem"}}>{modalP.team_flag}</div>
                <div style={{fontSize:"1.1rem",fontWeight:900,color:"var(--gold)"}}>{modalP.name}</div>
                <div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{modalP.team_name}</div>
              </div>
              <div className="jersey-preview">
                {modalP.photo && <img src={modalP.photo} style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:"3px solid var(--gold)"}} alt=""/>}
                <div style={{display:"flex",justifyContent:"center",marginTop:modalP.photo?10:0}}>
                  <JerseyCard teamId={modalP.team_id} kitType={modalP.jersey?.color||"home"} teamName={modalP.team_name} teamEn={TEAMS.find(t=>t.id===modalP.team_id)?.en||modalP.team_name} size={130} showName={modalP.jersey?.name} showNumber={modalP.jersey?.number}/>
                </div>
                <div style={{marginTop:4,fontSize:"1.05rem",fontWeight:900}}>
                  {modalP.jersey?.name} <span style={{color:"var(--gold)"}}>#{modalP.jersey?.number}</span>
                </div>
                <div className="jersey-tag">{colorLabel(modalP.jersey?.color)} • {modalP.jersey?.size}</div>
              </div>
              <div style={{fontSize:"0.75rem",color:"var(--muted)",marginBottom:6,fontWeight:700}}>🤖 تخيّل الشكل عند الفوز:</div>
              {aiLoading
                ? <div className="ai-loading"><span className="spin">⟳</span> جاري التوليد...</div>
                : aiPreview
                  ? <div className="ai-preview">{aiPreview}</div>
                  : <div style={{color:"var(--muted)",fontSize:"0.78rem",textAlign:"center"}}>—</div>
              }
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:"1.4rem",fontWeight:900,color:probColor(odds[modalP.team_id]||0)}}>{odds[modalP.team_id]||0}%</div>
                  <div style={{fontSize:"0.68rem",color:"var(--muted)"}}>احتمال الفوز</div>
                </div>
                <div style={{background:"rgba(0,0,0,.3)",borderRadius:10,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:"1.4rem",fontWeight:900,color:"var(--gold)"}}>{teamCount(modalP.team_id)}/{MAX_PER_TEAM}</div>
                  <div style={{fontSize:"0.68rem",color:"var(--muted)"}}>مشتركون بهذا المنتخب</div>
                </div>
              </div>

              {/* NEW: Share on WhatsApp */}
              <button className="btn btn-whatsapp" style={{marginTop:12}} onClick={()=>shareWhatsApp(modalP, odds[modalP.team_id]||0)}>
                📤 شارك بطاقتك على واتساب
              </button>

              <button className="btn btn-outline" style={{marginTop:8}} onClick={()=>setModalP(null)}>إغلاق</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
