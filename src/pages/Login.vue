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
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'
import { LocalStorage } from 'quasar'

export default {
  components: { NativeForm },
  name: 'Login',

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
      
      this.$api.post('/api/login', loginData).then(response => {
        console.log('login', response.data)
        if (response.status === 200) {
          console.log('Logged in.')
          LocalStorage.set('token', response.data.token)
          this.$router.push({path: '/'})
        }
      });
    }
  }
}
</script>
