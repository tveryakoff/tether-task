import { createSlice } from '@reduxjs/toolkit'
import { OrderBookResponseMessage } from './types'

export interface OrderBookState {
  isConnecting: boolean
  isConnected: boolean
  pairData: OrderBookResponseMessage | null
}

const initialState: OrderBookState = {
  isConnecting: false,
  isConnected: false,
  pairData: null,
}

export enum ORDER_BOOK_EVENT {
  OPEN = 'open',
  MESSAGE = 'message',
}

const orderBookSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    connect: (state) => {
      state.isConnecting = true
    },
    connectionEstablished: (state) => {
      state.isConnected = true
      state.isConnecting = false
    },
    receiveMessage: (state, action) => {
      state.pairData = action.payload
    },
  },
})

export const orderBookActions = orderBookSlice.actions

export default orderBookSlice
