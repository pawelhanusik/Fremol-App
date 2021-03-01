import { LocalStorage } from "quasar"

export default {
  namespaced: true,
  state: {
    host: LocalStorage.getItem('server_host') || '',
    apiPort: LocalStorage.getItem('server_apiPort') || '',
    wsPort: LocalStorage.getItem('server_wsPort') || '',
    isConnected: false
  },
  getters: {
    host: state => state.host,
    wsHost: state => state.host,
    apiPort: state => state.apiPort,
    wsPort: state => state.wsPort,
    
    axiosBaseURL: state => {
      return `http://${state.host}:${state.apiPort}/api`
    },
    echoAuthEndpoint: state => {
      return `http://${state.host}:${state.apiPort}/broadcasting/auth`
    },

    isConnected: state => state.isConnected
  },
  mutations: {
    SET_HOST(state, host) {
      state.host = host
      LocalStorage.set('server_host', state.host)
    },
    SET_APIPORT(state, apiPort) {
      state.apiPort = apiPort
      LocalStorage.set('server_apiPort', state.apiPort)
    },
    SET_WSPORT(state, wsPort) {
      state.wsPort = wsPort
      LocalStorage.set('server_wsPort', state.wsPort)
    },
    SET_ISCONNECTED(state, isConnected) {
      state.isConnected = isConnected
    }
  },
  actions: {
    connect(context, payload) {
      if (context.getters['isConnected']) {
        context.dispatch('disconnect')
      }
      context.commit('SET_HOST', payload.host)
      context.commit('SET_APIPORT', payload.apiPort)
      context.commit('SET_WSPORT', payload.wsPort)

      context.commit('SET_ISCONNECTED', true)
    },
    disconnect(context) {
      context.dispatch('user/forceLogout', null, { root: true })
      context.commit('SET_ISCONNECTED', false)
    },

    setAxiosBaseURL(context) {
      this._vm.$api.defaults.baseURL = context.getters['axiosBaseURL']
    },
    setEchoHostOptions(context) {
      this._vm.$echo.options.wsHost = context.getters['wsHost']
      this._vm.$echo.options.wsPort = context.getters['wsPort']
      this._vm.$echo.options.authEndpoint = context.getters['echoAuthEndpoint']
      this._vm.$echo.disconnect()
      this._vm.$echo.connect()
    }
  }
}
