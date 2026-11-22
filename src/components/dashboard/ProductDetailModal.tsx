
import { useCallback, useEffect, useState, type MouseEvent } from 'react'

import {
  Search,
  ChevronDown,
  Package,
  Tag,
  Boxes,
  Barcode,
} from 'lucide-react'

import '../../styles/product-detail-modal.css'

/* ========================================
   PRODUCT TYPES
======================================== */

interface Product {
  id?: string | number
  name: string
  sku?: string
  category?: string
  stock?: number
  price?: number | string
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  products?: Product[]
}

/* ========================================
   PRODUCT DETAIL MODAL
======================================== */

export default function ProductDetailModal({
  isOpen,
  onClose,
  products = [],
}: ProductDetailModalProps) {

  const [search, setSearch] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  /* ========================================
     FILTER PRODUCTS
  ======================================== */

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase()

    return (
      product.name.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query)
    )
  })

  const handleClose = useCallback(() => {
    setSearch('')
    setSelectedProduct(null)
    setIsDropdownOpen(false)
    onClose()
  }, [onClose])

  /* ========================================
     ESCAPE KEY HANDLER
  ======================================== */

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleClose, isOpen])

  /* ========================================
     SELECT PRODUCT
  ======================================== */

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setSearch('')
    setIsDropdownOpen(false)
  }

  /* ========================================
     BACKDROP CLICK
  ======================================== */

  const handleOverlayClick = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  /* ========================================
     MODAL UI
  ======================================== */

  return (
    <div
      className="product-modal-overlay"
      onMouseDown={handleOverlayClick}
    >

      <section
        className="product-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >

        {/* MODAL HEADER */}

        <header className="product-modal-header">

          <div>
            <h2 id="product-modal-title">
              Product Detail
            </h2>

            <p>
              View your product information
            </p>
          </div>

        </header>

        {/* MODAL BODY */}

        <div className="product-modal-body">

          <label className="product-field-label">
            SELECT PRODUCT
          </label>

          {/* PRODUCT SELECTOR */}

          <div className="product-select-wrapper">

            <button
              type="button"
              className={`product-select-trigger ${
                isDropdownOpen ? 'active' : ''
              }`}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
            >

              <span>
                {selectedProduct
                  ? selectedProduct.name
                  : 'Select Product'}
              </span>

              <ChevronDown
                size={20}
                className={isDropdownOpen ? 'rotated' : ''}
              />

            </button>

            {/* PRODUCT DROPDOWN */}

            {isDropdownOpen && (

              <div className="product-dropdown">

                {/* SEARCH BAR */}

                <div className="product-search-wrapper">

                  <Search size={19} />

                  <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    autoFocus
                  />

                </div>

                {/* PRODUCT OPTIONS */}

                <div className="product-dropdown-results">

                  {filteredProducts.length > 0 ? (

                    filteredProducts.map((product, index) => (

                      <button
                        type="button"
                        className="product-option"
                        key={
                          product.id ??
                          product.sku ??
                          `${product.name}-${index}`
                        }
                        onClick={() => handleSelectProduct(product)}
                      >

                        <span className="product-option-icon">
                          <Package size={19} />
                        </span>

                        <span className="product-option-info">

                          <strong>
                            {product.name}
                          </strong>

                          <small>
                            {product.sku || 'No SKU'}
                          </small>

                        </span>

                        <span className="product-option-stock">
                          Stock: {product.stock ?? 0}
                        </span>

                      </button>

                    ))

                  ) : (

                    <div className="product-empty-state">

                      <Package size={25} />

                      <p>
                        {search
                          ? 'No matching products found'
                          : 'No products available'}
                      </p>

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

          {/* SELECTED PRODUCT DETAILS */}

          {selectedProduct && (

            <div className="selected-product-details">

              <div className="selected-product-heading">

                <div className="selected-product-icon">
                  <Package size={23} />
                </div>

                <div>
                  <h3>
                    {selectedProduct.name}
                  </h3>

                  <p>
                    {selectedProduct.sku || 'No SKU available'}
                  </p>
                </div>

              </div>

              <div className="product-detail-grid">

                <div className="product-detail-item">
                  <Tag size={17} />
                  <span>Category</span>

                  <strong>
                    {selectedProduct.category || '—'}
                  </strong>
                </div>

                <div className="product-detail-item">
                  <Boxes size={17} />
                  <span>Available Stock</span>

                  <strong>
                    {selectedProduct.stock ?? 0}
                  </strong>
                </div>

                <div className="product-detail-item">
                  <Barcode size={17} />
                  <span>SKU</span>

                  <strong>
                    {selectedProduct.sku || '—'}
                  </strong>
                </div>

                <div className="product-detail-item">
                  <Tag size={17} />
                  <span>Price</span>

                  <strong>
                    {selectedProduct.price ?? '—'}
                  </strong>
                </div>

              </div>

            </div>

          )}

        </div>

        {/* MODAL FOOTER */}

        <footer className="product-modal-footer">

          <button
            type="button"
            className="product-modal-footer-close"
            onClick={handleClose}
          >
            Close
          </button>

        </footer>

      </section>

    </div>
  )
}
