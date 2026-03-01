import { useState, useEffect, useRef, useCallback } from "react";

// ─── LOGO (base64 embedded) ────────────────────────────────────────────────
const LOGO = "logo.png"
// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');

:root {
  --bg:     #020308;
  --bg2:    #080d16;
  --bg3:    #0d1525;
  --blue:   #4da6ff;
  --blue2:  #1a78d4;
  --bluedim:#1a3a5c;
  --cyan:   #00d4ff;
  --green:  #00ff88;
  --red:    #ff2244;
  --yellow: #ffd700;
  --orange: #ff6b35;
  --purple: #b24bf3;
  --white:  #eaf2ff;
  --dim:    rgba(234,242,255,0.55);
  --dimmer: rgba(234,242,255,0.28);
  --line:   rgba(77,166,255,0.13);
  --line2:  rgba(77,166,255,0.22);
  --mono:   'Share Tech Mono', monospace;
  --body:   'Rajdhani', sans-serif;
  --hero:   'Bebas Neue', cursive;
}

/* ── LIGHT MODE OVERRIDES ── */
body.light-mode {
  --bg:     #f0f4ff;
  --bg2:    #e4ecfa;
  --bg3:    #d8e5f7;
  --blue:   #1a6ed4;
  --blue2:  #1255b0;
  --bluedim:#a8c8f8;
  --cyan:   #0099cc;
  --green:  #00994d;
  --red:    #cc1133;
  --yellow: #b8900a;
  --orange: #d44a10;
  --purple: #7a1fc9;
  --white:  #0d1a2e;
  --dim:    rgba(10,30,60,0.68);
  --dimmer: rgba(10,30,60,0.42);
  --line:   rgba(30,100,200,0.16);
  --line2:  rgba(30,100,200,0.28);
}

body.light-mode::after {
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.012) 2px, rgba(0,0,0,0.012) 4px
  );
}

body.light-mode .nav {
  background: rgba(232,240,255,.92);
}

body.light-mode .sql-gate {
  background: var(--bg);
}

body.light-mode .f-input,
body.light-mode .f-area {
  color: var(--white);
}

body.light-mode .f-input::placeholder,
body.light-mode .f-area::placeholder {
  color: var(--dimmer);
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--white);
  font-family: var(--body);
  overflow-x: hidden;
  cursor: none;
  transition: background .35s ease, color .35s ease;
}

/* scanlines overlay */
body::after {
  content:'';
  position:fixed; inset:0; z-index:9990;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.035) 2px, rgba(0,0,0,0.035) 4px
  );
  pointer-events:none;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--bluedim); border-radius:2px; }
::-webkit-scrollbar-thumb:hover { background: var(--blue2); }

/* ── CURSOR ── */
.cur-dot {
  position:fixed; z-index:9999; pointer-events:none;
  width:8px; height:8px; border-radius:50%;
  background: var(--blue);
  transform: translate(-50%,-50%);
  transition: width .15s, height .15s, background .2s;
  mix-blend-mode: screen;
}
.cur-ring {
  position:fixed; z-index:9998; pointer-events:none;
  width:28px; height:28px; border-radius:50%;
  border: 1px solid rgba(77,166,255,.45);
  transform: translate(-50%,-50%);
  transition: transform .12s ease-out, width .2s, height .2s, border-color .2s, opacity .2s;
}
.cur-ring.hovered { width:40px; height:40px; border-color: var(--blue); opacity:.7; }

/* ── STARS ── */
.stars {
  position:fixed; inset:0; z-index:0; pointer-events:none;
  overflow:hidden;
}
.star {
  position:absolute; border-radius:50%;
  background: white;
  animation: starTwinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
}
body.light-mode .star { background: #1a55a8; opacity:.18; }
@keyframes starTwinkle {
  0%,100% { opacity: var(--lo,.1); transform:scale(1); }
  50%      { opacity: var(--hi,.6); transform:scale(1.4); }
}

/* ── NAV ── */
.nav {
  position:fixed; top:0; left:0; right:0; z-index:500;
  height:60px;
  display:flex; align-items:center; justify-content:space-between;
  padding: 0 48px;
  background: rgba(2,3,8,.88);
  backdrop-filter: blur(18px) saturate(1.4);
  border-bottom: 1px solid var(--line);
  animation: navSlide .7s ease both;
  transition: background .35s ease, border-color .35s ease;
}
@keyframes navSlide { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }

.nav-brand {
  display:flex; align-items:center; gap:10px;
  text-decoration:none; cursor:none;
}
.nav-brand img {
  width:30px; height:30px; object-fit:contain;
  filter: drop-shadow(0 0 8px rgba(77,166,255,.55));
  animation: logoPulse 4s ease-in-out infinite;
}
@keyframes logoPulse {
  0%,100% { filter: drop-shadow(0 0 8px rgba(77,166,255,.55)); }
  50%      { filter: drop-shadow(0 0 16px rgba(77,166,255,.9)); }
}
.nav-name {
  font-family: var(--mono);
  font-size:.92rem; letter-spacing:2px;
  color: var(--blue);
}

.nav-links { display:flex; align-items:center; gap:28px; }
.nav-link {
  font-family: var(--mono);
  font-size:.6rem; letter-spacing:2.5px; text-transform:uppercase;
  color: var(--dimmer); text-decoration:none; cursor:none;
  transition: color .2s;
  position:relative;
}
.nav-link::after {
  content:''; position:absolute; bottom:-6px; left:0;
  width:0; height:1px; background: var(--blue);
  transition: width .25s;
}
.nav-link:hover { color: var(--blue); }
.nav-link:hover::after { width:100%; }

/* ── THEME TOGGLE ── */
.theme-toggle {
  display:flex; align-items:center; justify-content:center;
  width:38px; height:22px; border-radius:11px;
  border: 1px solid var(--line2);
  background: var(--bg3);
  cursor: pointer;
  position: relative;
  transition: background .3s, border-color .3s, box-shadow .3s;
  flex-shrink: 0;
  outline: none;
}
.theme-toggle:hover {
  border-color: var(--blue);
  box-shadow: 0 0 12px rgba(77,166,255,.25);
}
.theme-toggle-knob {
  position: absolute;
  left: 3px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--blue);
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), background .3s;
  display: flex; align-items:center; justify-content:center;
  font-size: .7rem;
  line-height:1;
}
body.light-mode .theme-toggle-knob {
  transform: translateX(16px);
}
.theme-toggle-label {
  font-family: var(--mono);
  font-size: .58rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--dimmer);
  white-space: nowrap;
  cursor: pointer;
  transition: color .2s;
  user-select: none;
}
.theme-toggle-label:hover { color: var(--blue); }
.theme-toggle-wrap {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer;
}

/* ── HERO ── */
.hero {
  position:relative; z-index:1;
  min-height:100vh;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  padding:80px 24px 100px; text-align:center;
  overflow:hidden;
}

