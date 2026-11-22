import { useState } from 'react'
import { Box, Plus } from 'lucide-react'

import ProductDetailModal from '../dashboard/ProductDetailModal'

export default function Topbar() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  return (
    <>
      <div className="dashboard-topbar">
      

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="dashboard-product-detail-btn"
            onClick={() => setIsProductModalOpen(true)}
          >
            <Box size={17} />
            Product Detail
          </button>

          <button type="button" className="dashboard-create-btn">
            <Plus size={17} />
            Create Invoice
          </button>
        </div>
      </div>

      {isProductModalOpen && (
        <ProductDetailModal
          isOpen
          onClose={() => setIsProductModalOpen(false)}
          products={[]}
        />
      )}
    </>
  )
}
