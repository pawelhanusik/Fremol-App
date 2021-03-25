export default {
  namespaced: true,
  state: {
    // jobs
    pendingJobs: [],
    // -----------------------
    messages: {}
  },
  getters: {
    // jobs
    newJobID (state) {
      if (state.pendingJobs.length === 0) {
        return 0
      }
      let i = 0
      if (state.pendingJobs.length > 20) {
        i = state.pendingJobs[state.pendingJobs.length - 1] + 1
      }
      for (; state.pendingJobs.includes(i); ++i) {}
      return i
    },
    // -----------------------
    firstMessageID: state => (conversationID) => {
      if (state.messages[conversationID] && state.messages[conversationID].length > 0) {
        return state.messages[conversationID][0].id
      }
      return null
    },
    lastMessageID: state => (conversationID) => {
      if (state.messages[conversationID] && state.messages[conversationID].length > 0) {
        return state.messages[conversationID][state.messages[conversationID].length - 1].id
      }
      return null
    },
    // -----------------------
    getLatestMessages: state => (conversationID, count = 20) => {
      return Object.freeze(
        state.messages[conversationID].slice(
          state.messages[conversationID].length - count
        )
      )
    },
    getMessagesBefore: state => (conversationID, oldestMessageID, count = 20) => {
      function getMessagePosByID() {
        let l = 0
        let r = state.messages[conversationID].length
        while(r - l > 1) {
          let m = Math.floor((r + l) / 2)

          if (state.messages[conversationID][m].id > oldestMessageID) {
            r = m
          } else if (state.messages[conversationID][m].id < oldestMessageID){
            l = m
          } else {
            return m
          }
        }
        return null
      }
      const endPos = getMessagePosByID()
      if (endPos === null) {
        return null
      }
      let startPos = endPos - count
      if (startPos < 0) {
        startPos = 0
      }
      
      return Object.freeze(
        state.messages[conversationID].slice(startPos, endPos)
      )
    }
  },
  mutations: {
    // jobs
    ADD_JOB (state, jobID) {
      state.pendingJobs.push(jobID)
    },
    COMPLETE_JOB (state, jobID) {
      state.pendingJobs = state.pendingJobs.filter(e => e !== jobID)
    },
    // -----------------------
    ADD_MESSAGES (state, messages) {
      // fix attachemnts' URLs
      const baseURL = this._vm.$api.defaults.baseURL.substr(0, this._vm.$api.defaults.baseURL.length - 4)
      for (let msg of messages) {
        if (msg.attachment_url) {
          msg.attachment_url = baseURL + '/storage/' + msg.attachment_url.substr(7)
        }
        if (msg.attachment_thumbnail) {
          msg.attachment_thumbnail = baseURL + '/storage/' + msg.attachment_thumbnail.substr(7)
        }
      }

      // add messages
      if (messages.length > 0) {
        let convID = messages[0].conversation_id
        if (state.messages[convID]) {
          state.messages[convID] = state.messages[convID].concat(messages)
          state.messages[convID] = state.messages[convID].sort((a, b) => {
            if (a.id < b.id) {
              return -1;
            }
            if (a.id > b.id) {
              return 1;
            }
            return 0;
          })
        } else {
          state.messages[convID] = messages
        }
      }
    },
    // -----------------------
    CLEAR_DATA (state) {
      state.pendingJobs = []
      state.messages = {}
    }
  },
  actions: {
    fetchMessagesRaw (context, params) {
      if (typeof(params.conversationID) === 'undefined' || params.conversationID === null) {
        console.log('fetchMessagesRaw: conversationID is not specified!')
        return
      }
      const jobID = (typeof(params.jobID) !== 'undefined' && params.jobID !== null)
        ? params.jobID
        : null
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
          context.commit('COMPLETE_JOB', jobID)
        }
      })
    },

    /**
     * Get latest messages for given conversation
     * @param {*} context 
     * @param {*} params {
     *  conversationID: conversationID,
     *  count: 20
     * }
     */
    getLatestMessages (context, params) {
      if (!params.conversationID) {
        return
      }
      const conversationID = params.conversationID
      const count = (typeof(params.count) !== 'undefined' && params.count !== null)
        ? params.count
        : 20
      const jobID = (typeof(params.jobID) !== 'undefined' && params.jobID !== null)
        ? params.jobID
        : context.getters['newJobID']

      let lastID = context.getters['lastMessageID'](conversationID)
      if (lastID === null) {
        context.dispatch('fetchMessagesRaw', {
          jobID: jobID,
          conversationID: conversationID,
          toDate: (new Date).toISOString(),
          count: count
        })
      } else {
        context.dispatch('fetchMessagesRaw', {
          jobID: jobID,
          conversationID: conversationID,
          fromID: lastID + 1,
          count: count
        })
      }
      return jobID
    },
    getMessagesBefore (context, params) {
      if (!params.conversationID) {
        return
      }
      const conversationID = params.conversationID
      const count = (typeof(params.count) !== 'undefined' && params.count !== null)
        ? params.count
        : 20
      const jobID = (typeof(params.jobID) !== 'undefined' && params.jobID !== null)
        ? params.jobID
        : context.getters['newJobID']
      const firstID = (typeof(params.firstID) !== 'undefined' && params.firstID !== null)
        ? params.firstID
        : context.getters['firstMessageID'](conversationID)

      if (
        firstID - count - 1 >= context.getters['firstMessageID'](conversationID)
      ) {
        // use local cache
        context.commit('COMPLETE_JOB', jobID)
      } else if (firstID === null) {
        context.dispatch('fetchMessages', {
          jobID: jobID,
          conversationID: conversationID,
          count: count
        })
      } else {
        context.commit('SET_LAST_MSG_ADDITION_DIRECTION', -1)
        context.dispatch('fetchMessagesRaw', {
          jobID: jobID,
          conversationID: conversationID,
          toID: firstID - 1,
          count: 20
        })
      }

      return jobID
    },

    clearData(context) {
      context.commit('CLEAR_DATA')
    }
  }
}
