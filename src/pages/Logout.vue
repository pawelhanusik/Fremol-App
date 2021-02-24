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
        <h3> {{ message }} </h3>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
export default {
  name: 'Logout',
  data() {
    return {
      message: 'Logging out...'
    };
  },
  
  created() {
    this.$api.post('/logout', {}, {
      headers: {Authorization: 'Bearer ' + this.$q.localStorage.getItem('token')}
    }).then(response => {
      this.$q.localStorage.remove('token')
      this.$store.dispatch('user/clearData')
      this.$router.push('/')
      this.message = 'Logged out!'
    }).catch(error => {
      this.message = 'Cannot logout'
    });
  }
}
</script>
