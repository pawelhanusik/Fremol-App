<template>
  <div>
    <q-layout container style="height: calc(100vh - 150px);" class="shadow-2 rounded-borders row row-grow">
      <q-page-container>
        <q-page padding>
          <div id="messages_div" class="q-pa-md col items-start q-gutter-md">
            <q-card v-for="(msg, msgID) in messages" :id="'message_' + msg.id" :key="msgID" v-bind="msg" class="q-pa-md">
              <q-card-section horizontal>
                  {{ msg.user }}
              </q-card-section>
              <q-card-section horizontal>
                {{ msg.text }}
              </q-card-section>
            </q-card>
          </div>

          <q-page-scroller reverse position="bottom-right" :scroll-offset="10" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_down" color="secondary" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
    <div class="row q-mt-md">
      <q-input v-model="newMessageText" class="q-pb-md q-pl-md q-pr-md col-grow" outlined type="text">
        <template v-slot:append>
          <q-btn @click="sendMessage" icon="keyboard_arrow_right" color="secondary" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import { scroll } from 'quasar'
const { getScrollTarget } = scroll
const { getScrollPosition, setScrollPosition } = scroll
const { getScrollHeight } = scroll

function scrollToElement (el) {
  let target = getScrollTarget(el)
  let offset = el.offsetTop
  let duration = 1000
  setScrollPosition(target, offset, duration)
  return true
}
function scrollToMessage (id) {
  let el = document.getElementById(`message_${id}`)
  if (el === null) {
    return false
  }
  return scrollToElement(el)
}

let previousConversationID = -1
let scrollToAtNextUpdate = -1
let autoScroll = true
let unsubscibe = null

export default {
  name: 'PageChat',
  data() {
    return {
      newMessageText: ''
    }
  },
  beforeCreate() {
    this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
    previousConversationID = this.$route.params.conversationID
  },
  beforeUpdate() {
    // fetch only if conversation was changed
    if (previousConversationID != this.$route.params.conversationID) {
      this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
    }
    previousConversationID = this.$route.params.conversationID
  },
  created() {
    unsubscibe = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'conversations/ADD_MESSAGES') {
        console.log("PAYLOAD", mutation.payload)

        // scroll only if already at the bottom
        if (autoScroll) {
          for (let i = 0; i < mutation.payload.length; ++i) {
            if (mutation.payload[i].conversation_id == this.$route.params.conversationID) {
              scrollToAtNextUpdate = mutation.payload[i].id
              break
            }
          }
        }
      }
    })
  },
  destroyed() {
    if (unsubscibe !== null) {
      unsubscibe()
    }
  },
  updated() {
    if (
      scrollToAtNextUpdate > 0
      
    ) {
      scrollToMessage(scrollToAtNextUpdate)
      scrollToAtNextUpdate = -1
    }
  },
  computed: {
    messages() {
      return this.$store.getters['conversations/conversationMessages'](this.$route.params.conversationID)
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessageText.length == 0) {
        return
      }
      const messageData = {
        conversationID: this.$route.params.conversationID,
        text: this.newMessageText
      }
      this.$store.dispatch('conversations/sendMessage', messageData)
      this.newMessageText = ''
    }
  }
}
</script>
