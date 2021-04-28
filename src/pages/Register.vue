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
        <q-form @submit="submitRegisterForm" class="q-gutter-md">
          <q-input class="col-grow q-ma-md" type="email" label="email" name="email" v-model="email" required />
          <q-input class="col-grow q-ma-md" type="text" label="name" name="name" v-model="name" required />
          <q-input class="col-grow q-ma-md" type="password" label="password" name="password" v-model="password" required />
          <q-input class="col-grow q-ma-md" type="password" label="retype password" name="password2" v-model="password2" required />
          <q-btn label="Register" type="submit" color="primary"/>
        </q-form>
        <q-item
          to="/login"
          clickable
          tag="a"
        > Already have an account? Login </q-item>
      </div>
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      email: '',
      name: '',
      password: '',
      password2: ''
    }
  },
  methods: {
    submitRegisterForm(evt) {
      const formData = new FormData(evt.target)
      
      if(
        this.email == ''
        || this.name == ''
        || this.password == ''
        || this.password2 == ''
      ) {
        this.$q.notify('Please fill in all fields')
        return
      }

      const registerData = {
        email: this.email,
        name: this.name,
        password: this.password,
        password2: this.password2
      }

      if (registerData.password !== registerData.password2) {
        this.$q.notify('Passwords doesn\'t match!')
        this.password = ''
        this.password2 = ''
        return
      }

      this.$store.dispatch('user/register', registerData)
      
    }
  }
}
</script>
