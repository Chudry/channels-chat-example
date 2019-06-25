// @see https://redux-saga.js.org/docs/api/
import { eventChannel, END } from 'redux-saga'
import { put, call, take, takeLatest, select } from 'redux-saga/effects'
import { MessageModule } from 'modules/message-module'

/**
 * Container-based sagas middleware.
 */
export function * ChatSagas () {
  const wsApi  = yield select(state => state.app.websocketApi)
  const room   = window.location.pathname.split('/').filter((v) => v !== '').pop()
  const socket = new WebSocket(wsApi + '/chat/' + room + '/')
  // Watch outgoing Redux Action to WebSocket another worker process.
  const watchActions = ['message/initRoom', 'message/sendMessage', 'message/sendClear']
  yield takeLatest(watchActions, sendWebSocket, socket)
  // Watch incoming message from WebSocket.
  const channel = yield call(initWebsocket, socket, room)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

function * sendWebSocket (socket, action) {
  socket.send(JSON.stringify({
    type:    action.type,
    payload: action.payload,
  }))
}

function initWebsocket (socket, room) {
  return eventChannel(emitter => {
    socket.onopen = () => {
      console.log('Opening WebSocket.')
      return emitter(MessageModule.actions.initRoom(room))
    }

    socket.onerror = (error) => {
      console.error(error)
    }

    socket.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data) || null
        if (message) {
          const { action, payload } = message
          return emitter({ type: action, payload: payload })
        }
      } catch (error) {
        console.error(`Error parsing : ${e.data}`)
      }
    }

    return () => {
      ws.onmessage = null
      console.log('Socket close.')
      return emitter(END)
    }
  })
}
