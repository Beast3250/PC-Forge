// ============================================================================
// PERIPHERALS PAGE — Circular Iris Reveal, Mouse Follower, Categories & Cart
// ============================================================================

(function () {
  "use strict";

  // ── Helpers ──
  const $ = (id) => document.getElementById(id);
  let periphInitialized = false;
  let periphFilter = "all";

  // ── Iris Wipe Animation State ──
  let targetProgress = 0;   // 0 = fully closed (solid black + Hi), 1 = fully open
  let currentProgress = 0;  // interpolated progress
  let isAnimating = false;

  // ── Mouse Follower State ──
  let mouseX = -600, mouseY = -600;
  let followerX = -600, followerY = -600;

  // ── Circular Iris Wipe Controller ──
  function initIrisScroll() {
    const overlay = $("periphIrisOverlay");
    const ring = $("periphIrisRing");
    const greeting = $("periphGreeting");
    const enterBtn = $("periphEnterBtn");
    const irisContainer = $("periphIrisContainer");
    const scrollContent = $("periphScrollContent");

    if (!overlay || !ring || !greeting) return;

    // Apply initial state
    updateIrisView(0);

    // Enter button click
    if (enterBtn) {
      enterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        targetProgress = 1;
        startIrisAnimation();
      });
    }

    // Greeting click also triggers opening
    greeting.addEventListener("click", () => {
      if (currentProgress < 0.5) {
        targetProgress = 1;
        startIrisAnimation();
      }
    });

    // ── Wheel Event Listener ──
    window.addEventListener(
      "wheel",
      (e) => {
        const page = $("page-peripherals");
        if (!page || page.classList.contains("hidden")) return;

        // If iris is not fully open yet: wheel down opens it
        if (currentProgress < 0.98) {
          e.preventDefault();
          const delta = e.deltaY;
          if (delta > 0) {
            targetProgress = Math.min(1, targetProgress + delta * 0.0018);
          } else if (delta < 0) {
            targetProgress = Math.max(0, targetProgress + delta * 0.0018);
          }
          startIrisAnimation();
          return;
        }

        // If iris is fully open:
        // When user scrolls back to the very top and scrolls UP, close the iris!
        if (currentProgress >= 0.98 && window.scrollY <= 4 && e.deltaY < 0) {
          e.preventDefault();
          targetProgress = Math.max(0, targetProgress + e.deltaY * 0.0018);
          startIrisAnimation();
        }
      },
      { passive: false }
    );

    // ── Touch Gesture Support (Mobile / Tablet) ──
    let touchStartY = 0;
    let touchMoving = false;

    window.addEventListener(
      "touchstart",
      (e) => {
        const page = $("page-peripherals");
        if (!page || page.classList.contains("hidden")) return;
        touchStartY = e.touches[0].clientY;
        touchMoving = true;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        const page = $("page-peripherals");
        if (!page || page.classList.contains("hidden") || !touchMoving) return;

        const currentY = e.touches[0].clientY;
        const diff = touchStartY - currentY; // positive = swipe UP (scroll down)

        if (currentProgress < 0.98) {
          // Prevent standard scroll while iris is opening
          e.preventDefault();
          targetProgress = Math.max(0, Math.min(1, targetProgress + diff * 0.0045));
          touchStartY = currentY;
          startIrisAnimation();
          return;
        }

        // When at top and dragging DOWN, close the iris
        if (currentProgress >= 0.98 && window.scrollY <= 4 && diff < -8) {
          e.preventDefault();
          targetProgress = Math.max(0, Math.min(1, targetProgress + diff * 0.0045));
          touchStartY = currentY;
          startIrisAnimation();
        }
      },
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      () => {
        touchMoving = false;
        // Snap to nearest state if in-between on mobile
        if (targetProgress > 0.4 && targetProgress < 1) {
          targetProgress = 1;
        } else if (targetProgress <= 0.4 && targetProgress > 0) {
          targetProgress = 0;
        }
        startIrisAnimation();
      },
      { passive: true }
    );
  }

  function startIrisAnimation() {
    if (isAnimating) return;
    isAnimating = true;

    function step() {
      const page = $("page-peripherals");
      if (!page || page.classList.contains("hidden")) {
        isAnimating = false;
        return;
      }

      // Smooth interpolation
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.001) {
        currentProgress += diff * 0.16;
        updateIrisView(currentProgress);
        requestAnimationFrame(step);
      } else {
        currentProgress = targetProgress;
        updateIrisView(currentProgress);
        isAnimating = false;
      }
    }
    requestAnimationFrame(step);
  }

  function updateIrisView(progress) {
    const overlay = $("periphIrisOverlay");
    const ring = $("periphIrisRing");
    const greeting = $("periphGreeting");
    const scrollContent = $("periphScrollContent");

    if (!overlay || !ring || !greeting) return;

    // Radius in percentage of viewport
    const radiusPercent = progress * 140; // 0% to 140% (clears all 4 corners)

    // Calculate radius in pixels for the physical glowing neon ring
    const maxRadiusPx = Math.hypot(window.innerWidth, window.innerHeight) * 0.72;
    const radiusPx = progress * maxRadiusPx;

    // Circular Cutout Mask on Black Overlay
    const maskVal = `radial-gradient(circle at 50% 50%, transparent ${radiusPercent}%, #000000 calc(${radiusPercent}% + 1.5px))`;
    overlay.style.webkitMaskImage = maskVal;
    overlay.style.maskImage = maskVal;

    // Circular Glowing Loop Ring
    ring.style.width = `${radiusPx * 2}px`;
    ring.style.height = `${radiusPx * 2}px`;
    ring.style.opacity = progress > 0.015 && progress < 0.985 ? "1" : "0";

    // Greeting Fade & Scale
    const greetingOpacity = Math.max(0, 1 - progress * 2.6);
    const greetingScale = 1 + progress * 0.35;
    greeting.style.opacity = greetingOpacity;
    greeting.style.transform = `scale(${greetingScale})`;
    greeting.style.pointerEvents = greetingOpacity > 0.1 ? "auto" : "none";

    // Pointer-events and visibility toggle on overlay
    if (progress >= 0.98) {
      overlay.style.pointerEvents = "none";
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      if (scrollContent) scrollContent.classList.add("periph-content-visible");
    } else {
      overlay.style.visibility = "visible";
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
      if (scrollContent) {
        if (progress > 0.15) {
          scrollContent.classList.add("periph-content-visible");
        } else {
          scrollContent.classList.remove("periph-content-visible");
        }
      }
    }
  }

  // ── Mouse Follower Glow ──
  function initMouseFollower() {
    const el = $("periphCursorGlow");
    if (!el) return;

    // Disable on touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      el.style.display = "none";
      return;
    }

    const page = $("page-peripherals");
    if (!page) return;

    page.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      el.style.opacity = "1";
    });

    page.addEventListener("mouseleave", () => {
      el.style.opacity = "0";
    });

    page.addEventListener("mouseenter", () => {
      el.style.opacity = "1";
    });

    function animateFollower() {
      const pageActive = $("page-peripherals");
      if (pageActive && !pageActive.classList.contains("hidden")) {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        el.style.transform = `translate(${followerX - 160}px, ${followerY - 160}px)`;
      }
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
  }

  // ── Render Peripheral Products ──
  function renderPeripherals() {
    const grid = $("periphProductGrid");
    if (!grid || typeof PERIPHERALS === "undefined") return;

    const items =
      periphFilter === "all"
        ? PERIPHERALS
        : PERIPHERALS.filter((p) => p.cat === periphFilter);

    grid.innerHTML = items
      .map((p) => {
        const fallbackSvg =
          typeof getPeriphFallbackSvg === "function"
            ? getPeriphFallbackSvg(p.id)
            : "";

        return `
        <article class="periph-card" data-cat="${p.cat}" data-id="${p.id}">
          <div class="periph-card-img-wrap">
            <img src="${p.image}" 
                 alt="${p.name}" 
                 class="periph-card-img" 
                 loading="lazy"
                 onerror="this.onerror=null;if('${fallbackSvg}') this.src='${fallbackSvg}';" />
            <span class="periph-card-brand">${p.brand}</span>
            <span class="periph-stock-badge">${p.inStock ? "In Stock" : "Out of Stock"}</span>
          </div>

          <div class="periph-card-body">
            <div class="periph-card-topline">
              <span class="periph-card-tag">${p.tag}</span>
              <span class="periph-card-cat-badge">${PERIPH_CAT_LABEL[p.cat] || p.cat}</span>
            </div>
            
            <h3 class="periph-card-name">${p.name}</h3>
            <p class="periph-card-spec">${p.spec}</p>

            <div class="periph-card-footer">
              <div class="periph-price-box">
                <span class="periph-price-label">Price</span>
                <span class="periph-card-price">$${p.price.toLocaleString()}</span>
              </div>

              <div class="periph-card-btns">
                <button class="periph-add-cart-btn" data-periph-add="${p.id}" type="button" title="Add to Cart">
                  <span>Add</span>
                  <span class="btn-icon">🛒</span>
                </button>
                <button class="periph-buy-now-btn" data-periph-buy="${p.id}" type="button" title="Buy directly">
                  <span>Buy</span>
                  <span class="btn-icon">⚡</span>
                </button>
              </div>
            </div>
          </div>
        </article>`;
      })
      .join("");

    // Animate cards on filter change
    const cards = grid.querySelectorAll(".periph-card");
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.04}s`;
    });
  }

  // ── Category Filter Bar ──
  function initCategoryFilter() {
    const bar = $("periphFilterBar");
    if (!bar) return;

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-periph-filter]");
      if (!btn) return;

      bar.querySelectorAll("[data-periph-filter]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      periphFilter = btn.dataset.periphFilter;

      const grid = $("periphProductGrid");
      if (grid) {
        grid.classList.add("periph-grid-fade");
        setTimeout(() => {
          renderPeripherals();
          grid.classList.remove("periph-grid-fade");
        }, 180);
      }
    });
  }

  // ── Cart & Buy Button Event Handlers ──
  function initCartButtons() {
    const grid = $("periphProductGrid");
    if (!grid) return;

    grid.addEventListener("click", (e) => {
      // Add to Cart
      const addBtn = e.target.closest("[data-periph-add]");
      if (addBtn) {
        const id = addBtn.dataset.periphAdd;
        if (typeof addToCart === "function") {
          addToCart(id);
        }

        // Button feedback
        addBtn.classList.add("btn-added");
        const span = addBtn.querySelector("span:first-child");
        if (span) span.textContent = "✓";
        setTimeout(() => {
          addBtn.classList.remove("btn-added");
          if (span) span.textContent = "Add";
        }, 1200);
        return;
      }

      // Buy Now (Add to cart & go to checkout)
      const buyBtn = e.target.closest("[data-periph-buy]");
      if (buyBtn) {
        const id = buyBtn.dataset.periphBuy;
        if (typeof addToCart === "function") {
          addToCart(id);
        }
        location.hash = "#/checkout";
        return;
      }
    });
  }

  // ── Background Ambient Particles (Light Purple + Glowish Green) ──
  function initBgParticles() {
    const canvas = $("periphBgCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const PARTICLE_COUNT = 38;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 3.5 + 1.2,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.35 + 0.15,
        color: Math.random() > 0.5 ? "rgba(74, 222, 128, " : "rgba(192, 132, 252, ",
      });
    }

    function animate() {
      const page = $("page-peripherals");
      if (!page || page.classList.contains("hidden")) {
        requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Soft halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha * 0.25 + ")";
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ── Public API: Page Init on Route ──
  window.initPeripheralsPage = function () {
    if (!periphInitialized) {
      periphInitialized = true;
      initIrisScroll();
      initMouseFollower();
      initCategoryFilter();
      renderPeripherals();
      initCartButtons();
      initBgParticles();
    } else {
      // Reset iris state cleanly on re-entry
      targetProgress = 0;
      currentProgress = 0;
      updateIrisView(0);
      renderPeripherals();
    }
  };

  // Auto-init if direct hash entry to peripherals page
  if (location.hash.includes("peripherals")) {
    setTimeout(window.initPeripheralsPage, 50);
  }
})();
