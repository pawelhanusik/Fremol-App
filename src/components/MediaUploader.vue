<script>
import { QUploaderBase } from 'quasar'
import axios from 'axios'
const CancelToken = axios.CancelToken

export default {
  name: 'ImageUploader',

  mixins: [ QUploaderBase ],

  data() {
    return {
      uploading: false,
      source: null
    }
  },

  computed: {
    // [REQUIRED]
    // we're working on uploading files
    isUploading () {
      return this.uploading
    },

    // [optional]
    // shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    isBusy () {
      return this.uploading
    }
  },

  methods: {
    // [REQUIRED]
    // abort and clean up any process
    // that is in progress
    abort () {
      if (this.source) {
        this.source.cancel('Upload aborted by user')
      }
    },

    // [REQUIRED]
    async upload () {
      try {
        if (this.canUpload === false) {
          return;
        }

        this.uploading = true;

        const source = CancelToken.source();

        const formData = new FormData();
        formData.append('media', this.files[0]);
        await this.$store.dispatch('conversations/sendMessage', {
          conversationID: this.$route.params.conversationID,
          config: {
            cancelToken: source.token
          },
          data: formData
        })

        this.files = [];
      } finally {
        this.uploading = false;
        this.source = null;
      }
    }
  }
}
</script>
