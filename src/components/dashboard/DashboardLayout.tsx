
import { useEffect, useRef, useState } from 'react'

import {
  AlertTriangle,
  Package,
  FileText,
  CreditCard,
  ShoppingCart,
  ArrowRight,
  Plus,
  Receipt,
  Truck,
  Activity,
  Monitor,
  Store,
  Wallet,
  CalendarDays,
  ChevronDown,
} from 'lucide-react'

import StatCards from './StatCard'
import AppLayout from '../layout/AppLayout'
import TopProductsChart from './charts/TopProductsChart'
import FinancialGraph from './charts/FinancialGraph'
import '../../styles/dashboard.css'

/* ========================================
   TYPES
======================================== */

interface DashboardLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

type InvoiceView = 'all' | 'returns'

interface Invoice {
  invoice: string
  customer: string
  amount: string
  status: string
}

/* ========================================
   ALERTS DATA
======================================== */

const alerts = [
  {
    title: 'Low-stock products',
    count: '0 items',
    icon: AlertTriangle,
    type: 'low-stock',
  },
  {
    title: 'Out-of-stock products',
    count: '0 products',
    icon: Package,
    type: 'out-stock',
  },
  {
    title: 'Pending purchase orders',
    count: '0 orders',
    icon: FileText,
    type: 'pending-orders',
  },
  {
    title: 'Supplier payments due',
    count: '0 bills',
    icon: CreditCard,
    type: 'supplier-due',
  },
]

/* ========================================
   TOP 5 PRODUCTS
======================================== */

const topProducts = [
  { id: '1', name: 'Product One', unitsSold: 120 },
  { id: '2', name: 'Product Two', unitsSold: 94 },
  { id: '3', name: 'Product Three', unitsSold: 75 },
  { id: '4', name: 'Product Four', unitsSold: 54 },
  { id: '5', name: 'Product Five', unitsSold: 36 },
  { id: '6', name: 'Product Six', unitsSold: 22 },
  { id: '7', name: 'Product Seven', unitsSold: 15 },
]

/* ========================================
   LOW STOCK PRODUCTS
======================================== */

const lowStockProducts = [
  {
    name: 'Product One',
    sku: 'SKU-001',
    stock: 0,
    status: 'Out of stock',
  },
  {
    name: 'Product Two',
    sku: 'SKU-002',
    stock: 0,
    status: 'Out of stock',
  },
  {
    name: 'Product Three',
    sku: 'SKU-003',
    stock: 0,
    status: 'Out of stock',
  },
]

/* ========================================
   RECENT INVOICES
   FRONTEND DEMO DATA
======================================== */

const recentInvoices: Invoice[] = [
  {
    invoice: 'INV-2026-0003',
    customer: 'Customer One',
    amount: 'Rs 15,000',
    status: 'Paid',
  },
  {
    invoice: 'INV-2026-0002',
    customer: 'Customer Two',
    amount: 'Rs 8,500',
    status: 'Pending',
  },
  {
    invoice: 'INV-2026-0001',
    customer: 'Customer Three',
    amount: 'Rs 12,000',
    status: 'Paid',
  },
]

/* ========================================
   RETURN INVOICES
   FRONTEND DEMO DATA
======================================== */

const returnInvoices: Invoice[] = [
  {
    invoice: 'RET-2026-0002',
    customer: 'Customer One',
    amount: 'Rs 2,500',
    status: 'Returned',
  },
  {
    invoice: 'RET-2026-0001',
    customer: 'Customer Two',
    amount: 'Rs 1,200',
    status: 'Processed',
  },
]

/* ========================================
   RECENT ACTIVITY
======================================== */

const recentActivity = [
  {
    title: 'New invoice created',
    description: 'Invoice activity will appear here.',
    time: '—',
    icon: Receipt,
  },
  {
    title: 'Product added',
    description: 'Inventory activity will appear here.',
    time: '—',
    icon: Package,
  },
  {
    title: 'Purchase recorded',
    description: 'Purchase activity will appear here.',
    time: '—',
    icon: ShoppingCart,
  },
]

/* ========================================
   QUICK ACTIONS
======================================== */

const quickActions = [
  { title: 'New Sale', icon: ShoppingCart },
  { title: 'Add Product', icon: Package },
  { title: 'Add Purchase', icon: Truck },
  { title: 'Accounting', icon: Wallet },
]

