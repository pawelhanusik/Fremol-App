export default {
  namespaced: true,
  state: {
    conversations: []
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
    }
  },
  mutations: {
    SET_CONVERSATIONS (state, conversations) {
      state.conversations = conversations
    }    
  },
  actions: {
    fetchConversations (context) {
      this._vm.$api.get('/user/conversations', {
        headers: {Authorization: 'Bearer ' + this._vm.$q.localStorage.getItem('token')}
      }).then(response => {
        context.commit('SET_CONVERSATIONS', response.data)
      })
    }    
  }
}
