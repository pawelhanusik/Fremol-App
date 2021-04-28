<template>
  <q-page class="q-ma-lg">
    <div class="q-mt-lg flex flex-center">
      <div>
        <div>
          <div class="text-h4"> Edit conversation </div>
        </div>
        <div>
          <div class="q-pa-md">
            <q-form @submit="submitEditConversationForm" @reset="resetEditConversationForm" class="q-gutter-md">
              <q-input
                name="name"
                type="text"
                v-model="inputName"
                color="primary"
                label="name"
                required
              />
              <q-select
                name="participants"
                v-model="inputParticipants"
                multiple
                use-input
                input-debounce="0"
                @filter="filterFn"
                :options="inputParticipantsOptionsFiltered"
                label="participants"
                behavior="dialog"
                emit-value
                map-options
              />
              <q-btn label="Edit" type="submit" color="primary"/>
              <q-btn label="Clear" @click="clearParticipants" color="secondary"/>
              <q-btn label="Reset" type="reset" color="secondary"/>
              <q-btn label="Cancel" @click="cancelFormEdit" color="red"/>
            </q-form>
          </div>
        </div>
      </div>
    </div>
    
  </q-page>
</template>

<script>
export default {
  name: 'EditConversation',
  data() {
    return {
      inputName: '',
      inputParticipants: [],
      inputParticipantsOptions: [],
      inputParticipantsOptionsFiltered: [],
    }
  },
  beforeCreate() {
    this.$api.get('/users').then(response => {
      this.inputParticipantsOptions = response.data.data.filter(user => user.id != this.$store.getters['user/id']).map(user => {
        return {
          label: user.name,
          value: user.id
        }
      })
      this.inputParticipantsOptionsFiltered = this.inputParticipantsOptions
    })
  },
  created() {
    this.resetEditConversationForm()
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.inputParticipantsOptionsFiltered = this.inputParticipantsOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.inputParticipantsOptionsFiltered = this.inputParticipantsOptions.filter(user => user.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    submitEditConversationForm() {
      const conversationData = {
        id: this.$route.params.conversationID,
        name: this.inputName,
        participants: this.inputParticipants
      }

      this.$store.dispatch('conversations/editConversation', conversationData).then(() => {
        this.$q.notify('Conversation created')
        this.$router.push('/conversations/' + this.$route.params.conversationID)
      }).catch(err => {
        this.$q.notify('Cannot create conversation: error occurred')
        this.$router.push('/')
      })
    },
    resetEditConversationForm() {
      const conversation = this.$store.getters['conversations/conversationByID'](this.$route.params.conversationID)
      this.inputName = conversation.name
      this.inputParticipants = conversation.users.filter(user => user.id != this.$store.getters['user/id']).map( user => user.id )
    },
    clearParticipants() {
      this.inputParticipants = []
    },
    cancelFormEdit() {
      this.$router.push(`/conversations/${this.$route.params.conversationID}`)
    }
  }
}
</script>