.hero-grid {
  position:absolute; inset:0; pointer-events:none;
  background-image:
    linear-gradient(rgba(77,166,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(77,166,255,.035) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%);
}
.hero-glow {
  position:absolute; z-index:0; pointer-events:none;
  top:5%; left:50%; transform:translateX(-50%);
  width:700px; height:500px;
  background: radial-gradient(ellipse, rgba(77,166,255,.07) 0%, transparent 65%);
}

.hero-inner {
  position:relative; z-index:2;
  display:flex; flex-direction:column; align-items:center;
  max-width:860px;
}

.hero-badge {
  display:inline-flex; align-items:center; gap:8px;
  font-family: var(--mono); font-size:.6rem;
  letter-spacing:3px; text-transform:uppercase;
  color: var(--blue);
  padding:5px 16px;
  border:1px solid rgba(77,166,255,.28);
  border-radius:2px;
  background: rgba(77,166,255,.06);
  margin-bottom:32px;
  animation: fadeUp .8s .1s ease both;
}
.badge-blink {
  width:6px; height:6px; border-radius:50%;
  background: var(--green);
  animation: blink 1.4s step-end infinite;
}
@keyframes blink { 50%{opacity:0} }

.hero-logo {
  width:90px; height:90px; object-fit:contain;
  margin-bottom:28px;
  filter: drop-shadow(0 0 24px rgba(77,166,255,.7));
  animation: fadeUp .8s .15s ease both, logoHover 5s ease-in-out infinite;
}
@keyframes logoHover {
  0%,100% { transform:translateY(0) rotate(0deg); }
  50%      { transform:translateY(-10px) rotate(1deg); }
}

.hero-title {
  font-family: var(--hero);
  font-size: clamp(4rem, 11vw, 9rem);
  line-height:.88;
  letter-spacing:4px;
  color: var(--white);
  text-shadow: 0 0 60px rgba(77,166,255,.15);
  animation: fadeUp .8s .2s ease both;
}
.hero-title .accent { color: var(--blue); text-shadow: 0 0 30px rgba(77,166,255,.5); }
.hero-title .dot    { color: var(--blue); opacity:.7; }

.hero-sub {
  font-family: var(--mono);
  font-size:1rem; letter-spacing:4px;
  color: var(--dimmer); text-transform:uppercase;
  margin-top:10px; margin-bottom:28px;
  animation: fadeUp .8s .27s ease both;
}

.hero-typewriter {
  font-family: var(--mono);
  font-size: clamp(.85rem, 2vw, 1.1rem);
  color: var(--dim); letter-spacing:2px;
  min-height:1.7em;
  animation: fadeUp .8s .34s ease both;
}
.tw-cursor { color: var(--blue); animation: blink .7s step-end infinite; }

.hero-cta {
  display:flex; gap:14px; flex-wrap:wrap; justify-content:center;
  margin-top:40px;
  animation: fadeUp .8s .45s ease both;
}

.btn {
  font-family: var(--mono); font-size:.67rem;
  letter-spacing:2.5px; text-transform:uppercase;
  padding:12px 26px; border-radius:2px;
  text-decoration:none; cursor:none;
  display:inline-flex; align-items:center; gap:8px;
  transition: all .25s;
  position:relative; overflow:hidden;
}
.btn::before {
  content:''; position:absolute; inset:0;
  background: currentColor; opacity:0;
  transition: opacity .25s;
}
.btn:hover::before { opacity:.08; }
.btn:hover { transform: translateY(-2px); }
.btn-solid {
  background: var(--blue2); color:#000;
  border:1px solid var(--blue);
  box-shadow: 0 0 20px rgba(77,166,255,.18);
  font-weight:700;
}
.btn-solid:hover {
  background: var(--blue); color:#000;
  box-shadow: 0 0 32px rgba(77,166,255,.4);
}
.btn-ghost {
  background:transparent; color: var(--blue);
  border:1px solid rgba(77,166,255,.35);
}
.btn-ghost:hover { border-color: var(--blue); }

.hero-scroll {
  position:absolute; bottom:32px; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:6px;
  animation: fadeUp .8s .6s ease both;
}
.hero-scroll-txt {
  font-family: var(--mono); font-size:.67rem;
  letter-spacing:3px; color: var(--dimmer); text-transform:uppercase;
}
.hero-scroll-line {
  width:1px; height:36px;
  background: linear-gradient(to bottom, var(--blue), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.1)} }

@keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

/* ── SECTION WRAPPER ── */
.section-wrap {
  position:relative; z-index:1;
  max-width:1200px; margin:0 auto;
  padding: 96px 40px;
}

.s-header {
  display:flex; align-items:center; gap:18px;
  margin-bottom:56px;
}
.s-line { flex:1; height:1px; background: var(--line); }
.s-tag {
  font-family: var(--mono); font-size:.73rem;
  letter-spacing:3px; text-transform:uppercase;
  padding:5px 14px;
  border:1px solid currentColor;
  border-radius:2px; opacity:.65;
  white-space:nowrap;
}

.s-title {
  font-family: var(--hero);
  font-size: clamp(2.2rem, 5vw, 4rem);
  letter-spacing:2px; line-height:1;
  margin-bottom:12px;
}
.s-title .hl { color: var(--blue); }

.s-desc {
  font-size:1rem; color: var(--dim); line-height:1.85;
  max-width:640px; margin-bottom:48px;
}

/* ── DIVIDER ── */
.hr {
  max-width:1200px; margin:0 auto;
  height:1px;
  background: linear-gradient(to right, transparent, var(--line), transparent);
}

/* ── ABOUT ── */
.about-grid {
  display:grid; grid-template-columns:1fr 1fr;
  gap:64px; align-items:start;
}
.about-body p {
  font-size:1rem; color: var(--dim); line-height:1.9;
  margin-bottom:18px; font-weight:400;
  text-align: justify;
  hyphens: auto;
}
.about-body strong { color: var(--white); font-weight:600; }
.about-body .code-inline {
  font-family: var(--mono); font-size:.85em;
  color: var(--blue); background: rgba(77,166,255,.08);
  padding:1px 7px; border-radius:3px;
  border: 1px solid rgba(77,166,255,.2);
}

.about-right {}

.kpi-grid {
  display:grid; grid-template-columns:1fr 1fr; gap:12px;
  margin-bottom:24px;
}
.kpi {
  background: var(--bg2);
  border:1px solid var(--line);
  border-radius:6px; padding:18px 16px;
  position:relative; overflow:hidden;
  transition: border-color .2s, box-shadow .2s;
}
.kpi::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background: currentColor; opacity:.5;
}
.kpi:hover {
  border-color: var(--line2);
  box-shadow: 0 4px 24px rgba(0,0,0,.5);
}
.kpi-val {
  font-family: var(--hero);
  font-size:2.5rem; line-height:1; margin-bottom:4px;
}
.kpi-lbl {
  font-family: var(--mono); font-size:.61rem;
  letter-spacing:2px; text-transform:uppercase; color: var(--dimmer);
}

