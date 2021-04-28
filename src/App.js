import { observer } from 'mobx-react-lite'

import { formatCurrency, formatPrice, NumberInput, Table } from './utils'
import { useStore } from './App.store'

const App = () => {
  return (
    <>
      <h1>Orders</h1>
      <Orders />
      <OrderTotal />

      <h1>Currencies</h1>
      <Currencies />
    </>
  )
}

const Orders = observer(() => {
  const { orders } = useStore()

  return (
    <Table columns={['Title', 'Price', 'Currency', 'Price']}>
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </Table>
  )
})

const OrderRow = observer(({ order }) => {
  return (
    <tr key={order.id}>
      <td>{order.title}</td>
      <td>
        <NumberInput value={order.price} onChange={order.setPrice} />
      </td>
      <td>
        <CurrencySelect value={order.currency} onChange={order.setCurrency} />
      </td>
      <td>{formatPrice(order.total)}</td>
    </tr>
  )
})

const Currencies = observer(() => {
  const { currencies } = useStore()

  return (
    <Table columns={['Currency', 'Rate']}>
      {Object.entries(currencies).map(([currency, rate]) => (
        <tr key={currency}>
          <td>{currency}</td>
          <td>
            <NumberInput
              value={rate}
              onChange={(value) => {
                currencies[currency] = value
              }}
            />
          </td>
        </tr>
      ))}
    </Table>
  )
})

const CurrencySelect = observer(({ value, onChange }) => {
  const { currencies } = useStore()

  return (
    <select onChange={(e) => onChange(e.target.value)} value={value}>
      {Object.keys(currencies).map((c) => (
        <option key={c} value={c}>
          {formatCurrency(c)}
        </option>
      ))}
    </select>
  )
})

const OrderTotal = observer(() => {
  const { total } = useStore()

  return <div className="total">{formatPrice(total)}</div>
})

export default App