/* ========================================
   SALES ANALYTICS
======================================== */

const salesChannelData = {
  online: 0,
  offline: 118705,
}

const totalSales =
  salesChannelData.online + salesChannelData.offline

const onlinePercentage =
  totalSales > 0
    ? (salesChannelData.online / totalSales) * 100
    : 0

const offlinePercentage =
  totalSales > 0
    ? (salesChannelData.offline / totalSales) * 100
    : 0

const formatSalesAmount = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/* ========================================
   CIRCULAR SALES PROGRESS
======================================== */

interface SalesProgressProps {
  title: string
  percentage: number
  amount: number
  type: 'online' | 'offline'
  icon: typeof Monitor
}

function SalesProgress({
  title,
  percentage,
  amount,
  type,
  icon: Icon,
}: SalesProgressProps) {
  const radius = 43
  const circumference = 2 * Math.PI * radius

  const progressOffset =
    circumference - (percentage / 100) * circumference

  return (
    <article className={`sales-progress-card sales-progress-${type}`}>
      <div className="sales-progress-circle">
        <svg
          viewBox="0 0 110 110"
          className="sales-progress-svg"
          role="img"
          aria-label={`${title}: ${percentage.toFixed(0)} percent`}
        >
          <circle
            className="sales-progress-track"
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            strokeWidth="7"
          />

          <circle
            className="sales-progress-value"
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
          />
        </svg>

        <div className="sales-progress-center">
          <strong>{percentage.toFixed(0)}%</strong>
        </div>
      </div>

      <div className="sales-progress-info">
        <div className="sales-progress-title">
          <Icon size={15} />
          <h3>{title}</h3>
        </div>

        <strong className="sales-progress-amount">
          {formatSalesAmount(amount)}
        </strong>

        <span className="sales-progress-caption">
          Share of total sales
        </span>
      </div>
    </article>
  )
}

/* ========================================
   DASHBOARD COMPONENT
======================================== */

