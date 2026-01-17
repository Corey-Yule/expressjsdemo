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

const buttons = [{
    anchor: '/account',
    text: 'Account Settings'
  },

  {
    anchor: '/login',
    anchorClass: 'loginButton',
    text: 'Login'
  }

]

export function createNavBar() {
  const container = document.body

  createNav(container)
  addCss()


  for (const button of buttons) {
    createButton(nav, button)
  }


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
  const button = `
    <a href="${options.anchor}" class="${options.anchorClass || ""}">
      <button class="nbutton">
        ${options.text}
      </button>
    </a> 
  `

  parent.innerHTML += button
}

function createNav(container) {
  var nav = document.createElement('nav')
  nav.class = "navbar"
  nav.id = "Nav"

  container.insertBefore(nav, container.firstChild)
}
