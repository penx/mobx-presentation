import { createContext, useContext, useState } from 'react'

import { getInitialCurrencies, getInitialOrders } from './orders'
import { formatCurrency, formatPrice, NumberInput, Table } from './utils'

const CurrencyContext = createContext()

const App = () => {
  const [currencies, setCurrencies] = useState(getInitialCurrencies)
  const [orders, setOrders] = useState(getInitialOrders)

  const onCurrencyChange = (currency, value) => {
    setCurrencies((currencies) => ({
      ...currencies,
      [currency]: value,
    }))
  }

  const onPriceChange = (orderId, price) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              price,
            }
          : order
      )
    )
  }

  const onCurrencySelect = (orderId, currency) => {
    setOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              currency,
            }
          : order
      )
    )
  }

  console.log('orders', orders)

  return (
    <CurrencyContext.Provider value={currencies}>
      <h1>Orders</h1>
      <Orders
        orders={orders}
        onPriceChange={onPriceChange}
        onCurrencySelect={onCurrencySelect}
      />

      <OrderTotal orders={orders} />

      <h1>Currencies</h1>
      <Currencies currencies={currencies} onCurrencyChange={onCurrencyChange} />
    </CurrencyContext.Provider>
  )
}

const Orders = ({ orders, onPriceChange, onCurrencySelect }) => {
  return (
    <Table columns={['Title', 'Price', 'Currency', 'Price']}>
      {orders.map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          onPriceChange={onPriceChange}
          onCurrencySelect={onCurrencySelect}
        />
      ))}
    </Table>
  )
}

const OrderRow = ({ order, onPriceChange, onCurrencySelect }) => {
  const currencies = useContext(CurrencyContext)

  return (
    <tr key={order.id}>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(price) => onPriceChange(order.id, price)}
        />
      </td>
      <td>
        <CurrencySelect
          value={order.currency}
          onChange={(currency) => onCurrencySelect(order.id, currency)}
        />
      </td>
      <td>{formatPrice(order.price * currencies[order.currency])}</td>
    </tr>
  )
}

const Currencies = ({ currencies, onCurrencyChange }) => (
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
)

const CurrencySelect = ({ value, onChange }) => {
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
}

const OrderTotal = ({ orders }) => {
  const currencies = useContext(CurrencyContext)
  const total = orders.reduce(
    (acc, order) => (acc += order.price * currencies[order.currency]),
    0
  )

  return <div className="total">{formatPrice(total)}</div>
}

export default App