export default function DashboardLayout({
  activePage,
  onNavigate,
  onLogout,
}: DashboardLayoutProps) {
  /* Invoice dropdown state */

  const [invoiceView, setInvoiceView] = useState<InvoiceView>('all')
  const [invoiceDropdownOpen, setInvoiceDropdownOpen] = useState(false)

  const invoiceDropdownRef = useRef<HTMLDivElement>(null)

  /* Selected invoice data */

  const displayedInvoices =
    invoiceView === 'all' ? recentInvoices : returnInvoices

  const invoiceHeading =
    invoiceView === 'all' ? 'Recent Invoices' : 'Return Invoices'

  const invoiceDescription =
    invoiceView === 'all'
      ? 'Your latest invoice records'
      : 'Your returned invoice records'

  /* Change invoice view */

  const handleInvoiceViewChange = (view: InvoiceView) => {
    setInvoiceView(view)
    setInvoiceDropdownOpen(false)
  }

  /* Close dropdown when clicking outside */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        invoiceDropdownRef.current &&
        !invoiceDropdownRef.current.contains(event.target as Node)
      ) {
        setInvoiceDropdownOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInvoiceDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
      showDecorations
    >
      <div className="dashboard-page-content">

        {/* PAGE HEADING */}

        <header className="dashboard-heading">
          <div className="dashboard-heading-info">
            <span className="dashboard-eyebrow">
              BUSINESS OVERVIEW
            </span>

            <h1>Dashboard</h1>

            <p>
              Welcome back, <strong>Admin</strong> — here's what's happening today.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-new-invoice"
          >
            <Plus size={16} />
            New Invoice
          </button>
        </header>

        <section className="dashboard-content">

          {/* KPI CARDS */}

          <StatCards />

          {/* ALERTS & ACTIONS */}

          <section className="dashboard-panel alerts-panel">
            <div className="panel-title-row">
              <div>
                <span className="panel-eyebrow">
                  ATTENTION CENTER
                </span>

                <h2>Alerts &amp; Actions</h2>

                <p>
                  Things that may need your attention
                </p>
              </div>

              <span className="panel-live-indicator">
                System overview
              </span>
            </div>

            <div className="alerts-grid">
              {alerts.map((alert) => {
                const Icon = alert.icon

                return (
                  <article
                    className={`alert-card ${alert.type}`}
                    key={alert.title}
                  >
                    <span className="alert-icon">
                      <Icon size={20} />
                    </span>

                    <div>
                      <h3>{alert.title}</h3>
                      <p>{alert.count}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* ANALYTICS */}

          <section className="dashboard-charts-grid">

            {/* REVENUE VS EXPENSES VS PROFIT */}

            <article className="dashboard-panel chart-panel revenue-panel">
              <div className="panel-title-row">
                <div>
                  <span className="panel-eyebrow">
                    FINANCIAL ANALYTICS
                  </span>

                  <h2>Revenue vs Expenses vs Profit</h2>

                  <p>
                    Track your financial performance
                  </p>
                </div>

                <div className="dashboard-period-btn">
                  <CalendarDays size={14} />
                  <span>Last 6 Months</span>
                </div>
              </div>

              {/* CHART LEGEND */}

              <div className="chart-legend">
                <span>
                  <i className="legend-revenue" />
                  Revenue
                </span>

                <span>
                  <i className="legend-expenses" />
                  Expenses
                </span>

                <span>
                  <i className="legend-profit" />
                  Profit
                </span>
              </div>

              {/* FINANCIAL VERTICAL BAR CHART */}

              <FinancialGraph />

            </article>

            {/* ONLINE VS OFFLINE SALES */}

            <article className="dashboard-panel chart-panel sales-channel-panel">
              <div className="panel-title-row">
                <div>
                  <span className="panel-eyebrow">
                    SALES ANALYTICS
                  </span>

                  <h2>Online vs Offline Sales</h2>

                  <p>
                    Compare your sales channels
                  </p>
                </div>
              </div>

              {/* SALES CHANNEL CARDS */}

              <div className="sales-progress-grid">
                <SalesProgress
                  title="Online Sales"
                  percentage={onlinePercentage}
                  amount={salesChannelData.online}
                  type="online"
                  icon={Monitor}
                />

                <SalesProgress
                  title="Offline Sales"
                  percentage={offlinePercentage}
                  amount={salesChannelData.offline}
                  type="offline"
                  icon={Store}
                />
              </div>

              {/* SALES CHANNEL LEGEND */}

              <div className="sales-channel-legend">
                <span className="sales-legend-item">
                  <i className="sales-legend-dot online-dot" />
                  Online
                </span>

                <span className="sales-legend-item">
                  <i className="sales-legend-dot offline-dot" />
                  Offline
                </span>
              </div>
            </article>
          </section>

          {/* TOP PRODUCTS & LOW STOCK */}

          <section className="dashboard-lower-grid">

            {/* TOP 5 PRODUCTS */}

            <TopProductsChart products={topProducts} />

            {/* LOW STOCK ITEMS */}

            <article className="dashboard-panel lower-panel low-stock-panel">
              <div className="lower-panel-heading">
                <div className="lower-panel-icon forest-icon">
                  <Package size={19} />
                </div>

                <div>
                  <h2>Low Stock Items</h2>
                  <p>Products that need restocking</p>
                </div>

                <button
                  type="button"
                  className="panel-arrow"
                  aria-label="View low stock items"
                >
                  <ArrowRight size={17} />
                </button>
              </div>

              <div className="low-stock-list">
                {lowStockProducts.map((product) => (
                  <div
                    className="low-stock-row"
                    key={product.sku}
                  >
                    <div className="low-stock-product-icon">
                      <Package size={17} />
                    </div>

                    <div className="low-stock-product-info">
                      <strong>{product.name}</strong>
                      <span>{product.sku}</span>
                    </div>

                    <div className="low-stock-status">
                      <strong>{product.stock}</strong>
                      <span>{product.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="dashboard-place-order"
              >
                <Plus size={15} />
                Place Order
              </button>
            </article>
          </section>

          {/* RECENT INVOICES & ACTIVITY */}

          <section className="dashboard-lower-grid">

            {/* RECENT INVOICES */}

            <article className="dashboard-panel lower-panel recent-invoices-panel">
              <div className="lower-panel-heading">
                <div className="lower-panel-icon forest-icon">
                  <Receipt size={19} />
                </div>

                <div>
                  <h2>{invoiceHeading}</h2>
                  <p>{invoiceDescription}</p>
                </div>

                <button
                  type="button"
                  className="panel-arrow"
                  aria-label="View all invoices"
                >
                  <ArrowRight size={17} />
                </button>
              </div>

              {/* INVOICE TABLE */}

              <div className="invoice-table-wrapper">
                <table className="invoice-table">
                  <thead>
                    <tr>

                      {/* INVOICE DROPDOWN */}

                      <th>
                        <div
                          className="invoice-dropdown-container"
                          ref={invoiceDropdownRef}
                        >
                          <button
                            type="button"
                            className="invoice-dropdown-trigger"
                            aria-haspopup="true"
                            aria-expanded={invoiceDropdownOpen}
                            onClick={() => {
                              setInvoiceDropdownOpen((open) => !open)
                            }}
                          >
                            <span>Invoice</span>

                            <ChevronDown
                              size={15}
                              className={
                                invoiceDropdownOpen
                                  ? 'invoice-chevron-open'
                                  : ''
                              }
                            />
                          </button>

                          {invoiceDropdownOpen && (
                            <div
                              className="invoice-dropdown-menu"
                              role="menu"
                            >
                              <button
                                type="button"
                                role="menuitem"
                                className={
                                  invoiceView === 'all'
                                    ? 'invoice-dropdown-option active'
                                    : 'invoice-dropdown-option'
                                }
                                onClick={() => {
                                  handleInvoiceViewChange('all')
                                }}
                              >
                                All Invoices
                              </button>

                              <button
                                type="button"
                                role="menuitem"
                                className={
                                  invoiceView === 'returns'
                                    ? 'invoice-dropdown-option active'
                                    : 'invoice-dropdown-option'
                                }
                                onClick={() => {
                                  handleInvoiceViewChange('returns')
                                }}
                              >
                                Return Invoices
                              </button>
                            </div>
                          )}
                        </div>
                      </th>

                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedInvoices.length > 0 ? (
                      displayedInvoices.map((invoice) => (
                        <tr key={invoice.invoice}>
                          <td className="invoice-number">
                            {invoice.invoice}
                          </td>

                          <td>{invoice.customer}</td>

                          <td>{invoice.amount}</td>

                          <td>
                            <span
                              className={`invoice-status ${
                                invoice.status === 'Paid'
                                  ? 'invoice-paid'
                                  : invoice.status === 'Pending'
                                    ? 'invoice-pending'
                                    : 'invoice-returned'
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="invoice-empty-state"
                        >
                          No invoices found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* RECENT ACTIVITY */}

            <article className="dashboard-panel lower-panel recent-activity-panel">
              <div className="lower-panel-heading">
                <div className="lower-panel-icon mustard-icon">
                  <Activity size={19} />
                </div>

                <div>
                  <h2>Recent Activity</h2>
                  <p>Latest business updates</p>
                </div>
              </div>

              <div className="activity-list">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon

                  return (
                    <div
                      className="activity-row"
                      key={activity.title}
                    >
                      <span className="activity-icon">
                        <Icon size={17} />
                      </span>

                      <div className="activity-info">
                        <strong>{activity.title}</strong>
                        <span>{activity.description}</span>
                      </div>

                      <span className="activity-time">
                        {activity.time}
                      </span>
                    </div>
                  )
                })}
              </div>
            </article>
          </section>

          {/* QUICK ACTIONS */}

          <section className="dashboard-quick-actions">
            <div className="quick-actions-heading">
              <div className="quick-actions-mark">
                <Plus size={19} />
              </div>

              <div>
                <h2>Quick Actions</h2>
                <p>Get things done faster</p>
              </div>
            </div>

            <div className="quick-action-buttons">
              {quickActions.map((action) => {
                const Icon = action.icon

                return (
                  <button
                    type="button"
                    key={action.title}
                    onClick={() => {
                      if (action.title === 'Accounting') {
                        onNavigate('Accounting')
                      }
                    }}
                  >
                    <Icon size={16} />
                    {action.title}
                  </button>
                )
              })}
            </div>
          </section>
        </section>

        {/* FOOTER */}

        <footer className="dashboard-footer">
          <span>© 2026 Zakhira Management System</span>
          <span>Designed for smarter business management</span>
        </footer>
      </div>
    </AppLayout>
  )
}
