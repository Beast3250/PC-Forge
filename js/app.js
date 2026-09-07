// State
const cart = new Map();
const build = { case: null, cpu: null, gpu: null, ram: null, cooler: null, mobo: null };
let filter = "all";
let activeSlot = "case";
let entered = false;
let preview3DVisible = true;

// Independent ARGB Lighting States
let fanColorKey = "cyan";
let coolerColorKey = "cyan";

const COLOR_MAP = {
  cyan: { hex: 0x00f0ff, css: "#00f0ff" },
  pink: { hex: 0xff0077, css: "#ff0077" },
  green: { hex: 0x00ff66, css: "#00ff66" },
  purple: { hex: 0xa855f7, css: "#a855f7" },
  white: { hex: 0xffffff, css: "#ffffff" },
  gold: { hex: 0xffb703, css: "#ffb703" },
};

// Initialize default chassis case
if (typeof PRODUCTS !== "undefined") {
  build.case = PRODUCTS.find((p) => p.id === "case-lianli-o11") || PRODUCTS.find((p) => p.cat === "case") || null;
}

const $ = (id) => document.getElementById(id);

function money(n) {
  return `$${n.toLocaleString()}`;
}

function toast(msg) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function cartCount() {
  let n = 0;
  cart.forEach((q) => (n += q));
  return n;
}

function cartTotal() {
  let t = 0;
  cart.forEach((q, id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) t += p.price * q;
  });
  return t;
}

function addToCart(id, qty = 1) {
  cart.set(id, (cart.get(id) || 0) + qty);
  renderCart();
  toast("Added to cart");
}

function setQty(id, qty) {
  if (qty <= 0) cart.delete(id);
  else cart.set(id, qty);
  renderCart();
}

// Render shopping cart
function renderCart() {
  $("cartCount").textContent = cartCount();
  $("cartTotal").textContent = money(cartTotal());
  $("checkoutTotal").textContent = money(cartTotal());

  const rows = [...cart.entries()]
    .map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return "";
      return `<div class="cart-row">
        <div class="cart-row-left">
          <img src="${p.image}" class="cart-item-thumb" alt="${p.name}" />
          <div>
            <strong>${p.name}</strong>
            <div class="meta">${CAT_LABEL[p.cat] || p.cat} · ${money(p.price)}</div>
          </div>
        </div>
        <div class="qty">
          <button type="button" data-qty="${id}:-1" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button type="button" data-qty="${id}:1" aria-label="Increase quantity">+</button>
        </div>
      </div>`;
    })
    .join("");

  const empty = `<p class="empty">Your shopping cart is empty.</p>`;
  $("cartItems").innerHTML = rows || empty;
  $("checkoutBag").innerHTML = rows || empty;
}

// Render Store Products with Real Images
function renderStore() {
  const list = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
  $("productGrid").innerHTML = list
    .map(
      (p) => `<article class="card" data-cat="${p.cat}">
        <div class="card-image-box">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="card-tag-badge">${p.tag}</span>
        </div>
        <small>${CAT_LABEL[p.cat] || p.cat}</small>
        <h3>${p.name}</h3>
        <div class="meta">
          <span>${p.spec}</span>
          <b>${money(p.price)}</b>
        </div>
        <div class="card-actions">
          <button class="add" type="button" data-add="${p.id}">Add to cart</button>
          <button class="btn-build-seat" type="button" data-build-seat="${p.id}">
            ${p.cat === "case" ? "Build with Case ➔" : "Seat in 3D ➔"}
          </button>
        </div>
      </article>`
    )
    .join("");
}

// Render Brand Sponsor Infinite Marquee
function renderBrandMarquee() {
  const track = $("marqueeTrack");
  if (!track || !BRAND_SPONSORS) return;

  // Duplicate for seamless infinite loop
  const list = [...BRAND_SPONSORS, ...BRAND_SPONSORS];
  track.innerHTML = list
    .map(
      (b) => `<div class="brand-pill">
        <span class="brand-logo-txt">${b.icon}</span>
        <span class="brand-tier-badge">${b.tier}</span>
      </div>`
    )
    .join("");
}

// Render Featured Builds for Homepage
function renderFeaturedBuilds() {
  const container = $("featuredBuildsGrid");
  if (!container || !FEATURED_BUILDS) return;

  container.innerHTML = FEATURED_BUILDS.map((b) => {
    const specsHtml = b.specs.map((s) => `<span class="spec-tag">${s}</span>`).join("");
    return `<div class="build-card" id="${b.id}">
      <div class="build-card-image-wrap">
        <img src="${b.image}" alt="${b.name}" class="build-card-img" loading="lazy" />
        <span class="build-badge">${b.badge}</span>
        <span class="build-perf-badge">${b.perf} Score</span>
      </div>
      <div class="build-card-body">
        <h3>${b.name}</h3>
        <p class="build-card-desc">${b.desc}</p>
        <div class="build-specs-list">${specsHtml}</div>
        <div class="build-footer">
          <span class="build-price">${money(b.price)}</span>
          <button type="button" class="build-cta-btn" data-preset="${b.id}">
            Customize Rig →
          </button>
        </div>
      </div>
    </div>`;
  }).join("");
}

// Render Builder Picker (6 Categories including Case/Cabinet)
function renderPicker() {
  const cats = ["case", "cpu", "gpu", "ram", "cooler", "mobo"];
  $("picker").innerHTML = cats
    .map((cat) => {
      const opts = PRODUCTS.filter((p) => p.cat === cat)
        .map((p) => {
          const on = build[cat]?.id === p.id ? "on" : "";
          return `<button class="opt ${on}" type="button" data-pick="${p.id}" title="${p.name} - ${money(p.price)}">
            <img src="${p.image}" class="opt-thumb" alt="${p.name}" loading="lazy" />
            <div class="opt-info">
              <span class="opt-name">${p.name}</span>
              <span class="opt-spec">${p.tag} · ${p.spec}</span>
            </div>
            <span class="opt-price">${money(p.price)}</span>
            ${on ? '<span class="opt-check">✓</span>' : ''}
          </button>`;
        })
        .join("");
      return `<div class="pick-group" data-cat="${cat}"><h4>${CAT_LABEL[cat] || cat}</h4>${opts}</div>`;
    })
    .join("");
}

