import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MessageModule } from 'modules/message-module'

export const ChatInput = (props) => {
  //
  // @see https://reactjs.org/docs/hooks-state.html
  //
  const [value, setValue] = useState('')
  const dispatch          = useDispatch()
  const room              = useSelector(state => state.message.room)
  const userId            = useSelector(state => state.app.loggedUserId)

  const handleOnKeyUp = (e) => {
    if (e.keyCode === 13) {  // enter, return.
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (value && room) {
      const uuidv1 = require('uuid/v1')
      const message = {
        pk: uuidv1(),
        model: 'chat.message',
        fields: {
          text: value,
          room: room,
          user: userId,
        }
      }
      dispatch(MessageModule.actions.sendMessage(message))
      setValue('')
    }
  }

  const handleClear = () => {
    if (confirm('Clear all message history in this room, really do?')) {
      dispatch(MessageModule.actions.sendClear(room))
    }
  }

  return (
    <div className="uk-flex">
      <input
        type="text" className="uk-input"
        onKeyUp={handleOnKeyUp}
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <button className="uk-button" onClick={handleSubmit}>SEND</button>
      <button className="uk-button uk-button-danger" onClick={handleClear}>CLEAR</button>
    </div>
  )
}
