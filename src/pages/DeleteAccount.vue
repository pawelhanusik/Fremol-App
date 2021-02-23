<template>
  <q-page class="flex flex-center">
    
    <q-card class="full-height">  
      <q-card-section>
        <h3> Are you sure you want do delete your account? </h3>
      </q-card-section>
      
      <q-card-section>
        <table>
          <tr>
            <td>
              <q-btn color="red" @click="removeAccount"> Yes, delete my account </q-btn>
            </td>
            <td>
              <q-btn @click="cancel"> No, go back </q-btn>
            </td>
          </tr>
        </table>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'

export default {
  components: { NativeForm },
  name: 'Login',

  methods: {
    removeAccount() {
      let userId = this.$q.sessionStorage.getItem('currentUser').id
      this.$api.delete(`/users/${userId}`, {
        headers: {Authorization: 'Bearer ' + this.$q.localStorage.getItem('token')}
      }).then(response => {
        if(response.status === 200) {
          this.$q.notify('Account deleted!')
          this.$router.push('/')
        } else {
          this.$q.notify('An error occured: Cannot delete the user. Are you logged in?')
        }
      }).catch(error => {
        this.$q.notify('An error occured: Cannot delete the user. Are you logged in?')
      });
    },
    cancel() {
      this.$router.push('/')
    }
  }
}
</script>
