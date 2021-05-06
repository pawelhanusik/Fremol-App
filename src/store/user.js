export default {
  namespaced: true,
  state: {
    user: {},
    isLoggedIn: false
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user,
    id: state => state.user.id || -1,
    email: state => state.user.email || '',
    avatar_url: state => state.user.avatar_url || '',
    name: state => state.user.name || '',
  },
  mutations: {
    SET_ISLOGGEDIN (state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn
    },
    SET_USER (state, user) {
      if (user.avatar_url) {
        const baseURL = this._vm.$api.defaults.baseURL.substr(0, this._vm.$api.defaults.baseURL.length - 4)
        user.avatar_url = baseURL + '/storage/' + user.avatar_url.substr(7)
      }
      state.user = user
    }
  },
  actions: {
    async login(context, loginData) {
      return new Promise((resolve, reject) => {
        this._vm.$api.post('/login', loginData).then(response => {
          if (response.status === 200) {
            context.commit('server/SET_TOKEN', response.data.token, { root: true })
            context.dispatch('fetchUserData')
            context.dispatch('conversations/fetchConversations', null, { root: true })
            
            resolve()
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    async register(context, registerData) {
      return new Promise((resolve, reject) => {
        this._vm.$api.post('/register', registerData).then(response => {
          if (response.status === 200) {
            resolve()
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    fetchUserData (context) {
      this._vm.$api.get('/user').then(response => {
        if (response.status === 200) {
          context.commit('SET_USER', response.data)
          context.commit('SET_ISLOGGEDIN', true)
        } else {
          context.dispatch('clearData')
        }
      }).catch(err => {
        context.dispatch('clearData')
      })
    },
    async updateSettings (context, updatedUserData) {
      return new Promise((resolve, reject) => {
        const userId = context.getters['id']
        this._vm.$api.post(`/users/${userId}/update`, updatedUserData).then(response => {
          if (response.status === 200) {
            context.dispatch('fetchUserData')
            resolve()
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    
    async logout(context, config = {}) {
      return new Promise((resolve, reject) => {
        this._vm.$api.post('/logout', {}, config).then(() => {
          context.dispatch('clearData')
          resolve()
        }).catch(() => {
          reject()
        });
      })
    },
    forceLogout(context, config = {}) {
      this._vm.$api.post('/logout', {}, config).then(() => {
      }).catch(() => {
      });
      context.dispatch('clearData')
    },

    clearData (context) {
      context.commit('server/SET_TOKEN', '', { root: true })
      context.commit('SET_USER', {})
      context.commit('SET_ISLOGGEDIN', false)
      context.dispatch('conversations/clearData', null, { root: true })
      context.dispatch('messages/clearData', null, { root: true })
    }
  }
}
