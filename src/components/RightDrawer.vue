<template>
  <div>
    <div v-if="contentType == 'conversation'" class="q-pa-md" >
      <div class="text-h6 text-center"> {{ conversation.name }} </div>
      <hr />
      <div class="text-h6 q-pl-md q-pt-md"> Participants: </div>
      <div>
        <q-card v-for="user in conversation.users" :key="user.id" class="q-ma-md">
          <q-card-section>
            {{ user.name }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    contentType() {
      if (this.$route.name == 'conversations') {
        return 'conversation'
      }
      return 'none'
    },
    conversation() {
      return this.$store.getters['conversations/conversationByID'](this.$route.params.conversationID)
    }
  }
}
</script>
