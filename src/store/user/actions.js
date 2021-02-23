export function fetchUserData (context) {
  this._vm.$api.get('/user', {
    headers: {Authorization: 'Bearer ' + this._vm.$q.localStorage.getItem('token')}
  }).then(response => {
    context.commit('SET_USER', response.data)
  })
}
