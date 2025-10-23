import { http, HttpResponse } from 'msw'
import { GetSalesTransactionsQuery } from '../get-sales-transactions'

export const getSalesTransactionsMock = http.get<
  GetSalesTransactionsQuery
>('/sales-transactions', ({ request }) => {
  const url = new URL(request.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  const transactions = [
    {
      id: 'transaction-1',
      date: '2024-07-01',
      customerName: 'Cliente A',
      total: 150.00,
      items: [
        { product: 'Pizza Pepperoni', quantity: 1, price: 100.00 },
        { product: 'Refresco', quantity: 1, price: 50.00 },
      ],
    },
    {
      id: 'transaction-2',
      date: '2024-07-01',
      customerName: 'Cliente B',
      total: 200.00,
      items: [
        { product: 'Pizza Hawaiana', quantity: 1, price: 120.00 },
        { product: 'Cerveza', quantity: 2, price: 40.00 },
      ],
    },
    {
      id: 'transaction-3',
      date: '2024-07-02',
      customerName: 'Cliente C',
      total: 100.00,
      items: [
        { product: 'Pizza Vegetariana', quantity: 1, price: 100.00 },
      ],
    },
    {
      id: 'transaction-4',
      date: '2024-07-03',
      customerName: 'Cliente D',
      total: 300.00,
      items: [
        { product: 'Pizza de Carne', quantity: 2, price: 150.00 },
      ],
    },
  ]

  // Basic filtering by date range (for simulation purposes)
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    const fromDate = from ? new Date(from) : null
    const toDate = to ? new Date(to) : null

    return (
      (!fromDate || transactionDate >= fromDate) &&
      (!toDate || transactionDate <= toDate)
    )
  })

  return HttpResponse.json(filteredTransactions)
})
