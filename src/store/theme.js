import { colors, LocalStorage } from 'quasar'

export default {
  namespaced: true,
  state: {
    primaryColor: LocalStorage.getItem('theme_primaryColor') || colors.getBrand('primary'),
    secondaryColor: LocalStorage.getItem('theme_secondaryColor') || colors.getBrand('secondary')
  },
  getters: {
    primaryColor: state => state.primaryColor,
    secondary: state => state.secondaryColor
  },
  mutations: {
    SET_PRIMARYCOLOR(state, primaryColor) {
      state.primaryColor = primaryColor
      colors.setBrand('primary', state.primaryColor)
      LocalStorage.set('theme_primaryColor', state.primaryColor)
    },
    SET_SECONDARYCOLOR(state, secondaryColor) {
      state.secondaryColor = secondaryColor
      colors.setBrand('secondary', state.secondaryColor)
      LocalStorage.set('theme_secondaryColor', state.secondaryColor)
    }
  },
  actions: {
    changeTheme(context, payload) {
      if (payload.primaryColor && payload.primaryColor !== null) {
        context.commit('SET_PRIMARYCOLOR', payload.primaryColor)
      }
      if (payload.secondaryColor && payload.secondaryColor !== null) {
        context.commit('SET_SECONDARYCOLOR', payload.secondaryColor)
      }
    },
    restoreDefaults(context, payload) {
      LocalStorage.remove('theme_primaryColor')
      LocalStorage.remove('theme_secondaryColor')
      this._vm.$q.notify("Please restart the app to apply changes")
    }
  }
}
