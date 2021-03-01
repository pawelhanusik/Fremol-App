export default {
  namespaced: true,
  state: {
    conversations: [],
    messages: [],
    lastMessagesAdditionDirection: 0,
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
    },
    firstMessageID: state => (conversationID) => {
      for (let i = 0; i < state.messages.length; ++i) {
        if (state.messages[i].conversation_id == conversationID) {
          return state.messages[i].id
        }
      }
      return null
    },
    lastMessageID: state => (conversationID) => {
      for (let i = state.messages.length - 1; i >= 0; --i) {
        if (state.messages[i].conversation_id == conversationID) {
          return state.messages[i].id
        }
      }
      return null
    },
    countMessages: state => (conversationID) => {
      return state.messages.reduce((counter, cur) => counter + (cur.conversation_id == conversationID), 0)
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

      // sort
      // TODO: sort using insertion sort (since data is nearly sorted) (DOES THEY?)
      state.messages = state.messages.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    },
    SET_LAST_MSG_ADDITION_DIRECTION (state, direction) {
      state.lastMessagesAdditionDirection = direction
    },
    SET_LAST_MESSAGE_CREATION_TIMESTAMP (state, msg) {
      if (
        !state.lastMessageCreationTimestamps[msg.conversation_id]
        || new Date(msg.created_at) > new Date(state.lastMessageCreationTimestamps[msg.conversation_id])
      ) {
        state.lastMessageCreationTimestamps[msg.conversation_id] = msg.created_at
      }
    },
    CLEAR_LAST_MESSAGE_CREATION_TIMESTAMPS (state) {
      state.lastMessageCreationTimestamps = {}
    }
  },
  actions: {
    fetchConversations (context) {
      this._vm.$api.get('/user/conversations').then(response => {
        context.commit('SET_CONVERSATIONS', response.data)
      })
    },
    async createConversation (context, conversationData) {
      return new Promise((resolve, reject) => {
        this._vm.$api.post('/user/conversations', conversationData).then(response => {
          context.dispatch('fetchConversations')
            .then(() => {
              resolve(response.data.conversation.id)
            })          
        }).catch(err => {
          reject()
        })
      })
    },
    fetchPrevMessages (context, conversationID) {
      let firstID = context.getters['firstMessageID'](conversationID)
      if (firstID === null) {
        context.dispatch('fetchMessages', conversationID)
      } else {
        context.commit('SET_LAST_MSG_ADDITION_DIRECTION', -1)
        context.dispatch('fetchMessagesRaw', {
          conversationID: conversationID,
          toID: firstID - 1,
          count: 20
        })
      }
    },
    fetchMessages (context, conversationID) {
      context.commit('SET_LAST_MSG_ADDITION_DIRECTION', 1)
      let lastID = context.getters['lastMessageID'](conversationID)
      if (lastID === null) {
        context.dispatch('fetchMessagesRaw', {
          conversationID: conversationID,
          toDate: (new Date).toISOString(),
          count: 20
        })
      } else {
        context.dispatch('fetchMessagesRaw', {
          conversationID: conversationID,
          fromID: lastID + 1,
          count: 20
        })
      }
    },
    fetchMessagesRaw (context, params) {
      if (typeof(params.conversationID) === 'undefined' || params.conversationID === null) {
        console.log('fetchMessagesRaw: conversationID is not specified!')
        return
      }
      let url = `/conversations/${params.conversationID}/messages`;
      let sep = '?'
      if ( typeof(params.fromID) !== 'undefined' &&  params.fromID !== null) {
        url += `${sep}fromID=${params.fromID}`
        sep = '&'
      }
      if ( typeof(params.toID) !== 'undefined' &&  params.toID !== null) {
        url += `${sep}toID=${params.toID}`
        sep = '&'
      }
      if ( typeof(params.fromDate) !== 'undefined' &&  params.fromDate !== null) {
        url += `${sep}fromDate=${params.fromDate}`
        sep = '&'
      }
      if ( typeof(params.toDate) !== 'undefined' &&  params.toDate !== null) {
        url += `${sep}toDate=${params.toDate}`
        sep = '&'
      }
      if ( typeof(params.count) !== 'undefined' &&  params.count !== null) {
        url += `${sep}count=${params.count}`
        sep = '&'
      }
      this._vm.$api.get(url).then(response => {
        if (response.data.count > 0) {
          context.commit('ADD_MESSAGES', response.data.messages)
          for (let msg of response.data.messages) {
            context.commit('SET_LAST_MESSAGE_CREATION_TIMESTAMP', msg)
          }
        }
      })
    },
    sendMessage (context, messageData) {
      let url = `/conversations/${messageData.conversationID}/messages`;
      this._vm.$api.post(url, messageData).then(response => {
        if (response.status === 200) {
          context.dispatch('fetchMessages', messageData.conversationID)
        } else {
          this._vm.$q.notify('Cannot send the message')  
        }
      }).catch(err => {
        this._vm.$q.notify('Cannot send the message')
      })
    },
    clearData (context) {
      context.commit('SET_CONVERSATIONS', [])
      context.commit('SET_MESSAGES', [])
      context.commit('CLEAR_LAST_MESSAGE_CREATION_TIMESTAMPS')
    }
  }
}
