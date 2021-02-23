<template>
  <q-page class="flex flex-center">
    <img
      alt="Fremol logo"
      src="~assets/logo.svg"
    >
  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'

export default {
  components: { NativeForm },
  name: 'PageIndex',
  
  beforeCreate() {
    if ( !this.$q.localStorage.has('token') ) {
      this.$router.push({path: '/login'})
    } else {  
      this.$api.post('/login/check', {}, {
        headers: {Authorization: 'Bearer ' + this.$q.localStorage.getItem('token')}
      }).then(response => {
        console.log('API CHECK', response);
        
        if(response.status !== 200 ) {
          this.$router.push({path: '/login'})
        }

      }).catch(error => {
        this.$router.push({path: '/login'})
      });
    }
  },
  methods: {
  },

}
</script>
