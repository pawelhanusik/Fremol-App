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
              name: 'name',
              type: 'text',
              label: 'name'
            },
            {
              name: 'password',
              type: 'password',
              label: 'password',
            },
            {
              name: 'password2',
              type: 'password',
              label: 'repeat password',
            }
          ]"
          :submit="submitRegisterForm"
        />
      </q-card-section>
      
      <q-item
        to="/login"
        clickable
        tag="a"
      > Already have an account? Login </q-item>
    </q-card>

  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'
import { LocalStorage } from 'quasar';

export default {
  components: { NativeForm },
  name: 'Register',

  beforeCreate() {
    if ( LocalStorage.has('token') ) {
      this.$api.post('/login/check', {}, {
        headers: {Authorization: 'Bearer ' + LocalStorage.getItem('token')}
      }).then(response => {
        if(response.status === 200 ) {
          this.$router.push({path: '/'})
        }
      }).catch(error => {
      });
    }
  },

  methods: {
    submitRegisterForm(evt) {
      const formData = new FormData(evt.target)
      
      if(
        !formData.has('email')
        || !formData.has('name')
        || !formData.has('password')
        || !formData.has('password2')
      ) {
        this.$q.notify('Please fill in all fields')
        return
      }

      const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password2: formData.get('password2')
      }

      if (registerData.password !== registerData.password2) {
        this.$q.notify('Passwords doesn\'t match!')
        return
      }

      this.$api.post('/register', registerData).then(response => {
        console.log('register', response.data)
        if (response.status === 200) {
          console.log('Registered.')
          this.$q.notify('User registered. Plesase log in.')
          this.$router.push({path: '/login'})
        }
      });
      
    }
  }
}
</script>
