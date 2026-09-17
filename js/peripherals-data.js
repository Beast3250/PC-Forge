// ============================================================================
// PERIPHERALS DATA — Separate from main PRODUCTS (Keyboards, Mice, Controllers, Monitors)
// ============================================================================

const PERIPHERALS = [
  // ===================== KEYBOARDS =====================
  {
    id: "kb-corsair-k100",
    cat: "keyboard",
    name: "Corsair K100 RGB",
    brand: "Corsair",
    tag: "Flagship Mechanical",
    price: 229,
    spec: "OPX Rapid Trigger · iCUE Control Wheel · PBT Keycaps · Per-Key RGB",
    image: "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Keyboards/CH-912A01A-NA/Gallery/K100_AIR_01.webp",
    inStock: true,
  },
  {
    id: "kb-razer-huntsman-v3",
    cat: "keyboard",
    name: "Razer Huntsman V3 Pro",
    brand: "Razer",
    tag: "Analog Optical",
    price: 249,
    spec: "Analog Optical Switches · Rapid Trigger · Magnetic Wrist Rest · Chroma RGB",
    image: "https://assets2.razerzone.com/images/pnx.assets/7a4b72c0a4a3a6ba47e1ebb0eb71bf4c/razer-huntsman-v3-pro-mini-usp-desktop-2.webp",
    inStock: true,
  },
  {
    id: "kb-steelseries-apex-pro",
    cat: "keyboard",
    name: "SteelSeries Apex Pro TKL",
    brand: "SteelSeries",
    tag: "Adjustable Actuation",
    price: 189,
    spec: "OmniPoint 3.0 Switches · 0.1mm Actuation · OLED Display · Aircraft Aluminum",
    image: "https://media.steelseriescdn.com/thumbs/catalog/items/64856/bc5a8ed2a15a4533ae0c81ac91141781.png.500x400_q100_crop-fit_optimize.png",
    inStock: true,
  },
  {
    id: "kb-logitech-g915x",
    cat: "keyboard",
    name: "Logitech G915 X TKL",
    brand: "Logitech",
    tag: "Low Profile Wireless",
    price: 199,
    spec: "GL Tactile · LIGHTSPEED Wireless · 36hr Battery · RGB LIGHTSYNC",
    image: "https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g915x-tkl/gallery/g915-x-tkl-gallery-1-black.png",
    inStock: true,
  },
  {
    id: "kb-razer-blackwidow-v4",
    cat: "keyboard",
    name: "Razer BlackWidow V4 75%",
    brand: "Razer",
    tag: "Hot-Swappable",
    price: 179,
    spec: "Orange Tactile Switches · Hot-Swap · Knob · Gasket-Mount · Chroma RGB",
    image: "https://assets2.razerzone.com/images/pnx.assets/618ac9da3b9e937db6a9fe173f204be0/razer-blackwidow-v4-75-usp7-desktop.webp",
    inStock: true,
  },

  // ===================== MICE =====================
  {
    id: "mouse-razer-deathadder-v3",
    cat: "mouse",
    name: "Razer DeathAdder V3 Pro",
    brand: "Razer",
    tag: "Ergonomic Wireless",
    price: 149,
    spec: "Focus Pro 30K Sensor · 63g Ultralight · 90hr Battery · HyperSpeed Wireless",
    image: "https://assets2.razerzone.com/images/pnx.assets/a1cb848182295e14319fb6e74c2e5dce/razer-deathadder-v3-pro-hero-desktop.webp",
    inStock: true,
  },
  {
    id: "mouse-logitech-gpx2",
    cat: "mouse",
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech",
    tag: "Esports Pro",
    price: 159,
    spec: "HERO 2 Sensor 44K DPI · 60g · LIGHTSPEED · POWERPLAY Compatible",
    image: "https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x2-superlight/gallery/pro-x2-superlight-gallery-1-black.png",
    inStock: true,
  },
  {
    id: "mouse-steelseries-aerox5",
    cat: "mouse",
    name: "SteelSeries Aerox 5 Wireless",
    brand: "SteelSeries",
    tag: "Ultra Lightweight",
    price: 129,
    spec: "TrueMove Air Sensor · 74g · 180hr Battery · 9 Programmable Buttons",
    image: "https://media.steelseriescdn.com/thumbs/catalog/items/62406/77d376a2c7074e23b5353f10f8fc0102.png.500x400_q100_crop-fit_optimize.png",
    inStock: true,
  },
  {
    id: "mouse-corsair-m75",
    cat: "mouse",
    name: "Corsair M75 Air Wireless",
    brand: "Corsair",
    tag: "Featherweight",
    price: 129,
    spec: "MARKSMAN 26K Sensor · 60g · SLIPSTREAM Wireless · 100hr Battery",
    image: "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Gaming-Mice/CH-931D100-NA/Gallery/M75_AIR_WHITE_01.webp",
    inStock: true,
  },
  {
    id: "mouse-razer-viper-v3",
    cat: "mouse",
    name: "Razer Viper V3 Pro",
    brand: "Razer",
    tag: "Symmetrical Esports",
    price: 159,
    spec: "Focus Pro 35K · 54g · HyperSpeed · 95hr Battery · Optical Switches Gen-3",
    image: "https://assets2.razerzone.com/images/pnx.assets/6ab0e1c5476d87a71f2a5f1f4b600f77/razer-viper-v3-pro-hero-desktop.webp",
    inStock: true,
  },

  // ===================== CONTROLLERS =====================
  {
    id: "ctrl-ps5-dualsense-edge",
    cat: "controller",
    name: "PlayStation DualSense Edge",
    brand: "PlayStation",
    tag: "Pro Controller",
    price: 199,
    spec: "Changeable Stick Caps & Back Buttons · Adaptive Triggers · Haptic Feedback · Custom Profiles",
    image: "https://media.direct.playstation.com/is/image/sierialto/dualsense-edge-accessory-image-block-01-en-12oct22",
    inStock: true,
  },
  {
    id: "ctrl-xbox-elite2",
    cat: "controller",
    name: "Xbox Elite Series 2 Core",
    brand: "Xbox",
    tag: "Pro Wireless",
    price: 139,
    spec: "Adjustable Tension Thumbsticks · 40hr Battery · Wraparound Rubberized Grip · Bluetooth + USB-C",
    image: "https://assets.xboxservices.com/assets/34/19/341913c0-f4b6-4e8f-829a-e83fe6018afe.png",
    inStock: true,
  },
  {
    id: "ctrl-steelseries-stratus",
    cat: "controller",
    name: "SteelSeries Stratus+",
    brand: "SteelSeries",
    tag: "Android/PC",
    price: 59,
    spec: "Hall Effect Triggers · 90hr Battery · USB-C · Detachable Phone Mount",
    image: "https://media.steelseriescdn.com/thumbs/catalog/items/69076/b3b5f88ffb5245818f27f6dbef6a0f92.png.500x400_q100_crop-fit_optimize.png",
    inStock: true,
  },
  {
    id: "ctrl-razer-wolverine-v3",
    cat: "controller",
    name: "Razer Wolverine V3 Pro",
    brand: "Razer",
    tag: "Tournament Edition",
    price: 299,
    spec: "Razer Mecha-Tactile Buttons · HyperTrigger · 6 Remappable Buttons · Chroma RGB",
    image: "https://assets2.razerzone.com/images/pnx.assets/05afb30d0660dd04f9a3dfd4432d0fc3/razer-wolverine-v3-pro_hero-desktop.webp",
    inStock: true,
  },
  {
    id: "ctrl-8bitdo-ultimate",
    cat: "controller",
    name: "8BitDo Ultimate 2.4G",
    brand: "8BitDo",
    tag: "Hall Effect",
    price: 49,
    spec: "Hall Effect Sticks & Triggers · 2.4GHz + Bluetooth · Charging Dock Included",
    image: "https://www.8bitdo.com/images/ultimate/ultimate-24g/ultimate-24g-product.png",
    inStock: true,
  },

  // ===================== MONITORS =====================
  {
    id: "mon-asus-pg27aqdp",
    cat: "monitor",
    name: "ASUS ROG Swift PG27AQDP",
    brand: "ASUS",
    tag: "360Hz QD-OLED",
    price: 999,
    spec: '27" QD-OLED · 2560×1440 · 360Hz · 0.03ms · G-Sync Compatible · HDR True Black 400',
    image: "https://dlcdnwebimgs.asus.com/gain/1dbd8f3a-09f3-4d20-ac9d-cdf4ba0a54d1/w800",
    inStock: true,
  },
  {
    id: "mon-dell-aw3225qf",
    cat: "monitor",
    name: "Dell Alienware AW3225QF",
    brand: "Dell",
    tag: "4K QD-OLED Curved",
    price: 1099,
    spec: '32" QD-OLED · 3840×2160 · 240Hz · 0.03ms · Curved 1700R · Dolby Vision',
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/alienware/aw3225qf/media-gallery/monitor-alienware-aw3225qf-bk-gallery-1.psd",
    inStock: true,
  },
  {
    id: "mon-hp-omen-27qs",
    cat: "monitor",
    name: "HP OMEN 27qs QD-OLED",
    brand: "HP",
    tag: "240Hz QD-OLED",
    price: 449,
    spec: '27" QD-OLED · 2560×1440 · 240Hz · 0.03ms · AMD FreeSync Premium Pro · HDR True Black 400',
    image: "https://www.hp.com/content/dam/sites/worldwide/personal-computers/consumer/gaming/omen-monitors/omen-27qs/HP_OMEN_27qs_QHD_OLED_Front.png",
    inStock: true,
  },
  {
    id: "mon-lenovo-y27qf",
    cat: "monitor",
    name: "Lenovo Legion Y27qf-30",
    brand: "Lenovo",
    tag: "240Hz IPS",
    price: 349,
    spec: '27" IPS · 2560×1440 · 240Hz · 0.5ms · AMD FreeSync Premium · 95% DCI-P3',
    image: "https://p4-ofp.static.pub/fes/cms/2024/03/06/kvevjp4qcnggw89a5t11t2gumcpgey171523.png",
    inStock: true,
  },
  {
    id: "mon-lg-27gr95qe",
    cat: "monitor",
    name: "LG UltraGear 27GS95QE",
    brand: "LG",
    tag: "WOLED 240Hz",
    price: 799,
    spec: '27" WOLED · 2560×1440 · 240Hz · 0.03ms · G-Sync Compatible · Anti-Glare Low Reflection',
    image: "https://www.lg.com/content/dam/channel/wcms/global/products/monitor/27gs95qe-b/gallery/27GS95QE-B_01.jpg",
    inStock: true,
  },
];

