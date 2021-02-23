export function fetchConversations (context) {
  this._vm.$api.get('/user/conversations', {
    headers: {Authorization: 'Bearer ' + this._vm.$q.localStorage.getItem('token')}
  }).then(response => {
    context.commit('SET_CONVERSATIONS', response.data)
  })
}
