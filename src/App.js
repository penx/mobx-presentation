import { createContext, useContext } from 'react'
import { observer, useLocalObservable } from 'mobx-react-lite'

import { getInitialCurrencies, getInitialOrders } from './orders'
import { formatCurrency, formatPrice, NumberInput, Table } from './utils'

const CurrencyContext = createContext()

const App = () => {
  const currencies = useLocalObservable(getInitialCurrencies)
  const orders = useLocalObservable(getInitialOrders)

  const onCurrencyChange = (currency, value) => {
    currencies[currency] = value
  }

  return (
    <CurrencyContext.Provider value={currencies}>
      <h1>Orders</h1>
      <Orders orders={orders} />
      <OrderTotal orders={orders} />

      <h1>Currencies</h1>
      <Currencies currencies={currencies} onCurrencyChange={onCurrencyChange} />
    </CurrencyContext.Provider>
  )
}

const Orders = observer(({ orders }) => {
  return (
    <Table columns={['Title', 'Price', 'Currency', 'Price']}>
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </Table>
  )
})

const OrderRow = observer(({ order }) => {
  const currencies = useContext(CurrencyContext)

  return (
    <tr key={order.id}>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(price) => {
            order.price = price
          }}
        />
      </td>
      <td>
        <CurrencySelect
          value={order.currency}
          onChange={(currency) => {
            order.currency = currency
          }}
        />
      </td>
      <td>{formatPrice(order.price * currencies[order.currency])}</td>
    </tr>
  )
})

const Currencies = observer(({ currencies, onCurrencyChange }) => (
  <Table columns={['Currency', 'Rate']}>
    {Object.entries(currencies).map(([currency, rate]) => (
      <tr key={currency}>
        <td>{currency}</td>
        <td>
          <NumberInput
            value={rate}
            onChange={(value) => onCurrencyChange(currency, value)}
          />
        </td>
      </tr>
    ))}
  </Table>
))

const CurrencySelect = observer(({ value, onChange }) => {
  const currencies = useContext(CurrencyContext)

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

const OrderTotal = observer(({ orders }) => {
  const currencies = useContext(CurrencyContext)
  const total = orders.reduce(
    (acc, order) => (acc += order.price * currencies[order.currency]),
    0
  )

  return <div className="total">{formatPrice(total)}</div>
})

export default App
