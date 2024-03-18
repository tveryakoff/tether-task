import { RootState } from '../../app/store'
import { BookEntryData, OrderBookState } from './types'

export const selectOrderBookState = (state: RootState) => state.orderBook

export const selectOrderBook = (state: RootState) => state.orderBook?.book

const prepareEntryData = (rawData: any) => {
  return Object.keys(rawData)
    .map((id) => rawData[id])
    .filter((entry) => entry.cnt >= 1)
}
export const selectBids = (state: RootState): Array<BookEntryData> =>
  prepareEntryData(selectOrderBook(state).bids)
export const selectAsks = (state: RootState): Array<BookEntryData> =>
  prepareEntryData(selectOrderBook(state).asks)

export const selectOrderBookSubscribeParams = (state: RootState) => {
  const orderBookState = selectOrderBookState(state)

  return {
    symbol: orderBookState.symbol,
    prec: orderBookState.prec,
  }
}
