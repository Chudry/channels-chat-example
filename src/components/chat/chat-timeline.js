import React from 'react'
import { useSelector } from 'react-redux'

export const ChatTimeline = (props) => {
  const userId   = useSelector(state => state.app.loggedUserId)
  const users    = useSelector(state => state.user.users)
  const messages = useSelector(state => state.message.messages)

  return (
    <ul className="uk-list uk-list-divider chat-timeline">
      {messages.map(message => {
        let username = '-'
        let isMine   = false
        const user   = users.find(user => user.pk === message.fields.user)
        if (user) {
          username = user.fields.username
          isMine   = (user.pk === userId)
        }
        return (
          <li key={message.pk} className={`timeline ${isMine ? 'timeline--is-mine' : ''}`}>
            <div className="username">{ username }</div>
            <div className="message">{ message.fields.text }</div>
          </li>
        )
      })}
    </ul>
  )
}
