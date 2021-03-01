<template>
  <q-page>
    <div class="flex flex-center">
      <q-card>
        <q-card-section>
          <div class="text-h4"> New conversation </div>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <q-form @submit="submitCreateConversationForm" class="q-gutter-md">
              <q-input
                name="name"
                type="text"
                v-model="inputName"
                color="primary"
                label="name"
                required
                filled
              />
              <q-select
                filled
                name="participants"
                v-model="inputParticipants"
                multiple
                use-input
                input-debounce="0"
                @filter="filterFn"
                :options="inputParticipantsOptionsFiltered"
                label="participants"
                style="width: 250px"
                behavior="dialog"
                emit-value
                map-options
              />
              <q-btn label="Create" type="submit" color="primary"/>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </div>
    
  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'

export default {
  components: { NativeForm },
  name: 'NewConversation',
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
      this.inputParticipantsOptions = response.data.filter(user => user.id != this.$store.getters['user/id']).map(user => {
        return {
          label: user.name,
          value: user.id
        }
      })
      this.inputParticipantsOptionsFiltered = this.inputParticipantsOptions
    })
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
    submitCreateConversationForm() {
      const conversationData = {
        name: this.inputName,
        participants: this.inputParticipants
      }

      this.$store.dispatch('conversations/createConversation', conversationData).then(conversationID => {
        this.$q.notify('Conversation created')
        this.$router.push('/conversations/' + conversationID)
      }).catch(err => {
        this.$q.notify('Cannot create conversation: error occurred')
        this.$router.push('/')
      })
    }
  }
}
</script>
