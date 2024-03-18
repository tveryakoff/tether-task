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
