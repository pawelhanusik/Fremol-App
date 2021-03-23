<template>
  <div>
    <div class="row q-mt-md">
      <div class="row-grow" >
      <q-btn
        @click="onOpenMediaUploaderClick"
        class="q-mt-sm q-ml-sm"
        icon="image"
        round
        flat
        size="md"
      />
      <q-btn
        @click="onOpenAttachmentUploaderClick"
        class="q-mt-sm q-ml-sm"
        icon="file_present"
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
    
    <q-dialog v-model="showMediaSelectionDialog">
      <media-uploader
        label="Select media to upload"
        accept="image/*, audio/*, video/*"
        style="max-width: 300px"
        max-file-size="20971520"
      />
    </q-dialog>
    <q-dialog v-model="showAttachmentSelectionDialog">
      <media-uploader
        label="Select file to upload"
        accept="*"
        style="max-width: 300px"
        max-file-size="20971520"
      />
    </q-dialog>
  </div>
</template>

<script>
import MediaUploader from 'src/components/MediaUploader.vue'

export default {
  name: 'MessageInput',
  components: {
    MediaUploader
  },
  data() {
    return {
      newMessageText: '',
      showMediaSelectionDialog: false,
      showAttachmentSelectionDialog: false,
    }
  },
  props: {
    
  },
  methods: {
    onKeyDown(evt) {
      if (evt.key == "Enter") {
        this.sendMessage()
      }
    },
    onOpenMediaUploaderClick() {
      this.showMediaSelectionDialog = true
    },
    onOpenAttachmentUploaderClick() {
      this.showAttachmentSelectionDialog = true
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
    }
  }
}
</script>
