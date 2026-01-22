// This file handles all the importable components
// when wanting to use a component, just import the relevanta
// generate function from here and run it on the page
// that function will import the css and component automatically
// so that's all that needs to be done


import { createBackground } from './background.js'
import { createNavBar } from './navbar.js'


export function generateBackground() {
  createBackground()
}

export function generateNavBar() {
  createNavBar()
}
