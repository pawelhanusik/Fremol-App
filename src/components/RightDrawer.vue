<template>
  <div>
    <div v-if="contentType == 'conversation'" class="q-pa-md" >
      <div>
        <div class="">
          <div class="text-h6 text-center"> {{ conversation.name }}</div>
        </div>
        
        <div class="q-mt-sm row justify-center">
          <div v-if="isCurrentUserTheCreator">
            <q-btn :to="`/editConversation/${ conversation.id }`" title="Edit" size="sm" icon="edit" />
            <q-btn @click="onDeleteClick" title="Delete" size="sm" icon="delete" />
          </div>
          <div v-else>
            <q-btn @click="onLeaveClick" title="Leave" size="sm" icon="logout" />
          </div>
        </div>

      </div>
      
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
    },
    isCurrentUserTheCreator() {
      return this.conversation.creator_id == this.$store.getters['user/id']
    }
  },
  methods: {
    onDeleteClick() {
      this.$q.dialog({
        title: 'Delete',
        message: 'Are you sure you want to delete the conversation?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$store.dispatch('conversations/deleteConversation', this.$route.params.conversationID).then(() => {
          this.$q.notify('Conversation deleted')
          this.$router.push('/')
        }).catch(err => {
          this.$q.notify('Cannot create conversation: error occurred')
          this.$router.push('/conversations/' + this.$route.params.conversationID)
        })
      })
    },
    onLeaveClick() {
      this.$q.dialog({
        title: 'Leave',
        message: 'Are you sure you want to leave the conversation?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$store.dispatch('conversations/leaveConversation', this.$route.params.conversationID).then(() => {
          this.$q.notify('Left conversation')
          this.$router.push('/')
        }).catch(err => {
          this.$q.notify('Cannot leave the conversation: error occurred')
          this.$router.push('/conversations/' + this.$route.params.conversationID)
        })
      })
    }
  }
}
</script>
