import { useMemo, useState } from 'react'

import {
  Layers,
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  PackageOpen,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Package,
} from 'lucide-react'

import AppLayout from '../layout/AppLayout'
import '../../styles/categories.css'

/* ========================================
   TYPES
======================================== */

interface CategoriesLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  dateAdded: string
}

/* ========================================
   CATEGORY DATA
======================================== */

const categoryTabs = Array.from(
  { length: 20 },
  (_, index) => `C${index + 1}`
)

/* ========================================
   SAMPLE PRODUCTS
======================================== */

const sampleProducts: Product[] = [
  { id: 1, name: 'Cement Bag', price: 1200, category: 'C1', dateAdded: '2026-11-01' },
  { id: 2, name: 'Steel Rod 12mm', price: 8500, category: 'C1', dateAdded: '2026-11-02' },
  { id: 3, name: 'Sand Bag', price: 650, category: 'C1', dateAdded: '2026-11-03' },
  { id: 4, name: 'Brick Block', price: 45, category: 'C1', dateAdded: '2026-11-04' },
  { id: 5, name: 'Concrete Block', price: 120, category: 'C1', dateAdded: '2026-11-05' },
  { id: 6, name: 'Crush Stone', price: 1800, category: 'C1', dateAdded: '2026-11-06' },
  { id: 7, name: 'Steel Rod 10mm', price: 7200, category: 'C1', dateAdded: '2026-11-07' },
  { id: 8, name: 'White Cement', price: 1500, category: 'C1', dateAdded: '2026-11-08' },
  { id: 9, name: 'PVC Pipe', price: 950, category: 'C2', dateAdded: '2026-11-09' },
  { id: 10, name: 'Electrical Wire', price: 2200, category: 'C2', dateAdded: '2026-11-10' },
  { id: 11, name: 'Switch Board', price: 450, category: 'C2', dateAdded: '2026-11-11' },
  { id: 12, name: 'LED Bulb', price: 280, category: 'C2', dateAdded: '2026-11-12' },
  { id: 13, name: 'Copper Wire', price: 3200, category: 'C2', dateAdded: '2026-11-13' },
  { id: 14, name: 'Water Pipe', price: 1100, category: 'C2', dateAdded: '2026-11-14' },
  { id: 15, name: 'Paint Bucket', price: 3500, category: 'C3', dateAdded: '2026-11-15' },
  { id: 16, name: 'Wall Primer', price: 1800, category: 'C3', dateAdded: '2026-11-16' },
  { id: 17, name: 'Paint Brush', price: 350, category: 'C3', dateAdded: '2026-11-17' },
  { id: 18, name: 'Wall Putty', price: 2200, category: 'C3', dateAdded: '2026-11-18' },
  { id: 19, name: 'Door Handle', price: 850, category: 'C4', dateAdded: '2026-11-19' },
  { id: 20, name: 'Door Lock', price: 1500, category: 'C4', dateAdded: '2026-11-20' },
  { id: 21, name: 'Hinge Set', price: 500, category: 'C4', dateAdded: '2026-11-21' },
  { id: 22, name: 'Wooden Door', price: 12500, category: 'C4', dateAdded: '2026-11-22' },
  { id: 23, name: 'Window Frame', price: 6500, category: 'C4', dateAdded: '2026-11-23' },
  { id: 24, name: 'Glass Panel', price: 2800, category: 'C4', dateAdded: '2026-11-24' },
]

/* ========================================
   COMPONENT
======================================== */

