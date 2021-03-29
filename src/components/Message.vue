<template>
  <div>
    <q-chat-message
      :sent="sent"
      :name="user"
      :avatar="user_avatar_url ? user_avatar_url : undefined"
      :stamp="stamp"
      :text="text !== null ? [text] : []"
      
      label-sanitize
      name-sanitize
      text-sanitize
      stamp-sanitize
    >
      <slot name="default">
        <!-- ATTACHMENT -->
        <div v-if="attachment_mime">
          <q-btn v-if="attachment_mime && attachment_mime != 'other'" @click="onDownloadAttachmentBtnClick(attachment_url)" flat round size="sm" icon="download" />
          <!-- image -->
          <div v-if="isMimeAnImage(attachment_mime)" horizontal>
            <q-img
              @click="onImageClick(attachment_url)"
              :src="attachment_url"
              class="rounded-borders"
              style="height: 280px; width: 300px"
            />
          </div>
          <!-- video -->
          <div v-else-if="isMimePlayableVideo(attachment_mime)" horizontal>
            <q-media-player
              type="video"
              :sources="[{
                src: attachment_url,
                type: 'video/mp4'
              }]"
              style="height: 280px; max-width: 500px"
              :poster="attachment_thumbnail"
            />
          </div>
          <!-- audio -->
          <div v-else-if="isMimeAnAudio(attachment_mime)" horizontal>
            <q-media-player
              type="audio"
              :sources="[{
                src: attachment_url,
                type: 'audio/mp3'
              }]"
            ></q-media-player>
          </div>
          <!-- other -->
          <div v-else class="row">
            <q-card class="row">
              <div>
                There's a file attached.
              </div>
              <div>
                <a :href="attachment_url" target="_blank">Download</a>
              </div>
            </q-card>
          </div>
        </div>
      </slot>
      <template v-if="false && user_avatar_url" slot="avatar">
        <q-avatar class="q-ma-md">
          <q-img
            :src="user_avatar_url"
            ratio="1"
          />
        </q-avatar>
      </template>
    </q-chat-message>
    
    <q-dialog v-model="showFullScreenImage">
      <q-img 
        :src="fullScreenImageURL"
        contain
      />
    </q-dialog>
  </div>
</template>

<script>
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default {
  name: 'Message',
  data() {
    return {
      showFullScreenImage: false,
      fullScreenImageURL: ''
    }
  },
  props: {
    user_id: {
      type: Number,
      default: -1
    },
    user: {
      type: String,
      required: true
    },
    user_avatar_url: {
      type: String,
      default: null
    },
    sent: {
      type: Boolean,
      default: false
    },

    text: {
      type: String,
      default: null
    },
    attachment_mime: {
      type: String,
      default: null
    },
    attachment_url: {
      type: String,
      default: null
    },
    attachment_thumbnail: {
      type: String,
      default: null
    },

    created_at: {
      type: String,
      required: true
    }
  },
  computed: {
    stamp() {
      const cur_date = new Date()
      const msg_date = new Date(this.created_at)
      let ret = ""
      if (
        msg_date.getMonth() != cur_date.getMonth()
        || msg_date.getDate() != cur_date.getDate()
      ) {
        ret += msg_date.getDate() + ' ' + months[msg_date.getMonth()] + ' '
      }
      if (msg_date.getFullYear() != cur_date.getFullYear()) {
        ret += msg_date.getFullYear() + ' '
      }
      
      if (msg_date.getHours() < 10) {
        ret += '0'
      }
      ret += msg_date.getHours()
      ret += ':'
      if (msg_date.getMinutes() < 10) {
        ret += '0'
      }
      ret += msg_date.getMinutes()
      return ret
    }
  },
  methods: {
    onImageClick(url) {
      this.fullScreenImageURL = url
      this.showFullScreenImage = true
    },
    onDownloadAttachmentBtnClick(attachmentUrl) {
      window.open(attachmentUrl, '_blank')
    },

    // mime types
    isMimeAnImage(mime) {
      return (mime && mime.indexOf('image') == 0)
    },
    isMimePlayableVideo(mime) {
      return (mime && mime.indexOf('video') == 0)
    },
    isMimeAnAudio(mime) {
      return (mime && mime.indexOf('audio') == 0)
    }
  }
}
</script>
