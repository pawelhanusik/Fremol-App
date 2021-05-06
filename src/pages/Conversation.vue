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
          <div id="message_containers_div" ref="message_containers_div" class="q-pa-md col items-start q-gutter-md">
            <!-- CONTEINER FOR MESSAGES -->
          </div>

          <q-page-scroller reverse position="bottom-right" :scroll-offset="pageScrollerScrollOffset" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_down" color="secondary" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>

    <message-input />
  </div>
</template>

<script>
import Vue from 'vue'
import { scroll } from 'quasar'
const { getScrollTarget, getScrollHeight } = scroll
const { getScrollPosition, setScrollPosition } = scroll
import MessageInput from 'components/MessageInput'
import MessageGroup from 'components/MessageGroup'

const MessageGroupClass = Vue.extend(MessageGroup)

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
let unsubscibe = null

export default {
  name: 'PageChat',
  components: {
    MessageInput,
    MessageGroup
  },
  data() {
    return {
      pendingJobs: [],
      oldestMessageID: null,
      pageScrollerScrollOffset: 0
    }
  },
  created() {
    unsubscibe = this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'messages/COMPLETE_JOB') {
        const jobID = mutation.payload
        // check if event is for me
        if (!this.pendingJobs.includes(parseInt(jobID))) {
          return
        }
        // remove job from local pending jobs
        this.pendingJobs = this.pendingJobs.filter(e => e !== jobID)
        
        // ===================================================
        const scrollDown = (this.isScrolledAllWayDown())
        const messageGroupsContainer = this.$refs['message_containers_div']
        
        let messages = []
        let insertBeforeElement = null
        if (this.oldestMessageID === null) {
          messages = this.$store.getters['messages/getLatestMessages'](this.$route.params.conversationID)
        } else {
          messages = this.$store.getters['messages/getMessagesBefore'](this.$route.params.conversationID, this.oldestMessageID)
          insertBeforeElement = messageGroupsContainer.firstChild
        }
        this.oldestMessageID = this.$store.getters['messages/firstMessageID'](this.$route.params.conversationID)

        const newMessageGroup = new MessageGroupClass({
          propsData: {
            current_user_id: this.$store.getters['user/id'],
            messages: messages
          }
        })
        newMessageGroup.$mount()
        messageGroupsContainer.insertBefore(
          newMessageGroup.$el,
          insertBeforeElement
        )
        this.recalculatePageScrollerScrollOffset()
        // ===================================================
        
        if (insertBeforeElement === null) {
          if (scrollDown) {
            scrollToElement(newMessageGroup.$el)
          }
        } else {
          scrollToElement(insertBeforeElement, 0)
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
  watch: {
    '$route.params': {
        handler() {
            if (previousConversationID != this.$route.params.conversationID) {
              this.init()
            }
            previousConversationID = this.$route.params.conversationID
        },
        immediate: true,
    }
  },
  methods: {
    init() {
      // clear
      this.oldestMessageID = null
      this.pendingJobs = []
      const messageGroupsContainer = this.$refs['message_containers_div'] || null
      if (messageGroupsContainer !== null) {
        while (messageGroupsContainer.firstChild) {
          messageGroupsContainer.removeChild(messageGroupsContainer.lastChild);
        }
      }

      // fetch messages only if conversation was changed
      this.$store.dispatch('messages/getLatestMessages', {
        conversationID: this.$route.params.conversationID
      }).then((jobID) => {
        this.pendingJobs.push(jobID)
      })
      
      // join conversation's websocket channel
      this.$echo.leave()
      this.$echo.join(`conversations.${this.$route.params.conversationID}`)
        .listen('MessageSent', (e) => {
          if (e.message.conversation_id == this.$route.params.conversationID) {
            // this.$store.commit('conversations/ADD_MESSAGES', [e.message])
            // TODO: make sure that none messages was missed
            const scrollDown = (this.isScrolledAllWayDown())
            
            const baseURL = this.$api.defaults.baseURL.substr(0, this.$api.defaults.baseURL.length - 4)
            if (e.message.attachment_url) {
              e.message.attachment_url = baseURL + '/storage/' + e.message.attachment_url.substr(7)
            }
            if (e.message.attachment_thumbnail) {
              e.message.attachment_thumbnail = baseURL + '/storage/' + e.message.attachment_thumbnail.substr(7)
            }
            const messageGroupsContainer = this.$refs['message_containers_div']
            const newMessageGroup = new MessageGroupClass({
              propsData: {
                current_user_id: this.$store.getters['user/id'],
                messages: [e.message]
              }
            })
            newMessageGroup.$mount()
            messageGroupsContainer.insertBefore(
              newMessageGroup.$el,
              null
            )
            this.recalculatePageScrollerScrollOffset()

            if (scrollDown) {
              scrollToElement(newMessageGroup.$el)
            }
          }
        })
    },
    loadPrevMessages() {
      this.$store.dispatch('messages/getMessagesBefore', {
        conversationID: this.$route.params.conversationID,
        firstID: this.oldestMessageID
      }).then((jobID) => {
        this.pendingJobs.push(jobID)
      })
    },

    recalculatePageScrollerScrollOffset() {
      const el = this.$refs['message_containers_div']
      if (el) {
        const target = getScrollTarget(el)
        this.pageScrollerScrollOffset = -(getScrollHeight(target) - 2 * target.offsetHeight)
      }
    },
    isScrolledAllWayDown() {
      const el = this.$refs['message_containers_div']
      if (el) {
        const target = getScrollTarget(el)
        return ((getScrollHeight(target) - getScrollPosition(target) - target.offsetHeight) < 10)
      }
      return false
    }
  }
}
</script>
