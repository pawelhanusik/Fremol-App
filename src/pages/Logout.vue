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
    this.$store.dispatch('user/logout')
    this.$router.push('/')
  }
}
</script>
