import { backend } from "../../fremol.conf"

import { LocalStorage } from "quasar"


export default {
  namespaced: true,
  state: {
    host: LocalStorage.getItem('server_host') || backend.serverHost,
    apiPort: LocalStorage.getItem('server_apiPort') || backend.apiPort,
    wsPort: LocalStorage.getItem('server_wsPort') || backend.wsPort,
    isConnected: false,

    token: LocalStorage.getItem('token') || ''
  },
  getters: {
    host: state => state.host,
    wsHost: state => state.host,
    apiPort: state => state.apiPort,
    wsPort: state => state.wsPort,
    
    axiosBaseURL: state => {
      return `https://${state.host}:${state.apiPort}/api`
    },
    echoAuthEndpoint: state => {
      return `https://${state.host}:${state.apiPort}/broadcasting/auth`
    },

    isConnected: state => state.isConnected,

    token: state => state.token
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
    },
    SET_ISCONNECTED_QUIET(state, isConnected) {
      state.isConnected = isConnected
    },
    SET_TOKEN(state, token) {
      state.token = token
      LocalStorage.set('token', state.token)
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

      context.dispatch('checkApiConnection')
    },
    disconnect(context) {
      context.dispatch('user/forceLogout', null, { root: true })
      context.commit('SET_ISCONNECTED', false)
    },
    
    checkApiConnection(context) {
      this._vm.$api.get('/status').then(response => {
        context.commit('SET_ISCONNECTED', true)
      }).catch(err => {
        context.commit('SET_ISCONNECTED', false)
      })
    },

    setAxiosBaseURL(context) {
      this._vm.$api.defaults.baseURL = context.getters['axiosBaseURL']
    },
    setEchoHostOptions(context) {
      this._vm.$echo.options.wsHost = context.getters['wsHost']
      this._vm.$echo.options.wssPort = context.getters['wsPort']
      this._vm.$echo.options.authEndpoint = context.getters['echoAuthEndpoint']
      this._vm.$echo.disconnect()
      this._vm.$echo.connect()
    },
    setAccessToken(context) {
      this._vm.$api.defaults.headers.common['Authorization'] = 'Bearer ' + context.getters['token']
      this._vm.$echo.options.auth.headers['Authorization'] = 'Bearer ' + context.getters['token']
    },

    restoreDefaults(context) {
      LocalStorage.remove('server_host')
      LocalStorage.remove('server_apiPort')
      LocalStorage.remove('server_wsPort')
      context.commit('SET_HOST', backend.serverHost)
      context.commit('SET_APIPORT', backend.apiPort)
      context.commit('SET_WSPORT', backend.wsPort)
    }
  }
}
