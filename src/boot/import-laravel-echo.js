import Vue from 'vue'
import Echo from 'laravel-echo';
import { LocalStorage } from 'quasar'

const pusher = require('pusher-js');

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'websocketkey',
  cluster: 'main',
  wsHost: '',
  wsPort: 0,
  disableStats: true,
  forceTLS: false,
  authEndpoint: '',
  auth: {
    headers: {
        Authorization: 'Bearer ' + LocalStorage.getItem('token')
    },
  },
});

Vue.prototype.$pusher = pusher;
Vue.prototype.$echo = echo;

export { pusher, echo }
