import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { orderBookActions } from './slice'
import { selectAsks, selectBids } from './selectors'
import { Button, Select, Table } from 'antd'
import styles from './OrderBook.module.scss'
import { Precision } from './types'

const columns = [
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Count',
    dataIndex: 'cnt',
    key: 'cnt',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
]

const precList: Precision[] = ['P0', 'P1', 'P2', 'P3', 'P4']

const selectOptions = precList.map((prec) => ({
  value: prec,
  label: prec,
}))

export const OrderBook = () => {
  const dispatch = useDispatch()
  const connect = useCallback(() => {
    dispatch(orderBookActions.connect())
  }, [dispatch])

  const disconnect = useCallback(() => {
    dispatch(orderBookActions.disconnect())
  }, [dispatch])

  const setPrec = useCallback(
    (value: Precision) => {
      console.log('value', value)
      dispatch(orderBookActions.subscribe(value))
    },
    [dispatch],
  )

  const bids = useSelector(selectBids)
  const asks = useSelector(selectAsks)

  return (
    <section>
      <h1>Order book</h1>
      <Button type="primary" onClick={connect}>
        Connect
      </Button>
      <Button danger onClick={disconnect}>
        Disconnect
      </Button>
      <p>Select precision: </p>
      <Select
        className={styles.select}
        options={selectOptions}
        onSelect={setPrec}
      />
      <div className={styles.tableWrapper}>
        <Table
          key="bids"
          title={() => 'Bids'}
          columns={columns}
          dataSource={bids}
          pagination={false}
        />
        <Table
          key="asks"
          title={() => 'Asks'}
          columns={columns}
          dataSource={asks}
          pagination={false}
        />
      </div>
    </section>
  )
}
