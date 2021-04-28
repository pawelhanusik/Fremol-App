<template>
  <q-page class="flex flex-center">
    <div class="full-height">  
      <div>
        <img
          alt="Fremol logo"
          src="~assets/logo.svg"
        >
      </div>
      <div>
        <q-form @submit="submitLoginForm" class="q-gutter-md">
          <q-input class="col-grow q-ma-md" type="email" label="email" name="email" v-model="email"/>
          <q-input class="col-grow q-ma-md" type="password" label="password" name="password" v-model="password" />
          <q-btn label="Login" type="submit" color="primary"/>
        </q-form>
        <q-item
          to="/register"
          clickable
          tag="a"
          class="q-mt-md"
        > Don't have an account yet? Register </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  beforeCreate() {
    if (this.$store.getters['user/isLoggedIn']) {
      this.$router.push({path: '/'})
    }
  },
  created() {
    // change path to '/' when logged in
    const unsubscribe = this.$store.subscribe((mutation, state) => {
      if (
        mutation.type == 'user/SET_ISLOGGEDIN'
        && state.user.isLoggedIn
      ) {
        this.$router.push('/')
        unsubscribe()
      }
    })
  },
  methods: {
    submitLoginForm(evt) {
      this.$store.dispatch('user/login', {
        email: this.email,
        password: this.password
      }).then(() => {
        this.$q.notify('Logged in')
        this.$router.push({path: '/'})
      }).catch(() => {
        this.$q.notify('Invalid credentials.')
      })
    }
  }
}
</script>
