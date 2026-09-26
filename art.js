// Общие рисунки героев: используются в галерее (characters.html) и в игре (game.html)
// ---------- помощники ----------
const OUT = "#2a1d14";
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c * k)));
  return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((c) => c.toString(16).padStart(2, "0")).join("");
}
let uid = 0;
function bg(kind, w, h) {
  const id = "bg" + uid++;
  const sets = {
    street: ["#9fd4f5", "#dff1fb", `<rect y="${h * 0.72}" width="${w}" height="${h}" fill="#b9b4a8"/><rect y="${h * 0.72}" width="${w}" height="4" fill="#a7a296"/>
      <rect x="${w * 0.06}" y="${h * 0.38}" width="${w * 0.28}" height="${h * 0.34}" fill="#f0c9c0" opacity=".55"/><polygon points="${w * 0.03},${h * 0.4} ${w * 0.2},${h * 0.26} ${w * 0.37},${h * 0.4}" fill="#a04a3a" opacity=".5"/>
      <rect x="${w * 0.68}" y="${h * 0.42}" width="${w * 0.26}" height="${h * 0.3}" fill="#c9e0f0" opacity=".6"/><polygon points="${w * 0.65},${h * 0.44} ${w * 0.81},${h * 0.31} ${w * 0.97},${h * 0.44}" fill="#4a5a8a" opacity=".5"/>`],
    arena: ["#f3c77a", "#fbe2ae", `<rect y="${h * 0.72}" width="${w}" height="${h}" fill="#d8b26a"/><rect y="${h * 0.3}" width="${w}" height="${h * 0.42}" fill="#8d8a99" opacity=".35"/>
      ${Array.from({ length: 12 }, (_, i) => `<circle cx="${(i + 0.5) * w / 12}" cy="${h * 0.38 + (i % 2) * 8}" r="7" fill="${["#e25a5a", "#5a8ee2", "#e2c25a", "#7ad17a"][i % 4]}" opacity=".5"/>`).join("")}`],
    desert: ["#ffb36b", "#ffe4a8", `<circle cx="${w * 0.8}" cy="${h * 0.2}" r="${w * 0.08}" fill="#fff4c2"/><path d="M0 ${h * 0.7} Q${w * 0.3} ${h * 0.6} ${w * 0.6} ${h * 0.68} T${w} ${h * 0.64} V${h} H0Z" fill="#e2c07a"/>
      <rect x="${w * 0.12}" y="${h * 0.45}" width="8" height="${h * 0.24}" rx="4" fill="#3e8f4a" opacity=".7"/>`],
    forest: ["#3d5a7a", "#9cc9a0", `<circle cx="${w * 0.82}" cy="${h * 0.16}" r="${w * 0.06}" fill="#ffe9b0" opacity=".8"/>
      ${Array.from({ length: 6 }, (_, i) => { const x = (i + 0.3) * w / 6, t = h * (0.3 + (i % 2) * 0.08);
        return `<path d="M${x - w * 0.09} ${h * 0.74} L${x} ${t} L${x + w * 0.09} ${h * 0.74}Z" fill="${i % 2 ? "#2f6b44" : "#285c3a"}" opacity=".75"/>`; }).join("")}
      <rect y="${h * 0.72}" width="${w}" height="${h}" fill="#5f8f4e"/><rect y="${h * 0.72}" width="${w}" height="4" fill="#4f7d40"/>`],
    home: ["#f5e6cf", "#efd9b8", `<rect x="${w * 0.1}" y="${h * 0.14}" width="${w * 0.3}" height="${h * 0.26}" rx="4" fill="#a8d8f0" stroke="#fff" stroke-width="5"/>
      <rect x="${w * 0.1}" y="${h * 0.14}" width="${w * 0.3}" height="${h * 0.26}" rx="4" fill="none" stroke="#c9a57a" stroke-width="2"/>
      <path d="M${w * 0.25} ${h * 0.14} V${h * 0.4} M${w * 0.1} ${h * 0.27} H${w * 0.4}" stroke="#fff" stroke-width="4"/>
      <rect y="${h * 0.72}" width="${w}" height="${h}" fill="#c9965e"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${i * w / 8}" y="${h * 0.72}" width="2" height="${h}" fill="#b07f4a"/>`).join("")}`],
    cave: ["#1b2a4a", "#2d4a7a", `${Array.from({ length: 9 }, (_, i) => { const x = (i + 0.5) * w / 9, y = h * (0.12 + ((i * 37) % 50) / 100);
        return `<path d="M${x} ${y - 12} L${x + 7} ${y} L${x} ${y + 12} L${x - 7} ${y}Z" fill="#8fd8ff" opacity=".55"/>`; }).join("")}
      <rect y="${h * 0.74}" width="${w}" height="${h}" fill="#26375c"/>`],
  };
  const [top, bottom, deco] = sets[kind];
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#${id})"/>${deco}`;
}

// ---------- человек ----------
function person(o) {
  const S = o.skin, SD = shade(S, 0.82), SH = o.shirt, SHD = shade(SH, 0.8);
  const sw = { buff: 46, thin: 27, normal: 32, coat: 36, chubby: 40 }[o.build];      // полуширина плеч
  const ww = { buff: 30, thin: 23, normal: 28, coat: 34, chubby: 46 }[o.build];      // полуширина пояса
  const aw = { buff: 22, thin: 12, normal: 15, coat: 16, chubby: 17 }[o.build];      // толщина руки
  const lx = 100 - sw - aw + 5, rx = 100 + sw - 5;
  let s = `<ellipse cx="100" cy="258" rx="${sw + 22}" ry="9" fill="#000" opacity=".18"/>`;
  if (o.backHair) s += o.backHair();

  // ноги
  if (o.robe) {
    s += `<path d="M${100 - sw} 128 L${100 - ww - 18} 252 L${100 + ww + 18} 252 L${100 + sw} 128 Z" fill="${SH}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M100 150 L${100 + ww + 18} 252 L${100 + sw} 128 Z" fill="${SHD}" opacity=".35"/>
          <path d="M${100 - ww - 18} 236 L${100 + ww + 18} 236" stroke="${o.trim}" stroke-width="7"/>
          <ellipse cx="84" cy="255" rx="14" ry="6" fill="#6b4a2b" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="116" cy="255" rx="14" ry="6" fill="#6b4a2b" stroke="${OUT}" stroke-width="2.5"/>`;
  } else {
    s += `<rect x="${100 - ww + 4}" y="186" width="${ww - 6}" height="64" rx="7" fill="${o.pants}" stroke="${OUT}" stroke-width="3"/>
          <rect x="102" y="186" width="${ww - 6}" height="64" rx="7" fill="${shade(o.pants, 0.85)}" stroke="${OUT}" stroke-width="3"/>
          <ellipse cx="${100 - ww / 2 - 2}" cy="253" rx="16" ry="8" fill="${o.shoes}" stroke="${OUT}" stroke-width="3"/>
          <ellipse cx="${100 + ww / 2 + 2}" cy="253" rx="16" ry="8" fill="${o.shoes}" stroke="${OUT}" stroke-width="3"/>
          <ellipse cx="${100 - ww / 2 - 6}" cy="250" rx="6" ry="2.5" fill="#fff" opacity=".35"/>`;
  }
  // руки (за туловищем — сначала рукав/кожа)
  const arm = (x, flip) => {
    let a = `<rect x="${x}" y="128" width="${aw}" height="66" rx="${aw / 2}" fill="${o.longSleeve ? SH : S}" stroke="${OUT}" stroke-width="3"/>`;
    if (o.build === "buff") a += `<ellipse cx="${x + aw / 2 + (flip ? -2 : 2)}" cy="158" rx="${aw / 2 + 3}" ry="13" fill="${S}" stroke="${OUT}" stroke-width="3"/>
                                  <path d="M${x + 5} 162 q${aw / 2 - 5} 6 ${aw - 10} 0" stroke="${SD}" stroke-width="2.5" fill="none"/>`;
    if (!o.longSleeve) a += `<path d="M${x - 3} 128 h${aw + 6} v${o.build === "buff" ? 18 : 22} h-${aw + 6} Z" fill="${SH}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>`;
    a += `<circle cx="${x + aw / 2}" cy="196" r="${aw / 2 + 3}" fill="${S}" stroke="${OUT}" stroke-width="3"/>`;
    return a;
  };
  s += arm(lx, false) + arm(rx, true);

  // туловище
  if (!o.robe) {
    s += `<path d="M${100 - sw} 136 Q${100 - sw} 122 ${100 - sw + 12} 122 L${100 + sw - 12} 122 Q${100 + sw} 122 ${100 + sw} 136 L${100 + ww} 196 L${100 - ww} 196 Z"
            fill="${SH}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M${100 + sw - 14} 124 Q${100 + sw} 124 ${100 + sw} 136 L${100 + ww} 196 L${100 + ww - 16} 196 Z" fill="${SHD}" opacity=".6"/>`;
    if (o.build === "chubby") s += `<ellipse cx="100" cy="174" rx="${ww + 2}" ry="30" fill="${SH}"/>
          <path d="M${100 - ww - 2} 174 A${ww + 2} 30 0 0 0 ${100 + ww + 2} 174" stroke="${OUT}" stroke-width="3" fill="none"/>
          <path d="M${100 - ww - 1} 172 Q${100 - ww - 4} 150 ${100 - sw} 136 M${100 + ww + 1} 172 Q${100 + ww + 4} 150 ${100 + sw} 136" stroke="${OUT}" stroke-width="3" fill="none"/>
          <path d="M${100 + ww - 16} 150 Q${100 + ww} 172 ${100 + ww - 14} 196" stroke="${SHD}" stroke-width="10" fill="none" opacity=".6"/>`;
    if (o.build === "buff") s += `<path d="M78 146 q11 9 21 0 M101 146 q11 9 21 0" stroke="${SHD}" stroke-width="3" fill="none"/>`;
    if (o.stripe) s += `<rect x="${100 - sw + 2}" y="150" width="${sw * 2 - 4}" height="8" fill="${o.stripe}" opacity=".9"/>`;
    if (o.build === "coat") s += `<path d="M100 124 V196" stroke="${OUT}" stroke-width="2.5"/>
          <circle cx="93" cy="146" r="3" fill="${OUT}"/><circle cx="93" cy="166" r="3" fill="${OUT}"/><circle cx="93" cy="186" r="3" fill="${OUT}"/>
          <path d="M84 124 L100 146 L116 124" fill="${shade(SH, 1.25)}" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/>`;
    if (o.logo) s += `<text x="100" y="${o.build === "buff" ? 182 : 178}" text-anchor="middle" font-size="18">${o.logo}</text>`;
  }
  // шея и голова
  s += `<rect x="90" y="110" width="20" height="18" fill="${SD}" stroke="${OUT}" stroke-width="3"/>
        <circle cx="58" cy="86" r="10" fill="${S}" stroke="${OUT}" stroke-width="3"/><circle cx="142" cy="86" r="10" fill="${S}" stroke="${OUT}" stroke-width="3"/>
        <circle cx="100" cy="80" r="43" fill="${S}" stroke="${OUT}" stroke-width="3"/>
        <path d="M128 50 A43 43 0 0 1 128 112 A48 48 0 0 0 128 50Z" fill="${SD}" opacity=".5"/>`;
  s += o.hair();
  // лицо
  const iris = o.iris || "#4a2c16";
  if (o.sly) {
    s += `<path d="M76 88 q8 -6 16 0" stroke="${OUT}" stroke-width="3" fill="none"/><path d="M108 88 q8 -6 16 0" stroke="${OUT}" stroke-width="3" fill="none"/>
          <circle cx="84" cy="91" r="3.5" fill="${OUT}"/><circle cx="116" cy="91" r="3.5" fill="${OUT}"/>
          <path d="M74 78 l18 5 M126 78 l-18 5" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/>`;
  } else {
    s += `<ellipse cx="84" cy="88" rx="8.5" ry="10.5" fill="#fff" stroke="${OUT}" stroke-width="2"/><ellipse cx="116" cy="88" rx="8.5" ry="10.5" fill="#fff" stroke="${OUT}" stroke-width="2"/>
          <circle cx="86" cy="90" r="5.5" fill="${iris}"/><circle cx="118" cy="90" r="5.5" fill="${iris}"/>
          <circle cx="86" cy="90" r="2.8" fill="#000"/><circle cx="118" cy="90" r="2.8" fill="#000"/>
          <circle cx="88" cy="87" r="1.8" fill="#fff"/><circle cx="120" cy="87" r="1.8" fill="#fff"/>
          <path d="${o.brows || "M75 73 q9 -5 18 0 M107 73 q9 -5 18 0"}" stroke="${o.browColor || OUT}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  }
  s += `<path d="M98 97 q3 5 -1 7" stroke="${SD}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (o.mustache) s += `<path d="M80 108 q10 -9 20 -3 q10 -6 20 3 q-10 4 -20 -1 q-10 5 -20 1Z" fill="#5a4030" stroke="${OUT}" stroke-width="2"/>`;
  else s += o.mouth || `<path d="M88 108 Q100 120 112 108 Z" fill="#8a2a2a" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/><path d="M92 110 h16" stroke="#fff" stroke-width="3"/>`;
  if (o.build === "chubby") s += `<path d="M80 121 Q100 131 120 121" stroke="${SD}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  s += `<ellipse cx="72" cy="102" rx="7" ry="4" fill="#ff7a7a" opacity="${o.blush ?? 0.35}"/><ellipse cx="128" cy="102" rx="7" ry="4" fill="#ff7a7a" opacity="${o.blush ?? 0.35}"/>`;
  if (o.beard) s += `<path d="M66 100 Q70 130 100 132 Q130 130 134 100 Q124 118 100 120 Q76 118 66 100Z" fill="${o.beard}" stroke="${OUT}" stroke-width="2.5"/>
                     <path d="M88 110 Q100 118 112 110" stroke="${OUT}" stroke-width="2.5" fill="none"/>`;
  if (o.extra) s += o.extra;
  return s;
}

// ---------- причёски ----------
const hairCurly = (c) => () => {
  let s = `<path d="M58 78 Q58 34 100 34 Q142 34 142 78 Q132 56 100 56 Q68 56 58 78Z" fill="${c}"/>`;
  for (let a = 190; a <= 350; a += 16) {
    const r = (a * Math.PI) / 180;
    s += `<circle cx="${100 + Math.cos(r) * 40}" cy="${76 + Math.sin(r) * 40}" r="11" fill="${c}" stroke="${OUT}" stroke-width="2"/>`;
  }
  s += `<circle cx="86" cy="42" r="12" fill="${c}"/><circle cx="108" cy="40" r="12" fill="${c}"/><circle cx="96" cy="36" r="4" fill="#fff" opacity=".25"/>`;
  return s;
};
const hairMessy = (c) => () =>
  `<path d="M56 84 Q52 36 100 34 Q150 34 144 86 L136 70 L130 80 L122 60 L112 72 L104 58 L94 70 L86 58 L78 74 L70 62 L64 80Z" fill="${c}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
   <path d="M76 44 Q96 34 118 42" stroke="#fff" stroke-width="3" opacity=".3" fill="none"/>`;
const hatTolya = () =>
  `<path d="M58 88 Q56 66 70 60 L74 88Z M142 88 Q144 66 130 60 L126 88Z" fill="#8a8a8a" stroke="${OUT}" stroke-width="2.5"/>
   <rect x="66" y="6" width="68" height="48" rx="6" fill="#26262c" stroke="${OUT}" stroke-width="3"/>
   <rect x="66" y="38" width="68" height="10" fill="#7a2a2a"/>
   <ellipse cx="100" cy="54" rx="58" ry="10" fill="#1d1d22" stroke="${OUT}" stroke-width="3"/>
   <rect x="72" y="10" width="10" height="26" rx="4" fill="#fff" opacity=".12"/>`;
const wrap = (c, tail) => () =>
  `<path d="M56 80 Q54 38 100 36 Q146 38 144 80 Q142 64 100 62 Q58 64 56 80Z" fill="${c}" stroke="${OUT}" stroke-width="3"/>
   <path d="M58 70 Q100 52 142 70" stroke="${shade(c, 0.75)}" stroke-width="4" fill="none"/>
   ${tail ? `<path d="M138 62 Q162 70 158 104 Q150 88 136 78Z" fill="${c}" stroke="${OUT}" stroke-width="3"/>` : ""}`;

// ---------- предметы ----------
const hammer = `<rect x="160" y="96" width="9" height="160" rx="4" fill="#8a5a2b" stroke="${OUT}" stroke-width="3"/>
  <rect x="140" y="70" width="50" height="36" rx="6" fill="#9aa0ad" stroke="${OUT}" stroke-width="3"/>
  <rect x="140" y="70" width="50" height="10" rx="4" fill="#c9ced8"/><rect x="140" y="98" width="50" height="8" fill="#6f7482"/>`;
const candy = (x, y) => `<g transform="translate(${x} ${y})"><polygon points="-22,-9 -10,0 -22,9" fill="#ffd1e6" stroke="${OUT}" stroke-width="2"/>
  <polygon points="22,-9 10,0 22,9" fill="#ffd1e6" stroke="${OUT}" stroke-width="2"/><ellipse rx="13" ry="10" fill="#ff5fa2" stroke="${OUT}" stroke-width="2.5"/>
  <path d="M-6 -8 L2 8 M4 -9 L10 4" stroke="#fff" stroke-width="2.5"/></g>`;
const money = `<g transform="translate(160 186) rotate(-12)"><rect x="-20" y="-11" width="40" height="22" rx="3" fill="#8fd18f" stroke="${OUT}" stroke-width="2.5"/>
  <circle r="7" fill="#6ab36a"/><text y="4.5" text-anchor="middle" font-size="11" font-weight="700" fill="#1f4f1f">$</text><text x="-14" y="-3" font-size="7" fill="#1f4f1f">100</text></g>`;

// ---------- звери ----------
function lion() {
  let mane = "";
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    mane += `<circle cx="${176 + Math.cos(a) * 34}" cy="${84 + Math.sin(a) * 34}" r="18" fill="${i % 2 ? "#a0521d" : "#c26a2a"}" stroke="${OUT}" stroke-width="2"/>`;
  }
  return `<ellipse cx="125" cy="186" rx="95" ry="10" fill="#000" opacity=".18"/>
    <path d="M52 118 Q16 108 20 64" stroke="${OUT}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M52 118 Q16 108 20 64" stroke="#d9a441" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="20" cy="58" rx="10" ry="13" fill="#8a4b1c" stroke="${OUT}" stroke-width="2.5"/>
    <rect x="58" y="126" width="22" height="56" rx="10" fill="#c8923a" stroke="${OUT}" stroke-width="3"/>
    <rect x="148" y="126" width="22" height="56" rx="10" fill="#c8923a" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="116" cy="118" rx="74" ry="44" fill="#e0a84a" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="116" cy="138" rx="54" ry="18" fill="#f0c878" opacity=".8"/>
    <rect x="78" y="130" width="22" height="54" rx="10" fill="#e0a84a" stroke="${OUT}" stroke-width="3"/>
    <rect x="164" y="130" width="22" height="54" rx="10" fill="#e0a84a" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="89" cy="182" rx="15" ry="7" fill="#f0c878" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="175" cy="182" rx="15" ry="7" fill="#f0c878" stroke="${OUT}" stroke-width="2.5"/>
    ${mane}
    <circle cx="160" cy="58" r="9" fill="#e8b458" stroke="${OUT}" stroke-width="2.5"/><circle cx="196" cy="58" r="9" fill="#e8b458" stroke="${OUT}" stroke-width="2.5"/>
    <circle cx="178" cy="88" r="30" fill="#e8b458" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="180" cy="104" rx="17" ry="12" fill="#f7dca0" stroke="${OUT}" stroke-width="2"/>
    <path d="M172 96 L188 96 L180 104Z" fill="#4a2a1a"/>
    <path d="M180 104 v5 M180 109 q-6 5 -11 1 M180 109 q6 5 11 1" stroke="${OUT}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M162 76 l12 4 M196 76 l-12 4" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="168" cy="84" rx="5" ry="6" fill="#fff"/><ellipse cx="190" cy="84" rx="5" ry="6" fill="#fff"/>
    <circle cx="169" cy="85" r="3" fill="#6a3a0a"/><circle cx="191" cy="85" r="3" fill="#6a3a0a"/>`;
}
function ant() {
  const leg = (x, y, dx, dy2) => `<path d="M${x} ${y} L${x + dx} ${y + 26} L${x + dx + dy2} ${y + 62}" stroke="${OUT}" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M${x} ${y} L${x + dx} ${y + 26} L${x + dx + dy2} ${y + 62}" stroke="#6a1d0c" stroke-width="4.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  return `<ellipse cx="125" cy="186" rx="100" ry="10" fill="#000" opacity=".18"/>
    ${leg(118, 118, -34, -8)}${leg(126, 120, -6, -4)}${leg(134, 118, 22, 10)}
    <ellipse cx="62" cy="116" rx="48" ry="36" fill="#8b2a14" stroke="${OUT}" stroke-width="3"/>
    <path d="M40 90 Q34 116 42 144 M62 82 Q56 116 62 152 M84 86 Q80 116 86 146" stroke="#6a1d0c" stroke-width="4" fill="none"/>
    <ellipse cx="48" cy="98" rx="16" ry="8" fill="#fff" opacity=".25" transform="rotate(-20 48 98)"/>
    <ellipse cx="110" cy="116" rx="9" ry="8" fill="#7a2410" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="134" cy="112" rx="26" ry="17" fill="#9b3a1c" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="128" cy="104" rx="10" ry="4" fill="#fff" opacity=".25"/>
    <path d="M176 76 Q180 34 196 30 Q206 30 214 16 M186 78 Q200 46 216 46 Q226 44 232 32" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="180" cy="100" r="28" fill="#8b2a14" stroke="${OUT}" stroke-width="3"/>
    <path d="M198 118 Q222 118 218 136 Q210 126 196 128Z M190 124 Q206 140 196 150 Q192 136 184 130Z" fill="#4a1508" stroke="${OUT}" stroke-width="2.5"/>
    <ellipse cx="190" cy="94" rx="9" ry="10" fill="#111"/><circle cx="193" cy="90" r="3" fill="#fff"/>
    <path d="M176 80 l20 8" stroke="${OUT}" stroke-width="4.5" stroke-linecap="round"/>
    <ellipse cx="168" cy="88" rx="8" ry="5" fill="#fff" opacity=".22"/>`;
}
function fatMan(x0, clean) {
  const S = clean ? "#f3d6bc" : "#6d4a2b", SD = shade(S, 0.82);
  const g = (s) => `<g transform="translate(${x0} 0)">${s}</g>`;
  let s = `<ellipse cx="100" cy="258" rx="82" ry="10" fill="#000" opacity=".2"/>
    <rect x="66" y="210" width="28" height="42" rx="10" fill="${S}" stroke="${OUT}" stroke-width="3"/><rect x="106" y="210" width="28" height="42" rx="10" fill="${S}" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="78" cy="252" rx="18" ry="8" fill="#4a3b2a" stroke="${OUT}" stroke-width="3"/><ellipse cx="122" cy="252" rx="18" ry="8" fill="#4a3b2a" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="28" cy="160" rx="14" ry="30" fill="${S}" stroke="${OUT}" stroke-width="3" transform="rotate(18 28 160)"/>
    <ellipse cx="172" cy="160" rx="14" ry="30" fill="${S}" stroke="${OUT}" stroke-width="3" transform="rotate(-18 172 160)"/>
    <ellipse cx="100" cy="160" rx="74" ry="66" fill="${S}" stroke="${OUT}" stroke-width="3"/>
    <path d="M140 108 Q176 150 146 214 Q170 160 140 108Z" fill="${SD}" opacity=".6"/>
    <path d="M72 150 q12 6 22 0 M106 150 q12 6 22 0" stroke="${SD}" stroke-width="3" fill="none"/>
    <circle cx="100" cy="182" r="4" fill="${SD}"/>
    <path d="M38 196 Q100 232 162 196 L156 218 Q100 244 44 218Z" fill="#4a3b2a" stroke="${OUT}" stroke-width="3"/>
    <circle cx="100" cy="74" r="36" fill="${S}" stroke="${OUT}" stroke-width="3"/>
    <path d="M70 60 Q76 36 100 38 Q126 36 130 60 Q118 48 100 50 Q82 48 70 60Z" fill="#3a2a1a"/>
    <ellipse cx="88" cy="76" rx="6" ry="7" fill="#fff" stroke="${OUT}" stroke-width="2"/><ellipse cx="112" cy="76" rx="6" ry="7" fill="#fff" stroke="${OUT}" stroke-width="2"/>
    <circle cx="89" cy="78" r="3" fill="#000"/><circle cx="113" cy="78" r="3" fill="#000"/>
    <path d="M80 66 l12 3 M120 66 l-12 3" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>
    <path d="M90 94 q10 -6 20 0" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="80" cy="88" rx="8" ry="5" fill="${SD}" opacity=".6"/><ellipse cx="120" cy="88" rx="8" ry="5" fill="${SD}" opacity=".6"/>`;
  if (clean) {
    s += `<ellipse cx="70" cy="130" rx="7" ry="5" fill="#6d4a2b"/><ellipse cx="128" cy="182" rx="9" ry="5" fill="#6d4a2b"/><ellipse cx="112" cy="62" rx="5" ry="3" fill="#6d4a2b"/>
      <rect x="186" y="20" width="7" height="236" rx="3" fill="#8a5a2b" stroke="${OUT}" stroke-width="2.5" transform="rotate(8 190 140)"/>
      <path d="M198 0 L186 30 L204 32Z" fill="#c9ced8" stroke="${OUT}" stroke-width="2.5" transform="rotate(8 190 140)"/>`;
  } else {
    s += `<path d="M40 150 q4 18 0 24 q-6 -8 0 -24Z M150 196 q4 14 0 20 q-5 -8 0 -20Z M100 106 q3 10 0 14 q-4 -6 0 -14Z" fill="#4a2f18"/>
      <circle cx="64" cy="132" r="9" fill="#4a2f18" opacity=".7"/><circle cx="132" cy="160" r="12" fill="#4a2f18" opacity=".6"/><circle cx="92" cy="200" r="7" fill="#4a2f18" opacity=".6"/>
      <circle cx="116" cy="56" r="5" fill="#4a2f18" opacity=".7"/>`;
  }
  return g(s);
}


const svgDoc = (w, h, inner, vb) => `<svg viewBox="${vb || `0 0 ${w} ${h}`}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

// Внешность героев (одна на все страницы)
const CHAR = {
  gorilan: { skin: "#6b4128", shirt: "#e2553f", pants: "#2b3a67", shoes: "#f2f2f2", build: "buff", hair: hairCurly("#161010"), iris: "#2a1608", blush: 0.18, logo: "⚡",
    brows: "M74 72 q9 -7 19 -1 M107 71 q10 -6 19 1" },
  roma: { skin: "#f6d3b5", shirt: "#4fa3e0", stripe: "#ffffff", pants: "#5b5f6e", shoes: "#e25a5a", build: "thin", hair: hairMessy("#b7773a"), iris: "#4a86c6", browColor: "#8a5424" },
  tolya: { skin: "#efc6a2", shirt: "#6b6b73", pants: "#2c2c33", shoes: "#1d1d22", build: "coat", longSleeve: true, hair: hatTolya, sly: true, mustache: true, blush: 0.2 },
  villager: { skin: "#b98556", shirt: "#efe3c4", trim: "#d9534f", build: "normal", robe: true, hair: wrap("#d9534f", true), beard: "#9a9a9a", blush: 0.15 },
  villager2: { skin: "#a8744a", shirt: "#c9d6a3", trim: "#3c7dc4", build: "thin", robe: true, hair: wrap("#3c7dc4", false), blush: 0.15,
    brows: "M74 70 q9 -8 19 -2 M107 68 q10 -4 19 4",
    mouth: `<ellipse cx="100" cy="111" rx="7" ry="6" fill="#8a2a2a" stroke="${OUT}" stroke-width="2.5"/>` },
  player: { skin: "#f0c8a0", shirt: "#f08a3c", pants: "#3a3a48", shoes: "#6b4a2b", build: "normal", hair: hairMessy("#5a3620"), iris: "#3a6a3a", logo: "🎒" },
};

// ---------- Книга 2 ----------
const hairLong = (c) => () =>
  `<path d="M56 84 Q52 34 100 33 Q148 34 144 84 Q140 60 112 54 Q96 70 60 86Z" fill="${c}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
   <path d="M74 44 Q96 34 118 42" stroke="#fff" stroke-width="3" opacity=".25" fill="none"/>`;
const hairLongBack = (c) => () =>
  `<path d="M54 76 Q44 150 62 176 Q100 186 138 176 Q156 150 146 76Z" fill="${c}" stroke="${OUT}" stroke-width="3"/>`;
const hairBun = (c) => () =>
  `<circle cx="100" cy="30" r="17" fill="${c}" stroke="${OUT}" stroke-width="3"/>
   <path d="M56 82 Q54 36 100 36 Q146 36 144 82 Q134 56 100 54 Q66 56 56 82Z" fill="${c}" stroke="${OUT}" stroke-width="3"/>`;
const flashlight = `<g transform="translate(138 200) rotate(-25)"><path d="M-10 -36 L-38 -96 L38 -96 L10 -36Z" fill="#fff6b0" opacity=".5"/>
  <rect x="-7" y="-30" width="14" height="34" rx="3" fill="#3a3a44" stroke="${OUT}" stroke-width="2.5"/><rect x="-10" y="-40" width="20" height="12" rx="3" fill="#6a6a78" stroke="${OUT}" stroke-width="2.5"/>
  <rect x="-7" y="-40" width="14" height="4" fill="#fff6b0"/></g>`;
const iceCream = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-11 -4 L0 26 L11 -4Z" fill="#e2a55a" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M-6 2 L4 12 M0 -2 L7 5" stroke="#b97a35" stroke-width="2"/>
  <circle cx="0" cy="-10" r="11" fill="#ff9ec4" stroke="${OUT}" stroke-width="2.5"/><circle cx="-4" cy="-22" r="9" fill="#fff4d6" stroke="${OUT}" stroke-width="2.5"/>
  <circle cx="-7" cy="-25" r="2.5" fill="#fff"/><circle cx="3" cy="-8" r="1.5" fill="#e2553f"/><circle cx="-3" cy="-4" r="1.5" fill="#4fa3e0"/></g>`;
const pelmeniBowl = (x, y) => `<g transform="translate(${x} ${y})">
  <path d="M-10 -8 q5 -10 10 0 q-5 4 -10 0Z M0 -10 q5 -10 10 0 q-5 4 -10 0Z M-18 -6 q5 -10 10 0 q-5 4 -10 0Z M8 -6 q5 -10 10 0 q-5 4 -10 0Z" fill="#fff4dc" stroke="${OUT}" stroke-width="2"/>
  <path d="M-24 -6 H24 Q22 18 0 18 Q-22 18 -24 -6Z" fill="#4fa3e0" stroke="${OUT}" stroke-width="2.5"/><path d="M-20 0 H20" stroke="#fff" stroke-width="2" opacity=".6"/>
  <path d="M-6 -18 q-3 -6 0 -10 M4 -18 q-3 -6 0 -10" stroke="#fff" stroke-width="2" opacity=".7" fill="none"/></g>`;
const fryingPan = `<g transform="translate(150 196) rotate(20)"><rect x="-4" y="-50" width="8" height="36" rx="3" fill="#6b4a2b" stroke="${OUT}" stroke-width="2.5"/>
  <ellipse cx="0" cy="0" rx="26" ry="18" fill="#3a3a44" stroke="${OUT}" stroke-width="3"/><ellipse cx="0" cy="-2" rx="18" ry="11" fill="#555"/>
  <ellipse cx="-4" cy="-3" rx="8" ry="6" fill="#fff"/><circle cx="-3" cy="-3" r="3.5" fill="#ffc83a"/></g>`;
const apron = `<path d="M78 150 H122 L128 214 H72Z" fill="#fff" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="88" y="170" width="24" height="14" rx="3" fill="#ffd1e6" stroke="${OUT}" stroke-width="2"/>`;

function kitten(x0, weirdEar) {
  const W_ = "#fbfbff", SH = "#dfe2ee";
  return `<g transform="translate(${x0} 0)">
    <ellipse cx="100" cy="150" rx="62" ry="8" fill="#000" opacity=".18"/>
    <path d="M150 128 Q186 118 176 78" stroke="${OUT}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M150 128 Q186 118 176 78" stroke="${W_}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="118" cy="120" rx="44" ry="30" fill="${W_}" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="96" cy="142" rx="10" ry="8" fill="${W_}" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="140" cy="142" rx="10" ry="8" fill="${W_}" stroke="${OUT}" stroke-width="2.5"/>
    <path d="M54 58 L60 18 L84 44Z" fill="${W_}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M60 50 L62 30 L76 44Z" fill="#ffb3c7"/>
    ${weirdEar
      ? `<path d="M110 44 L136 34 L128 56Z" fill="${W_}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M118 36 l6 6 m-2 -8 l6 6" stroke="${OUT}" stroke-width="2"/>`
      : `<path d="M110 44 L128 14 L136 56Z" fill="${W_}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/><path d="M116 46 L126 26 L130 50Z" fill="#ffb3c7"/>`}
    <circle cx="94" cy="76" r="40" fill="${W_}" stroke="${OUT}" stroke-width="3"/>
    <path d="M118 52 A40 40 0 0 1 118 102 A44 44 0 0 0 118 52Z" fill="${SH}"/>
    <ellipse cx="80" cy="76" rx="7" ry="9" fill="#2f5d9a"/><ellipse cx="108" cy="76" rx="7" ry="9" fill="#2f5d9a"/>
    <circle cx="82" cy="73" r="2.5" fill="#fff"/><circle cx="110" cy="73" r="2.5" fill="#fff"/>
    <path d="M90 88 L98 88 L94 93Z" fill="#ff8aa8"/><path d="M94 93 q-5 6 -10 2 M94 93 q5 6 10 2" stroke="${OUT}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M66 88 l-20 -3 M66 93 l-20 3 M122 88 l20 -3 M122 93 l20 3" stroke="${OUT}" stroke-width="1.8"/>
    <ellipse cx="70" cy="90" rx="6" ry="3.5" fill="#ffb3c7" opacity=".6"/><ellipse cx="118" cy="90" rx="6" ry="3.5" fill="#ffb3c7" opacity=".6"/></g>`;
}

function blueMonster(sleeping) {
  let crystals = "";
  const pts = [[70, 150], [110, 120], [150, 160], [90, 196], [140, 206], [60, 210], [168, 120]];
  pts.forEach(([x, y], i) => { crystals += `<path d="M${x} ${y - 16} L${x + 10} ${y} L${x} ${y + 16} L${x - 10} ${y}Z" fill="${i % 2 ? "#8fd8ff" : "#b8e8ff"}" stroke="#2a5d9a" stroke-width="2" opacity=".9"/>`; });
  return `<ellipse cx="120" cy="252" rx="100" ry="10" fill="#000" opacity=".2"/>
    <rect x="70" y="200" width="36" height="50" rx="16" fill="#3a7fd0" stroke="${OUT}" stroke-width="3"/><rect x="136" y="200" width="36" height="50" rx="16" fill="#2f6fbf" stroke="${OUT}" stroke-width="3"/>
    <path d="M40 150 Q10 170 22 214 Q36 222 44 206 Q40 180 60 168Z" fill="#3a7fd0" stroke="${OUT}" stroke-width="3"/>
    <path d="M200 150 Q232 170 220 214 Q206 222 198 206 Q202 180 182 168Z" fill="#2f6fbf" stroke="${OUT}" stroke-width="3"/>
    <path d="M44 110 Q40 40 120 36 Q200 40 196 110 L190 214 Q120 232 50 214Z" fill="#4a90e2" stroke="${OUT}" stroke-width="3"/>
    <path d="M160 44 Q200 60 196 110 L190 214 Q176 218 164 220 Q180 140 160 44Z" fill="#2f6fbf" opacity=".6"/>
    ${crystals}
    <path d="M62 60 Q70 30 120 30 Q170 30 178 60 Q170 70 166 62 Q162 84 154 66 Q148 58 140 74 Q134 92 126 70 Q118 60 110 78 Q102 96 94 70 Q88 60 80 76 Q72 88 70 66 Q64 70 62 60Z"
      fill="#c2562a" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M78 42 Q100 34 124 38" stroke="#ffb07a" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${sleeping
      ? `<path d="M86 118 Q120 140 154 118" stroke="${OUT}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M96 128 l-4 8 M120 134 v9 M144 128 l4 8" stroke="${OUT}" stroke-width="3" stroke-linecap="round"/>`
      : `<ellipse cx="120" cy="116" rx="34" ry="32" fill="#fff" stroke="${OUT}" stroke-width="3"/>
    <circle cx="120" cy="118" r="26" fill="#0a0a12"/><circle cx="110" cy="108" r="7" fill="#fff" opacity=".85"/><circle cx="130" cy="126" r="3" fill="#fff" opacity=".5"/>`}
    <path d="M92 170 Q120 190 148 170" stroke="${OUT}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M104 176 l4 8 l4 -7 M128 177 l4 7 l4 -8" fill="#fff" stroke="${OUT}" stroke-width="2"/>`;
}

function crayfish(x, y, sc, flip) {
  const R = "#e0452e", RD = "#b8321f";
  const claw = (cx, cy, r) => `<g transform="translate(${cx} ${cy}) rotate(${r})"><path d="M0 0 Q-6 -24 8 -34 Q18 -26 12 -14 Q22 -18 22 -6 Q10 4 0 0Z" fill="${R}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})">
    <ellipse cx="0" cy="34" rx="70" ry="7" fill="#000" opacity=".18"/>
    <path d="M-30 10 L-44 -30 M-20 12 L-40 -34" stroke="${OUT}" stroke-width="2.5" fill="none"/>
    <path d="M-8 20 l-10 14 M4 22 l-6 14 M16 22 l0 14 M28 20 l6 14" stroke="${RD}" stroke-width="4" stroke-linecap="round"/>
    ${claw(-26, 8, -30)}${claw(-18, 14, 10)}
    <path d="M62 14 L82 2 L84 30Z" fill="${R}" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="46" cy="16" rx="18" ry="12" fill="${R}" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="22" cy="16" rx="16" ry="14" fill="${R}" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="-8" cy="12" rx="26" ry="18" fill="${R}" stroke="${OUT}" stroke-width="3"/>
    <path d="M30 6 v20 M48 8 v16" stroke="${RD}" stroke-width="3"/>
    <ellipse cx="-14" cy="4" rx="10" ry="5" fill="#fff" opacity=".3"/>
    <circle cx="-26" cy="2" r="5" fill="#fff" stroke="${OUT}" stroke-width="2"/><circle cx="-27" cy="2" r="2.5" fill="#000"/>
    <path d="M-32 18 q4 4 8 0" stroke="${OUT}" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
}

Object.assign(CHAR, {
  romomeo: { skin: "#f1c9a5", shirt: "#3f8f5a", stripe: "#f2c14e", pants: "#4a4a3a", shoes: "#6b4a2b", build: "normal", hair: hairMessy("#1f1a18"), iris: "#4a2c16", logo: "🧭", blush: 0.25 },
  omeshkin: { skin: "#f1c9a5", shirt: "#3f6fd6", pants: "#3a3a48", shoes: "#2c2c33", build: "chubby", hair: hairMessy("#3a2618"), iris: "#5a3a1a", logo: "🍬", blush: 0.3 },
  pelmeshkin: { skin: "#e9b98f", shirt: "#f2c14e", pants: "#6b4a2b", shoes: "#3a3a44", build: "normal", hair: hairMessy("#b7773a"), iris: "#3a6a3a", logo: "🥟",
    browColor: "#8a5424", brows: "M74 70 q9 -7 19 0 M107 70 q10 -7 19 0" },
  amira: { skin: "#f3cfb0", shirt: "#9b6fd6", trim: "#ffcf6b", build: "thin", robe: true, hair: hairLong("#2a1a12"), backHair: hairLongBack("#2a1a12"), iris: "#4a2c16", blush: 0.45,
    mouth: `<path d="M90 108 Q100 116 110 108" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  mama: { skin: "#f0c8a4", shirt: "#4f9d8f", trim: "#2f6f63", build: "normal", robe: true, hair: hairBun("#4a2a1a"), iris: "#4a2c16", blush: 0.4, extra: apron,
    brows: "M74 70 q9 -8 19 -2 M107 68 q10 -6 19 2",
    mouth: `<path d="M90 110 Q100 104 110 110" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
});
