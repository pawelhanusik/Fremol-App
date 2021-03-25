<template>
  <div>
    <q-card class="q-ma-md q-pa-md">
      <q-card-section horizontal>
          {{ user }}
          
          <q-btn v-if="attachment_mime && attachment_mime != 'other'" @click="onDownloadAttachmentBtnClick(attachment_url)" class="q-ml-md" flat round size="sm" icon="download" />
      </q-card-section>
      <q-card-section horizontal>
        {{ text }}
      </q-card-section>
      <!-- ATTACHMENT -->
      <div v-if="attachment_mime">
        <!-- image -->
        <q-card-section v-if="isMimeAnImage(attachment_mime)" horizontal>
          <q-img
            @click="onImageClick(attachment_url)"
            :src="attachment_url"
            class="rounded-borders"
            style="height: 280px; max-width: 300px"
          />
        </q-card-section>
        <!-- video -->
        <q-card-section v-else-if="isMimePlayableVideo(attachment_mime)" horizontal>
          <q-media-player
            type="video"
            :sources="[{
              src: attachment_url,
              type: 'video/mp4'
            }]"
            style="height: 280px; max-width: 500px"
            :poster="attachment_thumbnail"
          />
        </q-card-section>
        <!-- audio -->
        <q-card-section v-else-if="isMimeAnAudio(attachment_mime)" horizontal>
          <q-media-player
            type="audio"
            :sources="[{
              src: attachment_url,
              type: 'audio/mp3'
            }]"
          ></q-media-player>
        </q-card-section>
        <!-- other -->
        <q-card-section v-else class="row">
          <q-card class="row">
            <q-card-section>
              There's a file attached.
            </q-card-section>
            <q-card-section>
              <a :href="attachment_url" target="_blank">Download</a>
            </q-card-section>
          </q-card>
        </q-card-section>
      </div>
    </q-card>
    
    <q-dialog v-model="showFullScreenImage">
      <q-img 
        :src="fullScreenImageURL"
      />
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
      showFullScreenImage: false,
      fullScreenImageURL: ''
    }
  },
  props: {
    user: {
      type: String,
      required: true
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
