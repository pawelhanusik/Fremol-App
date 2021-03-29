import Vue from 'vue'
import Echo from 'laravel-echo';

const pusher = require('pusher-js');

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'websocketkey',
  cluster: 'main',
  wsHost: '',
  wsPort: 0,
  disableStats: true,
  authEndpoint: '',
  auth: {
    headers: {},
  },
});

Vue.prototype.$pusher = pusher;
Vue.prototype.$echo = echo;

export { pusher, echo }
