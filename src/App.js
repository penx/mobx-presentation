import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

import { getInitialCurrencies, getInitialOrders } from './orders'
import { formatCurrency, formatPrice, NumberInput, Table } from './utils'

const CurrencyContext = createContext()
const SetCurrencyContext = createContext()

const SetCurrenciesProvider = React.memo(({ set, ...props }) => {
  const onCurrencyChange = useCallback((currency, value) => {
    set((currencies) => ({
      ...currencies,
      [currency]: value,
    }))
  }, [set])
  return <SetCurrencyContext.Provider value={onCurrencyChange} {...props} />
})
SetCurrenciesProvider.displayName = 'SetCurrenciesProvider'

const CurrenciesProvider = props => {
  const [currencies, setCurrencies] = useState(getInitialCurrencies);
  return (
    <CurrencyContext.Provider value={currencies}>
      <SetCurrenciesProvider set={setCurrencies} {...props} />
    </CurrencyContext.Provider>
  )
}

const App = () => {
  const [orders, setOrders] = useState(getInitialOrders);

  const onPriceChange = useCallback((orderId, price) => {
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
  }, [])

  const onCurrencySelect = useCallback((orderId, currency) => {
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
  }, [])

  console.log('orders', orders)

  return (
    <CurrenciesProvider>
      <Panel orders={orders} onPriceChange={onPriceChange} onCurrencySelect={onCurrencySelect} />
    </CurrenciesProvider>
  )
}

const Panel = React.memo(({orders, onPriceChange, onCurrencySelect}) => <><h1>Orders</h1>
  <Orders
    orders={orders}
    onPriceChange={onPriceChange}
    onCurrencySelect={onCurrencySelect}
  />

  <OrderTotal orders={orders} />

  <h1>Currencies</h1>
  <Currencies /></>)
Panel.displayName = 'Panel'

const Orders = ({ orders, onPriceChange, onCurrencySelect }) => {
  return (
    <Table columns={['Title', 'Price', 'Currency', 'Price']}>
      {orders.map((order) => (
        <ConnectedOrderRow
          key={order.id}
          order={order}
          onPriceChange={onPriceChange}
          onCurrencySelect={onCurrencySelect}
        />
      ))}
    </Table>
  )
}

const ConnectedOrderRow = (props) => {
  const currencies = useContext(CurrencyContext)
  const currency = currencies[props.order.currency]
  return <OrderRow {...props} currency={currency} />
}

const OrderRow = React.memo(
  ({ order, onPriceChange, onCurrencySelect, currency }) => {
    console.log('OrderRow')
    const handleCurrencyChange = useCallback((currency) => onCurrencySelect(order.id, currency), [order.id, onCurrencySelect])
    const handlePriceChange = useCallback((price) => onPriceChange(order.id, price), [onPriceChange, order.id])
    return (
      <tr key={order.id}>
        <td>{order.title}</td>
        <td>
          <NumberInput
            value={order.price}
            onChange={handlePriceChange}
          />
        </td>
        <td>
          <ConnectedCurrencySelect
            value={order.currency}
            onChange={handleCurrencyChange}
          />
        </td>
        <td>{formatPrice(order.price * currency)}</td>
      </tr>
    )
  }
)
OrderRow.displayName = 'OrderRow'

const CurrencyInput = React.memo(({ value, currency, onChange }) => {
  const handleChange = useCallback((e) => onChange(currency, e.target.value), [currency, onChange])
  return (
    <input
      value={value}
      type="number"
      step={0.1}
      min={0}
      max={1000}
      onChange={handleChange}
    />
  )
})
CurrencyInput.displayName = CurrencyInput

const tableColumns = ['Currency', 'Rate']
const Currencies = () => {
  const currencies = useContext(CurrencyContext)
  const onCurrencyChange = useContext(SetCurrencyContext)
  return <Table columns={tableColumns}>
    {Object.entries(currencies).map(([currency, rate]) => (
      <tr key={currency}>
        <td>{currency}</td>
        <td>
          <CurrencyInput
            value={rate}
            currency={currency}
            onChange={onCurrencyChange}
          />
        </td>
      </tr>
    ))}
  </Table>
}

const ConnectedCurrencySelect = (props) => {
  const currencies = useContext(CurrencyContext)
  const currencyKeysString = JSON.stringify(Object.keys(currencies))
  const currencyKeys = useMemo(() => JSON.parse(currencyKeysString), [currencyKeysString])
  return <CurrencySelect {...props} currencyKeys={currencyKeys} />
 }

const CurrencySelect = React.memo(({ value, onChange, currencyKeys }) => {
  return (
    <select onChange={(e) => onChange(e.target.value)} value={value}>
      {currencyKeys.map((c) => (
        <option key={c} value={c}>
          {formatCurrency(c)}
        </option>
      ))}
    </select>
  )
})
CurrencySelect.displayName = 'CurrencySelect'

const OrderTotal = ({ orders }) => {
  const currencies = useContext(CurrencyContext)
  const total = orders.reduce(
    (acc, order) => (acc += order.price * currencies[order.currency]),
    0
  )

  return <div className="total">{formatPrice(total)}</div>
}

export default App
