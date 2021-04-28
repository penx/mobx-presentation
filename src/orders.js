export const getInitialOrders = () => [
  { id: 1, title: 'Foo', price: 100, currency: 'eur' },
  { id: 2, title: 'Bar', price: 15, currency: 'usd' },
  { id: 3, title: 'Baz', price: 300, currency: 'usd' },
  { id: 4, title: 'Qux', price: 200, currency: 'can' },
]

export const getInitialCurrencies = () => ({
  eur: 1.12,
  usd: 1.33,
  rup: 97.45,
  aus: 1.75,
  can: 1.75,
})
