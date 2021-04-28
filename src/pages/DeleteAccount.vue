<template>
  <q-page class="flex flex-center col">
    <div>
      <div class="row">
        <div class="text-center text-h3 q-mt-lg"> Are you sure you want do delete your account? </div>
      </div>

      <div class="row q-mt-sm">
        <p>Type in "yes" into text box to confirm</p>
      </div>
      <div class="row">
        <q-input
          name="confirmation"
          label="confirm"
          v-model="confirmation"
        />
      </div>
      <div class="row q-mt-sm">
        <div class="col">
          <q-btn color="red" @click="removeAccount"> Yes, delete my account </q-btn>
          <q-btn class="q-ml-sm" @click="cancel"> No, go back </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      confirmation: ''
    }
  },
  methods: {
    removeAccount() {
      if (this.confirmation !== 'yes') {
        this.$q.notify('Type in "yes" into text box to confirm')
        return
      }
      let userId = this.$store.state.user.user.id
      this.$api.delete(`/users/${userId}`).then(response => {
        if(response.status === 200) {
          this.$q.notify('Account deleted!')
          this.$q.localStorage.remove('token')
          this.$store.dispatch('user/clearData')
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
