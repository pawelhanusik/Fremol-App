<template>
  <div>
    <message
      v-for="(msg, msgID) in messages"

      :id="'message_' + msg.id"
      :key="msgID"


      :user_id="parseInt(msg.user_id)"
      :user="msg.user"
      :sent="current_user_id == msg.user_id"

      :text="msg.text"

      :attachment_mime="msg.attachment_mime"
      :attachment_url="msg.attachment_url"
      :attachment_thumbnail="msg.attachment_thumbnail"

      :created_at="msg.created_at"
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
    },
    current_user_id: {
      type: Number,
      default: -1
    }
  }
}
</script>
