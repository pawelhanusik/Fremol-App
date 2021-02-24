<template>
  <q-page>
    <div class="q-m-lg">

      
      <div>
        <div v-for="(msg, msgID) in messages" :key="msgID" v-bind="msg">
          <p>{{ msg.text }}</p>
        </div>
      </div>
      
      

      <div class="full-width row wrap justify-start items-start content-start">
        <input class="col-grow" type='text'>
        <button>SEND</button>
      </div>
    </div>
    
  </q-page>
</template>

<script>
export default {
  name: 'PageChat',
  beforeCreate() {
    this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
  },
  beforeUpdate() {
    this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
  },
  /*created() {
    this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
  },*/
  computed: {
    messages() {
      //return this.$store.state.conversations.messages[this.$route.params.conversationID]
      return this.$store.getters['conversations/conversationMessages'](this.$route.params.conversationID)
    }
  }
}
</script>
