import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

// Import global Store, Saga.
import { Store, Saga } from 'bases/store'

// My middlewares.
import { ChatSagas } from 'middlewares/chat-sagas'

// My components.
import { ChatInput } from 'components/chat/chat-input'
import { ChatTimeline }  from 'components/chat/chat-timeline'

const dest = document.querySelector('#chat-container')
if (dest) {
  // Run workers required on this container, using global worker.
  Saga.run(ChatSagas)
  // Render child components, using global state.
  render(
    <Provider store={Store}>
      <ChatInput />
      <ChatTimeline />
    </Provider>,
    dest
  )
}
