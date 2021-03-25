<template>
  <div>
    <message
      v-for="(msg, msgID) in messages"

      :id="'message_' + msg.id"
      :key="msgID"

      :user="msg.user"
      :text="msg.text"
      :attachment_mime="msg.attachment_mime"
      :attachment_url="msg.attachment_url"
      :attachment_thumbnail="msg.attachment_thumbnail"
    />
  </div>
</template>

<script>
import Message from './Message'
export default {
  name: 'MessageGroup',
  components: {
    Message
  },
  props: {
    messages: {
      type: Array[{}],
      required: true
    }
  }
}
</script>
