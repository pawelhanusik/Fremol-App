<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>

let unsubscibe = null

export default {
  name: 'App',
  beforeMount() {
    // set axios & laravel echo connection
    this.$store.dispatch('server/setAxiosBaseURL')
    this.$store.dispatch('server/setEchoHostOptions')
    this.$store.dispatch('server/setAccessToken')
    // check connection to server
    this.$store.dispatch('server/checkApiConnection')
    // fetch user data & conversations
    this.$store.dispatch('user/fetchUserData')
    this.$store.dispatch('conversations/fetchConversations')
  },
  created() {
    unsubscibe = this.$store.subscribe((mutation, state) => {
      // update axios & laravel echo connection
      if (
        mutation.type == 'server/SET_HOST'
        || mutation.type == 'server/SET_APIPORT'
        || mutation.type == 'server/SET_WSPORT'
      ) {
        this.$store.dispatch('server/setAxiosBaseURL')
        this.$store.dispatch('server/setEchoHostOptions')
      }

      // update axios token
      else if (mutation.type == 'server/SET_TOKEN') {
        this.$store.dispatch('server/setAccessToken')
      }
      
      // redirect on server connected/disconnected
      else if (
        mutation.type == 'server/SET_ISCONNECTED'
      ) {
        if (mutation.payload === true) {
          this.$router.push('/')
        } else {
          this.$router.push('/settings')
          this.$q.notify('Cannot connect. Check server settings')
        }
      }
    })
  },
  destroyed() {
    if (unsubscibe !== null) {
      unsubscibe()
    }
  },
}
</script>
