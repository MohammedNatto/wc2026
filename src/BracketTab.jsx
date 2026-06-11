// ══════════════════════════════════════════════════════
//  BracketTab — خريطة الطريق لكأس العالم 2026
//  يُضاف كـ tab في App.jsx
//  بيانات المجموعات الرسمية (draw ديسمبر 2025)
// ══════════════════════════════════════════════════════
import { useState, useMemo, useEffect } from "react";

// ── جلب النتائج من الإنترنت عبر Claude ───────────────
async function fetchLiveMatchResults() {
  const teamIds = [
    "mexico","southafrica","southkorea","czech",
    "canada","bosnia","qatar","switzerland",
    "brazil","morocco","haiti","scotland",
    "usa","paraguay","australia","turkey",
    "germany","curacao","ivorycoast","ecuador",
    "netherlands","japan","sweden","tunisia",
    "belgium","egypt","iran","newzealand",
    "spain","capeverde","saudiarabia","uruguay",
    "france","senegal","iraq","norway",
    "argentina","algeria","austria","jordan",
    "portugal","drcongo","uzbekistan","colombia",
    "england","croatia","ghana","panama"
  ];

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Search for ALL FIFA World Cup 2026 group stage match results that have been played so far. Today is ${new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}.

Return ONLY a valid JSON object. Key format: "GROUP_homeId_awayId" where GROUP is A-L and IDs from this list: ${teamIds.join(',')}.

Example format:
{
  "A_mexico_southafrica": {"homeScore": 2, "awayScore": 0, "played": true},
  "C_brazil_morocco": {"homeScore": 1, "awayScore": 1, "played": true}
}

Only include matches already played. Return ONLY the JSON object, nothing else.`
        }]
      })
    });
    const d = await r.json();
    const tb = d.content?.find(b => b.type === "text");
    if (!tb) return null;
    const m = tb.text.replace(/```json|```/g, "").trim().match(/\{[\s\S]*\}/);
    if (!m) return null;
    const results = JSON.parse(m[0]);
    // تحقق من صحة البيانات
    const valid = {};
    for (const [k, v] of Object.entries(results)) {
      if (v.played && typeof v.homeScore === 'number' && typeof v.awayScore === 'number') {
        valid[k] = v;
      }
    }
    return valid;
  } catch { return null; }
}

// ── بيانات المجموعات الرسمية ──────────────────────────
const GROUPS_DATA = {
  A: { teams: [
    { id:"mexico",      name:"المكسيك",         flag:"🇲🇽", host:true  },
    { id:"southafrica", name:"جنوب إفريقيا",     flag:"🇿🇦" },
    { id:"southkorea",  name:"كوريا الجنوبية",   flag:"🇰🇷" },
    { id:"czech",       name:"التشيك",           flag:"🇨🇿" },
  ]},
  B: { teams: [
    { id:"canada",      name:"كندا",             flag:"🇨🇦", host:true  },
    { id:"bosnia",      name:"البوسنة والهرسك",  flag:"🇧🇦" },
    { id:"qatar",       name:"قطر",              flag:"🇶🇦" },
    { id:"switzerland", name:"سويسرا",           flag:"🇨🇭" },
  ]},
  C: { teams: [
    { id:"brazil",      name:"البرازيل",         flag:"🇧🇷" },
    { id:"morocco",     name:"المغرب",           flag:"🇲🇦" },
    { id:"haiti",       name:"هايتي",            flag:"🇭🇹" },
    { id:"scotland",    name:"اسكتلندا",         flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  ]},
  D: { teams: [
    { id:"usa",         name:"الولايات المتحدة", flag:"🇺🇸", host:true  },
    { id:"paraguay",    name:"باراغواي",         flag:"🇵🇾" },
    { id:"australia",   name:"أستراليا",         flag:"🇦🇺" },
    { id:"turkey",      name:"تركيا",            flag:"🇹🇷" },
  ]},
  E: { teams: [
    { id:"germany",     name:"ألمانيا",          flag:"🇩🇪" },
    { id:"curacao",     name:"كوراساو",          flag:"🇨🇼" },
    { id:"ivorycoast",  name:"ساحل العاج",       flag:"🇨🇮" },
    { id:"ecuador",     name:"الإكوادور",        flag:"🇪🇨" },
  ]},
  F: { teams: [
    { id:"netherlands", name:"هولندا",           flag:"🇳🇱" },
    { id:"japan",       name:"اليابان",          flag:"🇯🇵" },
    { id:"sweden",      name:"السويد",           flag:"🇸🇪" },
    { id:"tunisia",     name:"تونس",             flag:"🇹🇳" },
  ]},
  G: { teams: [
    { id:"belgium",     name:"بلجيكا",           flag:"🇧🇪" },
    { id:"egypt",       name:"مصر",              flag:"🇪🇬" },
    { id:"iran",        name:"إيران",            flag:"🇮🇷" },
    { id:"newzealand",  name:"نيوزيلندا",        flag:"🇳🇿" },
  ]},
  H: { teams: [
    { id:"spain",       name:"إسبانيا",          flag:"🇪🇸" },
    { id:"capeverde",   name:"الرأس الأخضر",     flag:"🇨🇻" },
    { id:"saudiarabia", name:"السعودية",         flag:"🇸🇦" },
    { id:"uruguay",     name:"أوروغواي",         flag:"🇺🇾" },
  ]},
  I: { teams: [
    { id:"france",      name:"فرنسا",            flag:"🇫🇷" },
    { id:"senegal",     name:"السنغال",          flag:"🇸🇳" },
    { id:"iraq",        name:"العراق",           flag:"🇮🇶" },
    { id:"norway",      name:"النرويج",          flag:"🇳🇴" },
  ]},
  J: { teams: [
    { id:"argentina",   name:"الأرجنتين",        flag:"🇦🇷" },
    { id:"algeria",     name:"الجزائر",          flag:"🇩🇿" },
    { id:"austria",     name:"النمسا",           flag:"🇦🇹" },
    { id:"jordan",      name:"الأردن",           flag:"🇯🇴" },
  ]},
  K: { teams: [
    { id:"portugal",    name:"البرتغال",         flag:"🇵🇹" },
    { id:"drcongo",     name:"ج. الكونغو",       flag:"🇨🇩" },
    { id:"uzbekistan",  name:"أوزبكستان",        flag:"🇺🇿" },
    { id:"colombia",    name:"كولومبيا",         flag:"🇨🇴" },
  ]},
  L: { teams: [
    { id:"england",     name:"إنجلترا",          flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { id:"croatia",     name:"كرواتيا",          flag:"🇭🇷" },
    { id:"ghana",       name:"غانا",             flag:"🇬🇭" },
    { id:"panama",      name:"بنما",             flag:"🇵🇦" },
  ]},
};

// ── جدول المباريات بتوقيت السعودية (UTC+3) ─────────────
const MATCH_SCHEDULE = {
  "A_mexico_southafrica":    { date:"الخميس 11 يونيو",  time:"10:00 م" },
  "A_southkorea_czech":      { date:"الجمعة 12 يونيو",  time:"05:00 ص" },
  "A_czech_southafrica":     { date:"الخميس 18 يونيو",  time:"07:00 م" },
  "A_mexico_southkorea":     { date:"الجمعة 19 يونيو",  time:"04:00 ص" },
  "A_czech_mexico":          { date:"الأربعاء 25 يونيو", time:"04:00 ص" },
  "A_southafrica_southkorea":{ date:"الأربعاء 25 يونيو", time:"04:00 ص" },
  "B_canada_bosnia":         { date:"الجمعة 12 يونيو",  time:"10:00 م" },
  "B_qatar_switzerland":     { date:"السبت 13 يونيو",   time:"10:00 م" },
  "B_switzerland_bosnia":    { date:"الخميس 18 يونيو",  time:"10:00 م" },
  "B_canada_qatar":          { date:"الجمعة 19 يونيو",  time:"01:00 ص" },
  "B_switzerland_canada":    { date:"الأربعاء 25 يونيو", time:"10:00 م" },
  "B_bosnia_qatar":          { date:"الأربعاء 25 يونيو", time:"10:00 م" },
  "C_brazil_morocco":        { date:"السبت 13 يونيو",   time:"01:00 ص" },
  "C_haiti_scotland":        { date:"السبت 13 يونيو",   time:"04:00 ص" },
  "C_scotland_morocco":      { date:"الجمعة 20 يونيو",  time:"01:00 ص" },
  "C_brazil_haiti":          { date:"الجمعة 20 يونيو",  time:"03:30 ص" },
  "C_scotland_brazil":       { date:"الأربعاء 25 يونيو", time:"01:00 ص" },
  "C_morocco_haiti":         { date:"الأربعاء 25 يونيو", time:"01:00 ص" },
  "D_usa_paraguay":          { date:"السبت 13 يونيو",   time:"04:00 ص" },
  "D_australia_turkey":      { date:"الأحد 14 يونيو",   time:"07:00 م" },
  "D_usa_australia":         { date:"الجمعة 20 يونيو",  time:"10:00 م" },
  "D_turkey_paraguay":       { date:"السبت 21 يونيو",   time:"06:00 ص" },
  "D_turkey_usa":            { date:"الخميس 26 يونيو",  time:"05:00 ص" },
  "D_paraguay_australia":    { date:"الخميس 26 يونيو",  time:"05:00 ص" },
  "E_germany_curacao":       { date:"الأحد 14 يونيو",   time:"08:00 م" },
  "E_ivorycoast_ecuador":    { date:"الاثنين 15 يونيو", time:"02:00 ص" },
  "E_germany_ivorycoast":    { date:"السبت 21 يونيو",   time:"11:00 م" },
  "E_ecuador_curacao":       { date:"الأحد 22 يونيو",   time:"03:00 ص" },
  "E_curacao_ivorycoast":    { date:"الخميس 26 يونيو",  time:"11:00 م" },
  "E_ecuador_germany":       { date:"الخميس 26 يونيو",  time:"11:00 م" },
  "F_netherlands_japan":     { date:"الأحد 14 يونيو",   time:"11:00 م" },
  "F_sweden_tunisia":        { date:"الاثنين 15 يونيو", time:"05:00 ص" },
  "F_netherlands_sweden":    { date:"السبت 21 يونيو",   time:"08:00 م" },
  "F_tunisia_japan":         { date:"الأحد 22 يونيو",   time:"07:00 ص" },
  "F_japan_sweden":          { date:"الجمعة 26 يونيو",  time:"02:00 ص" },
  "F_tunisia_netherlands":   { date:"الجمعة 26 يونيو",  time:"02:00 ص" },
  "G_belgium_egypt":         { date:"الاثنين 16 يونيو", time:"10:00 م" },
  "G_iran_newzealand":       { date:"الثلاثاء 17 يونيو",time:"04:00 ص" },
  "G_belgium_iran":          { date:"الاثنين 23 يونيو", time:"10:00 م" },
  "G_newzealand_egypt":      { date:"الثلاثاء 24 يونيو",time:"04:00 ص" },
  "G_egypt_iran":            { date:"الجمعة 27 يونيو",  time:"06:00 ص" },
  "G_newzealand_belgium":    { date:"الجمعة 27 يونيو",  time:"06:00 ص" },
  "H_spain_capeverde":       { date:"الاثنين 16 يونيو", time:"07:00 م" },
  "H_saudiarabia_uruguay":   { date:"الثلاثاء 17 يونيو",time:"01:00 ص" },
  "H_spain_saudiarabia":     { date:"الأحد 22 يونيو",   time:"07:00 م" },
  "H_uruguay_capeverde":     { date:"الاثنين 23 يونيو", time:"01:00 ص" },
  "H_capeverde_saudiarabia": { date:"الجمعة 27 يونيو",  time:"03:00 ص" },
  "H_uruguay_spain":         { date:"الجمعة 27 يونيو",  time:"03:00 ص" },
  "I_france_senegal":        { date:"الثلاثاء 17 يونيو",time:"10:00 م" },
  "I_iraq_norway":           { date:"الأربعاء 18 يونيو",time:"01:00 ص" },
  "I_france_iraq":           { date:"الاثنين 23 يونيو", time:"12:00 ص" },
  "I_norway_senegal":        { date:"الثلاثاء 24 يونيو",time:"03:00 ص" },
  "I_norway_france":         { date:"الجمعة 27 يونيو",  time:"10:00 م" },
  "I_senegal_iraq":          { date:"الجمعة 27 يونيو",  time:"10:00 م" },
  "J_argentina_algeria":     { date:"الأربعاء 18 يونيو",time:"04:00 ص" },
  "J_austria_jordan":        { date:"الأربعاء 18 يونيو",time:"07:00 ص" },
  "J_argentina_austria":     { date:"الاثنين 23 يونيو", time:"08:00 م" },
  "J_jordan_algeria":        { date:"الثلاثاء 24 يونيو",time:"06:00 ص" },
  "J_algeria_austria":       { date:"السبت 28 يونيو",   time:"05:00 ص" },
  "J_jordan_argentina":      { date:"السبت 28 يونيو",   time:"05:00 ص" },
  "K_portugal_drcongo":      { date:"الأربعاء 18 يونيو",time:"08:00 م" },
  "K_uzbekistan_colombia":   { date:"الخميس 19 يونيو",  time:"05:00 ص" },
  "K_portugal_uzbekistan":   { date:"الثلاثاء 24 يونيو",time:"08:00 م" },
  "K_colombia_drcongo":      { date:"الأربعاء 25 يونيو",time:"05:00 ص" },
  "K_colombia_portugal":     { date:"السبت 28 يونيو",   time:"02:30 ص" },
  "K_drcongo_uzbekistan":    { date:"السبت 28 يونيو",   time:"02:30 ص" },
  "L_england_croatia":       { date:"الأربعاء 18 يونيو",time:"11:00 م" },
  "L_ghana_panama":          { date:"الخميس 19 يونيو",  time:"02:00 ص" },
  "L_england_ghana":         { date:"الثلاثاء 24 يونيو",time:"11:00 م" },
  "L_panama_croatia":        { date:"الأربعاء 25 يونيو",time:"02:00 ص" },
  "L_panama_england":        { date:"السبت 28 يونيو",   time:"12:00 ص" },
  "L_croatia_ghana":         { date:"السبت 28 يونيو",   time:"12:00 ص" },
};

// توليد قائمة المباريات لكل مجموعة
function getGroupMatches(groupLetter) {
  const teams = GROUPS_DATA[groupLetter].teams;
  const matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({ home: teams[i], away: teams[j] });
    }
  }
  return matches;
}

// حساب الترتيب من نتائج المباريات
function calcStandings(teams, results) {
  const stats = {};
  teams.forEach(t => {
    stats[t.id] = { ...t, p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
  });
  results.forEach(r => {
    if (r.played) {
      const h = stats[r.homeId], a = stats[r.awayId];
      h.p++; a.p++;
      h.gf += r.homeScore; h.ga += r.awayScore;
      a.gf += r.awayScore; a.ga += r.homeScore;
      if (r.homeScore > r.awayScore) { h.w++; h.pts += 3; a.l++; }
      else if (r.homeScore < r.awayScore) { a.w++; a.pts += 3; h.l++; }
      else { h.d++; a.d++; h.pts++; a.pts++; }
    }
  });
  return Object.values(stats).sort((a,b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });
}

// ── الكومبوننت الرئيسي ────────────────────────────────
export default function BracketTab({ participants = [], adminUnlocked = false }) {
  const [subTab, setSubTab] = useState("groups");
  const [matchData, setMatchData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wc2026_matches") || "{}"); } catch { return {}; }
  });
  const [knockoutData, setKnockoutData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wc2026_knockout") || "{}"); } catch { return {}; }
  });
  const [editingMatch, setEditingMatch] = useState(null);
  const [editScore, setEditScore] = useState({ home: "", away: "" });
  const [editingKO, setEditingKO] = useState(null);
  const [fetchingResults, setFetchingResults] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("");

  // فرق المشاركين
  const compTeamIds = new Set(participants.map(p => p.team_id));

  // جلب النتائج التلقائي
  const handleFetchResults = async () => {
    setFetchingResults(true);
    setFetchStatus("🔍 يبحث عن النتائج...");
    const results = await fetchLiveMatchResults();
    setFetchingResults(false);
    if (results && Object.keys(results).length > 0) {
      const newData = { ...matchData, ...results };
      setMatchData(newData);
      localStorage.setItem("wc2026_matches", JSON.stringify(newData));
      setLastFetch(new Date().toLocaleTimeString("ar-SA"));
      setFetchStatus(`✅ تم تحديث ${Object.keys(results).length} مباراة`);
    } else {
      setFetchStatus("⚠️ لم تُعثر على نتائج جديدة");
    }
    setTimeout(() => setFetchStatus(""), 4000);
  };

  // ── تحديث تلقائي كل دقيقة ──
  useEffect(() => {
    const interval = setInterval(handleFetchResults, 60 * 1000);
    return () => clearInterval(interval);
  }, [matchData]);

  const saveMatch = () => {
    const h = parseInt(editScore.home), a = parseInt(editScore.away);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return;
    const key = editingMatch;
    const newData = { ...matchData, [key]: { homeScore: h, awayScore: a, played: true } };
    setMatchData(newData);
    localStorage.setItem("wc2026_matches", JSON.stringify(newData));
    setEditingMatch(null);
  };

  const clearMatch = (key) => {
    const newData = { ...matchData };
    delete newData[key];
    setMatchData(newData);
    localStorage.setItem("wc2026_matches", JSON.stringify(newData));
  };

  const saveKO = (key, winner) => {
    const newData = { ...knockoutData, [key]: winner };
    setKnockoutData(newData);
    localStorage.setItem("wc2026_knockout", JSON.stringify(newData));
    setEditingKO(null);
  };

  const clearKO = (key) => {
    const newData = { ...knockoutData };
    delete newData[key];
    setKnockoutData(newData);
    localStorage.setItem("wc2026_knockout", JSON.stringify(newData));
  };

  // أفضل الثالثين
  const allThirds = useMemo(() => {
    return Object.keys(GROUPS_DATA).map(g => {
      const gmatches = getGroupMatches(g).map((m,i) => {
        const key = `${g}_${m.home.id}_${m.away.id}`;
        const r = matchData[key];
        return r ? { homeId: m.home.id, awayId: m.away.id, ...r } : null;
      }).filter(Boolean);
      const s = calcStandings(GROUPS_DATA[g].teams, gmatches);
      return s[2] ? { ...s[2], group: g } : null;
    }).filter(Boolean).sort((a,b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      return (b.gf-b.ga) - (a.gf-a.ga);
    });
  }, [matchData]);

  const css = `
    .br-nav{display:flex;gap:8px;margin-bottom:16px;justify-content:center}
    .br-nav-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(212,175,55,0.3);color:#a0b8a8;border-radius:10px;padding:8px 18px;font-family:'Cairo',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;transition:all .2s}
    .br-nav-btn.active{background:linear-gradient(135deg,#d4af37,#b8962e);border-color:#d4af37;color:#000}
    .group-card{background:rgba(4,30,16,0.92);border:1px solid rgba(212,175,55,0.2);border-radius:14px;padding:14px;margin-bottom:12px}
    .group-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
    .group-lbl{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#d4af37;letter-spacing:2px}
    .group-table{width:100%;border-collapse:collapse;font-size:0.78rem}
    .group-table th{color:#a0b8a8;font-weight:700;text-align:center;padding:3px 4px;border-bottom:1px solid rgba(255,255,255,0.08)}
    .group-table td{padding:5px 4px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04)}
    .group-table tr.qualify-1 td:first-child{border-right:3px solid #4cff88}
    .group-table tr.qualify-2 td:first-child{border-right:3px solid #44ddff}
    .group-table tr.qualify-3 td:first-child{border-right:3px solid rgba(255,200,60,0.5)}
    .team-cell{display:flex;align-items:center;gap:6px;text-align:right;min-width:90px}
    .team-flag-sm{font-size:1rem}
    .team-name-sm{font-size:0.74rem;font-weight:700;white-space:nowrap}
    .comp-badge{font-size:0.55rem;background:rgba(212,175,55,0.2);border:1px solid rgba(212,175,55,0.4);border-radius:4px;padding:1px 4px;color:#d4af37;margin-right:3px}
    .match-list{margin-top:10px;border-top:1px solid rgba(255,255,255,0.06);padding-top:8px}
    .match-row{display:flex;align-items:center;gap:6px;padding:4px 0;font-size:0.74rem;cursor:pointer;border-radius:6px;padding:4px 6px;transition:background .15s}
    .match-row:hover{background:rgba(255,255,255,0.05)}
    .match-team{flex:1;font-weight:600}
    .match-team.home{text-align:right}
    .match-team.away{text-align:left}
    .match-score{min-width:44px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:0.95rem;color:#d4af37}
    .match-score.played{color:#4cff88}
    .match-score.tbd{color:#a0b8a8;font-size:0.7rem}
    .ko-section{margin-bottom:20px}
    .ko-title{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#d4af37;letter-spacing:2px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(212,175,55,0.2)}
    .ko-match{background:rgba(4,30,16,0.92);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 12px;margin-bottom:8px;display:flex;align-items:center;gap:8px;cursor:pointer;transition:all .18s}
    .ko-match:hover{border-color:rgba(212,175,55,0.4)}
    .ko-team{flex:1;font-size:0.82rem;font-weight:700}
    .ko-team.home{text-align:right}
    .ko-team.away{text-align:left}
    .ko-vs{font-size:0.7rem;color:#a0b8a8;min-width:20px;text-align:center}
    .ko-won{color:#4cff88!important}
    .modal-sm{background:#0a2d18;border:1px solid rgba(212,175,55,0.3);border-radius:16px;padding:20px;max-width:340px;width:100%}
    .score-inp{width:52px;background:rgba(255,255,255,0.08);border:1px solid rgba(212,175,55,0.3);border-radius:8px;padding:8px;color:#f4f4f0;font-family:'Bebas Neue',sans-serif;font-size:1.6rem;text-align:center;outline:none}
    .score-inp:focus{border-color:#d4af37}
    .legend{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;font-size:0.72rem;color:#a0b8a8}
    .legend-item{display:flex;align-items:center;gap:4px}
    .legend-dot{width:8px;height:8px;border-radius:2px}
  `;

  return (
    <div style={{direction:"rtl"}}>
      <style>{css}</style>

      {/* Sub-nav */}
      <div className="br-nav">
        <button className={`br-nav-btn${subTab==="groups"?" active":""}`} onClick={()=>setSubTab("groups")}>🏟️ المجموعات</button>
        <button className={`br-nav-btn${subTab==="knockout"?" active":""}`} onClick={()=>setSubTab("knockout")}>⚔️ الأدوار الإقصائية</button>
      </div>

      {/* زر التحديث التلقائي */}
      <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <button
          onClick={handleFetchResults}
          disabled={fetchingResults}
          style={{background:fetchingResults?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#44ddff,#0099cc)",border:"none",borderRadius:10,padding:"9px 16px",color:fetchingResults?"#a0b8a8":"#000",fontFamily:"Cairo,sans-serif",fontSize:"0.82rem",fontWeight:700,cursor:fetchingResults?"not-allowed":"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:6}}
        >
          <span style={{display:"inline-block",animation:fetchingResults?"spin 1s linear infinite":"none"}}>🔄</span>
          {fetchingResults ? "جاري البحث..." : "تحديث النتائج من الإنترنت"}
        </button>
        {lastFetch && <span style={{fontSize:"0.72rem",color:"#a0b8a8"}}>آخر تحديث: {lastFetch}</span>}
        {fetchStatus && <span style={{fontSize:"0.78rem",color:fetchStatus.startsWith("✅")?"#4cff88":fetchStatus.startsWith("⚠️")?"#ffcc44":"#44ddff",fontWeight:700}}>{fetchStatus}</span>}
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item"><div className="legend-dot" style={{background:"#4cff88"}}/> الأول → دور الـ32</div>
        <div className="legend-item"><div className="legend-dot" style={{background:"#44ddff"}}/> الثاني → دور الـ32</div>
        <div className="legend-item"><div className="legend-dot" style={{background:"rgba(255,200,60,0.7)"}}/> الثالث → قد يتأهل</div>
        {compTeamIds.size > 0 && <div className="legend-item"><span style={{background:"rgba(212,175,55,0.2)",border:"1px solid rgba(212,175,55,0.4)",borderRadius:4,padding:"1px 5px",fontSize:"0.65rem",color:"#d4af37"}}>⭐</span> منتخب مسابقتك</div>}
      </div>

      {/* ══ GROUPS VIEW ══ */}
      {subTab === "groups" && (
        <div>
          {Object.keys(GROUPS_DATA).map(g => {
            const gTeams = GROUPS_DATA[g].teams;
            const matches = getGroupMatches(g);
            const matchResults = matches.map(m => {
              const key = `${g}_${m.home.id}_${m.away.id}`;
              const r = matchData[key];
              return { homeId: m.home.id, awayId: m.away.id, ...(r || { played: false, homeScore:0, awayScore:0 }) };
            });
            const standings = calcStandings(gTeams, matchResults);
            const playedCount = matchResults.filter(r => r.played).length;

            return (
              <div key={g} className="group-card">
                <div className="group-hdr">
                  <div className="group-lbl">المجموعة {g}</div>
                  <div style={{fontSize:"0.7rem",color:"#a0b8a8"}}>{playedCount}/6 مباراة</div>
                </div>

                {/* Standings table */}
                <table className="group-table">
                  <thead>
                    <tr>
                      <th style={{textAlign:"right"}}>الفريق</th>
                      <th>ل</th><th>ف</th><th>ت</th><th>خ</th>
                      <th>له</th><th>عليه</th><th>+/-</th>
                      <th style={{color:"#d4af37"}}>ن</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((t, ri) => {
                      const isComp = compTeamIds.has(t.id);
                      const rowClass = ri === 0 ? "qualify-1" : ri === 1 ? "qualify-2" : ri === 2 ? "qualify-3" : "";
                      return (
                        <tr key={t.id} className={rowClass} style={isComp ? {background:"rgba(212,175,55,0.06)"} : {}}>
                          <td>
                            <div className="team-cell">
                              <span className="team-flag-sm">{t.flag}</span>
                              <span className="team-name-sm">{t.name}</span>
                              {t.host && <span style={{fontSize:"0.6rem",color:"#44ddff"}}>★</span>}
                              {isComp && <span className="comp-badge">⭐</span>}
                            </div>
                          </td>
                          <td>{t.p}</td>
                          <td>{t.w}</td>
                          <td>{t.d}</td>
                          <td>{t.l}</td>
                          <td>{t.gf}</td>
                          <td>{t.ga}</td>
                          <td style={{color: (t.gf-t.ga)>0?"#4cff88":(t.gf-t.ga)<0?"#ff8866":"#a0b8a8"}}>{t.gf-t.ga > 0 ? "+" : ""}{t.gf-t.ga}</td>
                          <td style={{fontWeight:900,color:"#d4af37",fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem"}}>{t.pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Matches list */}
                {adminUnlocked && (
                  <div className="match-list">
                    <div style={{fontSize:"0.7rem",color:"#a0b8a8",marginBottom:4}}>⚽ المباريات — اضغط لإدخال النتيجة</div>
                    {matches.map((m, mi) => {
                      const key = `${g}_${m.home.id}_${m.away.id}`;
                      const r = matchData[key];
                      return (
                        <div key={key} className="match-row" onClick={()=>{setEditingMatch(key);setEditScore(r?{home:String(r.homeScore),away:String(r.awayScore)}:{home:"",away:""});}}>
                          <span className="match-team home">{m.home.flag} {m.home.name}</span>
                          <span className={`match-score ${r?.played?"played":"tbd"}`}>
                            {r?.played
                              ? `${r.homeScore} - ${r.awayScore}`
                              : MATCH_SCHEDULE[key]?.time || "- vs -"}
                          </span>
                          {!r?.played && MATCH_SCHEDULE[key] && (
                            <span style={{fontSize:"0.6rem",color:"#a0b8a8",minWidth:80,textAlign:"center"}}>{MATCH_SCHEDULE[key].date}</span>
                          )}
                          <span className="match-team away">{m.away.name} {m.away.flag}</span>
                          {r?.played && (
                            <button style={{background:"none",border:"none",color:"#ff7777",cursor:"pointer",fontSize:"0.7rem",padding:"0 2px"}} onClick={e=>{e.stopPropagation();clearMatch(key);}}>✕</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Show matches for non-admin */}
                {!adminUnlocked && (
                  <div className="match-list">
                    {matches.map(m => {
                      const key = `${g}_${m.home.id}_${m.away.id}`;
                      const r = matchData[key];
                      const sched = MATCH_SCHEDULE[key];
                      return (
                        <div key={key} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 0",fontSize:"0.72rem",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                          <span style={{flex:1,textAlign:"right",fontWeight:600}}>{m.home.flag} {m.home.name}</span>
                          <div style={{textAlign:"center",minWidth:72}}>
                            {r?.played
                              ? <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",color:"#4cff88"}}>{r.homeScore} - {r.awayScore}</span>
                              : <div>
                                  <div style={{color:"#d4af37",fontWeight:700,fontSize:"0.75rem"}}>{sched?.time || "-"}</div>
                                  <div style={{color:"#a0b8a8",fontSize:"0.6rem"}}>{sched?.date || ""}</div>
                                </div>
                            }
                          </div>
                          <span style={{flex:1,fontWeight:600}}>{m.away.name} {m.away.flag}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══ KNOCKOUT VIEW ══ */}
      {subTab === "knockout" && (
        <KnockoutView
          adminUnlocked={adminUnlocked}
          matchData={matchData}
          knockoutData={knockoutData}
          allThirds={allThirds}
          compTeamIds={compTeamIds}
          onEdit={(key, teams) => setEditingKO({key, teams})}
          onClear={clearKO}
          saveKO={saveKO}
          editingKO={editingKO}
          setEditingKO={setEditingKO}
        />
      )}

      {/* ══ MATCH SCORE MODAL ══ */}
      {editingMatch && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&setEditingMatch(null)}>
          <div className="modal-sm">
            <div style={{textAlign:"center",marginBottom:16,fontSize:"0.9rem",fontWeight:700,color:"#d4af37"}}>⚽ إدخال نتيجة المباراة</div>
            {(() => {
              const parts = editingMatch.split("_");
              const g = parts[0];
              const homeId = parts[1], awayId = parts[2];
              const homeT = GROUPS_DATA[g]?.teams.find(t=>t.id===homeId);
              const awayT = GROUPS_DATA[g]?.teams.find(t=>t.id===awayId);
              return (
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:20}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem"}}>{homeT?.flag}</div>
                    <div style={{fontSize:"0.74rem",fontWeight:700,marginBottom:6}}>{homeT?.name}</div>
                    <input className="score-inp" type="number" min="0" max="20" value={editScore.home}
                      onChange={e=>setEditScore(p=>({...p,home:e.target.value}))} placeholder="0"/>
                  </div>
                  <div style={{fontSize:"0.8rem",color:"#a0b8a8",fontWeight:700}}>-</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem"}}>{awayT?.flag}</div>
                    <div style={{fontSize:"0.74rem",fontWeight:700,marginBottom:6}}>{awayT?.name}</div>
                    <input className="score-inp" type="number" min="0" max="20" value={editScore.away}
                      onChange={e=>setEditScore(p=>({...p,away:e.target.value}))} placeholder="0"/>
                  </div>
                </div>
              );
            })()}
            <div style={{display:"flex",gap:8}}>
              <button style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"9px",color:"#a0b8a8",fontFamily:"Cairo,sans-serif",cursor:"pointer"}} onClick={()=>setEditingMatch(null)}>إلغاء</button>
              <button style={{flex:2,background:"linear-gradient(135deg,#d4af37,#b8962e)",border:"none",borderRadius:10,padding:"9px",color:"#000",fontFamily:"Cairo,sans-serif",fontWeight:900,cursor:"pointer"}} onClick={saveMatch}>✓ حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Knockout View ─────────────────────────────────────
function KnockoutView({ adminUnlocked, knockoutData, allThirds, compTeamIds, onEdit, onClear, saveKO, editingKO, setEditingKO }) {

  // بناء أزواج دور الـ32 (8 أزواج من المجموعات + 8 أزواج من الثالثين وباقي المجموعات)
  // الترتيب الرسمي: 1A vs TBD, 1C vs 3rd, 1E vs 3rd, 1G vs 2H, 1I vs 2L, 1K vs 2J, ...
  // سنستخدم تبسيط: 1st ضد 2nd من المجموعات المجاورة + 8 ثالثين

  const r32Pairs = [
    // الربع الأول
    { id:"r32_1",  home:"1A", away:"3CDEF" },
    { id:"r32_2",  home:"1B", away:"3AGHI" },
    { id:"r32_3",  home:"2A", away:"2C"    },
    { id:"r32_4",  home:"1C", away:"2B"    },
    // الربع الثاني
    { id:"r32_5",  home:"1D", away:"3BIJK" },
    { id:"r32_6",  home:"1E", away:"2D"    },
    { id:"r32_7",  home:"2E", away:"3FGJK" },
    { id:"r32_8",  home:"1F", away:"2G"    },
    // الربع الثالث
    { id:"r32_9",  home:"1G", away:"2F"    },
    { id:"r32_10", home:"2I", away:"3AHJL" },
    { id:"r32_11", home:"1H", away:"2K"    },
    { id:"r32_12", home:"1I", away:"2H"    },
    // الربع الرابع
    { id:"r32_13", home:"1J", away:"2L"    },
    { id:"r32_14", home:"2J", away:"3BCEL" },
    { id:"r32_15", home:"1K", away:"2I"    },
    { id:"r32_16", home:"1L", away:"2K"    },
  ];

  const r16Pairs = Array.from({length:8},(_,i) => ({
    id:`r16_${i+1}`,
    home: `فائز ر32 م${i*2+1}`,
    away: `فائز ر32 م${i*2+2}`,
  }));

  const qfPairs = Array.from({length:4},(_,i) => ({
    id:`qf_${i+1}`,
    home: `فائز ر16 م${i*2+1}`,
    away: `فائز ر16 م${i*2+2}`,
  }));

  const sfPairs = [
    { id:"sf_1", home:"فائز ر8 م1", away:"فائز ر8 م2" },
    { id:"sf_2", home:"فائز ر8 م3", away:"فائز ر8 م4" },
  ];

  const finalPair   = { id:"final",   home:"فائز ن.ف 1", away:"فائز ن.ف 2" };
  const thirdPair   = { id:"third",   home:"خاسر ن.ف 1", away:"خاسر ن.ف 2" };

  function KOMatch({ pair, label }) {
    const winner = knockoutData[pair.id];
    const home = winner?.home || knockoutData[`${pair.id}_home`] || pair.home;
    const away = winner?.away || knockoutData[`${pair.id}_away`] || pair.away;
    const winnerTeam = winner?.winner;

    return (
      <div className="ko-match" onClick={()=>adminUnlocked&&onEdit(pair.id, {home, away})}>
        <span className={`ko-team home${winnerTeam===home?" ko-won":""}`}>{home}</span>
        <span className="ko-vs">{winnerTeam ? "●" : "VS"}</span>
        <span className={`ko-team away${winnerTeam===away?" ko-won":""}`}>{away}</span>
        {winnerTeam && <span style={{fontSize:"0.7rem",color:"#4cff88",minWidth:50,textAlign:"center"}}>✓ {winnerTeam}</span>}
        {adminUnlocked && winnerTeam && (
          <button style={{background:"none",border:"none",color:"#ff7777",cursor:"pointer",fontSize:"0.7rem"}} onClick={e=>{e.stopPropagation();onClear(pair.id);}}>✕</button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* دور الـ 32 */}
      <div className="ko-section">
        <div className="ko-title">⚽ دور الـ 32 — 16 مباراة</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {r32Pairs.map(p => <KOMatch key={p.id} pair={p}/>)}
        </div>
      </div>

      {/* دور الـ 16 */}
      <div className="ko-section">
        <div className="ko-title">🔥 دور الـ 16</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {r16Pairs.map(p => <KOMatch key={p.id} pair={p}/>)}
        </div>
      </div>

      {/* ربع النهائي */}
      <div className="ko-section">
        <div className="ko-title">💥 ربع النهائي</div>
        {qfPairs.map(p => <KOMatch key={p.id} pair={p}/>)}
      </div>

      {/* نصف النهائي */}
      <div className="ko-section">
        <div className="ko-title">🌟 نصف النهائي</div>
        {sfPairs.map(p => <KOMatch key={p.id} pair={p}/>)}
      </div>

      {/* المركز الثالث */}
      <div className="ko-section">
        <div className="ko-title">🥉 المركز الثالث</div>
        <KOMatch pair={thirdPair}/>
      </div>

      {/* النهائي */}
      <div className="ko-section">
        <div className="ko-title" style={{color:"#ffd700",fontSize:"1.4rem"}}>🏆 النهائي — 19 يوليو 2026</div>
        <div style={{background:"linear-gradient(135deg,rgba(212,175,55,0.12),rgba(0,0,0,0.3))",border:"1px solid rgba(212,175,55,0.4)",borderRadius:14,padding:4}}>
          <KOMatch pair={finalPair}/>
        </div>
        {knockoutData["final"]?.winner && (
          <div style={{textAlign:"center",marginTop:12,padding:"14px",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:12}}>
            <div style={{fontSize:"2rem"}}>🏆</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.4rem",color:"#ffd700",letterSpacing:2}}>بطل العالم</div>
            <div style={{fontWeight:900,color:"#fff",fontSize:"1.1rem",marginTop:4}}>{knockoutData["final"].winner}</div>
          </div>
        )}
      </div>

      {adminUnlocked && (
        <div style={{background:"rgba(68,221,255,0.06)",border:"1px solid rgba(68,221,255,0.2)",borderRadius:10,padding:"10px 14px",marginTop:8,fontSize:"0.78rem",color:"#a0e8ff",textAlign:"center"}}>
          💡 اضغط على أي مباراة لتحديد الفائز أو تعديل الفريقين
        </div>
      )}

      {/* KO Edit Modal */}
      {editingKO && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&setEditingKO(null)}>
          <div style={{background:"#0a2d18",border:"1px solid rgba(212,175,55,0.3)",borderRadius:16,padding:20,maxWidth:340,width:"100%"}}>
            <div style={{textAlign:"center",marginBottom:14,fontSize:"0.9rem",fontWeight:700,color:"#d4af37"}}>تحديد الفائز</div>
            <KOTeamInput
              defaultHome={editingKO.teams.home}
              defaultAway={editingKO.teams.away}
              onSave={(home, away, winner) => saveKO(editingKO.key, {home, away, winner})}
              onCancel={() => setEditingKO(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function KOTeamInput({ defaultHome, defaultAway, onSave, onCancel }) {
  const [home, setHome] = useState(defaultHome);
  const [away, setAway] = useState(defaultAway);
  const [winner, setWinner] = useState("");

  const inpStyle = {width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:8,padding:"8px 10px",color:"#f4f4f0",fontFamily:"Cairo,sans-serif",fontSize:"0.86rem",outline:"none",marginBottom:8,textAlign:"right"};

  return (
    <div>
      <div style={{fontSize:"0.74rem",color:"#a0b8a8",marginBottom:4}}>اسم الفريق الأول</div>
      <input style={inpStyle} value={home} onChange={e=>setHome(e.target.value)} placeholder="مثال: إسبانيا"/>
      <div style={{fontSize:"0.74rem",color:"#a0b8a8",marginBottom:4}}>اسم الفريق الثاني</div>
      <input style={inpStyle} value={away} onChange={e=>setAway(e.target.value)} placeholder="مثال: فرنسا"/>
      <div style={{fontSize:"0.74rem",color:"#a0b8a8",marginBottom:6}}>الفائز (اختياري)</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <button style={{flex:1,padding:"8px",borderRadius:8,cursor:"pointer",fontFamily:"Cairo,sans-serif",fontSize:"0.8rem",fontWeight:700,border:winner===home?"2px solid #4cff88":"1px solid rgba(255,255,255,0.15)",background:winner===home?"rgba(76,255,136,0.15)":"rgba(255,255,255,0.05)",color:winner===home?"#4cff88":"#a0b8a8"}} onClick={()=>setWinner(winner===home?"":home)}>{home||"الأول"}</button>
        <button style={{flex:1,padding:"8px",borderRadius:8,cursor:"pointer",fontFamily:"Cairo,sans-serif",fontSize:"0.8rem",fontWeight:700,border:winner===away?"2px solid #4cff88":"1px solid rgba(255,255,255,0.15)",background:winner===away?"rgba(76,255,136,0.15)":"rgba(255,255,255,0.05)",color:winner===away?"#4cff88":"#a0b8a8"}} onClick={()=>setWinner(winner===away?"":away)}>{away||"الثاني"}</button>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"9px",color:"#a0b8a8",fontFamily:"Cairo,sans-serif",cursor:"pointer"}} onClick={onCancel}>إلغاء</button>
        <button style={{flex:2,background:"linear-gradient(135deg,#d4af37,#b8962e)",border:"none",borderRadius:10,padding:"9px",color:"#000",fontFamily:"Cairo,sans-serif",fontWeight:900,cursor:"pointer"}} onClick={()=>onSave(home,away,winner||null)}>✓ حفظ</button>
      </div>
    </div>
  );
}
