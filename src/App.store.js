import { useContext, createContext } from 'react'
import { makeAutoObservable, set } from 'mobx'

import { getInitialCurrencies, getInitialOrders } from './orders'

export class OrderModel {
  id = ''
  title = ''
  price = ''
  currency = ''

  constructor(data, currencies) {
    makeAutoObservable(this)
    set(this, data)
    this.currencies = currencies
  }

  get total() {
    return this.price * this.currencies[this.currency]
  }

  setPrice(price) {
    this.price = price
  }

  setCurrency(currency) {
    this.currency = currency
  }
}

export class AppStore {
  orders = []
  currencies = {}

  constructor(data) {
    makeAutoObservable(this)

    set(this, data)

    this.orders.replace(
      data.orders.map((item) => new OrderModel(item, this.currencies))
    )
  }

  get total() {
    return this.orders.reduce(
      (acc, order) => (acc += order.price * this.currencies[order.currency]),
      0
    )
  }
}

const store = new AppStore({
  currencies: getInitialCurrencies(),
  orders: getInitialOrders(),
})

const AppStoreContext = createContext(store)

export const useStore = () => useContext(AppStoreContext)