.avail-badge {
  display:flex; align-items:center; gap:10px;
  padding:12px 16px;
  border:1px solid rgba(0,255,136,.25);
  border-radius:4px; background: rgba(0,255,136,.05);
}
.avail-pulse {
  width:8px; height:8px; border-radius:50%;
  background: var(--green);
  box-shadow: 0 0 0 0 rgba(0,255,136,.6);
  animation: ripple 2s ease-out infinite;
}
@keyframes ripple {
  0%  { box-shadow: 0 0 0 0 rgba(0,255,136,.6); }
  70% { box-shadow: 0 0 0 10px rgba(0,255,136,0); }
  100%{ box-shadow: 0 0 0 0 rgba(0,255,136,0); }
}
.avail-text { font-family: var(--mono); font-size:.70rem; letter-spacing:1px; color: var(--green); }

/* ── TECH ── */
.tech-col { display:flex; flex-direction:column; gap:36px; }
.tech-group-lbl {
  font-family: var(--mono); font-size:.67rem;
  letter-spacing:3px; text-transform:uppercase; color: var(--dimmer);
  margin-bottom:12px;
}
/* ── TECH CATEGORIES ── */
.tech-grid {
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:20px;
}
.tech-cat {
  background: var(--bg2);
  border:1px solid var(--line);
  border-radius:10px;
  padding:24px 20px;
  transition: border-color .25s, box-shadow .25s;
}
.tech-cat:hover {
  box-shadow: 0 8px 36px rgba(0,0,0,.5);
}
.tech-cat-header {
  display:flex; align-items:center; gap:10px;
  margin-bottom:18px;
  padding-bottom:12px;
  border-bottom:1px solid var(--line);
}
.tech-cat-icon { font-size:1.45rem; line-height:1; }
.tech-cat-name {
  font-family: var(--hero);
  font-size:1.1rem; letter-spacing:2px;
}
.tech-tags {
  display:flex; flex-wrap:wrap; gap:8px;
}
.tech-tag {
  font-family: var(--mono); font-size:.73rem;
  letter-spacing:.5px; padding:5px 11px;
  border-radius:3px;
  border:1px solid currentColor;
  opacity:.65;
  transition: opacity .18s, transform .18s;
  cursor:default;
}
.tech-tag:hover { opacity:1; transform:translateY(-1px); }

@media(max-width:900px) {
  .tech-grid { grid-template-columns:1fr; }
}

/* ── PROJECTS - 3 large cards ── */
.projects-list {
  display:flex; flex-direction:column; gap:24px;
}
.social-links { display:flex; flex-direction:column; gap:12px; }
.social-row {
  display:flex; align-items:center; gap:14px;
  padding:12px 16px;
  background: var(--bg2);
  border:1px solid var(--line);
  border-radius:6px;
  text-decoration:none; cursor:pointer;
  transition: all .22s;
  color: inherit;
}
.social-row:hover {
  border-color: currentColor;
  transform: translateX(4px);
  box-shadow: -4px 0 20px rgba(0,0,0,.4);
}
.social-logo {
  width:22px; height:22px;
  object-fit:contain;
  flex-shrink:0;
  filter: brightness(0) invert(1);
}
.social-info { display:flex; flex-direction:column; gap:2px; }
.social-platform {
  font-family: var(--mono); font-size:.73rem;
  letter-spacing:2px; text-transform:uppercase;
  opacity:.5;
}
.social-handle {
  font-family: var(--mono); font-size:.92rem;
  letter-spacing:.5px;
}

/* ── CONTACT INFO CARD ── */
.contact-info-card {
  background: var(--bg2);
  border:1px solid var(--line);
  border-radius:10px;
  padding:28px 24px;
  display:flex; flex-direction:column; gap:20px;
}
.contact-info-row {
  display:flex; align-items:flex-start; gap:14px;
}
.contact-info-icon {
  font-size:1.35rem; flex-shrink:0;
  width:40px; height:40px;
  display:flex; align-items:center; justify-content:center;
  border-radius:6px;
  border:1px solid var(--line);
  background: var(--bg3);
}
.contact-info-body {}
.contact-info-lbl {
  font-family: var(--mono); font-size:.70rem;
  letter-spacing:2px; text-transform:uppercase;
  color: var(--dimmer); margin-bottom:3px;
}
.contact-info-val {
  font-family: var(--mono); font-size:.92rem;
  color: var(--blue);
}
.contact-info-val a {
  color: inherit; text-decoration:none;
}
.contact-info-val a:hover { text-decoration:underline; }

.chips { display:flex; flex-wrap:wrap; gap:9px; }
.chip {
  font-family: var(--mono); font-size:.73rem;
  padding:7px 13px; border-radius:3px;
  border:1px solid var(--line);
  background: var(--bg2); color: var(--dim);
  display:flex; align-items:center; gap:7px;
  transition: all .2s; cursor:default;
}
.chip:hover {
  border-color: currentColor; color: var(--white);
  background: rgba(77,166,255,.05);
  transform:translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,.45);
}
.chip-dot { width:5px; height:5px; border-radius:50%; background:currentColor; flex-shrink:0; }

/* ── PROJECTS ── */
.projects-grid {
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap:18px;
}
.proj {
  background: var(--bg2);
  border:1px solid var(--line);
  border-radius:8px; padding:26px 24px;
  text-decoration:none; color:inherit;
  cursor:none; display:block;
  position:relative; overflow:hidden;
  transition: transform .3s, border-color .3s, box-shadow .3s;
}
.proj-stripe {
  position:absolute; top:0; left:0; right:0; height:3px;
  background: currentColor; opacity:0;
  transition: opacity .3s;
}
.proj:hover { transform:translateY(-5px); }
.proj:hover .proj-stripe { opacity:1; }
.proj:hover { box-shadow: 0 16px 48px rgba(0,0,0,.7), 0 0 36px rgba(77,166,255,.04); }
.proj:hover .proj-bg-icon { opacity:.11 !important; filter: blur(12px) !important; }

.proj-icon { font-size:2rem; display:block; margin-bottom:12px; }
.proj-name {
  font-family: var(--mono); font-size:1rem;
  letter-spacing:1.5px; text-transform:uppercase;
  color: var(--white); margin-bottom:10px;
}
.proj-desc { font-size:.92rem; color: var(--dim); line-height:1.75; margin-bottom:14px; }
.proj-tags { display:flex; flex-wrap:wrap; gap:6px; }
.proj-tag {
  font-family: var(--mono); font-size:.61rem;
  letter-spacing:1px; padding:2px 8px;
  border:1px solid; border-radius:2px; opacity:.7;
}
.proj-arrow {
  display:inline-flex; align-items:center; gap:6px;
  margin-top:14px; font-family: var(--mono); font-size:.6rem;
  letter-spacing:1.5px; text-transform:uppercase;
  color: var(--blue); transition: gap .2s;
}
.proj:hover .proj-arrow { gap:10px; }

