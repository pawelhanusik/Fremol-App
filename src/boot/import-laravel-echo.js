import Vue from 'vue'
import Echo from 'laravel-echo';

const pusher = require('pusher-js');
const echo = new Echo({
  broadcaster: 'pusher',
  key: 'websocketkey',
  cluster: 'main',
  wsHost: 'localhost',
  wsPort: 6001,
  disableStats: true,
  forceTLS: false,
  authEndpoint: 'http://localhost:8000/broadcasting/auth',
  auth: {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
  },
});

Vue.prototype.$pusher = pusher;
Vue.prototype.$echo = echo;

export { pusher, echo }
