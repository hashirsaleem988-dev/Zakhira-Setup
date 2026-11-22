
import { useState } from 'react'

import {
  Package,
  TrendingUp,
  Wallet,
  Layers,
  AlertTriangle,
  CircleX,
  Plus,
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  PackageOpen,
} from 'lucide-react'

import AppLayout from '../layout/AppLayout'
import AddProductModal from './AddProductModal'
import CategoryProductGraph from './CategoryProductGraph'
import Top7ProductsSold from './Top7ProductsSold'
import InventoryValueByCategory from './InventoryValueByCategory'
import RevenueByCategory from './RevenueByCategory'
import '../../styles/inventory.css'

/* ========================================
   TYPES
======================================== */

interface InventoryLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

/* ========================================
   INVENTORY STATS
======================================== */

const inventoryStats = [
  {
    title: 'TOTAL PRODUCTS',
    value: '0',
    icon: Package,
    color: 'forest',
  },
  {
    title: 'TOP-SELLING PRODUCT',
    value: '—',
    icon: TrendingUp,
    color: 'brass',
  },
  {
    title: 'INVENTORY VALUE',
    value: '0',
    icon: Wallet,
    color: 'olive',
  },
  {
    title: 'TOTAL CATEGORIES',
    value: '0',
    icon: Layers,
    color: 'dark',
  },
]

/* ========================================
   INVENTORY COMPONENT
======================================== */

export default function InventoryLayout({
  activePage,
  onNavigate,
  onLogout,
}: InventoryLayoutProps) {

  /* FILTER STATES */

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [stockStatus, setStockStatus] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  /* ADD PRODUCT MODAL STATE */

  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  /* OPEN MODAL */

  const handleAddProduct = () => {
    setIsAddProductOpen(true)
  }

  /* CLOSE MODAL */

  const handleCloseProductModal = () => {
    setIsAddProductOpen(false)
  }

  /* SAVE PRODUCT */

  const handleSaveProduct = (product: {
    sku: string
    name: string
    price: number
    costPrice: number
    category: string
    stock: number
    lowStockAlert: number
    unit: string
    description: string
    images: File[]
  }) => {
    console.log('New Product:', product)

    setIsAddProductOpen(false)
  }

  /* RESET FILTERS */

  const handleResetFilters = () => {
    setSearch('')
    setCategory('all')
    setStockStatus('all')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
  }

  return (
    <AppLayout
      className="inventory-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="inventory-page-content">

          {/* PAGE HEADING */}

          <header className="inventory-heading">

            <div>
              <span className="inventory-eyebrow">
                INVENTORY MANAGEMENT
              </span>

              <h1>Inventory — Products</h1>

              <p>
                Manage products and monitor your stock levels
              </p>
            </div>

          </header>

          {/* INVENTORY OVERVIEW */}

          <section className="inventory-stats-grid">

            {inventoryStats.map((item) => {
              const Icon = item.icon

              return (
                <article
                  className="inventory-stat-card"
                  key={item.title}
                >

                  <div className={`inventory-stat-icon ${item.color}`}>
                    <Icon size={21} />
                  </div>

                  <div className="inventory-stat-info">
                    <strong>{item.value}</strong>
                    <span>{item.title}</span>
                  </div>

                </article>
              )
            })}

          </section>

          {/* STOCK ALERTS */}

          <section className="inventory-panel inventory-alerts-panel">

            <div className="inventory-section-heading">
              <AlertTriangle size={18} />
              <h2>STOCK ALERTS</h2>
            </div>

            <div className="inventory-alert-grid">

              <article className="inventory-alert-card low-stock">

                <div className="inventory-alert-icon">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <span>Low Stock</span>
                  <strong>0 items</strong>
                </div>

              </article>

              <article className="inventory-alert-card out-stock">

                <div className="inventory-alert-icon">
                  <CircleX size={20} />
                </div>

                <div>
                  <span>Out of Stock</span>
                  <strong>0 products</strong>
                </div>

              </article>

            </div>

          </section>

          {/* ADD PRODUCT BUTTON */}

          <div className="inventory-action-row">

            <button
              type="button"
              className="inventory-add-btn"
              onClick={handleAddProduct}
            >
              <Plus size={19} />
              Add Product
            </button>

          </div>

          {/* FILTERS */}

          <section className="inventory-panel inventory-filters">

            <div className="inventory-section-heading">
              <SlidersHorizontal size={19} />
              <h2>FILTERS</h2>
            </div>

            <div className="inventory-filter-grid">

              {/* SEARCH */}

              <div className="inventory-filter-field search-field">
                <label>SEARCH</label>

                <div className="inventory-search-input">
                  <Search size={19} />

                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Product name, SKU, description..."
                  />
                </div>
              </div>

              {/* CATEGORY */}

              <div className="inventory-filter-field">
                <label>CATEGORY</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                </select>
              </div>

              {/* STOCK STATUS */}

              <div className="inventory-filter-field">
                <label>STOCK STATUS</label>

                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* PRICE RANGE */}

              <div className="inventory-filter-field price-field">
                <label>PRICE RANGE</label>

                <div className="inventory-price-inputs">

                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                  />

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                  />

                </div>
              </div>

              {/* SORT */}

              <div className="inventory-filter-field">
                <label>
                  <ArrowUpDown size={13} />
                  SORT BY
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Date Added (newest)</option>
                  <option value="oldest">Date Added (oldest)</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>

            </div>

            <div className="inventory-filter-footer">

              <button
                type="button"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>

            </div>

          </section>

          {/* PRODUCTS LIST */}

          <section className="inventory-products-panel">

            <div className="inventory-products-header">
              <div>
                <h2>Products</h2>
                <span>(0)</span>
              </div>
            </div>

            {/* EMPTY STATE */}

            <div className="inventory-empty-state">

              <div className="inventory-empty-icon">
                <PackageOpen size={30} />
              </div>

              <h3>No products found</h3>

              <p>
                Your inventory is currently empty.
                Add your first product to get started.
              </p>

              <button
                type="button"
                className="inventory-empty-btn"
                onClick={handleAddProduct}
              >
                <Plus size={17} />
                Add Your First Product
              </button>

            </div>

          </section>

         {/* =====================================
    INVENTORY ANALYTICS
===================================== */}

<section className="inventory-analytics-grid">

  <CategoryProductGraph categories={[]} />

  <Top7ProductsSold />

  <InventoryValueByCategory />
  <RevenueByCategory />

</section>
</div>
{/* INVENTORY FOOTER */}

<footer className="inventory-footer">
  <span>© 2026 Zakhira Management System</span>
  <span>Designed for smarter business management</span>
</footer>
      {/* =====================================
          ADD PRODUCT MODAL
      ===================================== */}

      {isAddProductOpen && (
        <AddProductModal
          onClose={handleCloseProductModal}
          onSave={handleSaveProduct}
        />
      )}

    </AppLayout>
  )
}
