import { Middleware } from 'redux'
import { io, Socket } from 'socket.io-client'
import { ORDER_BOOK_EVENT, orderBookActions } from './slice'
import { OrderBookResponseMessage } from './types'

const orderBookMiddleWare: Middleware = (store) => {
  let socket: Socket

  return (next) => (action) => {
    if (orderBookActions.connect.match(action)) {
      socket = io('wss://api-pub.bitfinex.com/ws/2', {})

      socket.on(ORDER_BOOK_EVENT.OPEN, () => {
        store.dispatch(orderBookActions.connectionEstablished())
      })

      socket.on(
        ORDER_BOOK_EVENT.MESSAGE,
        (message: OrderBookResponseMessage) => {
          console.log('new message', message)
          store.dispatch(orderBookActions.receiveMessage({ message }))
        },
      )

      // socket.on(ChatEvent.SendAllMessages, (messages: ChatMessage[]) => {
      //   store.dispatch(orderBookActions.receiveAllMessages({ messages }))
      // })
      //
      // socket.on(ChatEvent.ReceiveMessage, (message: ChatMessage) => {
      //   store.dispatch(orderBookActions.receiveMessage({ message }))
      // })
    }

    // if (
    //   orderBookActions.submitMessage.match(action) &&
    //   isConnectionEstablished
    // ) {
    //   socket.emit(ChatEvent.SendMessage, action.payload.content)
    // }

    next(action)
  }
}

export default orderBookMiddleWare