// Fill 2D Slots & 3D HUD
function fillSlots() {
  // Update 2D slots
  document.querySelectorAll(".slot").forEach((slot) => {
    const key = slot.dataset.slot;
    const part = build[key];
    slot.classList.toggle("filled", Boolean(part));
    slot.classList.toggle("active", activeSlot === key);
    const nameEl = slot.querySelector(".slot-name");
    if (nameEl) nameEl.textContent = part ? part.name : "Empty";
  });

  // Update 3D HUD
  const caseEl = $("hudCase");
  const moboEl = $("hudMobo");
  const cpuEl = $("hudCpu");
  const coolerEl = $("hudCooler");
  const ramEl = $("hudRam");
  const gpuEl = $("hudGpu");

  if (caseEl) caseEl.textContent = build.case ? build.case.name : "None";
  if (moboEl) moboEl.textContent = build.mobo ? build.mobo.name : "None";
  if (cpuEl) cpuEl.textContent = build.cpu ? build.cpu.name : "None";
  if (coolerEl) coolerEl.textContent = build.cooler ? build.cooler.name : "Stock Cooler";
  if (ramEl) ramEl.textContent = build.ram ? build.ram.name : "None";
  if (gpuEl) gpuEl.textContent = build.gpu ? build.gpu.name : "None";

  // Sync 3D Toolbar Case Quick Switcher dropdown
  const quickCase = $("caseQuickSelect");
  if (quickCase && build.case) {
    quickCase.value = build.case.id;
  }

  // Sync Visual Case Quick Switcher Pills
  const activeCaseId = build.case ? build.case.id : "case-lianli-o11";
  document.querySelectorAll("[data-case-pick]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.casePick === activeCaseId);
  });

  document.querySelectorAll(".hud-item").forEach((item) => {
    const slotKey = item.dataset.slot;
    item.classList.toggle("seated", Boolean(build[slotKey]));
    item.classList.toggle("active-slot", activeSlot === slotKey);
  });

  update3DRig();
}

function scoreBuild() {
  const cpu = build.cpu?.score.cpu || 0;
  const gpu = build.gpu?.score.gpu || 0;
  const ram = build.ram?.score.ram || 0;
  const mobo = build.mobo?.score.mobo || 0;
  const cooler = build.cooler?.score.cooler || (build.cpu ? 70 : 0);
  const caseScore = build.case?.score.case || 90;

  const createParts = [build.cpu, build.gpu, build.ram, build.mobo, build.cooler, build.case].filter(Boolean);
  const create = createParts.length
    ? Math.round(createParts.reduce((s, p) => s + (p.score.create || 80), 0) / createParts.length)
    : 0;

  const gaming = Math.round(gpu * 0.58 + cpu * 0.26 + ram * 0.1 + (cooler > 85 ? 6 : 0));
  const peak = Math.round((cpu + gpu + ram + mobo + cooler + caseScore) / 6);
  const grade = !build.cpu && !build.gpu ? "—" : peak >= 88 ? "S" : peak >= 75 ? "A" : peak >= 60 ? "B" : "C";

  $("gameBar").style.width = `${gaming}%`;
  $("createBar").style.width = `${create}%`;
  $("peakBar").style.width = `${peak}%`;
  $("gameVal").textContent = `${gaming}%`;
  $("createVal").textContent = `${create}%`;
  $("peakVal").textContent = `${peak}%`;
  $("perfGrade").textContent = grade;

  let note = "Select parts to see the live read.";
  if (build.cpu || build.gpu) {
    if (gpu && cpu && gpu - cpu > 18) {
      note = "GPU is ahead of the CPU. Heavy titles will demand more processor overhead.";
    } else if (gpu && cpu && cpu - gpu > 18) {
      note = "CPU is bottlenecked by the GPU. A stronger graphics card unleashes this chip.";
    } else if (ram && ram < 80 && gpu > 80) {
      note = "High-end GPU paired with modest RAM. 32GB+ DDR5 is recommended for 4K & rendering.";
    } else if (peak >= 90) {
      note = "Supreme Tier. This custom rig tracks flagship hardware with zero frame compromise.";
    } else {
      note = "Balanced configuration for seated hardware. Compare against RTX 5090 + 9950X3D peak.";
    }
  }
  $("bottleneck").textContent = note;
}

function pick(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  build[p.cat] = p;
  activeSlot = p.cat;
  fillSlots();
  renderPicker();
  scoreBuild();
  toast(`Seated ${p.name}`);
}

function applyPreset(presetId) {
  if (presetId === "build-titan") {
    build.case = PRODUCTS.find((p) => p.id === "case-lianli-o11");
    build.cpu = PRODUCTS.find((p) => p.id === "cpu-9950x3d");
    build.gpu = PRODUCTS.find((p) => p.id === "gpu-5090");
    build.cooler = PRODUCTS.find((p) => p.id === "cooler-kraken-360");
    build.ram = PRODUCTS.find((p) => p.id === "ram-corsair-titanium");
    build.mobo = PRODUCTS.find((p) => p.id === "mobo-x870e");
  } else if (presetId === "build-apex") {
    build.case = PRODUCTS.find((p) => p.id === "case-nzxt-h9");
    build.cpu = PRODUCTS.find((p) => p.id === "cpu-9800x3d");
    build.gpu = PRODUCTS.find((p) => p.id === "gpu-5080");
    build.cooler = PRODUCTS.find((p) => p.id === "cooler-galahad-360");
    build.ram = PRODUCTS.find((p) => p.id === "ram-corsair-vengeance-d5");
    build.mobo = PRODUCTS.find((p) => p.id === "mobo-b850");
  } else if (presetId === "build-obsidian") {
    build.case = PRODUCTS.find((p) => p.id === "case-fractal-north");
    build.cpu = PRODUCTS.find((p) => p.id === "cpu-285k");
    build.gpu = PRODUCTS.find((p) => p.id === "gpu-5070ti");
    build.cooler = PRODUCTS.find((p) => p.id === "cooler-ak620-digital");
    build.ram = PRODUCTS.find((p) => p.id === "ram-samsung-d5-32");
    build.mobo = PRODUCTS.find((p) => p.id === "mobo-z890");
  }
  fillSlots();
  renderPicker();
  scoreBuild();
  location.hash = "#/builder";
  toast("Preset loaded into 3D builder");
}

// Router
function route() {
  const hash = location.hash.replace("#", "") || "/home";
  let page = "home";

  if (hash.startsWith("/builder")) {
    page = "builder";
  } else if (hash.startsWith("/checkout")) {
    page = "checkout";
  } else if (hash.startsWith("/about")) {
    page = "about";
  } else if (hash === "/" || hash.startsWith("/store")) {
    page = "store";
  } else {
    page = "home";
  }

  document.querySelectorAll(".page").forEach((el) => el.classList.add("hidden"));
  const targetPage = $(`page-${page}`);
  if (targetPage) targetPage.classList.remove("hidden");

  document.querySelectorAll(".nav-link").forEach((a) => {
    const route = a.dataset.route;
    const isAct =
      (page === "home" && route === "/home") ||
      (page === "store" && route === "/") ||
      (page === "builder" && route === "/builder") ||
      (page === "about" && route === "/about") ||
      (page === "checkout" && route === "/checkout");
    a.classList.toggle("active", isAct);
  });

  closeCart();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "builder" && preview3DVisible) {
    setTimeout(resize3D, 80);
  }
}

function openCart() {
  $("drawer").classList.add("open");
  $("drawer").setAttribute("aria-hidden", "false");
}

