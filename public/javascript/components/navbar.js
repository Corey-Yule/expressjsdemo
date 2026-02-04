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
    anchor: '/progress',
    text: 'Progress'
  },
  {
    anchor: '/test',
    text: 'Testing Ground'
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
  },
]

export async function createNavBar() {
  const container = document.body
  const nav = createNav(container)
  const loggedIn = await getLogin()

  addCss()

  for (const button of buttons) {
    if (loggedIn && button.removeOnLogin) {
      continue
    }

    createButton(nav, button)
  }
}

function getLogin() {
  return fetch('/auth/status')
    .then(res => res.json())
    .then(data => {
      return data.loggedIn
  })
}

function addCss() {
  const head = document.head;
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
}

function createImage(parent, options) {
  var img = document.createElement('img')

  img.src = options.image
  img.className = options.class

  parent.appendChild(img)
}

function createNav(container) {
  var nav = document.createElement('nav')
  nav.class = "navbar"
  nav.id = "Nav"
  nav.className = 'navBar'

  container.insertBefore(nav, container.firstChild)

  return nav
}
