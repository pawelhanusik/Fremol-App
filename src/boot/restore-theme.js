import { colors } from 'quasar'
const { setBrand } = colors
const { LocalStorage } = require("quasar");


if (LocalStorage.has('theme_primaryColor')) {
  setBrand('primary', LocalStorage.getItem('theme_primaryColor'))
}
if (LocalStorage.has('theme_secondaryColor')) {
  setBrand('secondary', LocalStorage.getItem('theme_secondaryColor'))
}
