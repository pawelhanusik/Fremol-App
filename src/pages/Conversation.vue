<template>
  <div>
    <q-layout container style="height: calc(100vh - 150px);" class="shadow-2 rounded-borders row row-grow">
      <q-page-container>
        <q-page id="scrollMessagesContainer" padding>
          <div class="q-pa-md col items-start q-gutter-md">
            <q-btn @click="loadPrevMessages">
              Load more messages
            </q-btn>
          </div>
          <div id="messages_div" class="q-pa-md col items-start q-gutter-md">
            <q-card v-for="(msg, msgID) in messages" :id="'message_' + msg.id" :key="msgID" v-bind="msg" class="q-pa-md">
              <q-card-section horizontal>
                  {{ msg.user }}
              </q-card-section>
              <q-card-section v-if="msg.image_url" horizontal>
                {{ msg.text }}
              </q-card-section>
              <q-card-section v-if="msg.image_url" horizontal>
                <q-img
                  @click="onImageClick(msg.image_url)"
                  :src="`${msg.image_url}`"
                  class="rounded-borders"
                  style="height: 280px; max-width: 300px"
                />
              </q-card-section>
            </q-card>
          </div>

          <q-page-scroller reverse position="bottom-right" :scroll-offset="getPageScrollerScrollOffset" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_down" color="secondary" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
    <div class="row q-mt-md">
      <div class="row-grow" >
        <q-btn
          @click="onOpenImageUploaderClick"
          class="q-mt-sm q-ml-sm"
          icon="image"
          round
          flat
          size="md"
        />
      </div>
      <q-input @keydown="onKeyDown" v-model="newMessageText" class="q-pb-md q-pl-md q-pr-md col-grow" outlined type="text">
        <template v-slot:append>
          <q-btn @click="sendMessage" icon="keyboard_arrow_right" color="secondary" />
        </template>
      </q-input>
    </div>

    <q-dialog v-model="showImageSelectionDialog">
      <image-uploader
        label="Select an image"
        accept="image/*"
        style="max-width: 300px"
      />
    </q-dialog>
    <q-dialog v-model="showFullScreenImage">
      <q-img 
        :src="fullScreenImageURL"
      />
    </q-dialog>
  </div>
</template>

<script>
import ImageUploader from 'src/components/ImageUploader.vue'
import { scroll } from 'quasar'
const { getScrollTarget } = scroll
const { getScrollPosition, setScrollPosition } = scroll

function scrollToElement (el, duration = 1000) {
  let target = getScrollTarget(el)
  let offset = el.offsetTop
  setScrollPosition(target, offset, duration)
  return true
}
function scrollToMessage (id, duration = 1000) {
  let el = document.getElementById(`message_${id}`)
  if (el === null) {
    return false
  }
  return scrollToElement(el, duration)
}

let previousConversationID = -1
let scrollToAtNextUpdate = -1
let scrollToAtNextUpdateDuration = 1000
let autoScroll = true
let unsubscibe = null

export default {
  name: 'PageChat',
  components: {
    ImageUploader
  },

  data() {
    return {
      newMessageText: '',
      showImageSelectionDialog: false,
      
      showFullScreenImage: false,
      fullScreenImageURL: ''
    }
  },
  beforeCreate() {
    this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
    previousConversationID = this.$route.params.conversationID
  },
  beforeUpdate() {
    if (previousConversationID != this.$route.params.conversationID) {
      // fetch messages only if conversation was changed
      this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
      // join conversation's websocket channel
      this.$echo.leave()
      this.$echo.join(`conversations.${this.$route.params.conversationID}`)
        .here((users) => {
          console.log("WEBSOCKETS!!! HERE", users)
        })
        .joining((user) => {
          console.log("WEBSOCKETS!!! JOINING", user)
        })
        .leaving((user) => {
          console.log("WEBSOCKETS!!! LEAVING", user)
        })
        .listen('MessageSent', (e) => {
          console.log("WEBSOCKETS !!!", e);
          if (e.message.conversation_id == this.$route.params.conversationID) {
            this.$store.commit('conversations/ADD_MESSAGES', [e.message])
            // TODO: make sure that none messages was missed
          }
        })
    }
    previousConversationID = this.$route.params.conversationID
  },
  created() {
    console.log('joining')
    
    unsubscibe = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'conversations/ADD_MESSAGES') {
        
        if (autoScroll) {
          if (state.conversations.lastMessagesAdditionDirection == -1) {
            for (let i = mutation.payload.length - 1; i >= 0; --i) {
              if (mutation.payload[i].conversation_id == this.$route.params.conversationID) {
                scrollToAtNextUpdateDuration = 0
                scrollToAtNextUpdate = mutation.payload[i].id
                break
              }
            }
          } else {
            for (let i = 0; i < mutation.payload.length; ++i) {
              if (mutation.payload[i].conversation_id == this.$route.params.conversationID) {
                scrollToAtNextUpdateDuration = 1000
                scrollToAtNextUpdate = mutation.payload[i].id
                break
              }
            }
          }
        }
      }
    })
  },
  destroyed() {
    this.$echo.leave()

    if (unsubscibe !== null) {
      unsubscibe()
    }
  },
  updated() {
    if (
      scrollToAtNextUpdate > 0
      
    ) {
      scrollToMessage(scrollToAtNextUpdate, scrollToAtNextUpdateDuration)
      scrollToAtNextUpdate = -1
    }
  },
  computed: {
    messages() {
      return this.$store.getters['conversations/conversationMessages'](this.$route.params.conversationID)
    },
    getPageScrollerScrollOffset() {
      const scrollMessagesContainer = document.getElementById('scrollMessagesContainer')
      if (scrollMessagesContainer) {
        return -scrollMessagesContainer.clientHeight + 50
      }
      return 0
    }
  },
  methods: {
    onKeyDown(evt) {
      if (evt.key == "Enter") {
        this.sendMessage()
      }
    },
    sendMessage() {
      if (this.newMessageText.length == 0) {
        return
      }
      this.$store.dispatch('conversations/sendMessage', {
        conversationID: this.$route.params.conversationID,
        data: {
          text: this.newMessageText
        }
      })
      this.newMessageText = ''
    },
    loadPrevMessages() {
      this.$store.dispatch('conversations/fetchPrevMessages', this.$route.params.conversationID)
    },
    onOpenImageUploaderClick() {
      this.showImageSelectionDialog = true
    },
    onImageClick(url) {
      this.fullScreenImageURL = url
      this.showFullScreenImage = true
      
    }
  }
}
</script>
