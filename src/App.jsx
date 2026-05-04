import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────
   MAGIC TEA — Landing Page v9
   Inter + Playfair Display · Iridescent bubbles
   Google Maps embed · Dynamic menu
───────────────────────────────────────────────── */

/* ══════════════ MENU DATA ══════════════ */
const DRINKS = {
  lait: [
    { n: "Thé au lait classique",     p: "9.00",  tag: null },
    { n: "Chai Latte",                p: "9.00",  tag: null },
    { n: "Café Latte",                p: "9.00",  tag: null },
    { n: "Le Ciel Bleu 'Coco'",      p: "9.00",  tag: "Populaire" },
    { n: "Pomelo Sagou à la Mangue", p: "10.50", tag: "Premium" },
    { n: "Avocat Smoothie",           p: "10.50", tag: "Premium" },
  ],
  fruit: [
    { n: "Passion",                   p: "9.00",  tag: "Populaire" },
    { n: "Lychee",                    p: "9.00",  tag: null },
    { n: "Citron Vert",               p: "9.00",  tag: null },
    { n: "Raisin Frappé",             p: "9.00",  tag: null },
    { n: "Fraise",                    p: "9.00",  tag: null },
    { n: "Kiwi",                      p: "9.00",  tag: null },
    { n: "Orange",                    p: "9.00",  tag: null },
    { n: "Bubble Mojito sans alcool", p: "10.00", tag: "Spécial" },
  ],
  autres: [
    { n: "Oishi Genmai",         e: "🍵", p: "4.50" },
    { n: "Oishi Green Original", e: "🍵", p: "4.50" },
    { n: "Oishi Black",          e: "🍵", p: "4.50" },
    { n: "Oishi Thé Vert",       e: "🍵", p: "4.50" },
    { n: "Coca-Cola",            e: "🥤", p: "4.00" },
    { n: "Lipton Ice Tea",       e: "🥤", p: "4.00" },
    { n: "Eau minérale",         e: "💧", p: "3.00" },
  ],
};

const TOPS_STD  = [
  { n: "Sagou",              e: "🟤", col: "#8B5E3C", p: 0.50 },
  { n: "Jelly Litchi",       e: "🟣", col: "#9B59B6", p: 0.50 },
  { n: "Haricots Rouges",    e: "🔴", col: "#E74C3C", p: 0.50 },
  { n: "Tapioca",            e: "⚫", col: "#2C3E50", p: 0.50 },
  { n: "Jelly Tricolore",    e: "🌈", col: "#E91E63", p: 0.50 },
  { n: "Boba Fruit Passion", e: "🟠", col: "#E67E22", p: 0.50 },
  { n: "Boba Litchi",        e: "🩷", col: "#FF69B4", p: 0.50 },
];
const TOPS_PREM = [
  { n: "Crème Brûlée", e: "🟡", col: "#F1C40F", p: 1.00, pop: true },
  { n: "Crème Salée",  e: "🤍", col: "#BDC3C7", p: 1.00 },
];

const SUSHI_CATS = [
  {
    icon: "🍣", title: "Nigiri", sub: "2 pcs",
    items: [
      { n: "Saumon",           p: "8.00" },
      { n: "Poulpe",           p: "8.00" },
      { n: "Anguille",         p: "10.00" },
      { n: "Omelette",         p: "7.00" },
      { n: "Crevettes cuites", p: "8.00" },
      { n: "Saumon flambé",    p: "9.00", sig: true },
    ],
  },
  {
    icon: "🌀", title: "Maki", sub: "8 pcs",
    items: [
      { n: "Concombre & Sésame", p: "7.90" },
      { n: "Surimi",             p: "7.90" },
      { n: "Avocat",             p: "7.50" },
      { n: "Mousse de Thon",     p: "8.50" },
      { n: "Tempura",            p: "8.50" },
    ],
  },
  {
    icon: "🔄", title: "Uramaki", sub: "8 pcs",
    items: [
      { n: "Saumon-Mangue & Tobiko", p: "13.90", pop: true },
      { n: "Crispy Ebiroll",         p: "12.90" },
      { n: "Unagiroll",              p: "13.90" },
    ],
  },
  {
    icon: "⛵", title: "Gunkan & Onigiri", sub: "à la pièce",
    items: [
      { n: "Gunkan Tobiko",           p: "5.50" },
      { n: "Onigiri Mousse de Thon",  p: "7.50" },
    ],
  },
];

const HOT = [
  {
    e: "🍜", n: "Soupe Vermicelles Aigre-Pimentée", p: "15.90", tag: "Végétarien", sig: true,
    d: "Vermicelles de patate douce, coriandre, ciboulette, cacahuètes frites & salade.",
    note: "Suppléments : Omelette · Œuf mariné · Travers de porc · Boulettes · Crevettes",
  },
  {
    e: "🐟", n: "Soupe de Boulettes de Poisson", p: "14.00", tag: "5 pcs",
    d: "Bouillon dashi mijoté, boulettes maison, vermicelles & aromates frais.",
  },
  {
    e: "🥟", n: "Raviolis au Poulet — Grillés", p: "11.50", tag: "Fait Maison",
    d: "Poulet (CH), maïs, oignons & champignons. Poêlés dorés, croûte croustillante.",
    note: "Option Vapeur disponible — même garniture.",
  },
  {
    e: "🥟", n: "Raviolis au Poulet — Vapeur", p: "11.50", tag: "Fait Maison",
    d: "Poulet (CH), maïs, oignons & champignons. Cuisson vapeur, texture tendre.",
    note: "Option Grillée disponible — même garniture.",
  },
];

const REVIEWS = [
  { av: "KS", n: "Kevin Sefsaf",   tag: "Ciel Bleu Coco",  col: "#C8E6B8",
    txt: "Le Ciel Bleu Coco est une révélation absolue. L'onctuosité du lait de coco, la fraîcheur du pandan — c'est magique. Je suis revenu trois fois cette semaine !" },
  { av: "ST", n: "Sarah Tekle",    tag: "Matcha Intense",   col: "#FFD6DF",
    txt: "Le matcha d'une authenticité rare. On sent immédiatement la qualité. L'ambiance ultra zen et le service chaleureux font de Magic Tea mon adresse coup de cœur." },
  { av: "KD", n: "Kylian D'Amato", tag: "Rituel de l'Uni", col: "#FFF2C8",
    txt: "Mon rituel entre deux cours ! Le rapport qualité-prix est incroyable. Le Pomelo Sagou c'est mon péché mignon. Je recommande les yeux fermés !" },
  { av: "LF", n: "Léa Fontaine",   tag: "Bubble Mojito",   col: "#FFD6DF",
    txt: "Le Bubble Mojito sans alcool est absolument délicieux ! Frais, léger et original. La déco est adorable et le service toujours souriant." },
  { av: "MD", n: "Marc Dubois",    tag: "Saumon Flambé",   col: "#C8E6B8",
    txt: "Les sushis sont frais, les saveurs impeccables. Le nigiri saumon flambé est spectaculaire. Meilleur rapport qualité-prix de Fribourg !" },
];