function closeCart() {
  $("drawer").classList.remove("open");
  $("drawer").setAttribute("aria-hidden", "true");
}

// ==========================================================================
// Scroll Transition: "HI GAMERS" <---> Homepage
// ==========================================================================
function enterSiteToHome() {
  if (entered) return;
  entered = true;
  $("intro").classList.add("leave");
  $("app").classList.add("in");
  document.body.style.overflow = "";
}

function returnToIntro() {
  if (!entered) return;
  entered = false;
  $("intro").classList.remove("leave");
  $("app").classList.remove("in");
  window.scrollTo({ top: 0 });
}

function bindScrollFlow() {
  // Wheel interaction at Intro
  window.addEventListener(
    "wheel",
    (e) => {
      if (!entered && e.deltaY > 0) {
        enterSiteToHome();
      } else if (entered && window.scrollY <= 0 && e.deltaY < -15) {
        const hash = location.hash.replace("#", "") || "/home";
        if (hash === "/home" || !hash) {
          returnToIntro();
        }
      }
    },
    { passive: true }
  );

  // Touch gesture
  let touchStartY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      if (!entered && diff > 30) {
        enterSiteToHome();
      } else if (entered && window.scrollY <= 0 && diff < -30) {
        const hash = location.hash.replace("#", "") || "/home";
        if (hash === "/home" || !hash) {
          returnToIntro();
        }
      }
    },
    { passive: true }
  );

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (!entered && (e.key === "ArrowDown" || e.key === " " || e.key === "Enter")) {
      enterSiteToHome();
    }
  });

  // Buttons & triggers
  const introBtn = $("introEnterBtn");
  if (introBtn) introBtn.addEventListener("click", enterSiteToHome);

  const returnCue = $("returnToIntro");
  if (returnCue) returnCue.addEventListener("click", returnToIntro);

  // "Click me to Open the Buy area" Button
  const openBuyBtn = $("openBuyAreaBtn");
  if (openBuyBtn) {
    openBuyBtn.addEventListener("click", () => {
      location.hash = "#/";
      toast("Welcome to the PC Forge Store");
    });
  }
}

// ==========================================================================
// 3D Preview Toggle: Hide/Show 3D Whole Area Preview
// ==========================================================================
function toggle3DPreview() {
  preview3DVisible = !preview3DVisible;

  const wrap3D = $("chassis3DWrap");
  const wrap2D = $("chassis2DWrap");
  const toggleBtnText = $("togglePreviewText");
  const previewStatus = $("previewStatusText");

  if (preview3DVisible) {
    wrap3D.classList.remove("hidden");
    wrap2D.classList.add("hidden");
    if (toggleBtnText) toggleBtnText.textContent = "Hide Preview";
    if (previewStatus) previewStatus.textContent = "Panoramic Full-Glass Rig · Dual ARGB Control";
    resize3D();
    toast("3D PC Rig preview enabled");
  } else {
    wrap3D.classList.add("hidden");
    wrap2D.classList.remove("hidden");
    if (toggleBtnText) toggleBtnText.textContent = "Show 3D Preview";
    if (previewStatus) previewStatus.textContent = "Classic 2D Schematic View";
    toast("Switched to classic 2D chassis view");
  }
}

// ==========================================================================
// MINIMALIST ANIMATED BRIGHT WHITE STARRY BACKGROUND (Store Page)
// ==========================================================================
function initStoreStarBg() {
  const canvas = $("storeStarBg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];
  let width, height;
  let mouseX = 0, mouseY = 0;

  function resizeCanvas() {
    const parent = $("page-store");
    if (!parent) return;
    width = canvas.width = parent.clientWidth || window.innerWidth;
    height = canvas.height = parent.clientHeight || window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.min(260, Math.floor((width * height) / 4200));
    for (let i = 0; i < count; i++) {
      stars.push({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() < 0.75 ? Math.random() * 1.1 + 0.6 : Math.random() * 1.6 + 1.4,
        alpha: Math.random() * 0.6 + 0.35,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        driftSpeed: Math.random() * 0.05 + 0.015,
        isSparkle: Math.random() < 0.09,
      });
    }
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 35;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 35;
  });

  let time = 0;
  function renderStars() {
    if (!$("page-store").classList.contains("hidden")) {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Draw minimalist bright white stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const currentAlpha = Math.max(0.18, Math.min(1, s.alpha + Math.sin(time * 2.5 + i * 0.7) * 0.35));
        const driftX = (s.baseX + Math.sin(time * s.driftSpeed + i) * 10 + mouseX * 0.12 + width) % width;
        const driftY = (s.baseY + Math.cos(time * s.driftSpeed + i) * 8 + mouseY * 0.12 + height) % height;

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = "#ffffff";

        if (s.radius > 1.3) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
        }

        ctx.beginPath();
        ctx.arc(driftX, driftY, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Elegant delicate 4-point sparkle cross on bright focal stars
        if (s.isSparkle && currentAlpha > 0.5) {
          const crossSize = s.radius * 3.4;
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(driftX - crossSize, driftY);
          ctx.lineTo(driftX + crossSize, driftY);
          ctx.moveTo(driftX, driftY - crossSize);
          ctx.lineTo(driftX, driftY + crossSize);
          ctx.stroke();
        }

        ctx.restore();
      }
    }
    requestAnimationFrame(renderStars);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  renderStars();
}

// ==========================================================================
// ULTRA-REALISTIC FULL-GLASS PANORAMIC 3D PC RIG (Three.js)
// ==========================================================================
let scene, camera, renderer, controls;
let caseGroup, caseChassisGroup, moboMesh, gpuMesh, gpuLogoMesh, ramGroup, ramRgb1, ramRgb2;
let coolerLiquidGroup, coolerAirGroup, airFanMesh, lcdTexture, lcdCanvas;
let fanRingMaterials = [];
let fanLight1, fanLight2, coolerLight;
let currentCaseId = null;
const spinningFans = [];

