import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './_layouts/app'
import { AuthLayout } from './_layouts/auth'
import { NotFound } from './404'
import { Dashboard } from './app/dashboard/dashboard'
import { Orders } from './app/orders/orders'
import { Products } from './app/business/products'
import { Categories } from './app/business/categories'
import { Addons } from './app/business/addons'
import { Promotions } from './app/business/promotions'
import { SignIn } from './auth/sign-in'
import { SignUp } from './auth/sign-up'
import { Error } from './error'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/orders', element: <Orders /> },
      { path: '/business/products', element: <Products /> },
      { path: '/business/categories', element: <Categories /> },
      { path: '/business/addons', element: <Addons /> },
      { path: '/business/promotions', element: <Promotions /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
