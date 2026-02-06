const buttons = [
  {
    anchor: '/',
    image: '/Images/logo.png',
    class: 'Logo'
  },
  {
    anchor: '/aboutUs',
    text: 'About us',
    hideOnMobile: true
  },
  {
    anchor: '/missions',
    text: 'Missions',
    hideOnMobile: true
  },
  {
    anchor: '/progress',
    text: 'Progress',
    hideOnMobile: true
  },
  {
    anchor: '/test',
    text: 'Testing Ground',
    hideOnMobile: true
  },
  {
    anchor: '/account',
    text: 'Account Settings',
    class: 'settingsButton'
  },
  {
    anchor: '/login',
    anchorClass: 'loginButton',
    text: 'Login',
    removeOnLogin: true,
    class: 'loginButtons'
  },
]

export async function createNavBar() {
  const container = document.body
  const nav = createNav(container)
  const loggedIn = await getLogin()
  addCss()
  
  // Track if we need the hamburger (if there are any hideOnMobile buttons)
  let hasDropdownItems = false
  
  // Create hamburger button
  const hamburger = createHamburger(nav)

  // First pass: add logo
  for (const button of buttons) {
    if (button.image) {
      createButton(nav, button)
    }
  }
  
  // Create dropdown menu container
  const dropdown = document.createElement('div')
  dropdown.className = 'navDropdown'
  nav.appendChild(dropdown)
  
  // Create regular menu container for visible buttons
  const menuContainer = document.createElement('div')
  menuContainer.className = 'navMenu'
  nav.appendChild(menuContainer)
  
  // Second pass: add all text buttons
  for (const button of buttons) {
    if (loggedIn && button.removeOnLogin) {
      continue
    }
    
    // Skip logo (already added)
    if (button.image) {
      continue
    }
    
    // Add to dropdown if it should hide on mobile
    if (button.hideOnMobile) {
      hasDropdownItems = true
      const dropdownBtn = createButton(dropdown, button)
      dropdownBtn.classList.add('dropdownOnly')
    }
    
    // Add to main menu
    const mainBtn = createButton(menuContainer, button)
    if (button.hideOnMobile) {
      mainBtn.classList.add('hideOnMobile')
    }
  }
  
  // Toggle dropdown on hamburger click
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation()
    dropdown.classList.toggle('active')
    hamburger.classList.toggle('active')
  })
  
  // Close dropdown when clicking a link
  dropdown.addEventListener('click', () => {
    dropdown.classList.remove('active')
    hamburger.classList.remove('active')
  })
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      dropdown.classList.remove('active')
      hamburger.classList.remove('active')
    }
  })
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

function getLogin() {
  return fetch('/auth/status')
    .then(res => res.json())
    .then(data => {
      return data.loggedIn
    })
}

function addCss() {
  const head = document.head
  var link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = '/css/navbar.css'
  head.appendChild(link)
}

function createButton(parent, options) {
  var anchor = document.createElement('a')
  anchor.href = options.anchor
  if (options.image) {
    anchor.className = 'nIconContainer'
    createImage(anchor, options)
  } else {
    anchor.className = 'nButton'
    anchor.innerHTML = options.text
  }
  parent.appendChild(anchor)
  return anchor
}

function createImage(parent, options) {
  var img = document.createElement('img')
  img.src = options.image
  img.className = options.class
  parent.appendChild(img)
}

function createNav(container) {
  var nav = document.createElement('nav')
  nav.id = "Nav"
  nav.className = 'navBar'
  container.insertBefore(nav, container.firstChild)
  return nav
}