function init3DScene() {
  const canvas = $("chassis3DCanvas");
  if (!canvas || !window.THREE) return;

  const holder = $("canvasHolder");
  const width = holder ? holder.clientWidth : 800;
  const height = holder ? holder.clientHeight : 680;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0d);

  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(3.4, 1.8, 3.8);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  if (window.THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 8.5;
    controls.minDistance = 2.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.target.set(0, 1.3, 0);
  }

  // Realistic Studio Lighting
  const ambientLight = new THREE.AmbientLight(0x242430, 2.0);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(4, 7, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x556677, 1.1);
  fillLight.position.set(-5, 4, -4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
  rimLight.position.set(0, -3, -5);
  scene.add(rimLight);

  // Internal ARGB Spot Lights
  fanLight1 = new THREE.PointLight(COLOR_MAP[fanColorKey].hex, 4.0, 7);
  fanLight1.position.set(0.9, 1.5, 0.2);
  scene.add(fanLight1);

  fanLight2 = new THREE.PointLight(COLOR_MAP[fanColorKey].hex, 2.5, 5);
  fanLight2.position.set(-0.9, 1.8, -0.2);
  scene.add(fanLight2);

  coolerLight = new THREE.PointLight(COLOR_MAP[coolerColorKey].hex, 3.8, 5);
  coolerLight.position.set(0.1, 1.8, -0.2);
  scene.add(coolerLight);

  // Build the Chassis Case & Seated Components
  buildPanoramicChassis3D();

  // Synchronize 3D parts and visibility with current build state
  update3DRig();

  // Animation Loop
  let tick = 0;
  function animate() {
    requestAnimationFrame(animate);
    tick += 0.015;

    // Spin fans smoothly
    spinningFans.forEach((fan) => {
      fan.rotation.z += 0.085;
    });

    // Spin center air cooler fan if visible
    if (airFanMesh && coolerAirGroup && coolerAirGroup.visible) {
      airFanMesh.rotation.z += 0.09;
    }

    // Animate LCD pump display texture
    if (coolerLiquidGroup && coolerLiquidGroup.visible && tick % 1.5 < 0.02) {
      updateLcdDisplay();
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", resize3D);
}

function resize3D() {
  if (!renderer || !camera) return;
  const holder = $("canvasHolder");
  if (!holder) return;
  const width = holder.clientWidth;
  const height = holder.clientHeight || 680;
  if (width === 0 || height === 0) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function createLcdTexture() {
  lcdCanvas = document.createElement("canvas");
  lcdCanvas.width = 256;
  lcdCanvas.height = 256;
  const ctx = lcdCanvas.getContext("2d");

  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = COLOR_MAP[coolerColorKey].css;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("38°C", 128, 115);

  ctx.fillStyle = COLOR_MAP[coolerColorKey].css;
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("5.2 GHz", 128, 160);

  ctx.fillStyle = "#a0a0b0";
  ctx.font = "15px sans-serif";
  ctx.fillText("PC FORGE LIQUID", 128, 195);

  lcdTexture = new THREE.CanvasTexture(lcdCanvas);
  return lcdTexture;
}

function updateLcdDisplay() {
  if (!lcdCanvas) return;
  const ctx = lcdCanvas.getContext("2d");
  const temp = Math.floor(35 + Math.random() * 5);
  const ghz = build.cpu ? build.cpu.spec.split("·")[1]?.trim() || "5.2 GHz" : "Idle";

  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = COLOR_MAP[coolerColorKey].css;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 110, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${temp}°C`, 128, 115);

  ctx.fillStyle = COLOR_MAP[coolerColorKey].css;
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(ghz, 128, 160);
  ctx.fillStyle = "#a0a0b0";
  ctx.font = "15px sans-serif";
  ctx.fillText(build.cooler ? build.cooler.name.split(" ")[0] : "PC FORGE", 128, 195);

  if (lcdTexture) lcdTexture.needsUpdate = true;
}

// Dynamic 3D Chassis Case Geometry Builder (Panoramic / Wood / Armor)
function buildCaseChassis(caseItem) {
  if (!caseChassisGroup) return;

  // Clear existing chassis outer frame meshes
  while (caseChassisGroup.children.length > 0) {
    const child = caseChassisGroup.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
      else child.material.dispose();
    }
    caseChassisGroup.remove(child);
  }

  const style = caseItem?.caseStyle || "panoramic";
  const caseId = caseItem?.id || "case-lianli-o11";

  // Per-case accent colors for panoramic variants (visually distinct)
  const CASE_ACCENTS = {
    "case-lianli-o11":    { frame: 0xd0d8e2, badge: 0x00f0ff, glass: 0xffffff, metalness: 0.98, roughness: 0.08 },  // Mirror Chrome + Cyan
    "case-corsair-6500x": { frame: 0xf6f7fc, badge: 0xffd700, glass: 0xf2f4ff, metalness: 0.45, roughness: 0.22 }, // Arctic White + Corsair Gold
    "case-nzxt-h9":       { frame: 0x111116, badge: 0xa855f7, glass: 0xd8d8f0, metalness: 0.85, roughness: 0.32 }, // Matte Stealth Obsidian + Purple
  };
  const accent = CASE_ACCENTS[caseId] || CASE_ACCENTS["case-lianli-o11"];

  const frameColor = style === "armor" ? 0x181a20 : style === "wood" ? 0x141419 : accent.frame;

  const metalMat = new THREE.MeshStandardMaterial({
    color: frameColor,
    roughness: style === "wood" ? 0.35 : style === "panoramic" ? accent.roughness : 0.25,
    metalness: style === "wood" ? 0.2 : style === "panoramic" ? accent.metalness : 0.92,
  });

  const darkInteriorMat = new THREE.MeshStandardMaterial({
    color: 0x0e0e12,
    roughness: 0.45,
    metalness: 0.8,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe0e0e8,
    roughness: 0.12,
    metalness: 0.98,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.28,
    metalness: 0.88,
  });

  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x5a3825,
    roughness: 0.65,
    metalness: 0.05,
  });

  const armorGunmetalMat = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.32,
    metalness: 0.92,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: style === "panoramic" ? accent.glass : 0xffffff,
    transparent: true,
    opacity: 0.18,
    roughness: 0.02,
    metalness: 0.05,
    transmission: 0.92,
    ior: 1.52,
    reflectivity: 0.95,
  });

  // Base Bottom Plate
  const baseGeo = new THREE.BoxGeometry(2.5, 0.12, 1.45);
  const baseMesh = new THREE.Mesh(baseGeo, metalMat);
  baseMesh.position.set(0, 0.06, 0);
  caseChassisGroup.add(baseMesh);

  // Top Radiator / Roof Frame
  const topGeo = new THREE.BoxGeometry(2.5, 0.14, 1.45);
  const topMesh = new THREE.Mesh(topGeo, metalMat);
  topMesh.position.set(0, 2.92, 0);
  caseChassisGroup.add(topMesh);

  // Rear I/O Backplate Frame
  const backGeo = new THREE.BoxGeometry(0.12, 2.76, 1.45);
  const backMesh = new THREE.Mesh(backGeo, metalMat);
  backMesh.position.set(-1.25, 1.48, 0);
  caseChassisGroup.add(backMesh);

  // Rear Cable / Dual-Chamber Partition Wall
  const partitionGeo = new THREE.BoxGeometry(2.4, 2.7, 0.08);
  const partitionMesh = new THREE.Mesh(partitionGeo, darkInteriorMat);
  partitionMesh.position.set(0, 1.48, -0.66);
  caseChassisGroup.add(partitionMesh);

  // 4 Bottom Feet
  const footMat = style === "wood" ? brassMat : style === "armor" ? armorGunmetalMat : chromeMat;
  for (let fx of [-1.15, 1.15]) {
    for (let fz of [-0.62, 0.62]) {
      const footGeo = style === "armor"
        ? new THREE.BoxGeometry(0.14, 0.08, 0.14)
        : new THREE.CylinderGeometry(0.085, 0.095, 0.08, 16);
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fx, 0.04, fz);
      caseChassisGroup.add(foot);
    }
  }

  // Side Glass Panel (Tempered glass)
  const sideGlassGeo = new THREE.BoxGeometry(2.46, 2.72, 0.03);
  const sideGlassMesh = new THREE.Mesh(sideGlassGeo, glassMat);
  sideGlassMesh.position.set(0, 1.48, 0.71);
  caseChassisGroup.add(sideGlassMesh);

  // Style-Specific Front & Accent Panels
  if (style === "wood") {
    // FRACTAL DESIGN NORTH XL: 10 Genuine Walnut Vertical Timber Slats + Brass Accents
    const frontFrameGeo = new THREE.BoxGeometry(0.06, 2.72, 1.44);
    const frontFrame = new THREE.Mesh(frontFrameGeo, metalMat);
    frontFrame.position.set(1.24, 1.48, 0);
    caseChassisGroup.add(frontFrame);

    const numSlats = 10;
    const slatGeo = new THREE.BoxGeometry(0.04, 2.64, 0.07);
    for (let i = 0; i < numSlats; i++) {
      const zOffset = -0.58 + (i * 1.16) / (numSlats - 1);
      const slat = new THREE.Mesh(slatGeo, walnutMat);
      slat.position.set(1.27, 1.48, zOffset);
      caseChassisGroup.add(slat);
    }

    const brassStrip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 1.42), brassMat);
    brassStrip.position.set(1.26, 0.14, 0);
    caseChassisGroup.add(brassStrip);

    const brassBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), brassMat);
    brassBtn.position.set(1.1, 3.0, 0.5);
    caseChassisGroup.add(brassBtn);
  } else if (style === "armor") {
    // THUNDER ARMORBOX: Industrial Cyber Armor Bezel + Stealth Mesh
    const armorBezelGeo = new THREE.BoxGeometry(0.1, 2.74, 1.44);
    const armorBezel = new THREE.Mesh(armorBezelGeo, armorGunmetalMat);
    armorBezel.position.set(1.24, 1.48, 0);
    caseChassisGroup.add(armorBezel);

    const meshGeo = new THREE.PlaneGeometry(1.28, 2.5);
    const meshMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.4,
      metalness: 0.8,
      wireframe: true,
    });
    const meshPlane = new THREE.Mesh(meshGeo, meshMat);
    meshPlane.rotation.y = Math.PI / 2;
    meshPlane.position.set(1.29, 1.48, 0);
    caseChassisGroup.add(meshPlane);

    for (let yPos of [0.25, 2.7]) {
      for (let zPos of [-0.65, 0.65]) {
        const clampGeo = new THREE.BoxGeometry(0.12, 0.14, 0.12);
        const clamp = new THREE.Mesh(clampGeo, armorGunmetalMat);
        clamp.position.set(1.24, yPos, zPos);
        caseChassisGroup.add(clamp);
      }
    }

    const cyberStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 2.2, 0.02),
      new THREE.MeshBasicMaterial({ color: COLOR_MAP[fanColorKey].hex })
    );
    cyberStrip.position.set(1.3, 1.48, -0.6);
    caseChassisGroup.add(cyberStrip);
  } else {
    // PANORAMIC: Each model has a distinct accent color badge strip
    const frontGlassGeo = new THREE.BoxGeometry(0.03, 2.72, 1.42);
    const frontGlassMesh = new THREE.Mesh(frontGlassGeo, glassMat);
    frontGlassMesh.position.set(1.24, 1.48, 0);
    caseChassisGroup.add(frontGlassMesh);

    // Distinct accent badge with case-specific color
    const badgeMat = new THREE.MeshBasicMaterial({ color: accent.badge });
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.35), badgeMat);
    badge.position.set(1.24, 2.82, 0.45);
    caseChassisGroup.add(badge);

    // Additional side accent strip (case-specific)
    if (caseId === "case-corsair-6500x") {
      // Corsair: gold top vent accent bar
      const ventBar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.06), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 }));
      ventBar.position.set(0, 2.89, 0.68);
      caseChassisGroup.add(ventBar);

      // Corsair dual-chamber side column with arctic white steel mesh
      const sideChamberGeo = new THREE.BoxGeometry(0.1, 2.7, 0.42);
      const sideChamberMat = new THREE.MeshStandardMaterial({ color: 0xf4f5fa, metalness: 0.6, roughness: 0.25 });
      const sideChamber = new THREE.Mesh(sideChamberGeo, sideChamberMat);
      sideChamber.position.set(1.23, 1.48, -0.48);
      caseChassisGroup.add(sideChamber);
    } else if (caseId === "case-nzxt-h9") {
      // NZXT H9: purple perforated top mesh overlay
      const topMesh2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 1.3), new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true }));
      topMesh2.position.set(0, 2.94, 0);
      caseChassisGroup.add(topMesh2);

      // Top power button with purple accent
      const pBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
      pBtn.position.set(1.1, 3.0, 0.5);
      caseChassisGroup.add(pBtn);
    } else if (caseId === "case-lianli-o11") {
      // Lian Li O11 Vision: Top glass panel (seamless 3-sided glass roof!)
      const topGlassGeo = new THREE.BoxGeometry(2.4, 0.02, 1.38);
      const topGlass = new THREE.Mesh(topGlassGeo, glassMat);
      topGlass.position.set(0, 2.94, 0);
      caseChassisGroup.add(topGlass);

      // Polished chrome corner pillars
      for (let [cx, cz] of [[-1.22, 0.7], [-1.22, -0.7]]) {
        const pillarGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.7, 16);
        const pillar = new THREE.Mesh(pillarGeo, chromeMat);
        pillar.position.set(cx, 1.48, cz);
        caseChassisGroup.add(pillar);
      }
    }
  }

  currentCaseId = caseItem?.id || "case-lianli-o11";
}

function buildPanoramicChassis3D() {
  caseGroup = new THREE.Group();
  scene.add(caseGroup);

  // Dedicated group for the outer chassis cabinet
  caseChassisGroup = new THREE.Group();
  caseGroup.add(caseChassisGroup);

  // Build initial chassis outer frame
  buildCaseChassis(build.case || PRODUCTS.find((p) => p.id === "case-lianli-o11"));

  fanRingMaterials = [];

  // ===================== ARGB DESIGN INTAKE & EXHAUST FANS =====================
  const fanGroup = new THREE.Group();
  caseGroup.add(fanGroup);

  function createArgbFan(x, y, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    // Glowing ARGB Outer Halo Ring
    const ringGeo = new THREE.TorusGeometry(0.24, 0.022, 16, 36);
    const ringMat = new THREE.MeshBasicMaterial({ color: COLOR_MAP[fanColorKey].hex });
    fanRingMaterials.push(ringMat);
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    group.add(ringMesh);

    // Aerodynamic Blades with Center Holographic Hub
    const blades = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.03, 24);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x121217, metalness: 0.85 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.x = Math.PI / 2;
    blades.add(hub);

    const bladeGeo = new THREE.BoxGeometry(0.065, 0.19, 0.012);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x22222a, roughness: 0.35 });
    for (let i = 0; i < 9; i++) {
      const b = new THREE.Mesh(bladeGeo, bladeMat);
      b.rotation.z = (i * Math.PI * 2) / 9;
      b.position.y = 0.08 * Math.cos((i * Math.PI * 2) / 9);
      b.position.x = 0.08 * Math.sin((i * Math.PI * 2) / 9);
      blades.add(b);
    }
    group.add(blades);
    spinningFans.push(blades);
    fanGroup.add(group);
    return { ringMesh, blades };
  }

  // 3 Side Chamber Intake Fans (Illuminating interior)
  createArgbFan(0.75, 0.8, -0.58, 0);
  createArgbFan(0.75, 1.45, -0.58, 0);
  createArgbFan(0.75, 2.1, -0.58, 0);

  // 1 Rear Exhaust Fan
  createArgbFan(-1.18, 2.1, 0, Math.PI / 2);

  // ===================== MOTHERBOARD =====================
  const moboGroup = new THREE.Group();
  moboGroup.position.set(-0.15, 1.78, -0.58);

  const moboGeo = new THREE.BoxGeometry(1.65, 1.65, 0.03);
  const moboMat = new THREE.MeshStandardMaterial({
    color: 0x121217,
    roughness: 0.35,
    metalness: 0.85,
  });
  moboMesh = new THREE.Mesh(moboGeo, moboMat);
  moboGroup.add(moboMesh);

  // VRM Brushed Armor Heatsinks
  const vrmMat = new THREE.MeshStandardMaterial({ color: 0x24242c, roughness: 0.2, metalness: 0.9 });
  const vrm1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.14), vrmMat);
  vrm1.position.set(-0.1, 0.65, 0.08);
  moboGroup.add(vrm1);

  const vrm2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, 0.14), vrmMat);
  vrm2.position.set(-0.55, 0.3, 0.08);
  moboGroup.add(vrm2);

  // M.2 Heatshield Armor & PCIe Steel Reinforced Slots
  const m2Mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.05), vrmMat);
  m2Mesh.position.set(0.1, -0.42, 0.04);
  moboGroup.add(m2Mesh);

  const pcieMat = new THREE.MeshStandardMaterial({ color: 0xc8c8d0, metalness: 0.95 });
  const pcie1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.04), pcieMat);
  pcie1.position.set(0.1, -0.15, 0.04);
  moboGroup.add(pcie1);

  caseGroup.add(moboGroup);

  // ===================== 1. LIQUID COOLER (AIO 360mm with LCD PUMP) =====================
  coolerLiquidGroup = new THREE.Group();
  coolerLiquidGroup.position.set(-0.1, 1.85, -0.42);

  const radGeo = new THREE.BoxGeometry(1.8, 0.08, 0.45);
  const radMat = new THREE.MeshStandardMaterial({ color: 0x16161c, metalness: 0.85 });
  const radiator = new THREE.Mesh(radGeo, radMat);
  radiator.position.set(0.2, 0.95, 0.15);
  coolerLiquidGroup.add(radiator);

  const pumpBaseGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 36);
  const pumpBaseMat = new THREE.MeshStandardMaterial({ color: 0x16161c, metalness: 0.92 });
  const pumpBase = new THREE.Mesh(pumpBaseGeo, pumpBaseMat);
  pumpBase.rotation.x = Math.PI / 2;
  coolerLiquidGroup.add(pumpBase);

  const lcdGeo = new THREE.CircleGeometry(0.18, 36);
  const lcdMat = new THREE.MeshBasicMaterial({ map: createLcdTexture() });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.position.set(0, 0, 0.075);
  coolerLiquidGroup.add(lcdMesh);

  const pumpRingGeo = new THREE.TorusGeometry(0.21, 0.018, 16, 36);
  const pumpRingMat = new THREE.MeshBasicMaterial({ color: COLOR_MAP[coolerColorKey].hex });
  const pumpRing = new THREE.Mesh(pumpRingGeo, pumpRingMat);
  pumpRing.position.set(0, 0, 0.07);
  coolerLiquidGroup.add(pumpRing);
  coolerLiquidGroup.pumpRing = pumpRing;

  const tubeMat = new THREE.MeshStandardMaterial({ color: 0x121217, roughness: 0.7 });
  for (let t = -1; t <= 1; t += 2) {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(t * 0.08, 0.08, 0.04),
      new THREE.Vector3(t * 0.35, 0.6, 0.2),
      new THREE.Vector3(t * 0.2, 0.92, 0.15)
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.032, 12, false);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    coolerLiquidGroup.add(tube);
  }

  caseGroup.add(coolerLiquidGroup);

  // ===================== 2. NORMAL AIR COOLER (DUAL-TOWER HEATSINK with ARGB FAN) =====================
  coolerAirGroup = new THREE.Group();
  coolerAirGroup.position.set(-0.1, 1.85, -0.42);

  const finTowerMat = new THREE.MeshStandardMaterial({
    color: 0x303038,
    metalness: 0.95,
    roughness: 0.2,
  });
  const tower1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.16), finTowerMat);
  tower1.position.set(0, 0, -0.06);
  const tower2 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.16), finTowerMat);
  tower2.position.set(0, 0, 0.14);
  coolerAirGroup.add(tower1, tower2);

  const airPipeMat = new THREE.MeshStandardMaterial({ color: 0xd97736, metalness: 0.95, roughness: 0.15 });
  for (let hp = -2; hp <= 2; hp++) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.68, 12), airPipeMat);
    pipe.position.set(hp * 0.08, 0, 0.04);
    coolerAirGroup.add(pipe);
  }

  const airFanGroup = new THREE.Group();
  airFanGroup.position.set(0, 0, 0.04);
  const airFanHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16),
    new THREE.MeshBasicMaterial({ color: COLOR_MAP[coolerColorKey].hex })
  );
  airFanHub.rotation.x = Math.PI / 2;
  airFanGroup.add(airFanHub);

  const airBladeMat = new THREE.MeshBasicMaterial({
    color: COLOR_MAP[coolerColorKey].hex,
    transparent: true,
    opacity: 0.85,
  });
  for (let i = 0; i < 7; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.01), airBladeMat);
    blade.rotation.z = (i * Math.PI * 2) / 7;
    blade.position.y = 0.07 * Math.cos((i * Math.PI * 2) / 7);
    blade.position.x = 0.07 * Math.sin((i * Math.PI * 2) / 7);
    airFanGroup.add(blade);
  }
  airFanMesh = airFanGroup;
  coolerAirGroup.add(airFanGroup);
  coolerAirGroup.airBladeMat = airBladeMat;
  coolerAirGroup.airFanHub = airFanHub;

  coolerAirGroup.visible = false;
  caseGroup.add(coolerAirGroup);

  // ===================== MEMORY (RAM with FROSTED RGB LIGHTBAR) =====================
  ramGroup = new THREE.Group();
  ramGroup.position.set(0.32, 1.85, -0.46);

  const ramGeo = new THREE.BoxGeometry(0.042, 0.48, 0.14);
  const ramMat = new THREE.MeshStandardMaterial({ color: 0x24242c, metalness: 0.9, roughness: 0.3 });
  const ram1 = new THREE.Mesh(ramGeo, ramMat);
  ram1.position.set(0, 0, -0.05);
  const ram2 = new THREE.Mesh(ramGeo, ramMat);
  ram2.position.set(0, 0, 0.05);

  const ramRgbGeo = new THREE.BoxGeometry(0.048, 0.05, 0.14);
  const ramRgbMat = new THREE.MeshBasicMaterial({ color: COLOR_MAP[fanColorKey].hex });
  ramRgb1 = new THREE.Mesh(ramRgbGeo, ramRgbMat);
  ramRgb1.position.set(0, 0.25, -0.05);
  ramRgb2 = new THREE.Mesh(ramRgbGeo, ramRgbMat.clone());
  ramRgb2.position.set(0, 0.25, 0.05);

  ramGroup.add(ram1, ram2, ramRgb1, ramRgb2);
  caseGroup.add(ramGroup);

  // ===================== GRAPHICS CARD (TRIPLE-SLOT GPU) =====================
  const gpuGroup = new THREE.Group();
  gpuGroup.position.set(-0.08, 1.25, -0.15);

  const gpuBodyGeo = new THREE.BoxGeometry(1.65, 0.42, 0.58);
  const gpuBodyMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c22,
    metalness: 0.9,
    roughness: 0.25,
  });
  const gpuBody = new THREE.Mesh(gpuBodyGeo, gpuBodyMat);
  gpuGroup.add(gpuBody);

  const backplateGeo = new THREE.BoxGeometry(1.65, 0.02, 0.58);
  const backplateMat = new THREE.MeshStandardMaterial({
    color: 0x2b2b34,
    metalness: 0.95,
    roughness: 0.2,
  });
  const backplate = new THREE.Mesh(backplateGeo, backplateMat);
  backplate.position.set(0, 0.22, 0);
  gpuGroup.add(backplate);

  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xd97736, metalness: 0.95, roughness: 0.15 });
  for (let p = -1; p <= 1; p++) {
    const pipeGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.4, 12);
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, 0.02 + p * 0.05, 0.29);
    gpuGroup.add(pipe);
  }

  const logoGeo = new THREE.BoxGeometry(0.75, 0.07, 0.02);
  const logoMat = new THREE.MeshBasicMaterial({ color: COLOR_MAP[fanColorKey].hex });
  gpuLogoMesh = new THREE.Mesh(logoGeo, logoMat);
  gpuLogoMesh.position.set(0, 0.13, 0.3);
  gpuGroup.add(gpuLogoMesh);

  for (let i = -1; i <= 1; i++) {
    const gFanGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.02, 24);
    const gFanMat = new THREE.MeshStandardMaterial({ color: 0x121217, roughness: 0.5 });
    const gFan = new THREE.Mesh(gFanGeo, gFanMat);
    gFan.rotation.x = Math.PI / 2;
    gFan.position.set(i * 0.48, -0.21, 0);
    gpuGroup.add(gFan);
  }

  gpuMesh = gpuGroup;
  caseGroup.add(gpuMesh);
}

// Update 3D parts when parts are selected or cleared
function update3DRig() {
  if (!scene) return;

  const fanColor = COLOR_MAP[fanColorKey].hex;
  const coolerColor = COLOR_MAP[coolerColorKey].hex;

  // Dynamic Case Switching — always rebuild when case changes to ensure 3D updates
  const selectedCase = build.case || PRODUCTS.find((p) => p.id === "case-lianli-o11");
  if (selectedCase && selectedCase.id !== currentCaseId) {
    buildCaseChassis(selectedCase);
    toast(`Case swapped: ${selectedCase.name}`);
  }

  // Motherboard
  if (moboMesh) {
    moboMesh.material.color.set(build.mobo ? 0x1f1f28 : 0x111115);
    moboMesh.material.emissive = new THREE.Color(build.mobo ? 0x002233 : 0x000000);
  }

  // Cooler Logic: Air vs Liquid
  const isAirCooler = build.cooler && build.cooler.coolerType === "air";
  const hasCpuOrCooler = Boolean(build.cpu || build.cooler);

  if (coolerLiquidGroup) {
    coolerLiquidGroup.visible = hasCpuOrCooler && !isAirCooler;
  }
  if (coolerAirGroup) {
    coolerAirGroup.visible = hasCpuOrCooler && isAirCooler;
  }

  // RAM
  if (ramGroup) {
    ramGroup.visible = Boolean(build.ram);
  }
  if (ramRgb1 && ramRgb2) {
    ramRgb1.material.color.set(fanColor);
    ramRgb2.material.color.set(fanColor);
  }

  // GPU
  if (gpuMesh) {
    gpuMesh.visible = Boolean(build.gpu);
  }
  if (gpuLogoMesh) {
    if (build.gpu && (build.gpu.brand === "AMD" || build.gpu.name.includes("RX"))) {
      gpuLogoMesh.material.color.set(0xff2233);
    } else {
      gpuLogoMesh.material.color.set(fanColor);
    }
  }

  // Update Fan ARGB Materials
  fanRingMaterials.forEach((m) => m.color.set(fanColor));

  // Update Cooler ARGB Materials
  if (coolerLiquidGroup?.pumpRing) {
    coolerLiquidGroup.pumpRing.material.color.set(coolerColor);
  }
  if (coolerAirGroup?.airBladeMat) {
    coolerAirGroup.airBladeMat.color.set(coolerColor);
    coolerAirGroup.airFanHub.material.color.set(coolerColor);
  }

  // Update Point Lights
  if (fanLight1) {
    fanLight1.color.set(fanColor);
    fanLight1.intensity = build.gpu || build.cpu ? 4.5 : 2.5;
  }
  if (fanLight2) {
    fanLight2.color.set(fanColor);
  }
  if (coolerLight) {
    coolerLight.color.set(coolerColor);
    coolerLight.intensity = hasCpuOrCooler ? 4.2 : 1.8;
  }

  updateLcdDisplay();
}

function setFanColor(colorKey) {
  if (!COLOR_MAP[colorKey]) return;
  fanColorKey = colorKey;

  document.querySelectorAll("[data-fan-color]").forEach((sw) => {
    sw.classList.toggle("active", sw.dataset.fanColor === colorKey);
  });

  update3DRig();
  toast(`Fans ARGB: ${colorKey.toUpperCase()}`);
}

function setCoolerColor(colorKey) {
  if (!COLOR_MAP[colorKey]) return;
  coolerColorKey = colorKey;

  document.querySelectorAll("[data-cooler-color]").forEach((sw) => {
    sw.classList.toggle("active", sw.dataset.coolerColor === colorKey);
  });

  update3DRig();
  toast(`Cooler ARGB: ${colorKey.toUpperCase()}`);
}

function reset3DCamera() {
  if (!camera || !controls) return;
  camera.position.set(3.4, 1.8, 3.8);
  controls.target.set(0, 1.3, 0);
  controls.update();
  toast("Camera angle reset");
}

function setCameraAngle(angle) {
  if (!camera || !controls) return;
  document.querySelectorAll(".cam-btn").forEach((b) => b.classList.toggle("active", b.dataset.cam === angle));

  if (angle === "iso") {
    camera.position.set(3.4, 1.8, 3.8);
    controls.target.set(0, 1.3, 0);
  } else if (angle === "side") {
    camera.position.set(0, 1.45, 4.3);
    controls.target.set(0, 1.45, 0);
  } else if (angle === "front") {
    camera.position.set(4.2, 1.45, 0);
    controls.target.set(0, 1.45, 0);
  } else if (angle === "close") {
    camera.position.set(1.5, 1.6, 1.7);
    controls.target.set(0.1, 1.5, -0.2);
  }
  controls.update();
  toast(`View: ${angle.toUpperCase()}`);
}

// Copy to clipboard helper
function copyText(text, successMsg) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast(successMsg)).catch(() => toast(`Copied: ${text}`));
  } else {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    toast(successMsg);
  }
}

// ==========================================================================
// Event Listeners
// ==========================================================================
document.addEventListener("click", (e) => {
  // Add to cart
  const add = e.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);

  // Seat in 3D Builder directly from Store cards
  const seatBtn = e.target.closest("[data-build-seat]");
  if (seatBtn) {
    const p = PRODUCTS.find((x) => x.id === seatBtn.dataset.buildSeat);
    if (p) {
      build[p.cat] = p;
      activeSlot = p.cat;
      fillSlots();
      renderPicker();
      scoreBuild();
      location.hash = "#/builder";
      toast(`Selected ${p.name} for 3D Build`);
    }
  }

  // Quick Visual Case Switcher Pill in 3D Viewport
  const casePill = e.target.closest("[data-case-pick]");
  if (casePill) {
    pick(casePill.dataset.casePick);
  }

  // Pick part in builder
  const pickBtn = e.target.closest("[data-pick]");
  if (pickBtn) pick(pickBtn.dataset.pick);

  // Customize Preset Rig from Homepage
  const presetBtn = e.target.closest("[data-preset]");
  if (presetBtn) applyPreset(presetBtn.dataset.preset);

  // 3D HUD Item or 2D Slot Click in builder
  const hudOrSlot = e.target.closest(".slot, .hud-item");
  if (hudOrSlot) {
    activeSlot = hudOrSlot.dataset.slot;
    fillSlots();
    // Scroll the component picker on the right directly to this category and highlight it
    const catGroup = document.querySelector(`.pick-group[data-cat="${activeSlot}"]`);
    if (catGroup) {
      catGroup.scrollIntoView({ behavior: "smooth", block: "nearest" });
      catGroup.classList.add("highlight");
      setTimeout(() => catGroup.classList.remove("highlight"), 1400);
    }
  }

  // Cart Qty +/-
  const qty = e.target.closest("[data-qty]");
  if (qty) {
    const [id, d] = qty.dataset.qty.split(":");
    setQty(id, (cart.get(id) || 0) + Number(d));
  }

  // Filter Chip in Store
  const chip = e.target.closest(".chip");
  if (chip) {
    filter = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
    renderStore();
  }

  // Fan ARGB Swatch
  const fanSwatch = e.target.closest("[data-fan-color]");
  if (fanSwatch) {
    setFanColor(fanSwatch.dataset.fanColor);
  }

  // Cooler ARGB Swatch
  const coolerSwatch = e.target.closest("[data-cooler-color]");
  if (coolerSwatch) {
    setCoolerColor(coolerSwatch.dataset.coolerColor);
  }

  // Camera Angle Preset Buttons
  const camBtn = e.target.closest(".cam-btn");
  if (camBtn && camBtn.dataset.cam) {
    setCameraAngle(camBtn.dataset.cam);
  }

  // Copy Email / Phone buttons
  const copyBtn = e.target.closest(".copy-btn");
  if (copyBtn) {
    const val = copyBtn.dataset.copy;
    copyText(val, `Copied: ${val}`);
  }

  // Close Cart on link navigation
  if (e.target.closest("[data-link]")) closeCart();
});

// Navigation Cart Drawer
$("cartBtn").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("drawer").addEventListener("click", (e) => {
  if (e.target === $("drawer")) closeCart();
});
$("goCheckout").addEventListener("click", closeCart);

// Builder: Add full build to cart
$("addBuildToCart").addEventListener("click", () => {
  const parts = Object.values(build).filter(Boolean);
  if (!parts.length) {
    toast("Seat at least one component into the build");
    return;
  }
  parts.forEach((p) => addToCart(p.id));
  toast("Seated build moved to cart");
});

// Checkout Form Submission
$("payForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!cart.size) {
    toast("Cart is empty");
    return;
  }
  cart.clear();
  renderCart();
  toast("Order placed! Your rig is in production.");
  e.target.reset();
});

// Contact Inquiry Form Submission on About page
const contactForm = $("contactInquiryForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Inquiry transmitted! A PC Forge architect will respond shortly.");
    contactForm.reset();
  });
}

// 3D Preview Toggle Button
const togglePreviewBtn = $("togglePreviewBtn");
if (togglePreviewBtn) {
  togglePreviewBtn.addEventListener("click", toggle3DPreview);
}

// Reset 3D Camera Button
const resetCamBtn = $("reset3DCamera");
if (resetCamBtn) {
  resetCamBtn.addEventListener("click", reset3DCamera);
}

// Quick Case Switcher in 3D Toolbar
const quickCaseSelect = $("caseQuickSelect");
if (quickCaseSelect) {
  quickCaseSelect.addEventListener("change", (e) => {
    pick(e.target.value);
  });
}

// Routing & Scroll Flow Init
window.addEventListener("hashchange", route);

// Initialize Application
bindScrollFlow();
renderBrandMarquee();
renderStore();
renderFeaturedBuilds();
renderPicker();
renderCart();
fillSlots();
scoreBuild();
initStoreStarBg();
route();

// Initialize 3D WebGL Rig Preview
if (window.THREE) {
  init3DScene();
} else {
  window.addEventListener("load", init3DScene);
}
