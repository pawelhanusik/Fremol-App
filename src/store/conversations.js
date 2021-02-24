export default {
  namespaced: true,
  state: {
    conversations: [],
    messages: [],
    lastMessageCreationTimestamps: {}
  },
  getters: {
    conversationAsLinks (state) {
      let ret = [];
      for(let conv of state.conversations) {
        ret.push({
          id: conv.id,
          title: conv.name,
          icon: 'chat'
        });
      }
      return ret
    },
    conversationMessages: state => (conversationID) => {
      return state.messages.filter(msg => msg.conversation_id == conversationID)
    },
    lastMessageCreationTimestamp: state => (conversationID) => {
      return state.lastMessageCreationTimestamps[conversationID] || null
    }
  },
  mutations: {
    SET_CONVERSATIONS (state, conversations) {
      state.conversations = conversations
    },
    SET_MESSAGES (state, messages) {
      state.messages = messages
    },
    ADD_MESSAGES (state, messages) {
      state.messages = state.messages.concat(messages)
    },
    SET_LAST_MESSAGE_CREATION_TIMESTAMP (state, msg) {
      if (
        !state.lastMessageCreationTimestamps[msg.conversation_id]
        || new Date(msg.created_at) > new Date(state.lastMessageCreationTimestamps[msg.conversation_id])
      ) {
        state.lastMessageCreationTimestamps[msg.conversation_id] = msg.created_at
      }
    }
  },
  actions: {
    fetchConversations (context) {
      this._vm.$api.get('/user/conversations', {
        headers: {Authorization: 'Bearer ' + this._vm.$q.localStorage.getItem('token')}
      }).then(response => {
        context.commit('SET_CONVERSATIONS', response.data)
      })
    },
    fetchMessages (context, conversationID) {
      let url = `/conversations/${conversationID}/messages`;
      let lastMessageCreationTimestamp = context.getters['lastMessageCreationTimestamp'](conversationID)
      if ( lastMessageCreationTimestamp !== null) {
        url += `?last=${lastMessageCreationTimestamp}`
      }
      this._vm.$api.get(url, {
        headers: {Authorization: 'Bearer ' + this._vm.$q.localStorage.getItem('token')}
      }).then(response => {
        if (response.data.count > 0) {
          context.commit('ADD_MESSAGES', response.data.messages)
          for (let msg of response.data.messages) {
            context.commit('SET_LAST_MESSAGE_CREATION_TIMESTAMP', msg)
          }
        }
      })
    },
    clearData (context) {
      context.commit('SET_CONVERSATIONS', [])
      context.commit('SET_MESSAGES', [])
    }
  }
}
