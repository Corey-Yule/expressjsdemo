const buttons = [
  {
    anchor: '/',
    image: '/Images/logo.png',
    class: 'Logo'
  },
  {
    anchor: '/aboutUs',
    text: 'About us'
  },
  {
    anchor: '/missions',
    text: 'Missions'
  },
  {
    anchor: '/leaderboard',
    text: 'Leaderboard'
  },
  {
    anchor: '/progress',
    text: 'Progress'
  },
  {
    anchor: '/social',
    text: 'Social',
    presentOnLogin: true
  },
  {
    anchor: '/account',
    text: 'Account Settings',
    presentOnLogin: true,
    class: 'settingsButton'
  },
  {
    anchor: '/login',
    text: 'Login',
    removeOnLogin: true,
    class: 'loginButtons'
  }
]

export async function createNavBar() {
  // 🔒 Prevent duplicate navbars
  if (document.querySelector('.navBar')) return

  addCss()

  const loggedIn = await getLogin()

  const nav = createNav(document.body)
  const hamburger = createHamburger(document.body)
  const menuContainer = createMenuContainer(nav)

  for (const button of buttons) {
    if (loggedIn && button.removeOnLogin) { continue }
    if (!loggedIn && button.presentOnLogin) { continue }
    createButton(menuContainer, button)
  }

  addEvents(hamburger, nav)
}

/* =====================
   EVENTS
===================== */

function addEvents(hamburger, nav) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation()
    nav.classList.toggle('active')
    hamburger.classList.toggle('active')
  })

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('active')
      hamburger.classList.remove('active')
    }
  })
}

/* =====================
   ELEMENT CREATORS
===================== */

function createNav(container) {
  const nav = document.createElement('nav')
  nav.className = 'navBar'
  container.insertBefore(nav, container.firstChild)
  return nav
}

function createMenuContainer(nav) {
  const menu = document.createElement('div')
  menu.className = 'navMenu'
  nav.appendChild(menu)
  return menu
}

function createHamburger(parent) {
  const hamburger = document.createElement('button')
  hamburger.className = 'hamburger'
  hamburger.setAttribute('aria-label', 'Menu')

  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `

  parent.appendChild(hamburger)
  return hamburger
}

function createButton(parent, options) {
  const anchor = document.createElement('a')
  anchor.href = options.anchor

  if (options.image) {
    anchor.className = 'nIconContainer'
    const img = document.createElement('img')
    img.src = options.image
    img.className = options.class
    anchor.appendChild(img)
  } else {
    anchor.className = `nButton ${options.class || ''}`.trim()
    anchor.textContent = options.text
  }

  parent.appendChild(anchor)
}

/* =====================
   HELPERS
===================== */

function getLogin() {
  return fetch('/auth/status')
    .then(res => res.json())
    .then(data => data.loggedIn)
    .catch(() => false)
}

function addCss() {
  if (document.querySelector('link[href="/css/navbar.css"]')) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/css/navbar.css'
  document.head.appendChild(link)
}