export default function CategoriesLayout({
  activePage,
  onNavigate,
  onLogout,
}: CategoriesLayoutProps) {

  /* ========================================
     STATES
  ======================================== */

  const [categoryWindowStart, setCategoryWindowStart] = useState(0)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('C1')
  const [sortBy, setSortBy] = useState('newest')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  /* ========================================
     SUMMARY DATA
  ======================================== */

  const totalCategories = categoryTabs.length

  const categoryProducts = sampleProducts.filter(
    (product) => product.category === activeCategory
  )

  const totalCategoryProducts = categoryProducts.length

  const totalInventoryValue = categoryProducts.reduce(
    (total, product) => total + product.price,
    0
  )

  /* ========================================
     FILTER & SORT
  ======================================== */

  const filteredProducts = useMemo(() => {

    let result = sampleProducts.filter(
      (product) => product.category === activeCategory
    )

    if (search.trim()) {
      const searchTerm = search.toLowerCase()

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          String(product.id).includes(searchTerm)
      )
    }

    switch (sortBy) {

      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() -
            new Date(b.dateAdded).getTime()
        )
        break

      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break

      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break

      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break

      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break

      default:
        result.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() -
            new Date(a.dateAdded).getTime()
        )
    }

    return result

  }, [activeCategory, search, sortBy])

  /* ========================================
     PAGINATION
  ======================================== */

  const totalRecords = filteredProducts.length

  const totalPages = Math.max(
    1,
    Math.ceil(totalRecords / pageSize)
  )

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const startRecord =
    totalRecords === 0
      ? 0
      : (currentPage - 1) * pageSize + 1

  const endRecord = Math.min(
    currentPage * pageSize,
    totalRecords
  )

  /* ========================================
     HANDLERS
  ======================================== */

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setSearch('')
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearch('')
    setSortBy('newest')
    setPageSize(10)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  /* ========================================
     UI
  ======================================== */

  return (
    <AppLayout
      className="inventory-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >

      <div className="categories-page">

        {/* PAGE HEADER */}

        <header className="categories-heading">

          <div>

            <span className="categories-eyebrow">
              INVENTORY MANAGEMENT
            </span>

            <h1>Categories</h1>

            <p>
              Manage and organize your inventory categories
            </p>

          </div>

        </header>

        {/* SUMMARY CARDS */}

        <section className="categories-summary-grid">

          {/* TOTAL CATEGORIES */}

          <article className="categories-summary-card">

            <div className="categories-summary-icon gold">
              <Layers size={20} />
            </div>

            <div className="categories-summary-content">

              <h3>{totalCategories}</h3>

              <span>TOTAL CATEGORIES</span>

              <p>Available category groups</p>

            </div>

          </article>

          {/* PRODUCTS */}

          <article className="categories-summary-card">

            <div className="categories-summary-icon forest">
              <Package size={20} />
            </div>

            <div className="categories-summary-content">

              <h3>{totalCategoryProducts}</h3>

              <span>PRODUCTS IN {activeCategory}</span>

              <p>Current category products</p>

            </div>

          </article>

          {/* CATEGORY VALUE */}

          <article className="categories-summary-card">

            <div className="categories-summary-icon grey">
              <Boxes size={20} />
            </div>

            <div className="categories-summary-content">

              <h3>
                PKR {totalInventoryValue.toLocaleString()}
              </h3>

              <span>CATEGORY VALUE</span>

              <p>Sum of product prices</p>

            </div>

          </article>

        </section>

        {/* CATEGORY TABS */}

        <section className="categories-tabs-panel">

          <div className="categories-section-heading">

            <div className="categories-heading-icon">
              <Layers size={18} />
            </div>

            <h2>CATEGORIES</h2>

          </div>

          <div className="categories-tabs-navigation">

            <button
              type="button"
              className="categories-tab-arrow"
              disabled={categoryWindowStart === 0}
              onClick={() =>
                setCategoryWindowStart((prev) =>
                  Math.max(0, prev - 6)
                )
              }
              aria-label="Previous categories"
            >
              <ChevronLeft size={17} />
            </button>

            <div className="categories-tabs-scroll">

              <div className="categories-tabs">

                {categoryTabs
                  .slice(
                    categoryWindowStart,
                    categoryWindowStart + 6
                  )
                  .map((category) => (

                    <button
                      key={category}
                      type="button"
                      className={`category-tab ${
                        activeCategory === category
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        handleCategoryChange(category)
                      }
                    >
                      {category}
                    </button>

                  ))}

              </div>

            </div>

            <button
              type="button"
              className="categories-tab-arrow"
              disabled={
                categoryWindowStart >=
                categoryTabs.length - 6
              }
              onClick={() =>
                setCategoryWindowStart((prev) =>
                  Math.min(
                    categoryTabs.length - 6,
                    prev + 6
                  )
                )
              }
              aria-label="Next categories"
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </section>

        {/* FILTERS */}

        <section className="categories-panel categories-filters">

          <div className="categories-section-heading">

            <div className="categories-heading-icon">
              <SlidersHorizontal size={18} />
            </div>

            <h2>FILTERS</h2>

            <button
              type="button"
              className="categories-reset-button"
              onClick={handleResetFilters}
            >
              <RotateCcw size={14} />
              Reset
            </button>

          </div>

          <div className="categories-filter-grid">

            {/* SEARCH */}

            <div className="categories-filter-field search-field">

              <label>SEARCH</label>

              <div className="categories-search-input">

                <Search size={16} />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search products..."
                />

              </div>

            </div>

            {/* SORT */}

            <div className="categories-filter-field">

              <label>
                <ArrowUpDown size={13} />
                SORT BY
              </label>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
              >

                <option value="newest">
                  Date Added (Newest)
                </option>

                <option value="oldest">
                  Date Added (Oldest)
                </option>

                <option value="name-asc">
                  Name (A-Z)
                </option>

                <option value="name-desc">
                  Name (Z-A)
                </option>

                <option value="price-low">
                  Price (Low to High)
                </option>

                <option value="price-high">
                  Price (High to Low)
                </option>

              </select>

            </div>

          </div>

        </section>

        {/* PRODUCT TABLE */}

        <section className="categories-products-panel">

          <div className="categories-products-header">

            <div className="categories-products-title">

              <h2>{activeCategory}</h2>

              <span className="categories-record-count">
                ({totalRecords})
              </span>

            </div>

          </div>

          <div className="categories-table-wrapper">

            <table className="categories-table">

              <thead>

                <tr>
                  <th>PRODUCT ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                </tr>

              </thead>

              <tbody>

                {paginatedProducts.length > 0 ? (

                  paginatedProducts.map((product) => (

                    <tr key={product.id}>

                      <td className="categories-product-id">
                        #{product.id}
                      </td>

                      <td>
                        <strong>{product.name}</strong>
                      </td>

                      <td className="categories-price">
                        PKR {product.price.toLocaleString()}
                      </td>

                      <td>

                        <span className="categories-category-badge">
                          {product.category}
                        </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td colSpan={4}>

                      <div className="categories-empty-state">

                        <div className="categories-empty-icon">
                          <PackageOpen size={24} />
                        </div>

                        <h3>No products found</h3>

                        <p>
                          No products are currently available in{' '}
                          {activeCategory}
                          {search
                            ? ' matching your search.'
                            : '.'}
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          {totalRecords > 0 && (

            <div className="categories-pagination">

              <div className="categories-pagination-info">

                Showing <strong>{startRecord}</strong> to{' '}
                <strong>{endRecord}</strong> of{' '}
                <strong>{totalRecords}</strong>

              </div>

              <div className="categories-pagination-controls">

                <div className="categories-page-size">

                  <label>Rows</label>

                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(
                        Number(e.target.value)
                      )
                    }
                  >

                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>

                  </select>

                </div>

                <div className="categories-page-buttons">

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.max(1, prev - 1)
                      )
                    }
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span>
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages, prev + 1)
                      )
                    }
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>

                </div>

              </div>

            </div>

          )}

        </section>

      </div>

      {/* FOOTER */}

      <footer className="categories-footer">

        <span>
          © 2026 Zakhira Management System
        </span>

        <span>
          Designed for smarter business management
        </span>

      </footer>

    </AppLayout>
  )
}