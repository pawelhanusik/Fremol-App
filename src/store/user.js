import router from "src/router";

export default {
  namespaced: true,
  state: {
    user: {},
    isLoggedIn: false
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    user: state => state.user
  },
  mutations: {
    SET_ISLOGGEDIN (state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn
    },
    SET_USER (state, user) {
      state.user = user
    }
  },
  actions: {
    login(context, loginData) {
      this._vm.$api.post('/login', loginData).then(response => {
        if (response.status === 200) {
          this._vm.$q.notify('Logged in')
          localStorage.setItem('token', response.data.token)
          context.dispatch('fetchUserData')
          
          this.$router.push({path: '/'})
        } else {
          this._vm.$q.notify('Invalid credentials. EEE')
        }
      }).catch(error => {
        this._vm.$q.notify('Invalid credentials.')
      });
    },
    register(context, registerData) {
      this._vm.$api.post('/register', registerData).then(response => {
        if (response.status === 200) {
          this._vm.$q.notify('User registered. Plesase log in.')
          this._vm.$router.push({path: '/login'})
        } else {
          this._vm.$q.notify('Cannot register')
        }
      }).catch(err => {
        console.log(err, response)
        this._vm.$q.notify('Cannot register')
      });
    },
    fetchUserData (context) {
      this._vm.$api.get('/user', {
        headers: {Authorization: 'Bearer ' + localStorage.getItem('token') }
      }).then(response => {
        console.log('logged in response:', response)
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
    
    clearData (context) {
      context.commit('SET_USER', {})
      context.commit('SET_ISLOGGEDIN', false)
    }
  }
}
