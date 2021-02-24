<template>
  <q-page>
    
    <div class="flex flex-center">
      <q-card>
        <q-card-section>
          <h3> Settings </h3>
        </q-card-section>
        <q-card-section>
          <native-form
            v-if="user != null && user.email != null && user.name != null"
            :items="[
              {
                name: 'email',
                type: 'text',
                label: 'email',
                required: true
              },
              {
                name: 'name',
                type: 'text',
                label: 'name',
                required: true
              },
              {
                name: 'password',
                type: 'password',
                label: 'new password'
              },
              {
                name: 'password2',
                type: 'password',
                label: 'repeat new password'
              },
              {
                name: 'oldPassword',
                type: 'password',
                label: 'current password',
                required: true
              }
            ]"
            v-bind:initialValues="[this.user.email, this.user.name]"
            submitLabel="Update"
            :submit="submitSettingsForm"
          />
        </q-card-section>
        <q-card-section>
          <q-btn color="red" to="/deleteAccount">
            Delete account
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
    
  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'
export default {
  components: { NativeForm },
  name: 'Settings',
  
  data() {
    return {
      user: this.$store.state.user.user
    }
  },

  methods: {
    submitSettingsForm: function(evt) {
      if (!this.$store.state.user.isLoggedIn) {
        this.$q.notify('Cannot update settings. Make sure you are logged in')
        return;
      }
      let userId = this.$store.state.user.user.id

      this.$q.dispatch('user/clearData')
      
      const formData = new FormData(evt.target)
      if(
        !formData.has('email')
        || !formData.has('name')
        || !formData.has('password')
        || !formData.has('password2')
        || !formData.has('oldPassword')
      ) {
        this.$q.notify('Please fill in all fields')
        return
      }

      const updatedUserData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password2: formData.get('password2'),
        oldPassword: formData.get('oldPassword')
      }

      if (updatedUserData.password !== updatedUserData.password2) {
        this.$q.notify('New passwords doesn\'t match!')
        return
      }

      this.$api.put(`/users/${userId}`, updatedUserData, {
        headers: {Authorization: 'Bearer ' + this.$q.localStorage.getItem('token')}
      }).then(response => {
        
        if (response.status === 200) {
          this.$q.notify('Updated settings')
          this.$store.dispatch('user/fetchUserData')
        } else {
          this.$q.notify('Cannot update settings')
        }
        this.$router.go()
        
      }).catch(error => {
        this.$q.notify('Cannot update settings')
        this.$router.go()
      })
    }
  }
}
</script>
