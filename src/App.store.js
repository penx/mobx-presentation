import { useContext, createContext } from 'react'
import { makeAutoObservable, set } from 'mobx'

import { getInitialCurrencies, getInitialOrders } from './orders'

export class OrderModel {
  id = ''
  title = ''
  price = ''
  currency = ''

  constructor(data) {
    makeAutoObservable(this)
    set(this, data)
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
