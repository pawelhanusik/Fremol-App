<template>
  <q-page class="flex flex-center">
    
    <q-card class="full-height">  
      <q-card-section>
        <h3> {{  }} </h3>
      </q-card-section>
      <q-card-section>
        <button @click="test">TEST</button>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
export default {
  name: 'Logout',
  data() {
    return {
      message: 'Test'
    };
  },
  methods: {
    test() {
      this.$api.get('/conversations/1/messages?last=123', {
        headers: {Authorization: 'Bearer ' + this.$q.localStorage.getItem('token')}
      }).then(response => {
        console.log(response)
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      });
    }
  },
  created() {
    
  }
}
</script>
