import { configureStore } from '@reduxjs/toolkit'
import orderBookMiddleWare from '../../features/orderBook/middleware'
import orderBookSlice from '../../features/orderBook/slice'
export const store = configureStore({
  reducer: {
    orderBook: orderBookSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([orderBookMiddleWare])
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppStore = typeof store

export type AppDispatch = typeof store.dispatch
