import { useContext, createContext } from 'react'
import { makeAutoObservable, set } from 'mobx'

import { getInitialCurrencies, getInitialOrders } from './orders'

class OrderModel {
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

class AppStore {
  orders = getInitialOrders().map((order) => new OrderModel(order))
  currencies = getInitialCurrencies()

  constructor() {
    makeAutoObservable(this)
  }

  get total() {
    return this.orders.reduce(
      (acc, order) => (acc += order.price * this.currencies[order.currency]),
      0
    )
  }
}

const store = new AppStore()

const AppStoreContext = createContext(store)

export const useStore = () => useContext(AppStoreContext)
