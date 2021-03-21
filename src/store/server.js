import { LocalStorage } from "quasar"
import https from 'https'

export default {
  namespaced: true,
  state: {
    host: LocalStorage.getItem('server_host') || '',
    useHttps: LocalStorage.getItem('server_useHttps') || true,
    apiPort: LocalStorage.getItem('server_apiPort') || '',
    wsPort: LocalStorage.getItem('server_wsPort') || '',
    cert: LocalStorage.getItem('server_cert') || '',
    isConnected: false,

    token: LocalStorage.getItem('token') || ''
  },
  getters: {
    host: state => state.host,
    useHttps: state => state.useHttps,
    wsHost: state => state.host,
    apiPort: state => state.apiPort,
    wsPort: state => state.wsPort,
    cert: state => state.cert,
    
    axiosBaseURL: state => {
      let protocol = state.useHttps ? 'https' : 'http'
      return `${protocol}://${state.host}:${state.apiPort}/api`
    },
    echoAuthEndpoint: state => {
      let protocol = state.useHttps ? 'https' : 'http'
      return `${protocol}://${state.host}:${state.apiPort}/broadcasting/auth`
    },

    isConnected: state => state.isConnected,

    token: state => state.token
  },
  mutations: {
    SET_HOST(state, host) {
      state.host = host
      LocalStorage.set('server_host', state.host)
    },
    SET_USEHTTPS(state, useHttps) {
      state.useHttps = useHttps
      LocalStorage.set('server_useHttps', state.useHttps)
    },
    SET_APIPORT(state, apiPort) {
      state.apiPort = apiPort
      LocalStorage.set('server_apiPort', state.apiPort)
    },
    SET_WSPORT(state, wsPort) {
      state.wsPort = wsPort
      LocalStorage.set('server_wsPort', state.wsPort)
    },
    SET_CERT(state, cert) {
      state.cert = cert
      LocalStorage.set('server_cert', state.cert)
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
      context.commit('SET_USEHTTPS', payload.useHttps)
      context.commit('SET_APIPORT', payload.apiPort)
      context.commit('SET_WSPORT', payload.wsPort)
      if (payload.cert) {
        const reader = new FileReader()
        reader.onload = function(e) {
          let certFileContents = e.target.result
          context.commit('SET_CERT', certFileContents)
        }
        reader.readAsText(payload.cert);
      }

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
      this._vm.$api.defaults.agent = new https.Agent({ 
        ca: context.getters['cert']
      })
    },
    setEchoHostOptions(context) {
      this._vm.$echo.options.wsHost = context.getters['wsHost']
      this._vm.$echo.options.wsPort = context.getters['wsPort']
      this._vm.$echo.options.wssPort = context.getters['wsPort']
      this._vm.$echo.options.authEndpoint = context.getters['echoAuthEndpoint']
      this._vm.$echo.disconnect()
      this._vm.$echo.connect()
    },
    setAccessToken(context) {
      this._vm.$api.defaults.headers.common['Authorization'] = 'Bearer ' + context.getters['token']
      this._vm.$echo.options.auth.headers['Authorization'] = 'Bearer ' + context.getters['token']
    }
  }
}