const HOURS = [
  { d: "Lundi",    o: "11h00", c: "20h00" },
  { d: "Mardi",    o: "11h00", c: "20h00" },
  { d: "Mercredi", o: "11h00", c: "20h00" },
  { d: "Jeudi",    o: "11h00", c: "20h00" },
  { d: "Vendredi", o: "11h00", c: "20h00" },
  { d: "Samedi",   o: "11h00", c: "21h00" },
  { d: "Dimanche", o: "12h00", c: "19h00" },
];

/* ══════════════ BUBBLE CONFIG ══════════════ */
const PHI = 1.6180339887;
const makeBubbles = (n, seed = 0) =>
  Array.from({ length: n }, (_, i) => {
    const s = (i + seed + 1) * PHI;
    return {
      id: i + seed,
      sz:  16 + ((s * 59) % 84),
      lft: ((i * 100 / n) + (s % 9) - 4.5 + 100) % 100,
      dV:  12 + ((s * 15) % 22),
      dH:  9  + ((s * 11) % 14),
      dl:  (i * 28 / n) % 30,
      h1: Math.round((s * 137.5) % 360),
      h2: Math.round((s * 137.5 + 70) % 360),
      h3: Math.round((s * 137.5 + 175) % 360),
      amp: 18 + ((s * 36) % 62),
    };
  });

const HERO_B   = makeBubbles(34, 0);
const GLOBAL_B = makeBubbles(14, 34);

/* ══════════════ CSS ══════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#FEFCFA;overflow-x:hidden;font-family:'Inter',sans-serif;color:#3C2F2F}

/* Bubble rise */
@keyframes bUp{0%{bottom:-130px;opacity:0}6%{opacity:1}89%{opacity:1}100%{bottom:112vh;opacity:0}}
.bb{position:absolute;border-radius:50%;pointer-events:none;animation:bUp linear infinite}

/* Floats */
@keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes fltB{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-20px) rotate(1.5deg)}}
@keyframes hb{0%,100%{transform:scale(1)}50%{transform:scale(1.16)}}
@keyframes twk{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.65;transform:scale(1.12)}}
@keyframes shim{0%{background-position:260% center}100%{background-position:-260% center}}
@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes eUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes tdPls{0%,100%{box-shadow:0 0 0 0 rgba(255,183,197,.5)}65%{box-shadow:0 0 0 7px rgba(255,183,197,0)}}

/* Entrances */
.ea{animation:eUp .9s cubic-bezier(.22,1,.36,1) forwards}
.eb{animation:eUp .9s cubic-bezier(.22,1,.36,1) .14s forwards;opacity:0}
.ec{animation:eUp .9s cubic-bezier(.22,1,.36,1) .28s forwards;opacity:0}
.ed{animation:eUp .9s cubic-bezier(.22,1,.36,1) .44s forwards;opacity:0}
.ee{animation:eUp .9s cubic-bezier(.22,1,.36,1) .60s forwards;opacity:0}

