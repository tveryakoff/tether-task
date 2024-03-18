import { Provider } from 'react-redux'
import { store } from './app/store'
import { OrderBook } from './features/orderBook/OrderBook'

export const App = () => (
  <Provider store={store}>
    <OrderBook />
  </Provider>
)
