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
        <h3> Logging out... </h3>
      </div>
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'Logout',
  created() {
    this.$store.dispatch('user/logout').then(() => {
      this.$q.notify('Logged out!')
      this.$router.push('/')
    }).catch(() => {
      this.$q.notify('Cannot logout')
    })
  }
}
</script>
