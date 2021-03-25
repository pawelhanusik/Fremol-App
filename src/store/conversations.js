export default {
  namespaced: true,
  state: {
    conversations: []
  },
  getters: {
    conversationAsLinks (state) {
      let ret = [];
      for (let conv of state.conversations) {
        ret.push({
          id: conv.id,
          title: conv.name,
          icon: 'chat'
        });
      }
      return ret
    },
    conversationByID: state => (conversationID) => {
      for (let conv of state.conversations) {
        if (conv.id == conversationID) {
          return conv
        }
      }
      return null
    },
  },
  mutations: {
    SET_CONVERSATIONS (state, conversations) {
      state.conversations = conversations
    }
  },
  actions: {
    fetchConversations (context) {
      this._vm.$api.get('/user/conversations').then(response => {
        context.commit('SET_CONVERSATIONS', response.data.data)
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
    async editConversation (context, conversationData) {
      return new Promise((resolve, reject) => {
        this._vm.$api.put(`/user/conversations/${conversationData.id}`, conversationData).then(response => {
          context.dispatch('fetchConversations')
            .then(() => {
              resolve(response.data.conversation.id)
            })          
        }).catch(err => {
          reject()
        })
      })
    },
    async deleteConversation (context, conversationID) {
      return new Promise((resolve, reject) => {
        this._vm.$api.delete(`/user/conversations/${conversationID}`).then(response => {
          context.dispatch('fetchConversations')
            .then(() => {
              resolve()
            })
        }).catch(err => {
          reject()
        })
      })
    },
    async leaveConversation (context, conversationID) {
      return new Promise((resolve, reject) => {
        this._vm.$api.delete(`/user/conversations/${conversationID}/leave`).then(response => {
          context.dispatch('fetchConversations')
            .then(() => {
              resolve()
            })
        }).catch(err => {
          reject()
        })
      })
    },
    async sendMessage (context, payload) {
      return new Promise((resolve, reject) => {
        let url = `/conversations/${payload.conversationID}/messages`;
        let config = payload.config || {}
        this._vm.$api.post(url, payload.data, config).then(response => {
          if (response.status === 200) {
            //
          } else {
            this._vm.$q.notify('Cannot send the message')
          }

          resolve()
        }).catch(err => {
          this._vm.$q.notify('Cannot send the message')
          
          reject()
        })
      })
    },
    clearData (context) {
      context.commit('SET_CONVERSATIONS', [])
      context.commit('SET_MESSAGES', [])
      context.commit('CLEAR_LAST_MESSAGE_CREATION_TIMESTAMPS')
    }
  }
}
