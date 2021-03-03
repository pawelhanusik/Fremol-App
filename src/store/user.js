export default {
  namespaced: true,
  state: {
    isFetching: false,
    user: {},
    isLoggedIn: false
  },
  getters: {
    isFetching: state => state.isFetching,
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user,
    id: state => state.user.id || -1,
    email: state => state.user.email || '',
    name: state => state.user.name || '',
  },
  mutations: {
    SET_ISFETCHING (state, isFetching) {
      state.isFetching = isFetching
    },
    SET_ISLOGGEDIN (state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn
    },
    SET_USER (state, user) {
      state.user = user
    }
  },
  actions: {
    login(context, loginData) {
      context.commit('SET_ISFETCHING', true)
      this._vm.$api.post('/login', loginData).then(response => {
        if (response.status === 200) {
          this._vm.$q.notify('Logged in')
          context.commit('server/SET_TOKEN', response.data.token, { root: true })
          context.dispatch('fetchUserData')
          context.dispatch('conversations/fetchConversations', null, { root: true })
          
          this.$router.push({path: '/'})
        } else {
          this._vm.$q.notify('Invalid credentials. EEE')
        }
        context.commit('SET_ISFETCHING', false)
      }).catch(error => {
        this._vm.$q.notify('Invalid credentials.')
        context.commit('SET_ISFETCHING', false)
      });
    },
    register(context, registerData) {
      context.commit('SET_ISFETCHING', true)
      this._vm.$api.post('/register', registerData).then(response => {
        if (response.status === 200) {
          this._vm.$q.notify('User registered. Plesase log in.')
          this._vm.$router.push({path: '/login'})
        } else {
          this._vm.$q.notify('Cannot register')
        }
        context.commit('SET_ISFETCHING', false)
      }).catch(err => {
        console.log(err, response)
        this._vm.$q.notify('Cannot register')
        context.commit('SET_ISFETCHING', false)
      });
    },
    fetchUserData (context) {
      context.commit('SET_ISFETCHING', true)
      this._vm.$api.get('/user').then(response => {
        console.log('logged in response:', response)
        if (response.status === 200) {
          context.commit('SET_USER', response.data)
          context.commit('SET_ISLOGGEDIN', true)
        } else {
          context.dispatch('clearData')
        }
        context.commit('SET_ISFETCHING', false)
      }).catch(err => {
        context.dispatch('clearData')
        context.commit('SET_ISFETCHING', false)
      })
    },
    updateSettings (context, updatedUserData) {
      let userId = context.getters['id']
      context.commit('SET_ISFETCHING', true)
      this._vm.$api.put(`/users/${userId}`, updatedUserData).then(response => {
        if (response.status === 200) {
          this._vm.$q.notify('Updated settings')
          context.dispatch('fetchUserData')
        } else {
          this._vm.$q.notify('Cannot update settings')
        }
        context.commit('SET_ISFETCHING', false)
      }).catch(error => {
        this._vm.$q.notify('Cannot update settings')
        context.commit('SET_ISFETCHING', false)
      })
    },
    
    logout(context, config = {}) {
      this._vm.$api.post('/logout', {}, config).then(response => {
        context.dispatch('clearData')

        this._vm.$q.notify('Logged out!')
      }).catch(error => {
        this._vm.$q.notify('Cannot logout')
      });
    },
    forceLogout(context, config = {}) {
      console.log('FORCE LOGOUT')
      this._vm.$api.post('/logout', {}, config).then(response => {
      }).catch(error => {
      });
      context.dispatch('clearData')
    },

    clearData (context) {
      context.commit('server/SET_TOKEN', '', { root: true })
      context.commit('SET_USER', {})
      context.commit('SET_ISLOGGEDIN', false)
      context.dispatch('conversations/clearData', null, { root: true })
    }
  }
}