/* ── CAREER ── */
.timeline { position:relative; }
.timeline-spine {
  position:absolute; left:20px; top:0; bottom:0; width:1px;
  background: linear-gradient(to bottom, var(--blue), transparent);
  z-index:0;
}
.tl-item {
  position:relative; z-index:1;
  display:flex; gap:32px; padding-bottom:44px;
}
.tl-item:last-child { padding-bottom:0; }
.tl-dot {
  flex-shrink:0; width:40px; height:40px; border-radius:50%;
  border:1px solid currentColor;
  background: var(--bg);
  display:flex; align-items:center; justify-content:center;
  font-size:1.15rem;
}
.tl-body {
  flex:1;
  background: var(--bg2); border:1px solid var(--line);
  border-radius:6px; padding:20px 22px;
  transition: border-color .2s;
}
.tl-body:hover { border-color: var(--line2); }
.tl-period {
  font-family: var(--mono); font-size:.61rem;
  letter-spacing:2px; text-transform:uppercase; color: var(--dimmer);
  margin-bottom:4px;
}
.tl-role {
  font-family: var(--hero); font-size:1.45rem; letter-spacing:1px;
  margin-bottom:2px; color: var(--white);
}
.tl-company { font-family: var(--mono); font-size:.92rem; margin-bottom:10px; }
.tl-desc { font-size:.98rem; color: var(--dim); line-height:1.8; }
.tl-techs { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
.tl-tech {
  font-family: var(--mono); font-size:.70rem; letter-spacing:1px;
  padding:2px 8px; border-radius:2px;
  background: rgba(77,166,255,.08);
  border:1px solid rgba(77,166,255,.2);
  color: var(--blue);
}

/* ── FUN ── */
.fun-grid {
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap:14px;
}
.fun-card {
  background: var(--bg2);
  border:1px solid var(--line);
  border-radius:8px; padding:22px 18px;
  text-align:center; cursor:default;
  transition: transform .25s, border-color .25s, box-shadow .25s;
}
.fun-card:hover {
  transform:translateY(-3px);
  border-color: currentColor;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
}
.fun-icon { font-size:2rem; margin-bottom:10px; display:block; }
.fun-name {
  font-family: var(--mono); font-size:.70rem;
  letter-spacing:1.5px; text-transform:uppercase;
  margin-bottom:8px;
}
.fun-body { font-size:.92rem; color: var(--dim); line-height:1.7; }

/* ── CONTACT ── */
.contact-wrap {
  display:grid; grid-template-columns:1fr 1fr;
  gap:56px; align-items:start;
}
.contact-intro p {
  font-size:.98rem; color: var(--dim); line-height:1.85;
  margin-bottom:20px;
}
.email-badge {
  padding:14px 18px;
  background: var(--bg2); border:1px solid var(--line);
  border-left:3px solid var(--blue); border-radius:4px;
  margin-bottom:24px;
}
.email-lbl { font-family: var(--mono); font-size:.61rem; letter-spacing:2px; color: var(--dimmer); margin-bottom:4px; }
.email-val { font-family: var(--mono); font-size:1rem; color: var(--blue); }

.socials { display:flex; gap:10px; flex-wrap:wrap; }
.soc {
  width:44px; height:44px; border-radius:6px;
  border:1px solid var(--line); background: var(--bg2);
  display:flex; align-items:center; justify-content:center;
  text-decoration:none; cursor:none; font-size:1.2rem;
  position:relative; transition: all .22s;
}
.soc:hover { transform:translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.5); }
.soc-tip {
  position:absolute; bottom:52px; left:50%; transform:translateX(-50%);
  font-family: var(--mono); font-size:.70rem;
  letter-spacing:1px; text-transform:uppercase;
  padding:3px 8px; border-radius:2px;
  background: var(--bg3); border:1px solid var(--line);
  color: var(--dim); white-space:nowrap;
  opacity:0; pointer-events:none; transition: opacity .18s;
}
.soc:hover .soc-tip { opacity:1; }

.cform { display:flex; flex-direction:column; gap:14px; }
.f-label {
  font-family: var(--mono); font-size:.61rem;
  letter-spacing:2px; text-transform:uppercase; color: var(--dimmer);
  display:block; margin-bottom:5px;
}
.f-input, .f-area {
  width:100%;
  background: var(--bg2); border:1px solid var(--line);
  border-radius:3px; padding:11px 15px;
  color: var(--white); font-family: var(--mono); font-size:.98rem;
  outline:none; resize:none;
  transition: border-color .2s;
}
.f-input:focus, .f-area:focus { border-color: var(--blue); }
.f-input::placeholder, .f-area::placeholder { color: var(--dimmer); }
.f-area { min-height:96px; }
.btn-submit {
  align-self:flex-start;
  font-family: var(--mono); font-size:.67rem;
  letter-spacing:2.5px; text-transform:uppercase;
  padding:12px 24px; border-radius:2px; cursor:none;
  background:transparent; color: var(--blue);
  border:1px solid var(--blue);
  display:flex; align-items:center; gap:8px;
  transition: all .22s;
}
.btn-submit:hover {
  background: var(--blue); color:#000;
  box-shadow: 0 0 28px rgba(77,166,255,.35);
  transform:translateY(-2px);
}

.form-success {
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; padding:36px 24px; text-align:center;
  background: var(--bg2);
  border:1px solid rgba(0,255,136,.28); border-radius:8px;
}
.form-success .check { font-size:2.4rem; margin-bottom:12px; }
.form-success .ok-title {
  font-family: var(--mono); color: var(--green);
  font-size:1rem; letter-spacing:2px; margin-bottom:6px;
}
.form-success .ok-sub { font-size:1rem; color: var(--dim); }

