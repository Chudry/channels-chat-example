import { createSlice } from 'redux-starter-kit'

export const MessageModule = createSlice({
  slice: 'message',
  initialState: {
    // Refs as state.message.* by selector.
    messages:  [],
    room: '',
  },
  reducers: {

    /**
     * Init room on open WebSocket.
     * Refs as MessageModule.actions.initRoom when dispatch.
     *
     * @param state  - state.message
     * @param action - type: 'message/initRoom', payload: int
     */
    initRoom: (state, action) => {
      state.room = action.payload
    },

    /**
     * Fetch messages.
     * Refs as MessageModule.actions.fetchMessages() when dispatch.
     *
     * @param state  - state.message
     * @param action - type: 'message/fetchMessages', payload: array
     */
    fetchMessages: (state, action) => {
      state.messages = []
      state.messages.push(...action.payload)
    },

    /**
     * Receive message.
     * Refs as MessageModule.actions.receiveMessage() when dispatch.
     *
     * @param state  - state.message
     * @param action - type: 'message/receiveMessage', payload: object
     */
    receiveMessage: (state, action) => {
      const received = action.payload.pop()
      if (!state.messages.some((message) => message.pk === received.pk)) {
        state.messages.push(received)
      }
    },

    /**
     * Send new messages.
     * Refs as MessageModule.actions.sendMessage() when dispatch.
     *
     * @param state  - state.message
     * @param action - type: 'message/sendMessage', payload: object
     */
    sendMessage: (state, action) => {
      state.messages.push(action.payload)
    },

    /**
     * Send clear all messages.
     * Refs as MessageModule.actions.sendClear() when dispatch.
     *
     * @param state  - state.message
     * @param action - type: 'message/sendClear' payload: string room
     */
    sendClear: (state, action) => {},
  }
})
