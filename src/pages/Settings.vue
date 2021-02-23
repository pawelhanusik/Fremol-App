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
              },
              {
                name: 'name',
                type: 'text',
                label: 'name',
              },
              {
                name: 'newPassword',
                type: 'password',
                label: 'new password'
              },
              {
                name: 'newPassword',
                type: 'password',
                label: 'repeat new password'
              },
              {
                name: 'oldPassword',
                type: 'password',
                label: 'oldPassword'
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
      user: this.$q.sessionStorage.getItem('currentUser')
    }
  },
  
  beforeCreate() {
    console.log('email:', this);

    if (!this.$q.sessionStorage.has('currentUser')) {
      this.$api.get('/user', {
        headers: {Authorization: 'Bearer ' + this.$q.localStorage.getItem('token')}
      }).then(response => {
        if(response.status === 200) {
          
          this.$q.sessionStorage.set('currentUser', {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name
          })
          this.$router.go()
          
        } else {
          this.$q.notify('Cannot get your settings. Try to relogin or try later.');
        }
      }).catch(error => {
        this.$q.notify('Cannot get your settings. Try to relogin or try later.');
      });
    }
  },

  methods: {
    submitSettingsForm: function() {
      this.$q.sessionStorage.remove('currentUser')
    }
  }
}
</script>
