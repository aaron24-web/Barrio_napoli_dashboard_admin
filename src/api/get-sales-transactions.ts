import { api } from '@/lib/axios'

export interface GetSalesTransactionsQuery {
  from?: Date
  to?: Date
}

export interface SalesTransaction {
  id: string
  date: string
  customerName: string
  total: number
  items: {
    product: string
    quantity: number
    price: number
  }[]
}

export async function getSalesTransactions({
  from,
  to,
}: GetSalesTransactionsQuery) {
  const response = await api.get<SalesTransaction[]>('/sales-transactions', {
    params: {
      from,
      to,
    },
  })

  return response.data
}
