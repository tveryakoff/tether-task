import { Middleware } from 'redux'
import { orderBookActions } from './slice'
import {
  selectOrderBookState,
  selectOrderBookSubscribeParams,
} from './selectors'
import { ORDER_BOOK_EVENT } from './types'
import { MiddlewareAPI } from '@reduxjs/toolkit'

const connectWebSocket = (store: MiddlewareAPI,  action: unknown) => {
  const socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2')

  // Restore connection
  socket.addEventListener(ORDER_BOOK_EVENT.CLOSE, () => {
    setTimeout(() => connectWebSocket(store, action), 1000)
  })

  socket.addEventListener(ORDER_BOOK_EVENT.OPEN, (event) => {
    store.dispatch(orderBookActions.connectionEstablished())
    const params = selectOrderBookSubscribeParams(store.getState())

    socket.send(
      JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        ...params,
      }),
    )
  })

  socket.addEventListener(ORDER_BOOK_EVENT.MESSAGE, (event: any) => {
    // handle book. create book or update/delete price points
    const msg = JSON.parse(event?.data)

    if (msg.event) {
      return
    }

    store.dispatch(orderBookActions.receiveMessage(msg))
  })

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  socket.onclose = () => {
    console.log('WebSocket disconnected')
    setTimeout(() => connectWebSocket(store, action), 500)
  }

  return socket
}

const orderBookMiddleWare: Middleware = (store) => {
  let socket: WebSocket

  return (next) => (action) => {
    const state = selectOrderBookState(store.getState())

    // Connect
    if (orderBookActions.connect.match(action)) {
      if (state.isConnected || state.isConnecting) {
        return next(action)
      }
      socket = connectWebSocket(store, action)
    } else if (orderBookActions.disconnect.match(action)) {
      socket.close()
    }
    // Change params (subscribe)
    else if (orderBookActions.subscribe.match(action)) {
      const params = selectOrderBookSubscribeParams(store.getState())

      socket.send(
        JSON.stringify({
          event: 'subscribe',
          channel: 'book',
          ...params,
        }),
      )
    }

    next(action)
  }
}

export default orderBookMiddleWare
