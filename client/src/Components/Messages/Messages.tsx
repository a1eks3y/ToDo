import * as React from 'react'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import Message from './Message/Message'
import style from './Messages.module.css'

const Messages: React.FC = () => {
    const messages = useTypedSelector(state => state.message)
    if ( messages === null || !messages.length )
        return <></>
    return (
        <div className={ style.messageNotifications }>
            {
                messages.map(el =>
                    <Message
                        key={ el.id }
                        isBad={ el.isBad }
                        message={ el.message }
                        messageId={ el.id }
                        willBeDeleted={ el.willBeDeleted }
                    />
                )
            }
        </div>
    )
}

export default Messages