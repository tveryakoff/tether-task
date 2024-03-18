export type OrderBookRequestParams = {
  SYMBOL?: string
  PRECISION?: string
  FREQUENCY?: string
  LENGTH?: string
  SUBID?: string
}

export type OrderBookResponseMessage = {
  CHANNEL_ID?: number
  PRICE?: number
  RATE?: number
  PERIOD?: number
  COUNT?: number
  AMOUNT?: number
}

export enum ORDER_BOOK_EVENT {
  OPEN = 'open',
  CLOSE = 'close',
  SUBSCRIBE = 'subscribe',
  MESSAGE = 'message',
  DISCONNECT = 'disconnect',
}

export type Precision = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'
export type BookEntryData = {
  price?: string | number
  cnt?: string | number
  amount?: string | number
}

export type OrderBookState = {
  isConnecting: boolean
  isConnected: boolean
  prec?: Precision
  symbol: string
  book: {
    bids: any
    asks: any
    psnap: any
    mcnt: any
  }
}

export type ReceiveMessagePayload = [number, number[]]