/* Scroll reveal */
.sr{opacity:0;transform:translateY(32px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.sr.vis{opacity:1;transform:none}
.sr.d1{transition-delay:.10s}.sr.d2{transition-delay:.22s}.sr.d3{transition-delay:.36s}

/* Stagger */
.sg>.sc{opacity:0;transform:translateY(22px) scale(.98);
  transition:opacity .52s cubic-bezier(.34,1.5,.64,1),transform .52s cubic-bezier(.34,1.5,.64,1)}
.sg.vis>.sc{opacity:1;transform:none}
.sg.vis>.sc:nth-child(1){transition-delay:.00s}.sg.vis>.sc:nth-child(2){transition-delay:.07s}
.sg.vis>.sc:nth-child(3){transition-delay:.14s}.sg.vis>.sc:nth-child(4){transition-delay:.21s}
.sg.vis>.sc:nth-child(5){transition-delay:.28s}.sg.vis>.sc:nth-child(6){transition-delay:.35s}
.sg.vis>.sc:nth-child(7){transition-delay:.42s}.sg.vis>.sc:nth-child(8){transition-delay:.49s}
.sg.vis>.sc:nth-child(9){transition-delay:.56s}.sg.vis>.sc:nth-child(10){transition-delay:.63s}

/* Glassmorphism */
.gl{background:rgba(255,255,255,.78);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);border:1px solid rgba(255,220,228,.30);border-radius:16px;box-shadow:0 2px 16px rgba(60,47,47,.05),inset 0 1px 0 rgba(255,255,255,.92);transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,background .22s ease}
.gl:hover{transform:translateY(-5px) scale(1.016);background:rgba(255,255,255,.92);box-shadow:0 14px 40px rgba(60,47,47,.09)}
.glm{background:rgba(238,250,228,.66);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(163,177,138,.22);border-radius:18px}

/* Buttons */
.btn-r{background:linear-gradient(135deg,#FFB7C5 0%,#FF94AF 46%,#FFB7C5 100%);background-size:260% auto;animation:shim 4.5s linear infinite;color:#fff;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;transition:transform .28s ease,box-shadow .28s ease;box-shadow:0 8px 28px rgba(255,143,170,.38)}
.btn-r:hover{transform:translateY(-5px) scale(1.024);box-shadow:0 20px 50px rgba(255,143,170,.54)}
.btn-w{background:#fff;border:1.5px solid rgba(60,47,47,.15);color:#3C2F2F;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;transition:all .28s ease}
.btn-w:hover{border-color:rgba(60,47,47,.30);transform:translateY(-3px);box-shadow:0 8px 20px rgba(60,47,47,.07)}
.btn-d{background:#2A1F1F;color:#fff;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;transition:transform .28s ease,box-shadow .28s ease;box-shadow:0 6px 20px rgba(42,31,31,.28)}
.btn-d:hover{transform:translateY(-4px);box-shadow:0 15px 36px rgba(42,31,31,.36)}

/* Nav */
.nl{color:rgba(60,47,47,.42);text-decoration:none;font-size:12.5px;font-weight:500;letter-spacing:.8px;transition:color .2s;font-family:'Inter',sans-serif}
.nl:hover{color:#3C2F2F}

/* Tab switch */
.sw-w{background:rgba(244,240,238,.92);border-radius:13px;padding:5px;display:inline-flex;gap:3px;border:1px solid rgba(60,47,47,.08);box-shadow:inset 0 2px 8px rgba(60,47,47,.06)}
.sw{font-family:'Inter',sans-serif;font-weight:600;font-size:14px;padding:11px 32px;border-radius:10px;border:none;cursor:pointer;transition:all .30s cubic-bezier(.22,1,.36,1);color:rgba(60,47,47,.46);background:transparent}
.sw.or{background:#fff;color:#8B3A50;box-shadow:0 3px 12px rgba(60,47,47,.10)}
.sw.og{background:#fff;color:#3A5820;box-shadow:0 3px 12px rgba(60,47,47,.10)}

/* Sub-tabs */
.st{cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;font-size:13px;border:none;background:transparent;border-bottom:2px solid transparent;padding:10px 20px;color:rgba(60,47,47,.40);transition:all .22s ease;margin-bottom:-1.5px;letter-spacing:.3px}
.st.on{border-bottom-color:#FFB7C5;color:#3C2F2F;font-weight:600}

/* Price pills */
.pg{background:rgba(163,177,138,.12);color:#3A5820;font-weight:600;border-radius:7px;padding:3px 11px;font-size:11.5px;white-space:nowrap;border:1px solid rgba(163,177,138,.24);font-family:'Inter',sans-serif}
.pr{background:rgba(255,183,197,.12);color:#8B3A50;font-weight:600;border-radius:7px;padding:3px 11px;font-size:11.5px;white-space:nowrap;border:1px solid rgba(255,183,197,.26);font-family:'Inter',sans-serif}
.pp{background:#FFB7C5;color:#fff;font-weight:700;border-radius:6px;padding:2px 8px;font-size:9.5px;white-space:nowrap;font-family:'Inter',sans-serif}
.ppg{background:#A3B18A;color:#fff;font-weight:700;border-radius:6px;padding:2px 8px;font-size:9.5px;white-space:nowrap;font-family:'Inter',sans-serif}

/* Menu item */
.mi{background:rgba(255,255,255,.82);backdrop-filter:blur(12px);border:1px solid rgba(255,183,197,.12);border-radius:14px;padding:13px 16px;display:flex;align-items:center;gap:13px;transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s ease,background .22s ease}
.mi:hover{transform:translateY(-5px) scale(1.016);box-shadow:0 12px 34px rgba(60,47,47,.08);background:rgba(255,255,255,.96)}

/* Topping row */
.tr{background:rgba(255,255,255,.86);border:1.5px solid rgba(60,47,47,.08);border-radius:11px;padding:10px 13px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all .22s cubic-bezier(.22,1,.36,1)}
.tr:hover{border-color:rgba(163,177,138,.46);background:rgba(240,250,230,.58)}
.tr.on{border-color:#A3B18A;background:rgba(163,177,138,.09);transform:scale(1.014);box-shadow:0 4px 14px rgba(163,177,138,.15)}

/* Hot card */
.hc{background:rgba(255,255,255,.86);backdrop-filter:blur(14px);border:1px solid rgba(255,183,197,.12);border-radius:16px;padding:22px;transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
.hc:hover{transform:translateY(-6px) scale(1.013);box-shadow:0 16px 44px rgba(60,47,47,.09)}

/* Marquee */
.mq-o{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.mq-i{display:flex;animation:mq 44s linear infinite;width:max-content}
.mq-i:hover{animation-play-state:paused}

/* Review card */
.rc{background:rgba(255,255,255,.94);border-radius:18px;padding:22px;flex-shrink:0;width:316px;margin:0 10px;position:relative;box-shadow:0 3px 18px rgba(60,47,47,.06);border:1px solid rgba(255,183,197,.15);transition:transform .28s ease}
.rc:hover{transform:translateY(-5px)}

/* Hours */
.hr{display:flex;align-items:center;justify-content:space-between;padding:9px 13px;border-radius:11px;border:1px solid transparent;transition:all .22s ease}
.hr.td{background:rgba(255,183,197,.08);border-color:rgba(255,183,197,.26);animation:tdPls 2.8s ease-in-out infinite}

/* Concept card */
.cc{border-radius:26px;overflow:hidden;position:relative;transition:transform .34s cubic-bezier(.22,1,.36,1),box-shadow .34s ease}
.cc:hover{transform:translateY(-6px) scale(1.011);box-shadow:0 26px 68px rgba(60,47,47,.12)!important}

/* Map frame */
.mapf{border-radius:18px;overflow:hidden;border:1px solid rgba(60,47,47,.09);box-shadow:0 10px 40px rgba(60,47,47,.08)}

/* Section label */
.sl{font-size:10.5px;font-weight:600;letter-spacing:5px;text-transform:uppercase;color:rgba(60,47,47,.36);font-family:'Inter',sans-serif}
.divl{width:44px;height:2px;background:linear-gradient(90deg,#FFB7C5,transparent);border-radius:2px;margin:13px auto 0}

/* Footer link */
.fl{color:rgba(255,255,255,.34);text-decoration:none;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Inter',sans-serif;transition:color .2s}
.fl:hover{color:rgba(255,255,255,.80)}

/* Responsive */
@media(max-width:840px){.two-col{grid-template-columns:1fr!important}.hbtns{flex-direction:column!important;align-items:stretch!important}.cg{grid-template-columns:1fr!important}.mg{grid-template-columns:1fr!important}.sug{grid-template-columns:1fr!important}.hg{grid-template-columns:1fr!important}.dg{grid-template-columns:1fr!important}.tg{grid-template-columns:1fr!important}}
@media(max-width:560px){.rc{width:286px!important}}
`;

/* ══════════════ HELPERS ══════════════ */
const PF  = { fontFamily: "'Playfair Display', serif" };
const INT = { fontFamily: "'Inter', sans-serif" };
const BR  = "#3C2F2F";
const PNK = "#FFB7C5";
const MAT = "#A3B18A";

const todayStr = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][new Date().getDay()];

function Star({ d = 0 }) {
  return <span style={{ fontSize: 13, color: "#E8C43A", display: "inline-block", animation: `twk 2.8s ease-in-out ${d}s infinite` }}>★</span>;
}

/* ── Soap bubble with backdrop-blur iridescent effect ── */
function Bubble({ b, kfName }) {
  const bg = [
    `radial-gradient(circle at 28% 26%, hsla(${b.h2},80%,97%,.55) 0%, transparent 40%)`,
    `radial-gradient(circle at 68% 70%, hsla(${b.h3},70%,92%,.32) 0%, transparent 38%)`,
    `radial-gradient(ellipse at 50% 50%, hsla(${b.h1},60%,98%,.08) 0%, hsla(${b.h2},52%,88%,.20) 50%, hsla(${b.h3},48%,94%,.07) 100%)`,
  ].join(",");
  const blr = b.sz > 60 ? 1.5 : b.sz > 34 ? 0.8 : 0;
  return (
    <div className="bb" style={{ width: b.sz, height: b.sz, left: `${b.lft}%`, animationDuration: `${b.dV}s`, animationDelay: `${b.dl}s` }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: bg,
        border: "0.5px solid rgba(255,255,255,.40)",
        backdropFilter: `blur(${Math.min(b.sz * 0.08, 4)}px)`,
        WebkitBackdropFilter: `blur(${Math.min(b.sz * 0.08, 4)}px)`,
        filter: `blur(${blr}px)`,
        boxShadow: `inset -2px -2px 5px hsla(${b.h2},60%,80%,.14), inset 2px 2px 4px rgba(255,255,255,.54)`,
        animation: `${kfName} ${b.dH}s ease-in-out ${b.dl}s infinite`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "16%", left: "18%",
          width: `${b.sz * 0.22}px`, height: `${b.sz * 0.13}px`,
          borderRadius: "50%",
          background: "rgba(255,255,255,.82)",
          filter: "blur(1px)", transform: "rotate(-32deg)",
        }} />
      </div>
    </div>
  );
}

/* ── Bubble layer with auto-generated drift keyframes ── */
function BubbleLayer({ bubbles, isFixed = false }) {
  const kfRef = useRef(null);
  useEffect(() => {
    const kf = bubbles.map((b, i) => {
      const amp = b.amp, spd = 0.8 + (b.id * PHI % 1.4);
      const steps = Array.from({ length: 9 }, (_, k) => {
        const tx = (Math.sin((k / 8) * Math.PI * 2 * spd) * amp).toFixed(1);
        return `${Math.round(k * 12.5)}%{transform:translateX(${tx}px)}`;
      }).join(" ");
      return `@keyframes bX${b.id}{${steps}}`;
    }).join("\n");
    const el = document.createElement("style");
    el.textContent = kf;
    document.head.appendChild(el);
    kfRef.current = el;
    return () => { if (kfRef.current) document.head.removeChild(kfRef.current); };
  }, []);

  return (
    <div style={{ position: isFixed ? "fixed" : "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {bubbles.map((b) => <Bubble key={b.id} b={b} kfName={`bX${b.id}`} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function App() {
  const [tab,   setTab]   = useState("drinks");
  const [dtab,  setDtab]  = useState("lait");
  const [tops,  setTops]  = useState([]);
  const [solid, setSolid] = useState(false);
  const [mob,   setMob]   = useState(false);

  const allTops   = [...TOPS_STD, ...TOPS_PREM];
  const topsTotal = tops.reduce((a, n) => a + (allTops.find(t => t.n === n)?.p || 0), 0);
  const marq      = [...REVIEWS, ...REVIEWS, ...REVIEWS];

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.06 }
    );
    const t = setTimeout(() => document.querySelectorAll(".sr,.sg").forEach(el => io.observe(el)), 260);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [tab, dtab]);

  const toggleTop = (n) => setTops(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);

  /* ──────────────────────────────── */
  return (
    <div style={{ background: "#FEFCFA", minHeight: "100vh", overflowX: "hidden", color: BR }}>
      <BubbleLayer bubbles={GLOBAL_B} isFixed={true} />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: mob ? "13px 20px" : "14px 56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: solid ? "rgba(254,252,250,.97)" : "rgba(254,252,250,.82)",
        backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
        borderBottom: solid ? "1px solid rgba(60,47,47,.08)" : "1px solid transparent",
        transition: "all .4s ease",
      }}>
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%,rgba(255,230,238,.9),rgba(255,183,197,.6))",
            border: "0.5px solid rgba(255,255,255,.50)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, animation: "hb 2.5s ease-in-out infinite" }}>✦</div>
          <span style={{ ...PF, fontSize: 20, fontWeight: 600, color: BR }}>Magic Tea</span>
        </a>
        {!mob && (
          <div style={{ display: "flex", gap: 28 }}>
            {[["Concept","#concept"],["Menu","#menu"],["Avis","#avis"],["Contact","#contact"]].map(([l,h]) => (
              <a key={l} href={h} className="nl">{l}</a>
            ))}
          </div>
        )}
        <a href="https://www.ubereats.com/ch-fr/store/magic-tea/u4LS1txOVhqnPZNdA4U78w" target="_blank" rel="noopener noreferrer"
          className="btn-r" style={{ padding: mob ? "9px 18px" : "10px 24px", borderRadius: 11, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 7 }}>
          🛵{!mob && " UberEats"}
        </a>
      </nav>

      {/* ══════════════════════════
          1 — HERO
      ══════════════════════════ */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center",
        padding: mob ? "110px 24px 72px" : "110px 0 72px",
        background: "linear-gradient(168deg,#FEFCFA 0%,#FFF0F5 52%,#FEFCFA 100%)",
        position: "relative", overflow: "hidden" }}>
        <BubbleLayer bubbles={HERO_B} isFixed={false} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: mob ? "0" : "0 72px",
          position: "relative", zIndex: 1, width: "100%" }}>

          <div className="ea" style={{ display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,.90)", borderRadius: 11,
            padding: "8px 20px", marginBottom: 28,
            boxShadow: "0 4px 18px rgba(60,47,47,.06)", border: "0.5px solid rgba(255,183,197,.32)" }}>
            <span style={{ color: PNK, fontSize: 14, animation: "hb 2s ease-in-out infinite" }}>♥</span>
            <span style={{ ...INT, fontSize: 13.5, fontWeight: 500, color: "rgba(60,47,47,.62)" }}>Bubble Tea & Sushi · Fribourg</span>
          </div>

          <div className="eb">
            <h1 style={{ ...PF, fontWeight: 600, lineHeight: 1.10,
              fontSize: mob ? "clamp(38px,10vw,52px)" : "clamp(50px,6vw,76px)",
              marginBottom: 22, maxWidth: 700 }}>
              <span style={{ color: BR }}>Magic Tea : </span>
              <em style={{ color: PNK }}>ta pause<br />douceur </em>
              <span style={{ color: BR }}>à Fribourg.</span>
            </h1>
          </div>

          <p className="ec" style={{ ...INT, fontSize: mob ? 15 : 17, color: "rgba(60,47,47,.54)",
            maxWidth: 460, lineHeight: 1.82, marginBottom: 40, fontWeight: 400 }}>
            Des bubble teas frais & fruités, des sushis snackables,
            et une ambiance kawaii toute douce.
            <br />Petits prix, grands sourires.
          </p>

          <div className="ed hbtns" style={{ display: "flex", gap: 14, marginBottom: 44 }}>
            <a href="https://www.ubereats.com/ch-fr/store/magic-tea/u4LS1txOVhqnPZNdA4U78w" target="_blank" rel="noopener noreferrer"
              className="btn-r" style={{ padding: "16px 36px", fontSize: 15, borderRadius: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}>
              Commander sur UberEats &nbsp;→
            </a>
            <a href="#menu" className="btn-w" style={{ padding: "16px 32px", fontSize: 15, borderRadius: 13, textDecoration: "none" }}>
              Voir le menu
            </a>
          </div>

          <div className="ee" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {[PNK, MAT, "#F4C430"].map((c, i) => (
                <div key={i} style={{ width: 25, height: 25, borderRadius: "50%", background: c,
                  border: "2.5px solid #fff", marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i,
                  position: "relative", boxShadow: "0 2px 8px rgba(60,47,47,.12)" }} />
              ))}
            </div>
            <span style={{ ...INT, fontSize: 13.5, color: "rgba(60,47,47,.52)", fontWeight: 500 }}>
              Déjà adoré par la communauté locale · 4.8 <span style={{ color: "#E8C43A" }}>★</span>
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          2 — AVIS DÉFILANTS
      ══════════════════════════ */}
      <section id="avis" style={{ padding: mob ? "60px 0" : "80px 0", background: "#fff", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: mob ? "0 18px" : "0 48px" }}>
          <div className="sr" style={{ textAlign: "center", marginBottom: 36 }}>
            <p className="sl" style={{ marginBottom: 12 }}>Ce qu'ils disent</p>
            <h2 style={{ ...PF, fontSize: "clamp(24px,4vw,40px)", fontWeight: 600, color: BR, marginBottom: 14 }}>
              Ils nous adorent <em style={{ color: PNK }}>♡</em>
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ color: "#E8C43A", fontSize: 20 }}>★★★★★</span>
              <span style={{ ...PF, fontSize: 28, fontWeight: 600, color: BR }}>4.8</span>
              <span style={{ ...INT, fontSize: 13, color: "rgba(60,47,47,.40)" }}>/ 5 · Google</span>
            </div>
          </div>
        </div>
        <div className="mq-o">
          <div className="mq-i">
            {marq.map((r, i) => (
              <div key={i} className="rc">
                <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 2,
                  background: `linear-gradient(90deg,${r.col},transparent)`, borderRadius: "0 0 2px 2px" }} />
                <div style={{ position: "absolute", top: 8, right: 14, fontFamily: "Georgia,serif",
                  fontSize: 66, lineHeight: 1, color: PNK, opacity: .20, userSelect: "none" }}>"</div>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {[0,1,2,3,4].map(k => <Star key={k} d={k * .18} />)}
                </div>
                <p style={{ ...INT, fontSize: 13.5, color: BR, lineHeight: 1.86, marginBottom: 18, fontStyle: "italic", fontWeight: 400 }}>
                  "{r.txt}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: `radial-gradient(circle at 35% 35%,${r.col},rgba(255,255,255,.5))`,
                    border: `1.5px solid ${r.col}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    ...INT, fontSize: 11.5, fontWeight: 700, color: BR }}>{r.av}</div>
                  <div>
                    <div style={{ ...INT, fontSize: 13.5, fontWeight: 600, color: BR }}>{r.n}</div>
                    <div style={{ ...INT, fontSize: 11.5, color: "rgba(60,47,47,.48)", marginTop: 1 }}>{r.tag}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" style={{ height: 10, opacity: .28 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          3 — CONCEPT
      ══════════════════════════ */}
      <section id="concept" style={{ padding: mob ? "68px 18px" : "96px 48px", background: "#FEFCFA", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="sr" style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="sl" style={{ marginBottom: 12 }}>Le Concept</p>
            <h2 style={{ ...PF, fontSize: "clamp(26px,4vw,44px)", fontWeight: 600, color: BR, marginBottom: 10 }}>
              Frais & fruités <span style={{ color: PNK }}>×</span> snacks savoureux
            </h2>
            <p style={{ ...INT, fontSize: 15, color: "rgba(60,47,47,.48)", maxWidth: 500, margin: "0 auto", lineHeight: 1.80 }}>
              Une dualité gourmande pensée pour ta journée : siroter, croquer, sourire.
            </p>
            <div className="divl" />
          </div>

          <div className="cg sr" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Pink — Bubble Tea */}
            <div className="cc" style={{ background: "linear-gradient(148deg,#FFE6EF,#FFD4E0)", padding: "42px 38px 34px", minHeight: 300, boxShadow: "0 8px 34px rgba(255,143,170,.15)" }}>
              {[{sz:150,t:"-30px",r:"-38px"},{sz:70,b:"10px",r:"55px"},{sz:42,t:"44%",r:"12px"}].map((c,i) => (
                <div key={i} style={{ position: "absolute", width: c.sz, height: c.sz, borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%,rgba(255,240,248,.72),rgba(255,183,197,.18))",
                  border: "0.5px solid rgba(255,255,255,.42)",
                  backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)",
                  top: c.t, right: c.r, bottom: c.b,
                  animation: `flt ${5.5 + i * .9}s ease-in-out ${i * .7}s infinite` }} />
              ))}
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ ...INT, fontSize: 11, fontWeight: 600, color: "rgba(139,58,80,.60)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>✦ Bubble Tea</p>
                <h3 style={{ ...PF, fontSize: mob ? 22 : 28, fontWeight: 600, color: BR, marginBottom: 12, lineHeight: 1.2 }}>
                  Frais, fruités, magiques.
                </h3>
                <p style={{ ...INT, fontSize: 13.5, color: "rgba(60,47,47,.60)", lineHeight: 1.72, marginBottom: 6, maxWidth: 268 }}>
                  Thés glacés, milk teas crémeux, perles de tapioca moelleuses, fruits frais et toppings rigolos.
                </p>
                <p style={{ ...INT, fontSize: 13, color: "rgba(60,47,47,.54)", lineHeight: 1.65, marginBottom: 20, maxWidth: 268 }}>
                  Choisis ta base : <strong>Base Fruit</strong>, <strong>Base Lait</strong>… Puis ajoute les toppings de ton choix !
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Base Fruit","Base Lait","Autres"].map(f => (
                    <span key={f} style={{ ...INT, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,.80)", borderRadius: 20, padding: "6px 18px", color: BR, border: "1.5px solid rgba(255,255,255,.95)", letterSpacing: ".3px", boxShadow: "0 2px 8px rgba(60,47,47,.08)" }}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ position: "absolute", bottom: -8, right: 18, fontSize: mob ? 58 : 78, filter: "drop-shadow(0 8px 20px rgba(255,143,170,.28))", animation: "fltB 4.5s ease-in-out infinite" }}>🧋</div>
            </div>

            {/* Green — Sushi */}
            <div className="cc sr d1" style={{ background: "linear-gradient(148deg,#D8EDCC,#C6E2B2)", padding: "42px 38px 34px", minHeight: 300, boxShadow: "0 8px 34px rgba(122,155,94,.14)" }}>
              {[{sz:130,t:"-26px",r:"-34px"},{sz:60,b:"14px",r:"66px"}].map((c,i) => (
                <div key={i} style={{ position: "absolute", width: c.sz, height: c.sz, borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%,rgba(230,248,220,.72),rgba(163,177,138,.18))",
                  border: "0.5px solid rgba(255,255,255,.42)",
                  backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)",
                  top: c.t, right: c.r, bottom: c.b,
                  animation: `flt ${6 + i * 1.2}s ease-in-out ${i * .6}s infinite` }} />
              ))}
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ ...INT, fontSize: 11, fontWeight: 600, color: "rgba(58,88,32,.58)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>✦ Sushi</p>
                <h3 style={{ ...PF, fontSize: mob ? 22 : 28, fontWeight: 600, color: BR, marginBottom: 12, lineHeight: 1.2 }}>
                  Snacks savoureux, sourires garantis.
                </h3>
                <p style={{ ...INT, fontSize: 13.5, color: "rgba(60,47,47,.60)", lineHeight: 1.72, marginBottom: 20, maxWidth: 268 }}>
                  Makis, californias, onigiris : des bouchées à grignoter sur place ou à emporter.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Nigiri","Maki","Uramaki","Raviolis Soupes"].map(f => (
                    <span key={f} style={{ ...INT, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,.80)", borderRadius: 20, padding: "6px 18px", color: BR, border: "1.5px solid rgba(255,255,255,.95)", letterSpacing: ".3px", boxShadow: "0 2px 8px rgba(60,47,47,.08)" }}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ position: "absolute", bottom: -8, right: 18, fontSize: mob ? 58 : 78, filter: "drop-shadow(0 8px 20px rgba(122,155,94,.26))", animation: "fltB 5.5s ease-in-out .5s infinite" }}>🍣</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          4 — CARTE INTERACTIVE
      ══════════════════════════ */}
      <section id="menu" style={{ padding: mob ? "68px 18px" : "96px 48px", background: "#fff", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: 34, alignItems: mob ? "flex-start" : "center", justifyContent: "space-between", marginBottom: 46 }}>
            <div>
              <p className="sl" style={{ marginBottom: 12 }}>La Carte Magic Tea</p>
              <h2 style={{ ...PF, fontSize: "clamp(28px,4vw,48px)", fontWeight: 600, color: BR, lineHeight: 1.12 }}>
                Choisis ton<br /><em style={{ color: PNK }}>univers magique</em>
              </h2>
            </div>
            <p style={{ ...INT, fontSize: 14.5, color: "rgba(60,47,47,.46)", maxWidth: 300, lineHeight: 1.80, fontWeight: 400 }}>
              Le bar à thé d'un côté, la cuisine de l'autre. Survole un thé et regarde la pièce changer de couleur ✨
            </p>
          </div>

          {/* Switch + student badge — UNIQUE */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 46 }}>
            <div className="sw-w">
              <button onClick={() => setTab("drinks")} className={`sw ${tab === "drinks" ? "or" : ""}`}>🧋 Boissons</button>
              <button onClick={() => setTab("food")} className={`sw ${tab === "food" ? "og" : ""}`}>🍱 Food</button>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9,
              background: `linear-gradient(135deg,${MAT},#6D9252)`, color: "#fff",
              padding: "10px 26px", borderRadius: 999,
              ...INT, fontSize: 13.5, fontWeight: 600,
              boxShadow: "0 5px 20px rgba(109,146,82,.30)" }}>
              🎓 <strong>-10% étudiants</strong> · sur présentation de la carte
            </div>
          </div>

          {/* ── DRINKS ── */}
          {tab === "drinks" && (
            <div>
              <div style={{ display: "flex", justifyContent: "center", borderBottom: "1.5px solid rgba(60,47,47,.07)", marginBottom: 32 }}>
                {[{id:"lait",l:"Série Lactée"},{id:"fruit",l:"Thés aux Fruits"},{id:"autres",l:"Autres Boissons"}].map(s => (
                  <button key={s.id} onClick={() => setDtab(s.id)} className={`st ${dtab === s.id ? "on" : ""}`}>{s.l}</button>
                ))}
              </div>

              {(dtab === "lait" || dtab === "fruit") && (
                <div className="sg mg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
                  {DRINKS[dtab].map((d, i) => (
                    <div key={i} className="mi sc">
                      <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        background: dtab === "lait"
                          ? "radial-gradient(circle at 35% 35%,rgba(255,230,238,.9),rgba(255,183,197,.4))"
                          : "radial-gradient(circle at 35% 35%,rgba(220,240,210,.9),rgba(163,177,138,.4))",
                        border: `0.5px solid ${dtab === "lait" ? "rgba(255,183,197,.30)" : "rgba(163,177,138,.30)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                        {dtab === "lait" ? "🧋" : "🍹"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                          <span style={{ ...INT, fontSize: 13.5, fontWeight: 500, color: BR }}>{d.n}</span>
                          {d.tag === "Populaire" && <span className="pp">Populaire</span>}
                          {d.tag === "Premium" && <span style={{ ...INT, fontSize: 9, fontWeight: 600, background: "rgba(244,196,58,.18)", color: "#7A5A00", padding: "1px 8px", borderRadius: 6, border: "1px solid rgba(244,196,58,.30)" }}>Premium</span>}
                          {d.tag === "Spécial" && <span className="ppg">Spécial</span>}
                        </div>
                      </div>
                      <span className={parseFloat(d.p) > 9 ? "pr" : "pg"}>{d.p} CHF</span>
                    </div>
                  ))}
                </div>
              )}

              {dtab === "autres" && (
                <div className="sg dg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10, maxWidth: 680, margin: "0 auto" }}>
                  {DRINKS.autres.map((d, i) => (
                    <div key={i} className="mi sc">
                      <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(255,183,197,.10)", border: "0.5px solid rgba(255,183,197,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{d.e}</div>
                      <span style={{ ...INT, fontSize: 13.5, fontWeight: 500, color: BR, flex: 1 }}>{d.n}</span>
                      <span className="pg">{d.p} CHF</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Toppings */}
              {(dtab === "lait" || dtab === "fruit") && (
                <div className="glm" style={{ padding: mob ? "22px 18px" : "28px 32px", marginTop: 36 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <span style={{ fontSize: 22 }}>🫧</span>
                    <div>
                      <h3 style={{ ...PF, fontSize: 19, fontWeight: 600, color: BR }}>Customise ton Tea</h3>
                      <p style={{ ...INT, fontSize: 12, color: "rgba(60,47,47,.44)", marginTop: 3 }}>Standard 0.50 CHF · Premium 1.00 CHF</p>
                    </div>
                  </div>
                  <p style={{ ...INT, fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(60,47,47,.36)", marginBottom: 10 }}>Standard — 0.50 CHF</p>
                  <div className="tg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(188px,1fr))", gap: 8, marginBottom: 18 }}>
                    {TOPS_STD.map(tp => (
                      <div key={tp.n} onClick={() => toggleTop(tp.n)} className={`tr ${tops.includes(tp.n) ? "on" : ""}`}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          background: tops.includes(tp.n) ? `${tp.col}22` : "rgba(255,255,255,.90)",
                          border: `1.5px solid ${tops.includes(tp.n) ? tp.col : "rgba(60,47,47,.08)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                          transition: "all .22s ease" }}>{tp.e}</div>
                        <span style={{ ...INT, fontSize: 12.5, fontWeight: 500, color: BR, flex: 1 }}>{tp.n}</span>
                        <span className="pg" style={{ fontSize: 10.5 }}>0.50</span>
                        {tops.includes(tp.n) && <span style={{ color: MAT, fontSize: 13, fontWeight: 700 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                  <p style={{ ...INT, fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(60,47,47,.36)", marginBottom: 10 }}>Premium — 1.00 CHF</p>
                  <div className="tg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(188px,1fr))", gap: 8 }}>
                    {TOPS_PREM.map(tp => (
                      <div key={tp.n} onClick={() => toggleTop(tp.n)} className={`tr ${tops.includes(tp.n) ? "on" : ""}`}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          background: tops.includes(tp.n) ? `${tp.col}22` : "rgba(255,255,255,.90)",
                          border: `1.5px solid ${tops.includes(tp.n) ? tp.col : "rgba(60,47,47,.08)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                          transition: "all .22s ease" }}>{tp.e}</div>
                        <span style={{ ...INT, fontSize: 12.5, fontWeight: 500, color: BR, flex: 1 }}>{tp.n}</span>
                        {tp.pop && <span className="pp" style={{ fontSize: 8.5 }}>Pop</span>}
                        <span className="pg" style={{ fontSize: 10.5 }}>1.00</span>
                        {tops.includes(tp.n) && <span style={{ color: MAT, fontSize: 13, fontWeight: 700 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                  {tops.length > 0 && (
                    <div style={{ marginTop: 16, padding: "12px 18px", background: "rgba(255,255,255,.82)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(163,177,138,.22)" }}>
                      <span style={{ ...INT, fontSize: 13.5, fontWeight: 600, color: BR }}>{tops.length} topping{tops.length > 1 ? "s" : ""} sélectionné{tops.length > 1 ? "s" : ""}</span>
                      <span style={{ ...PF, fontSize: 16, fontWeight: 600, color: "#3A5820" }}>+{topsTotal.toFixed(2)} CHF</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── FOOD ── */}
          {tab === "food" && (
            <div>
              {SUSHI_CATS.map((cat, ci) => (
                <div key={ci} style={{ marginBottom: 36 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid rgba(60,47,47,.07)" }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <h3 style={{ ...PF, fontSize: 21, fontWeight: 600, color: BR }}>{cat.title}</h3>
                    <span style={{ ...INT, fontSize: 11.5, color: "rgba(60,47,47,.36)", fontStyle: "italic" }}>{cat.sub}</span>
                  </div>
                  <div className="sg sug" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(208px,1fr))", gap: 9 }}>
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="mi sc">
                        <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(255,183,197,.12)", border: "0.5px solid rgba(255,183,197,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{cat.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ ...INT, fontSize: 13, fontWeight: 500, color: BR }}>{item.n}</span>
                            {item.pop && <span className="pp">Pop</span>}
                            {item.sig && <span className="ppg">Signature</span>}
                          </div>
                        </div>
                        <span className="pg">{item.p}.-</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Hot food */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(60,47,47,.07)" }}>
                  <span style={{ fontSize: 18 }}>🔥</span>
                  <h3 style={{ ...PF, fontSize: 21, fontWeight: 600, color: BR }}>Plats Chauds</h3>
                  <span style={{ ...INT, fontSize: 11.5, color: "rgba(60,47,47,.36)", fontStyle: "italic" }}>préparés à la commande</span>
                </div>
                <div className="sg hg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(265px,1fr))", gap: 16 }}>
                  {HOT.map((item, i) => (
                    <div key={i} className="hc sc">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <span style={{ fontSize: 28, display: "inline-block", animation: `flt ${5 + i * .5}s ease-in-out ${i * .7}s infinite` }}>{item.e}</span>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <span style={{ ...INT, fontSize: 9.5, fontWeight: 600, background: "rgba(255,183,197,.15)", color: "#8B3A50", padding: "2px 10px", borderRadius: 6, border: "1px solid rgba(255,183,197,.26)" }}>{item.tag}</span>
                          {item.sig && <span className="ppg">Signature</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
                        <h4 style={{ ...PF, fontSize: 14.5, fontWeight: 600, color: BR, lineHeight: 1.28 }}>{item.n}</h4>
                        <span className="pg">{item.p} CHF</span>
                      </div>
                      <p style={{ ...INT, fontSize: 13, color: "rgba(60,47,47,.54)", lineHeight: 1.68, marginBottom: item.note ? 10 : 0 }}>{item.d}</p>
                      {item.note && (
                        <div style={{ background: "rgba(255,249,220,.85)", borderRadius: 9, padding: "9px 13px", border: "1px solid rgba(200,168,78,.18)" }}>
                          <span style={{ ...INT, fontSize: 11.5, color: "#7A5218", fontStyle: "italic" }}>{item.note}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════
          5 — NOUS TROUVER (MAPS)
      ══════════════════════════ */}
      <section id="contact" style={{ padding: mob ? "68px 18px" : "96px 48px", background: "linear-gradient(160deg,#FFF8FA,#FEFCFA)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="sr" style={{ textAlign: "center", marginBottom: 50 }}>
            <p className="sl" style={{ marginBottom: 12 }}>Nous trouver</p>
            <h2 style={{ ...PF, fontSize: "clamp(26px,4vw,44px)", fontWeight: 600, color: BR, marginBottom: 8 }}>
              Venez nous rendre visite <em style={{ color: PNK }}>♡</em>
            </h2>
            <div className="divl" />
          </div>

          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34, alignItems: "start" }}>
            {/* Left info */}
            <div className="sr" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Address */}
              <div style={{ background: "linear-gradient(142deg,#FFE6EF,#FFD8E4)", borderRadius: 20, padding: "26px 28px", position: "relative", overflow: "hidden", boxShadow: "0 6px 26px rgba(255,143,170,.14)" }}>
                <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%,rgba(255,230,238,.70),rgba(255,183,197,.28))",
                  border: "0.5px solid rgba(255,255,255,.40)",
                  backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
                  bottom: "-26px", right: "-26px", animation: "flt 5s ease-in-out infinite" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{ ...PF, fontSize: 25, fontWeight: 600, color: BR, marginBottom: 4 }}>Bd de Pérolles 79</h3>
                  <p style={{ ...PF, fontSize: 20, fontWeight: 400, color: "rgba(60,47,47,.64)", marginBottom: 20, fontStyle: "italic" }}>1700 Fribourg</p>
                  <a href="https://maps.app.goo.gl/XZWP8sUbfVLX1tDe6"
                    target="_blank" rel="noopener noreferrer"
                    className="btn-d" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "12px 26px", fontSize: 14, borderRadius: 11, textDecoration: "none" }}>
                    Itinéraire &nbsp;↗
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div style={{ background: "rgba(255,255,255,.92)", borderRadius: 18, padding: "22px 20px", border: "1px solid rgba(60,47,47,.08)", boxShadow: "0 3px 16px rgba(60,47,47,.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(163,177,138,.12)", border: "1px solid rgba(163,177,138,.20)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🕐</div>
                  <h4 style={{ ...INT, fontSize: 9.5, fontWeight: 600, color: "rgba(60,47,47,.36)", letterSpacing: "2.5px", textTransform: "uppercase" }}>Horaires</h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {HOURS.map((h, i) => {
                    const isTd = h.d === todayStr;
                    return (
                      <div key={i} className={`hr${isTd ? " td" : ""}`}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ ...INT, fontSize: 13.5, fontWeight: isTd ? 600 : 500, color: isTd ? BR : "rgba(60,47,47,.52)" }}>{h.d}</span>
                          {isTd && <span style={{ ...INT, fontSize: 9, fontWeight: 600, background: PNK, color: "#fff", padding: "1px 9px", borderRadius: 6 }}>aujourd'hui</span>}
                        </div>
                        <span style={{ ...INT, fontSize: 13, fontWeight: isTd ? 600 : 500, color: isTd ? "#3A5820" : "rgba(60,47,47,.46)" }}>{h.o} – {h.c}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 13, paddingTop: 11, borderTop: "1px solid rgba(60,47,47,.07)" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: MAT, boxShadow: "0 0 0 3px rgba(163,177,138,.20)" }} />
                  <span style={{ ...INT, fontSize: 12, color: "#3A5820", fontWeight: 600 }}>Ouvert dès 11h00</span>
                </div>
              </div>

              <a href="tel:0765498668" className="btn-d" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 17, borderRadius: 13, textDecoration: "none", fontSize: 15 }}>
                📞 &nbsp;076 549 86 68
              </a>
              <a href="https://www.ubereats.com/ch-fr/store/magic-tea/u4LS1txOVhqnPZNdA4U78w" target="_blank" rel="noopener noreferrer"
                className="btn-r" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 16, borderRadius: 13, textDecoration: "none", fontSize: 14.5, fontWeight: 600 }}>
                🛵 Commander sur UberEats
              </a>
            </div>

            {/* Google Maps — Real embed */}
            <div className="sr d2">
              <div className="mapf" style={{ height: 540 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2723.6335!2d7.1538673!3d46.7951257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e69c5c10ec7a7%3A0x11118f24b26aa66!2sMagic%20Tea%20-%20Bubble%20Tea%20%26%20Sushi!5e0!3m2!1sfr!2sch!4v1748000000000!5m2!1sfr!2sch"
                  width="100%" height="100%"
                  style={{ border: 0, display: "block", borderRadius: 18 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Magic Tea — Bd de Pérolles 79, 1700 Fribourg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          CTA — BANNIÈRE ROSE
      ══════════════════════════ */}
      <section style={{ padding: mob ? "76px 24px" : "100px 48px", background: "linear-gradient(148deg,#FFB7C5 0%,#FF9BAF 55%,#FFB7C5 100%)", position: "relative", overflow: "hidden", textAlign: "center", zIndex: 1 }}>
        {/* Soap bubbles decoration */}
        {[{sz:200,t:"8%",l:"3%"},{sz:100,t:"60%",l:"2%"},{sz:56,t:"20%",l:"13%"},{sz:170,t:"6%",r:"6%"},{sz:84,t:"58%",r:"3%"},{sz:44,t:"34%",r:"15%"},{sz:58,b:"10%",l:"36%"},{sz:76,t:"13%",l:"45%"}].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: c.sz, height: c.sz, borderRadius: "50%",
            background: "radial-gradient(circle at 32% 28%,rgba(255,255,255,.62) 0%,transparent 44%),radial-gradient(ellipse,rgba(255,255,255,.16) 0%,rgba(255,210,226,.18) 100%)",
            border: "0.5px solid rgba(255,255,255,.40)",
            backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
            top: c.t, left: c.l, right: c.r, bottom: c.b, pointerEvents: "none",
            animation: `flt ${5.2 + i * .9}s ease-in-out ${i * .55}s infinite`,
          }} />
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ ...PF, fontSize: "clamp(30px,5.5vw,56px)", fontWeight: 600, color: "#fff", lineHeight: 1.14, marginBottom: 16 }}>
            Envie d'une bulle de bonheur ?
          </h2>
          <p style={{ ...INT, fontSize: mob ? 16 : 18, color: "rgba(255,255,255,.80)", marginBottom: 44, fontWeight: 400, lineHeight: 1.68 }}>
            Appelle-nous, on prépare ta commande avec amour.
          </p>
          <a href="tel:0765498668" style={{
            display: "inline-flex", alignItems: "center", gap: 15,
            background: "#fff", color: "#8B3A50",
            padding: mob ? "18px 30px" : "21px 54px",
            borderRadius: 14, ...INT, fontSize: mob ? 18 : 22, fontWeight: 700,
            textDecoration: "none", boxShadow: "0 8px 36px rgba(60,47,47,.16)",
            transition: "transform .28s ease, box-shadow .28s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 54px rgba(60,47,47,.20)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 36px rgba(60,47,47,.16)"; }}>
            📞 &nbsp;076 549 86 68
          </a>
        </div>
      </section>

      {/* ══════════════════════════
          FOOTER
      ══════════════════════════ */}
      <footer style={{ background: "#1E1515", color: "rgba(255,255,255,.40)", padding: mob ? "48px 22px 28px" : "62px 56px 36px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg,transparent,rgba(255,183,197,.44),rgba(163,177,138,.26),transparent)", marginBottom: 42 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,rgba(255,230,238,.9),rgba(255,183,197,.6))", border: "0.5px solid rgba(255,183,197,.40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✦</div>
          <span style={{ ...PF, fontSize: mob ? 32 : 42, fontWeight: 600, color: "rgba(255,255,255,.90)" }}>Magic Tea</span>
        </div>
        <p style={{ ...INT, fontSize: 10, letterSpacing: "6px", textTransform: "uppercase", color: "rgba(255,255,255,.20)", marginBottom: 28 }}>
          Bubble Tea & Sushi · Bd de Pérolles 79 · 1700 Fribourg
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", marginBottom: 22 }}>
          {[["Concept","#concept"],["Menu","#menu"],["Avis","#avis"],["Contact","#contact"]].map(([l,h]) => (
            <a key={l} href={h} className="fl">{l}</a>
          ))}
        </div>
        {/* Instagram + UberEats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 30 }}>
          <a href="https://www.instagram.com/magicteafribourg" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,183,197,.12)", color: PNK, border: "1px solid rgba(255,183,197,.24)", padding: "9px 20px", borderRadius: 11, textDecoration: "none", ...INT, fontSize: 13, fontWeight: 500, transition: "background .22s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,183,197,.24)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,183,197,.12)"; }}>
            📸 Instagram
          </a>
          <a href="https://www.ubereats.com/ch-fr/store/magic-tea/u4LS1txOVhqnPZNdA4U78w" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(163,177,138,.12)", color: MAT, border: "1px solid rgba(163,177,138,.24)", padding: "9px 20px", borderRadius: 11, textDecoration: "none", ...INT, fontSize: 13, fontWeight: 500, transition: "background .22s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(163,177,138,.24)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(163,177,138,.12)"; }}>
            🛵 UberEats
          </a>
        </div>
        <div style={{ width: 24, height: 1, background: "rgba(255,255,255,.08)", margin: "0 auto 18px" }} />
        <p style={{ ...INT, fontSize: 10.5, color: "rgba(255,255,255,.14)" }}>© 2025 Magic Tea · Bd de Pérolles 79, 1700 Fribourg, Suisse</p>
        <p style={{ ...INT, fontSize: 10, color: "rgba(255,255,255,.08)", marginTop: 6 }}>Fait avec <span style={{ color: PNK }}>♡</span> & 🌿 à Fribourg</p>
      </footer>
    </div>
  );
}

