<template>
  <q-page class="flex flex-center">
    
    <q-card class="full-height">  
      <q-card-section>
        <img
          alt="Fremol logo"
          src="~assets/logo.svg"
        >
      </q-card-section>
      
      <q-card-section>
        <native-form
          :items="[
            {
              name: 'email',
              type: 'text',
              label: 'email',
            },
            {
              name: 'password',
              type: 'password',
              label: 'password',
            }
          ]"
          :submit="submitLoginForm"
        />
        <q-item
          to="/register"
          clickable
          tag="a"
        > Don't have an account yet? Register </q-item>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'

export default {
  components: { NativeForm },
  name: 'Login',

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
      const formData = new FormData(evt.target)
      const loginData = {}
      
      if (formData.has('email')) {
        loginData.email = formData.get('email')
      }
      if (formData.has('password')) {
        loginData.password = formData.get('password')
      }

      this.$store.dispatch('user/login', loginData)
    }
  }
}
</script>
