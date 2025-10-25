import { Helmet } from 'react-helmet-async'

import { AddonManagement } from '../business/addon-management'
import { CategoryManagement } from '../business/category-management'
import { ProductManagement } from '../business/product-management'
import { PromotionManagement } from '../business/promotion-management'

export function Orders() {
  return (
    <>
      <Helmet title="Gestión del menú" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestión del menú</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ProductManagement />

          <CategoryManagement />
          <AddonManagement />
          <PromotionManagement />
        </div>
      </div>
    </>
  )
}
