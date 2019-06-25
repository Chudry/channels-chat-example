import React from 'react'
import { render } from 'react-dom'

const ChatLogin = (props) => {
  let textInput = React.createRef()

  const handleOnKeyUp = (e) => {
    if (e.keyCode === 13) {  // enter, return.
      handleEnterChat()
    }
  }

  const handleEnterChat = () => {
    const roomName = textInput.current.value
    window.location.pathname = '/chat/' + roomName + '/'
  }

  return (
    <div className="uk-flex">
      <input type="text" className="uk-input" ref={textInput} onKeyUp={handleOnKeyUp} />
      <input type="button" value="Enter" className="uk-button" onClick={handleEnterChat} />
    </div>
  )
}

const dest = document.querySelector('#chat-login')
if (dest) {
  render(<ChatLogin />, dest)
}
