
export function createBackground(options = {}) {

// Where to put the background when function is called
  const container = options.container || document.body;
// Number of particles in the background 
  const particleCount = options.particleCount ?? 80;

  // Load CSS into page 
  appendCss();

  // Avoid duplicates if createBackground runs more than once
  const existing = container.querySelector(".gradient-background");
  if (existing) existing.remove();

  // Main background wrapper
  const background = document.createElement("div");
  background.className = "gradient-background";

  // pixel grid
  const pixelGrid = document.createElement("div");
  pixelGrid.className = "pixel-grid";
  pixelGrid.setAttribute("aria-hidden", "true");
  background.appendChild(pixelGrid);

  // pixel sparkles 
  const canvas = document.createElement("canvas");
  canvas.id = "pixels";
  canvas.setAttribute("aria-hidden", "true");
  background.appendChild(canvas);

  // Particles container 
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "particles-container";
  particlesContainer.id = "particles-container";
  background.appendChild(particlesContainer);

  // Put the whole background into the page
  container.prepend(background);

  // Start the sparkles!
  initPixelSparkles(canvas);

  // Spawns the floating particles.
  initParticles(particlesContainer, particleCount);

  //Adds “mouse trail particles” on mouse move.
  initMouseParticles(particlesContainer);
}

// Stuff to help with the css - If CSS was already appended, stop. Otherwise mark it as appended.
let cssAppended = false;
function appendCss() {
  if (cssAppended) return;
  cssAppended = true;

  const head = document.head;
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/css/background.css";
  head.appendChild(link);
}

// Sparkly function bit
function initPixelSparkles(canvas) {
  const ctx = canvas.getContext("2d", { alpha: true });

  // Used to adjust the background to different sized displays
  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Calls resize when window is resized 
  window.addEventListener("resize", resize);
  resize();

  // Controls the size and rate of sparkles
  const tile = 16; // pixel size
  const sparkleChance = 0.0009;
  const base = { r: 12, g: 18, b: 40 };

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function frame() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // subtle shimmer trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
    ctx.fillRect(0, 0, w, h);


    // 
    for (let x = 0; x < w; x += tile) {
      for (let y = 0; y < h; y += tile) {
        if (Math.random() < sparkleChance) {
          const boost = randInt(10, 45);
          const r = base.r + boost;
          const g = base.g + boost;
          const b = base.b + boost + randInt(0, 25);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
          ctx.fillRect(x, y, tile, tile);
        }
      }
    }

    requestAnimationFrame(frame);
  }

  // start
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  requestAnimationFrame(frame);
}


function initParticles(container, count) {
  for (let i = 0; i < count; i++) createParticle(container);
}

function createParticle(container) {
  const particle = document.createElement("div");
  particle.className = "particle";
  const size = Math.random() * 3 + 1;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  resetParticle(particle);
  container.appendChild(particle);
  animateParticle(particle);
}

function resetParticle(particle) {
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.style.opacity = "0";
  return { x: posX, y: posY };
}

function animateParticle(particle) {
  const pos = resetParticle(particle);
  const duration = Math.random() * 10 + 10;
  const delay = Math.random() * 5;

  setTimeout(() => {
    particle.style.transition = `all ${duration}s linear`;
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    const moveX = pos.x + (Math.random() * 20 - 10);
    const moveY = pos.y - Math.random() * 30;
    particle.style.left = `${moveX}%`;
    particle.style.top = `${moveY}%`;

    setTimeout(() => animateParticle(particle), duration * 1000);
  }, delay * 1000);
}

function initMouseParticles(container) {
  document.addEventListener("mousemove", (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 100;
    const mouseY = (e.clientY / window.innerHeight) * 100;

    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${mouseX}%`;
    particle.style.top = `${mouseY}%`;
    particle.style.opacity = "0.6";
    container.appendChild(particle);

    setTimeout(() => {
      particle.style.transition = "all 2s ease-out";
      particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
      particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
      particle.style.opacity = "0";
      setTimeout(() => particle.remove(), 2000);
    }, 10);
  });
}
