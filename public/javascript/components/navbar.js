

const buttons = [
  {
    anchor: '/',
    image: '/Images/logo.png'
  },
  {
    anchor: '/about',
    text: 'About us'

  },
  {
    anchor: '/login',
    anchorClass: 'loginButton',
    text: 'Login'
  },
  {
    anchor: '/account',
    text: 'Account Settings'
  },

]

export function createNavBar() {
  fetch('/auth/status')
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        console.log("Worked!")
      }
    });

  const container = document.body
  const nav = createNav(container)

  for (const button of buttons) {
    createButton(nav, button)
  }

  addCss()
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
    createImage(anchor, options.image)
  } else {
    anchor.className = 'nButton'
    anchor.innerHTML = options.text
  }

  parent.appendChild(anchor)
}

function createImage(parent, route) {
  var img = document.createElement('img')

  img.src = '/Images/logo.png'
  img.className = 'nIcon'

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

// temporarily commented to work on the generation of the nav bar
//
// middleware/authContext.js
// const { checkAuth } = require();
//
// module.exports = async function authContext(req, res, next) {
//   const auth = await checkAuth(req);
//
//   res.locals.authenticated = auth.authenticated;
//   res.locals.user = auth.user;
//
//   if (auth.newTokens) {
//     res.cookie('sb-access-token', auth.newTokens.access_token, {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production'
//     });
//
//     res.cookie('sb-refresh-token', auth.newTokens.refresh_token, {
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production'
//     });
//   }
//
//   next();
// };