// Category labels for peripherals
const PERIPH_CAT_LABEL = {
  keyboard: "⌨️ Keyboard",
  mouse: "🖱️ Mouse",
  controller: "🎮 Controller",
  monitor: "🖥️ Monitor",
};

// Brand accent colors for SVG mockups
const PERIPH_BRAND_COLORS = {
  Razer: "#00ff88",
  Corsair: "#00e5ff",
  SteelSeries: "#ff6a00",
  Logitech: "#38bdf8",
  PlayStation: "#006FCD",
  Xbox: "#107c10",
  "8BitDo": "#f59e0b",
  ASUS: "#e11d48",
  Dell: "#06b6d4",
  HP: "#ec4899",
  Lenovo: "#3b82f6",
  LG: "#a855f7",
};

// Generates high-fidelity vector product illustrations as fallbacks
function getPeriphFallbackSvg(id) {
  const p = PERIPHERALS.find((x) => x.id === id);
  const brand = p ? p.brand : "Brand";
  const cat = p ? p.cat : "item";
  const name = p ? p.name : "Peripheral";
  const color = PERIPH_BRAND_COLORS[brand] || "#10b981";

  let visual = "";

  if (cat === "keyboard") {
    visual = `
      <g transform="translate(40, 65)">
        <!-- Keyboard Chassis -->
        <rect x="0" y="0" width="320" height="150" rx="14" fill="#14141f" stroke="${color}" stroke-width="2" stroke-opacity="0.4" filter="url(#glow)"/>
        <rect x="3" y="3" width="314" height="144" rx="12" fill="url(#kbGrad)"/>
        <!-- Top bar with brand & volume dial -->
        <rect x="15" y="10" width="290" height="14" rx="4" fill="#0d0e15"/>
        <circle cx="285" cy="17" r="5" fill="#2d3748" stroke="${color}" stroke-width="1.5"/>
        <!-- Key rows -->
        <g fill="#1f2438" rx="3">
          <!-- Row 1 -->
          <rect x="15" y="32" width="20" height="18" rx="3"/>
          <rect x="39" y="32" width="20" height="18" rx="3"/>
          <rect x="63" y="32" width="20" height="18" rx="3"/>
          <rect x="87" y="32" width="20" height="18" rx="3"/>
          <rect x="111" y="32" width="20" height="18" rx="3"/>
          <rect x="135" y="32" width="20" height="18" rx="3"/>
          <rect x="159" y="32" width="20" height="18" rx="3"/>
          <rect x="183" y="32" width="20" height="18" rx="3"/>
          <rect x="207" y="32" width="20" height="18" rx="3"/>
          <rect x="231" y="32" width="20" height="18" rx="3"/>
          <rect x="255" y="32" width="50" height="18" rx="3" fill="#2d3748"/>
          <!-- Row 2 (WASD glowing) -->
          <rect x="15" y="54" width="28" height="18" rx="3" fill="#2d3748"/>
          <rect x="47" y="54" width="20" height="18" rx="3"/>
          <rect x="71" y="54" width="20" height="18" rx="3" fill="${color}" fill-opacity="0.75"/>
          <rect x="95" y="54" width="20" height="18" rx="3"/>
          <rect x="119" y="54" width="20" height="18" rx="3"/>
          <rect x="143" y="54" width="20" height="18" rx="3"/>
          <rect x="167" y="54" width="20" height="18" rx="3"/>
          <rect x="191" y="54" width="20" height="18" rx="3"/>
          <rect x="215" y="54" width="20" height="18" rx="3"/>
          <rect x="239" y="54" width="20" height="18" rx="3"/>
          <rect x="263" y="54" width="42" height="18" rx="3" fill="#2d3748"/>
          <!-- Row 3 (A S D) -->
          <rect x="15" y="76" width="34" height="18" rx="3" fill="#2d3748"/>
          <rect x="53" y="76" width="20" height="18" rx="3" fill="${color}" fill-opacity="0.75"/>
          <rect x="77" y="76" width="20" height="18" rx="3" fill="${color}" fill-opacity="0.75"/>
          <rect x="101" y="76" width="20" height="18" rx="3" fill="${color}" fill-opacity="0.75"/>
          <rect x="125" y="76" width="20" height="18" rx="3"/>
          <rect x="149" y="76" width="20" height="18" rx="3"/>
          <rect x="173" y="76" width="20" height="18" rx="3"/>
          <rect x="197" y="76" width="20" height="18" rx="3"/>
          <rect x="221" y="76" width="20" height="18" rx="3"/>
          <rect x="245" y="76" width="60" height="18" rx="3" fill="#2d3748"/>
          <!-- Row 4 (Spacebar) -->
          <rect x="15" y="98" width="40" height="18" rx="3" fill="#2d3748"/>
          <rect x="59" y="98" width="25" height="18" rx="3"/>
          <rect x="88" y="98" width="130" height="18" rx="3" stroke="${color}" stroke-width="1.2" stroke-opacity="0.6"/>
          <rect x="222" y="98" width="25" height="18" rx="3"/>
          <rect x="251" y="98" width="54" height="18" rx="3" fill="#2d3748"/>
        </g>
        <!-- RGB Underglow line -->
        <rect x="20" y="130" width="280" height="3" rx="1.5" fill="${color}" opacity="0.85" filter="url(#glow)"/>
      </g>`;
  } else if (cat === "mouse") {
    visual = `
      <g transform="translate(130, 45)">
        <!-- Mouse Silhouette Glow -->
        <path d="M70,10 C105,10 120,40 125,95 C130,150 115,190 70,190 C25,190 10,150 15,95 C20,40 35,10 70,10 Z" fill="#14141f" stroke="${color}" stroke-width="2" stroke-opacity="0.5" filter="url(#glow)"/>
        <!-- Main Body -->
        <path d="M70,13 C102,13 117,42 121,95 C126,148 111,186 70,186 C29,186 14,148 19,95 C23,42 38,13 70,13 Z" fill="url(#mouseGrad)"/>
        <!-- Split Buttons -->
        <line x1="70" y1="14" x2="70" y2="70" stroke="#0a0a12" stroke-width="2.5"/>
        <path d="M35,68 C50,72 90,72 105,68" stroke="#0a0a12" stroke-width="2" fill="none"/>
        <!-- RGB Scroll Wheel -->
        <rect x="65" y="28" width="10" height="24" rx="4" fill="#0d0e15" stroke="${color}" stroke-width="1.5"/>
        <line x1="65" y1="36" x2="75" y2="36" stroke="${color}" stroke-width="1.5"/>
        <line x1="65" y1="44" x2="75" y2="44" stroke="${color}" stroke-width="1.5"/>
        <!-- DPI Button -->
        <rect x="67" y="58" width="6" height="8" rx="2" fill="#2d3748"/>
        <!-- Palm Brand Emblem -->
        <circle cx="70" cy="140" r="14" fill="#14141f" stroke="${color}" stroke-width="1.5" stroke-opacity="0.7"/>
        <circle cx="70" cy="140" r="7" fill="${color}" fill-opacity="0.8" filter="url(#glow)"/>
        <!-- Side grip accents -->
        <path d="M19,95 Q23,120 22,145" stroke="${color}" stroke-width="1.5" stroke-opacity="0.4" fill="none"/>
        <path d="M121,95 Q117,120 118,145" stroke="${color}" stroke-width="1.5" stroke-opacity="0.4" fill="none"/>
      </g>`;
  } else if (cat === "controller") {
    visual = `
      <g transform="translate(60, 48)">
        <!-- Controller Body Shadow & Shell -->
        <path d="M60,40 C100,20 180,20 220,40 C245,55 270,105 255,160 C245,190 215,195 195,170 C175,145 165,140 140,140 C115,140 105,145 85,170 C65,195 35,190 25,160 C10,105 35,55 60,40 Z" fill="#14141f" stroke="${color}" stroke-width="2" stroke-opacity="0.4" filter="url(#glow)"/>
        <!-- Main Shell -->
        <path d="M62,42 C101,23 179,23 218,42 C242,56 266,104 251,157 C242,185 214,190 196,167 C176,143 164,138 140,138 C116,138 104,143 84,167 C66,190 38,185 29,157 C14,104 38,56 62,42 Z" fill="url(#ctrlGrad)"/>
        <!-- Central Touchpad / Center Jewel -->
        <rect x="110" y="36" width="60" height="34" rx="6" fill="#0f111a" stroke="${color}" stroke-width="1.5"/>
        <rect x="118" y="40" width="44" height="4" rx="2" fill="${color}" fill-opacity="0.9" filter="url(#glow)"/>
        <!-- D-Pad (Left) -->
        <g transform="translate(70, 75)">
          <rect x="6" y="0" width="10" height="26" rx="2" fill="#2d3748"/>
          <rect x="0" y="8" width="22" height="10" rx="2" fill="#2d3748"/>
          <circle cx="11" cy="13" r="2.5" fill="#1a202c"/>
        </g>
        <!-- Face Buttons (Right) -->
        <g transform="translate(195, 75)">
          <circle cx="12" cy="4" r="5" fill="#2d3748" stroke="${color}" stroke-width="1"/>
          <circle cx="20" cy="13" r="5" fill="#2d3748" stroke="${color}" stroke-width="1"/>
          <circle cx="12" cy="22" r="5" fill="#2d3748" stroke="${color}" stroke-width="1"/>
          <circle cx="4" cy="13" r="5" fill="#2d3748" stroke="${color}" stroke-width="1"/>
        </g>
        <!-- Left Thumbstick -->
        <circle cx="105" cy="120" r="18" fill="#141724" stroke="#2d3748" stroke-width="2"/>
        <circle cx="105" cy="120" r="12" fill="#1f2438" stroke="${color}" stroke-width="1.2"/>
        <!-- Right Thumbstick -->
        <circle cx="175" cy="120" r="18" fill="#141724" stroke="#2d3748" stroke-width="2"/>
        <circle cx="175" cy="120" r="12" fill="#1f2438" stroke="${color}" stroke-width="1.2"/>
      </g>`;
  } else if (cat === "monitor") {
    visual = `
      <g transform="translate(50, 40)">
        <!-- Stand Base -->
        <polygon points="120,200 180,200 210,215 90,215" fill="#1c1f2e" stroke="${color}" stroke-width="1" stroke-opacity="0.5"/>
        <rect x="145" y="160" width="10" height="42" fill="#2a2e42"/>
        <!-- Monitor Frame -->
        <rect x="0" y="0" width="300" height="170" rx="8" fill="#10121a" stroke="${color}" stroke-width="2" stroke-opacity="0.5" filter="url(#glow)"/>
        <!-- Screen Bezel -->
        <rect x="4" y="4" width="292" height="152" rx="4" fill="#08090e"/>
        <!-- Screen Content (Vibrant Display Artwork) -->
        <rect x="6" y="6" width="288" height="148" rx="3" fill="url(#monScreen)"/>
        <!-- Gaming Horizon Art -->
        <circle cx="150" cy="110" r="45" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.6"/>
        <path d="M6,120 Q80,80 150,110 T294,95 L294,154 L6,154 Z" fill="${color}" fill-opacity="0.25"/>
        <line x1="6" y1="130" x2="294" y2="130" stroke="${color}" stroke-width="1" stroke-opacity="0.3"/>
        <line x1="6" y1="140" x2="294" y2="140" stroke="${color}" stroke-width="1" stroke-opacity="0.2"/>
        <!-- Monitor Chin Brand Badge -->
        <rect x="135" y="157" width="30" height="6" rx="2" fill="${color}" fill-opacity="0.8" filter="url(#glow)"/>
        <!-- Curved Glint -->
        <path d="M12,12 Q150,4 288,12" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5" fill="none"/>
      </g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 270" width="100%" height="100%">
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#12111d"/>
        <stop offset="50%" stop-color="#181528"/>
        <stop offset="100%" stop-color="#0e0d17"/>
      </linearGradient>
      <linearGradient id="kbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1a1d2e"/>
        <stop offset="100%" stop-color="#0f111c"/>
      </linearGradient>
      <linearGradient id="mouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#24283b"/>
        <stop offset="50%" stop-color="#171926"/>
        <stop offset="100%" stop-color="#0c0d14"/>
      </linearGradient>
      <linearGradient id="ctrlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#222738"/>
        <stop offset="100%" stop-color="#10121c"/>
      </linearGradient>
      <linearGradient id="monScreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a0845"/>
        <stop offset="50%" stop-color="#1b1035"/>
        <stop offset="100%" stop-color="#0b192e"/>
      </linearGradient>
    </defs>
    <!-- Background Card -->
    <rect width="400" height="270" fill="url(#bgGrad)"/>
    <!-- Subtle Brand Glow in Corner -->
    <circle cx="200" cy="135" r="90" fill="${color}" fill-opacity="0.08" filter="url(#glow)"/>
    <!-- Product Graphic -->
    ${visual}
    <!-- Brand Tag Badge -->
    <rect x="20" y="16" width="${brand.length * 9 + 20}" height="22" rx="11" fill="rgba(0,0,0,0.6)" stroke="${color}" stroke-width="1"/>
    <text x="${20 + (brand.length * 9 + 20) / 2}" y="31" text-anchor="middle" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="11" font-weight="700" letter-spacing="1">${brand.toUpperCase()}</text>
  </svg>`;

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg.replace(/\n\s*/g, " "));
}
