import Vue from 'vue'
import axios from 'axios'
import https from 'https'

var agent = new https.Agent({ 
    ca: ''
})

Vue.prototype.$axios = axios

const api = axios.create({ agent: agent })
Vue.prototype.$api = api

export { axios, api }
