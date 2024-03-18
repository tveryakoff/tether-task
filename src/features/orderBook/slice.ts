import { createSlice } from '@reduxjs/toolkit'
import { OrderBookState, ReceiveMessagePayload } from './types'
import _ from 'lodash'

const initialState: OrderBookState = {
  isConnecting: false,
  isConnected: false,
  symbol: 'tBTCUSD',
  prec: 'P0',
  book: {
    bids: {},
    asks: {},
    psnap: {},
    mcnt: 0,
  },
}

type Side = 'bids' | 'asks' | 'psnap' | 'mcnt'

const orderBookSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    connect: (state) => {
      state.isConnecting = true
    },
    disconnect: (state) => {
      state.isConnected = initialState.isConnected
      state.isConnecting = initialState.isConnecting
    },
    connectionEstablished: (state) => {
      state.isConnected = true
      state.isConnecting = false
    },
    subscribe: (state, action) => {
      state.prec = action.payload
    },
    receiveMessage: (
      state,
      action: { type: string; payload: ReceiveMessagePayload },
    ) => {
      const msg = action.payload

      const book = state.book
      if (book.mcnt === 0) {
        _.each(msg[1], function (pp) {
          //@ts-ignore
          const tmp = { id: pp[0], price: pp[1], amount: pp[2] }
          const side = tmp.amount >= 0 ? 'bids' : 'asks'
          tmp.amount = Math.abs(tmp.amount)
          book[side][tmp.id] = tmp
        })
      } else {
        const data = msg[1]
        const pp = { price: data[0], cnt: data[1], amount: data[2] }

        // if count is zero, then delete price point
        if (!pp.cnt) {
          let found = true

          if (pp.amount > 0) {
            if (book['bids'][pp.price]) {
              delete book['bids'][pp.price]
            } else {
              found = false
            }
          } else if (pp.amount < 0) {
            if (book['asks'][pp.price]) {
              delete book['asks'][pp.price]
            } else {
              found = false
            }
          }

          if (!found) {
            console.error('Book delete failed. Price point not found')
          }
        } else {
          // else update price point
          const side = pp.amount >= 0 ? 'bids' : 'asks'
          pp.amount = Math.abs(pp.amount)
          book[side][pp.price] = pp
        }

        // save price snapshots. Checksum relies on psnaps!
        _.each(['bids', 'asks'], function (side: any) {
          const sbook = book[side as Side]
          const bprices = Object.keys(sbook)
          const prices = bprices.sort(function (a, b) {
            if (side === 'bids') {
              return +a >= +b ? -1 : 1
            } else {
              return +a <= +b ? -1 : 1
            }
          })
          book.psnap[side] = prices
        })
      }
      book.mcnt++
    },
  },
})

export const orderBookActions = orderBookSlice.actions

export default orderBookSlice