/* ── SQL GATE ── */
.sql-gate {
  position:fixed; inset:0; z-index:9000;
  background: var(--bg);
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  padding:24px;
  animation: fadeIn .4s ease;
}
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
.sql-gate.exit { animation: gateExit .7s ease forwards; }
@keyframes gateExit {
  0%   { opacity:1; transform:scale(1); }
  50%  { opacity:1; transform:scale(1.015); }
  100% { opacity:0; transform:scale(.96); pointer-events:none; }
}
.sql-terminal {
  width:100%; max-width:700px;
  background: var(--bg2);
  border:1px solid var(--line2);
  border-radius:8px; overflow:hidden;
  box-shadow: 0 0 80px rgba(77,166,255,.08), 0 32px 80px rgba(0,0,0,.7);
}
.sql-titlebar {
  display:flex; align-items:center; gap:8px;
  padding:10px 16px;
  background: var(--bg3);
  border-bottom:1px solid var(--line);
}
.sql-dot { width:11px; height:11px; border-radius:50%; }
.sql-title {
  font-family: var(--mono); font-size:.65rem;
  letter-spacing:2px; color: var(--dimmer); margin-left:6px;
}
.sql-body { padding:28px 32px 32px; }
.sql-db-info {
  display:flex; align-items:center; gap:10px;
  margin-bottom:28px; padding:10px 14px;
  border:1px solid var(--line); border-radius:4px;
  background: rgba(77,166,255,.03);
}
.sql-db-text {
  font-family: var(--mono); font-size:.62rem;
  color: var(--dimmer); letter-spacing:1px;
}
.sql-db-text span { color: var(--blue); }
.sql-prompt-label {
  font-family: var(--mono); font-size:.6rem;
  letter-spacing:2.5px; text-transform:uppercase;
  color: var(--dimmer); margin-bottom:10px; display:block;
}
.sql-editor-wrap { position:relative; margin-bottom:16px; }
.sql-prefix {
  position:absolute; left:14px; top:13px;
  font-family: var(--mono); font-size:.82rem;
  color: var(--blue); pointer-events:none; user-select:none;
}
.sql-editor {
  width:100%; background: var(--bg3);
  border:1px solid var(--line); border-radius:4px;
  padding:12px 14px 12px 56px;
  color: var(--white); font-family: var(--mono); font-size:.82rem;
  letter-spacing:.5px; line-height:1.7;
  outline:none; resize:none; min-height:88px;
  transition: border-color .2s, box-shadow .2s;
  caret-color: var(--blue);
}
.sql-editor:focus {
  border-color: rgba(77,166,255,.45);
  box-shadow: 0 0 0 3px rgba(77,166,255,.07);
}
.sql-editor.err { border-color: rgba(255,34,68,.6) !important; }
.sql-editor.ok  { border-color: rgba(0,255,136,.6) !important; }
.sql-hint {
  font-family: var(--mono); font-size:.58rem;
  letter-spacing:.5px; color: var(--dimmer);
  margin-bottom:20px; line-height:1.9;
}
.sql-hint .kw  { color: #cc99cd; }
.sql-hint .tbl { color: #f8c555; }
.sql-hint .col { color: var(--green); }
.sql-hint .val { color: #f89820; }
.sql-actions {
  display:flex; align-items:center;
  justify-content:space-between; gap:12px;
}
.sql-run {
  font-family: var(--mono); font-size:.65rem;
  letter-spacing:2.5px; text-transform:uppercase;
  padding:10px 22px; border-radius:3px; cursor:pointer;
  background: var(--blue2); color:#000; font-weight:700;
  border:1px solid var(--blue);
  display:flex; align-items:center; gap:8px;
  transition: all .2s;
}
.sql-run:hover { background: var(--blue); box-shadow: 0 0 24px rgba(77,166,255,.4); transform:translateY(-1px); }
.sql-run:disabled { opacity:.4; cursor:not-allowed; transform:none; }
.sql-status { font-family: var(--mono); font-size:.62rem; letter-spacing:1px; min-height:1.2em; }
.sql-status.ok  { color: var(--green); }
.sql-status.err { color: var(--red); }
.sql-status.run { color: var(--blue); }
.sql-result {
  margin-top:20px; border:1px solid rgba(0,255,136,.2);
  border-radius:4px; overflow:hidden; animation: fadeIn .3s ease;
}
.sql-result-header {
  background: rgba(0,255,136,.05); padding:7px 14px;
  font-family: var(--mono); font-size:.58rem;
  letter-spacing:2px; color: var(--green);
  border-bottom:1px solid rgba(0,255,136,.15);
}
.sql-result-row { display:grid; grid-template-columns: repeat(4,1fr); }
.sql-cell {
  padding:8px 14px; font-family: var(--mono); font-size:.65rem;
  border-right:1px solid var(--line); border-bottom:1px solid var(--line);
  color: var(--dim);
}
.sql-cell:last-child { border-right:none; }
.sql-cell.head { color: var(--dimmer); font-size:.55rem; letter-spacing:1.5px; text-transform:uppercase; background: var(--bg3); }
.sql-cell.blue  { color: var(--blue); }
.sql-cell.green { color: var(--green); }

/* ── FOOTER ── */
.footer {
  position:relative; z-index:1;
  border-top:1px solid var(--line);
  padding: 28px 48px;
  display:flex; justify-content:space-between; align-items:center;
  flex-wrap:wrap; gap:14px;
}
.foot-brand { display:flex; align-items:center; gap:8px; text-decoration:none; cursor:none; }
.foot-brand img { width:22px; height:22px; filter: drop-shadow(0 0 5px rgba(77,166,255,.45)); }
.foot-name { font-family: var(--mono); font-size:.7rem; color: var(--blue); }
.foot-copy { font-family: var(--mono); font-size:.67rem; letter-spacing:1px; color: var(--dimmer); }
.foot-up {
  font-family: var(--mono); font-size:.67rem;
  letter-spacing:2px; text-transform:uppercase;
  text-decoration:none; color: var(--dimmer); cursor:none;
  transition: color .2s;
}
.foot-up:hover { color: var(--blue); }

/* ── REVEAL ── */
.reveal { opacity:0; transform:translateY(26px); transition: opacity .7s ease, transform .7s ease; }
.reveal.in { opacity:1; transform:translateY(0); }

/* ── RESPONSIVE ── */
@media(max-width:900px) {
  .nav { padding:0 20px; }
  .nav-links { display:none; }
  .about-grid { grid-template-columns:1fr; gap:36px; }
  .contact-wrap { grid-template-columns:1fr; }
  .section-wrap { padding:72px 20px; }
  .hero-title { letter-spacing:1px; }
  .footer { padding:24px 20px; flex-direction:column; text-align:center; }
}
@media(max-width:560px) {
  .kpi-grid { grid-template-columns:1fr 1fr; }
  .projects-grid { grid-template-columns:1fr; }
}
`;

// ─── DATA ──────────────────────────────────────────────────────────────────
const TYPEWRITER_LINES = [
  "Java Backend Developer",
  "Spring Boot Architect",
  "Microservices Engineer",
  "Clean Code Advocate",
  "PostgreSQL Enthusiast",
  "grzeszuk.dev ⚡",
];

const TECH_GROUPS = [
  {
    name:"Backend", icon:"⚙️", color:"#f89820",
    items:[
      "Java 17 / 21","Spring Boot","Spring Security",
      "Spring Data JPA","Hibernate","REST API",
      "GraphQL",
    ]
  },
  {
    name:"Bazy danych & Messaging", icon:"🗄️", color:"#4da6ff",
    items:[
      "PostgreSQL","Oracle DB","MySQL",
      "Redis","Elasticsearch","Liquibase",
      "Apache Kafka","RabbitMQ","SQL",
    ]
  },
  {
    name:"Infrastruktura & Narzędzia", icon:"🚀", color:"#00ff88",
    items:[
      "Docker","Kubernetes","Azure",
      "GitHub Actions","CI / CD","Linux / Bash",
      "Git","Postman / OpenAPI","IntelliJ IDEA",
    ]
  },
];

const PROJECTS = [
  {
    icon:"📡", color:"#4da6ff", name:"SENT GEO",
    desc:"System monitorowania przewozów towarów wrażliwych w czasie rzeczywistym. Projekt rządowy o wysokiej niezawodności — działający 24/7 dla dziesiątek tysięcy operacji dziennie.",
  },
  {
    icon:"🛣️", color:"#00ff88", name:"e-TOLL",
    desc:"Krajowy system poboru opłat drogowych — następca viaTOLL. Architektura mikroserwisowa obsługująca miliony transakcji dziennie z rygorystycznymi wymaganiami SLA.",
  },
  {
    icon:"🏛️", color:"#ffd700", name:"SIST JST",
    desc:"Platforma wspierająca rozliczenia podatkowe dla jednostek samorządu terytorialnego. Złożona logika biznesowa, integracje z instytucjami państwowymi, stopniowa modernizacja legacy systemu.",
  },
];

const CAREER = [
  { icon:"💻", color:"#4da6ff", period:"2024 — OBECNIE",
    role:"Mid Java Developer", company:"Instytut Łączności · Warszawa",
    desc:"Rozwój i utrzymanie systemów backendowych o zasięgu krajowym. Praca przy projektach wymagających wysokiej niezawodności, bezpieczeństwa i ciągłości działania 24/7." },
  { icon:"🌱", color:"#00ff88", period:"2023 — 2024",
    role:"Junior Java Developer", company:"Instytut Łączności · Warszawa",
    desc:"Pierwsze kroki w środowisku produkcyjnym — wdrożenie do pracy z dużymi, złożonymi systemami legacy. Nauka odpowiedzialnego podejścia do zmian w kodzie i pracy w zespole." },
  { icon:"🚀", color:"#ffd700", period:"2022 — 2023",
    role:"Java Developer Intern", company:"TTSW · Kraków",
    desc:"Staż w software house — praca nad aplikacjami backendowymi, pierwsze doświadczenia z kodem produkcyjnym, code review i metodologią Scrum w komercyjnym projekcie." },
  { icon:"👨‍🏫", color:"#b24bf3", period:"2021 — 2022",
    role:"Nauczyciel Programowania", company:"Giganci Programowania",
    desc:"Prowadzenie zajęć z programowania dla dzieci i młodzieży. Nauka cierpliwości, tłumaczenia złożonych konceptów w prosty sposób i — przede wszystkim — umiejętność zarażania pasją do kodu." },
];

const FUN_FACTS = [
  { icon:"☕", color:"#f89820", name:"Java Fanatic",
    body:"Od Java 8 śledzę każdy release JDK. Virtual Threads i sealed classes to moje ulubione additions do języka." },
  { icon:"📚", color:"#4da6ff", name:"Tech Bookworm",
    body:"Clean Architecture, DDD, DDIA — regał pełen klasyki. Zawsze czytam z notesem i zaznaczonymi fragmentami." },
  { icon:"🎮", color:"#00ff88", name:"Indie Gamer",
    body:"After hours: gry indie i retro. Gram w to co buduję — każdy system testuję jak gracz, nie tylko jak developer." },
  { icon:"🧩", color:"#b24bf3", name:"System Thinker",
    body:"Rozkładam złożone systemy na części. Od CPU i cache hierarchii po distributed consensus." },
  { icon:"🔭", color:"#ff2244", name:"Open Source",
    body:"Własne narzędzia na GitHubie. Kod to forma komunikacji z innymi developerami." },
];

const SOCIALS = [
  {
    label:"linkedin.com/in/mgrzeszuk",
    url:"https://linkedin.com/in/mgrzeszuk",
    href:"https://www.linkedin.com/in/mgrzeszuk",
    color:"#0a66c2",
    logo:"https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg",
  },
  {
    label:"github.com/grzeszuk",
    url:"https://github.com/michalek990/",
    href:"https://github.com/michalek990/",
    color:"#ffffff",
    logo:"https://cdn.simpleicons.org/github/ffffff",
  },
  {
    label:"t.me/grzeszuk",
    url:"https://t.me/grzeszuk",
    href:"https://t.me/grzeszuk",
    color:"#2ca5e0",
    logo:"https://cdn.simpleicons.org/telegram/2ca5e0",
  },
  {
    label:"discord: magis9899",
    url:"https://discord.com",
    href:"https://discord.com",
    color:"#7289da",
    logo:"https://cdn.simpleicons.org/discord/7289da",
  },
];

// ─── HOOKS ─────────────────────────────────────────────────────────────────
function useTypewriter(lines, speed = 58, pause = 2100) {
  const [text, setText] = useState("");
  const [lineI, setLineI] = useState(0);
  const [charI, setCharI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const cur = lines[lineI];
    const id = setTimeout(() => {
      if (!del) {
        if (charI < cur.length) { setText(cur.slice(0, charI + 1)); setCharI(c => c+1); }
        else setTimeout(() => setDel(true), pause);
      } else {
        if (charI > 0) { setText(cur.slice(0, charI - 1)); setCharI(c => c-1); }
        else { setDel(false); setLineI(i => (i+1) % lines.length); }
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(id);
  });
  return text;
}

function useCursor() {
  const [dot, setDot] = useState({ x:-200, y:-200 });
  const [ring, setRing] = useState({ x:-200, y:-200 });
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const mv = e => {
      setDot({ x:e.clientX, y:e.clientY });
      setTimeout(() => setRing({ x:e.clientX, y:e.clientY }), 90);
      const t = e.target;
      setHov(!!(t.closest("a") || t.closest("button") || t.closest(".chip") || t.closest(".fun-card") || t.closest(".proj") || t.closest(".kpi")));
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, []);
  return { dot, ring, hov };
}

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, vis };
}

// ─── STARS ─────────────────────────────────────────────────────────────────
function Stars() {
  const stars = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      sz: Math.random() * 1.6 + 0.4,
      dur: (Math.random() * 3 + 2).toFixed(1),
      delay: (Math.random() * 4).toFixed(1),
      lo: (Math.random() * 0.15 + 0.05).toFixed(2),
      hi: (Math.random() * 0.45 + 0.2).toFixed(2),
    }))
  ).current;

  return (
    <div className="stars">
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.sz, height: s.sz,
          "--dur": `${s.dur}s`, "--delay": `${s.delay}s`,
          "--lo": s.lo, "--hi": s.hi,
        }} />
      ))}
    </div>
  );
}

// ─── REVEAL WRAPPER ────────────────────────────────────────────────────────
function R({ children, delay = 0 }) {
  const { ref, vis } = useReveal();
  return (
    <div ref={ref} className={`reveal ${vis ? "in" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── SECTION HEADER ────────────────────────────────────────────────────────
function SHeader({ num, label, color }) {
  return (
    <div className="s-header">
      <div className="s-line" />
      <div className="s-tag" style={{ color }}>{num} / {label}</div>
      <div className="s-line" />
    </div>
  );
}

// ─── THEME TOGGLE ──────────────────────────────────────────────────────────
function ThemeToggle({ isLight, onToggle }) {
  return (
    <div
      className="theme-toggle-wrap"
      onClick={onToggle}
      title={isLight ? "Przełącz na dark mode" : "Przełącz na light mode"}
    >
      <span className="theme-toggle-label">
        {isLight ? "LIGHT" : "DARK"}
      </span>
      <button className="theme-toggle" aria-label="toggle theme">
        <div className="theme-toggle-knob">
          {isLight ? "☀️" : "🌙"}
        </div>
      </button>
    </div>
  );
}

// ─── INTRO ANIMATION ───────────────────────────────────────────────────────
function Intro({ onDone }) {
  const [text, setText] = useState("");
  const [exiting, setExiting] = useState(false);
  const query = "SELECT * FROM users WHERE username = 'grzeszuk';";

  useEffect(() => {
    let i = 0;
    const type = setInterval(() => {
      i++;
      setText(query.slice(0, i));
      if (i >= query.length) {
        clearInterval(type);
        setTimeout(() => { setExiting(true); setTimeout(onDone, 900); }, 900);
      }
    }, 48);
    return () => clearInterval(type);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className={`sql-gate${exiting ? " exit" : ""}`}>
        <div className="sql-terminal">
          <div className="sql-titlebar">
            <div className="sql-dot" style={{ background:"#ff5f57" }} />
            <div className="sql-dot" style={{ background:"#febc2e" }} />
            <div className="sql-dot" style={{ background:"#28c840" }} />
            <span className="sql-title">psql — portfolio_db — 5432</span>
          </div>
          <div className="sql-body">
            <div className="sql-db-info">
              <span style={{ fontSize:"1rem" }}>🐘</span>
              <div className="sql-db-text">
                Connected to <span>portfolio_db</span> · table: <span>users</span>
              </div>
            </div>
            <div style={{ fontFamily:"var(--mono)", fontSize:".9rem", lineHeight:2, minHeight:"3em" }}>
              <span style={{ color:"var(--blue)" }}>▶ </span>
              <span style={{ color:"var(--white)" }}>{text}</span>
              <span style={{ color:"var(--blue)", animation:"blink .7s step-end infinite" }}>_</span>
            </div>
            {exiting && (
              <div style={{ marginTop:16, fontFamily:"var(--mono)", fontSize:".7rem", color:"var(--green)", letterSpacing:1 }}>
                ✓ 1 row returned · loading portfolio...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const tw = useTypewriter(TYPEWRITER_LINES);
  const { dot, ring, hov } = useCursor();
  const [entered, setEntered] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [isLight]);

  if (!entered) return <Intro onDone={() => setEntered(true)} />;

  return (
    <>
      <style>{STYLES}</style>

      {/* Custom cursor */}
      <div className="cur-dot" style={{ left: dot.x, top: dot.y }} />
      <div className={`cur-ring ${hov ? "hovered" : ""}`} style={{ left: ring.x, top: ring.y }} />

      <Stars />

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#top" className="nav-brand">
          <img src={LOGO} alt="Grzeszuk.dev" />
          <span className="nav-name">Grzeszuk.dev</span>
        </a>
        <div className="nav-links">
          {[["O mnie","#about"],["Technologie","#tech"],["Projekty","#projects"],
            ["Kariera","#career"],["Poza kodem","#fun"],["Kontakt","#contact"]].map(([l,h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
          <ThemeToggle isLight={isLight} onToggle={() => setIsLight(v => !v)} />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="badge-blink" />
            Open to new opportunities
          </div>
          <img src={LOGO} alt="Logo" className="hero-logo" />
          <h1 className="hero-title">
            <span className="accent">Grzeszuk</span>
            <span className="dot">.</span>dev
          </h1>
          <p className="hero-sub">// Java Backend Developer · Poland</p>
          <div className="hero-typewriter">
            {tw}<span className="tw-cursor">_</span>
          </div>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-solid">⚡ Projekty</a>
            <a href="#contact"  className="btn btn-ghost">✉ Kontakt</a>
          </div>
        </div>
        <div className="hero-scroll">
          <span className="hero-scroll-txt">scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <div className="hr" />
      <section id="about">
        <div className="section-wrap">
          <R><SHeader num="01" label="O mnie" color="#4da6ff" /></R>
          <div className="about-grid">
            <R delay={60}>
              <div className="about-body">
                <h2 className="s-title">Hej, jestem <span className="hl">Michał</span></h2>
                <p>
                  <strong>Mid Java Developer</strong> z ponad 2-letnim doświadczeniem komercyjnym w tworzeniu
                  aplikacji webowych. Pracuję z <span className="code-inline">Java</span>,{" "}
                  <span className="code-inline">Spring Framework</span>,{" "}
                  <span className="code-inline">Hibernate</span> i relacyjnymi bazami danych —
                  głównie <span className="code-inline">PostgreSQL</span>.
                </p>
                <p>
                  Podchodzę do projektów <strong>end-to-end</strong> — od logiki biznesowej backendu,
                  przez integrację z bazą danych, aż po projektowanie i dokumentowanie REST API.
                  Nie interesuje mnie pisanie kodu, który "jakoś działa" — zależy mi na tym,
                  żeby był <strong>czytelny, testowalny i łatwy w utrzymaniu</strong>.
                </p>
                <p>
                  Cenię dobrze zorganizowaną pracę zespołową w <span className="code-inline">Scrum</span>.
                  Stale poszerzam wiedzę — aktualnie szczególnie interesują mnie tematy
                  wydajności systemów, architektury mikroserwisowej i automatyzacji procesów wytwarzania oprogramowania.
                </p>
                <p>
                  Brałem udział w projektach o zasięgu krajowym, wymagających wysokiej
                  niezawodności i bezpieczeństwa — co nauczyło mnie pokory wobec produkcji
                  i odpowiedzialnego podejścia do każdej zmiany w kodzie.
                </p>
              </div>
            </R>
            <R delay={120}>
              <div className="kpi-grid" style={{ gridTemplateColumns:"1fr 1fr 1fr" }}>
                {[
                  { v:"2+",  l:"Lata doświadczenia", c:"#4da6ff" },
                  { v:"3",   l:"Projekty krajowe",    c:"#00ff88" },
                  { v:"3+",  l:"Lata nauki Javy",     c:"#f89820" },
                  { v:"12+", l:"Technologii w stacku",c:"#b24bf3" },
                  { v:"500+",l:"Commitów / PR-ów",    c:"#ffd700" },
                  { v:"∞",   l:"Kawy dziennie",       c:"#ff6b35" },
                ].map(k => (
                  <div key={k.l} className="kpi" style={{ color: k.c }}>
                    <div className="kpi-val" style={{ color: k.c }}>{k.v}</div>
                    <div className="kpi-lbl">{k.l}</div>
                  </div>
                ))}
              </div>
              <div className="avail-badge">
                <div className="avail-pulse" />
                <span className="avail-text">Available for new projects & positions</span>
              </div>
              <div style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 16px",
                background:"var(--bg2)",
                border:"1px solid var(--line)",
                borderRadius:6,
                marginTop:12,
              }}>
                <span style={{ fontSize:"1.3rem", lineHeight:1 }}>🇵🇱</span>
                <div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:".55rem", letterSpacing:"2px", color:"var(--dimmer)", textTransform:"uppercase", marginBottom:2 }}>
                    Lokalizacja / Strefa czasowa
                  </div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:".72rem", color:"var(--dim)" }}>
                    Polska · CET/CEST · UTC+1 / UTC+2
                  </div>
                </div>
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── TECH ── */}
      <div className="hr" />
      <section id="tech">
        <div className="section-wrap">
          <R><SHeader num="02" label="Technologie" color="#f89820" /></R>
          <R delay={60}>
            <h2 className="s-title">Mój <span className="hl">tech stack</span></h2>
            <p className="s-desc">Narzędzia i technologie których używam na co dzień — od backendu przez bazy danych po infrastrukturę.</p>
          </R>
          <div className="tech-grid">
            {TECH_GROUPS.map((g, gi) => (
              <R key={g.name} delay={gi * 80}>
                <div className="tech-cat" style={{ color: g.color, borderColor:`${g.color}22` }}>
                  <div className="tech-cat-header">
                    <span className="tech-cat-icon">{g.icon}</span>
                    <span className="tech-cat-name" style={{ color: g.color }}>{g.name}</span>
                  </div>
                  <div className="tech-tags">
                    {g.items.map(item => (
                      <span key={item} className="tech-tag" style={{ color: g.color, borderColor:`${g.color}55` }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <div className="hr" />
      <section id="projects">
        <div className="section-wrap">
          <R><SHeader num="03" label="Projekty" color="#00ff88" /></R>
          <R delay={60}>
            <h2 className="s-title">Wybrane <span className="hl">projekty</span></h2>
            <p className="s-desc">Systemy które współtworzyłem i planowałem — od mikroserwisów przez pipeline'y danych po dashboardy monitorujące.</p>
          </R>
          <div className="projects-list">
            {PROJECTS.map((p, pi) => (
              <R key={p.name} delay={pi * 70}>
                <div className="proj" style={{ color: p.color }}>
                  <div className="proj-stripe" />
                  {/* blurred bg icon */}
                  <div className="proj-bg-icon" style={{
                    position:"absolute", right:-30, bottom:-40,
                    fontSize:"18rem", lineHeight:1,
                    opacity:.06, filter:"blur(18px)",
                    pointerEvents:"none", userSelect:"none",
                    transition:"opacity .3s, filter .3s",
                  }} aria-hidden="true">{p.icon}</div>
                  <div style={{ position:"relative", zIndex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:14 }}>
                      <span style={{ fontSize:"2.2rem", lineHeight:1, flexShrink:0, filter:`drop-shadow(0 0 12px ${p.color}99)` }}>{p.icon}</span>
                      <div className="proj-name" style={{ fontSize:"1.1rem", letterSpacing:"2px" }}>{p.name}</div>
                    </div>
                    <div className="proj-desc" style={{ fontSize:".9rem", lineHeight:1.85 }}>{p.desc}</div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREER ── */}
      <div className="hr" />
      <section id="career">
        <div className="section-wrap">
          <R><SHeader num="04" label="Kariera" color="#ffd700" /></R>
          <R delay={60}>
            <h2 className="s-title">Ścieżka <span className="hl">zawodowa</span></h2>
            <p className="s-desc">Od juniora po mida — przebyta droga przez projekty, firmy i technologie.</p>
          </R>
          <div className="timeline">
            <div className="timeline-spine" />
            {CAREER.map((c, ci) => (
              <R key={c.role} delay={ci * 80}>
                <div className="tl-item">
                  <div className="tl-dot" style={{ color: c.color, boxShadow:`0 0 18px ${c.color}33` }}>
                    {c.icon}
                  </div>
                  <div className="tl-body">
                    <div className="tl-period">{c.period}</div>
                    <div className="tl-role">{c.role}</div>
                    <div className="tl-company" style={{ color: c.color }}>{c.company}</div>
                    <div className="tl-desc">{c.desc}</div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUN ── */}
      <div className="hr" />
      <section id="fun">
        <div className="section-wrap">
          <R><SHeader num="05" label="Poza kodem" color="#b24bf3" /></R>
          <R delay={60}>
            <h2 className="s-title">Kim jestem <span className="hl">naprawdę</span></h2>
            <p className="s-desc">Kilka rzeczy które definiują mnie poza Javą i Springiem.</p>
          </R>
          <div className="fun-grid">
            {FUN_FACTS.map((f, fi) => (
              <R key={f.name} delay={fi * 55}>
                <div className="fun-card" style={{ color: f.color }}>
                  <span className="fun-icon">{f.icon}</span>
                  <div className="fun-name" style={{ color: f.color }}>{f.name}</div>
                  <div className="fun-body">{f.body}</div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <div className="hr" />
      <section id="contact">
        <div className="section-wrap">
          <R><SHeader num="06" label="Kontakt" color="#00d4ff" /></R>
          <R delay={60}>
            <h2 className="s-title">Porozmawiajmy <span className="hl">o projekcie</span></h2>
            <p className="s-desc">Szukasz doświadczonego Java developera? Chętnie porozmawiam — niezależnie czy to kontrakt, full-time czy konsultacja architektoniczna.</p>
          </R>
          <div className="contact-wrap">
            <R delay={80}>
              <div className="contact-intro">
                <h3 style={{ fontFamily:"var(--hero)", fontSize:"1.3rem", letterSpacing:"2px", marginBottom:16 }}>
                  Dane kontaktowe
                </h3>
                <div className="contact-info-card">
                  <div className="contact-info-row">
                    <div className="contact-info-icon">📧</div>
                    <div className="contact-info-body">
                      <div className="contact-info-lbl">Email</div>
                      <div className="contact-info-val">
                        <a href="mailto:kontakt@grzeszuk.dev">michal.grzeszuk@gmail.com</a>
                      </div>
                    </div>
                  </div>
                  <div className="contact-info-row">
                    <div className="contact-info-icon">📍</div>
                    <div className="contact-info-body">
                      <div className="contact-info-lbl">Lokalizacja</div>
                      <div className="contact-info-val" style={{ color:"var(--dim)" }}>Polska · praca zdalna / hybrid</div>
                    </div>
                  </div>
                  <div className="contact-info-row">
                    <div className="contact-info-icon">🕐</div>
                    <div className="contact-info-body">
                      <div className="contact-info-lbl">Czas odpowiedzi</div>
                      <div className="contact-info-val" style={{ color:"var(--green)" }}>Zazwyczaj w ciągu 24h</div>
                    </div>
                  </div>
                  <div className="contact-info-row">
                    <div className="contact-info-icon">💼</div>
                    <div className="contact-info-body">
                      <div className="contact-info-lbl">Dostępność</div>
                      <div className="contact-info-val" style={{ color:"var(--dim)" }}>Full-time · Konsultacje</div>
                    </div>
                  </div>
                </div>
              </div>
            </R>
            <R delay={140}>
              <h3 style={{ fontFamily:"var(--hero)", fontSize:"1.3rem", letterSpacing:"2px", marginBottom:16 }}>
                Social media
              </h3>
              <div className="social-links">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-row" style={{ color: s.color, borderColor:`${s.color}22` }}>
                    <img
                      src={s.logo}
                      alt={s.label}
                      className="social-logo"
                    />
                    <div className="social-info">
                      <span className="social-platform">{s.label.split(".")[0]}</span>
                      <span className="social-handle" style={{ color: s.color }}>{s.label}</span>
                    </div>
                    <span style={{ marginLeft:"auto", fontFamily:"var(--mono)", fontSize:".6rem", opacity:.35 }}>↗</span>
                  </a>
                ))}
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="hr" />
      <footer className="footer">
        <a href="#top" className="foot-brand">
          <img src={LOGO} alt="logo" />
          <span className="foot-name">Grzeszuk.dev</span>
        </a>
        <span className="foot-copy">© 2025 <span style={{ color:"var(--blue)" }}>grzeszuk.dev</span> · Built with React · No Tailwind · No compromises ⚡</span>
        <a href="#top" className="foot-up">↑ top</a>
      </footer>
    </>
  );
}