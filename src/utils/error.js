import Vue from 'vue'
import eventBus from './eventbus'

export default function handleError(err) {
  if (err.response) {
    let errData = err.response.data
    let errCode = errData.code
    switch (errCode) {
      case 1002:
        accessTokenExpire()
    }
    if (errData.message) {
      Vue.prototype.$message.error(errData.message)
    }
  } else {
    console.error('Error', err.message)
  }
}

function accessTokenExpire() {
  eventBus.$emit('accessTokenExpire')
}
