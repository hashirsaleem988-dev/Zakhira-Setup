
import { useMemo, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Search,
  CalendarDays,
  Info,
  TrendingUp,
  Wallet,
  Clock,
  FileText,
  RotateCcw,
  ChevronDown,
  Filter,
  Download,
} from 'lucide-react'

type RecordStatus = 'Paid' | 'Unpaid' | 'Partial'
type RecordTab = 'Quotations' | 'Invoices' | 'Approved' | 'Rejected'

type SalesRecord = {
  id: string
  customer: string
  phone: string
  date: string
  amount: number
  received: number
  status: RecordStatus
  type: 'Quotation' | 'Invoice'
  approval: 'Approved' | 'Rejected' | 'Pending'
}

const records: SalesRecord[] = [
  { id: 'INV-1025', customer: 'Ahmed Traders', phone: '03001234567', date: '2026-11-16', amount: 125000, received: 125000, status: 'Paid', type: 'Invoice', approval: 'Approved' },
  { id: 'INV-1024', customer: 'Modern Furniture', phone: '03111234567', date: '2026-11-15', amount: 85000, received: 40000, status: 'Partial', type: 'Invoice', approval: 'Approved' },
  { id: 'INV-1023', customer: 'Ali Construction', phone: '03221234567', date: '2026-11-14', amount: 210000, received: 0, status: 'Unpaid', type: 'Invoice', approval: 'Pending' },
  { id: 'QUO-1022', customer: 'Hassan Builders', phone: '03331234567', date: '2026-11-13', amount: 175000, received: 0, status: 'Unpaid', type: 'Quotation', approval: 'Pending' },
  { id: 'INV-1021', customer: 'City Hardware', phone: '03001239876', date: '2026-11-12', amount: 64000, received: 64000, status: 'Paid', type: 'Invoice', approval: 'Approved' },
  { id: 'QUO-1020', customer: 'Royal Developers', phone: '03119876543', date: '2026-11-10', amount: 95000, received: 0, status: 'Unpaid', type: 'Quotation', approval: 'Rejected' },
  { id: 'INV-1019', customer: 'A One Supplies', phone: '03219876543', date: '2026-11-09', amount: 142000, received: 70000, status: 'Partial', type: 'Invoice', approval: 'Approved' },
  { id: 'INV-1018', customer: 'New Vision Store', phone: '03339876543', date: '2026-11-08', amount: 56000, received: 56000, status: 'Paid', type: 'Invoice', approval: 'Approved' },
]

const monthlyData = [
  { month: 'Jun', revenue: 250000, expense: 145000, profit: 105000 },
  { month: 'Jul', revenue: 280000, expense: 160000, profit: 120000 },
  { month: 'Aug', revenue: 310000, expense: 180000, profit: 130000 },
  { month: 'Sep', revenue: 290000, expense: 170000, profit: 120000 },
  { month: 'Oct', revenue: 350000, expense: 200000, profit: 150000 },
  { month: 'Nov', revenue: 390000, expense: 225000, profit: 165000 },
]

const products = [
  { name: 'Cement Bags', quantity: 480, amount: 720000 },
  { name: 'Steel Bars', quantity: 350, amount: 650000 },
  { name: 'Wall Tiles', quantity: 290, amount: 435000 },
  { name: 'Paint Buckets', quantity: 210, amount: 315000 },
  { name: 'Gypsum Boards', quantity: 175, amount: 262500 },
]

const formatPKR = (value: number) =>
  `PKR ${value.toLocaleString('en-PK')}`

// ========================================
// REUSABLE DASHBOARD-STYLE INFO POPUP
// ========================================

function InfoTip({
  text,
  title = 'Information',
  formula,
}: {
  text: string
  title?: string
  formula?: string
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => setOpen(false), 180)
  }

  const updatePosition = () => {
    const button = buttonRef.current
    const tooltip = tooltipRef.current
    if (!button || !tooltip) return

    const rect = button.getBoundingClientRect()
    const width = Math.min(345, window.innerWidth - 32)
    const height = tooltip.offsetHeight
    let left = rect.left + rect.width / 2 - width / 2
    left = Math.max(16, Math.min(left, window.innerWidth - width - 16))

    const above = rect.top - height - 12
    const top = above >= 12 ? above : Math.max(12, Math.min(rect.bottom + 12, window.innerHeight - height - 12))
    setPosition({ top, left })
  }

  useEffect(() => {
    if (!open) return
    updatePosition()
    const handle = () => updatePosition()
    window.addEventListener('resize', handle)
    window.addEventListener('scroll', handle, true)
    const handleOutside = (event: MouseEvent) => {
      if (buttonRef.current?.contains(event.target as Node) || tooltipRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => {
      window.removeEventListener('resize', handle)
      window.removeEventListener('scroll', handle, true)
      document.removeEventListener('mousedown', handleOutside)
      cancelClose()
    }
  }, [open, text, formula])

  return (
    <span className="rb-info-wrap">
      <button
        type="button"
        ref={buttonRef}
        className="rb-info-button"
        aria-label={`More information about ${title}`}
        aria-expanded={open}
        onClick={() => { cancelClose(); setOpen((value) => !value) }}
        onMouseEnter={() => { cancelClose(); setOpen(true) }}
        onMouseLeave={scheduleClose}
        onFocus={() => setOpen(true)}
        onBlur={scheduleClose}
      >
        <Info size={15} />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className="rb-info-tooltip rb-info-tooltip-portal"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{ position: 'fixed', top: position.top, left: position.left, width: 'min(345px, calc(100vw - 32px))', maxWidth: 'calc(100vw - 32px)', zIndex: 2147483647, opacity: 1, visibility: 'visible', pointerEvents: 'auto', transform: 'none' }}
        >
          <span className="rb-info-purpose">{text}</span>
          {formula && (
            <span className="rb-info-formula">
              <span>CALCULATION FORMULA</span>
              <p>{formula}</p>
            </span>
          )}
        </div>,
        document.body
      )}
    </span>
  )
}

// ========================================
// CIRCULAR INVOICE STATUS COMPONENT
// ========================================

function InvoiceStatusChart({
  paid,
  partial,
  unpaid,
  total,
}: {
  paid: number
  partial: number
  unpaid: number
  total: number
}) {
  const statuses = [
    {
      label: 'Paid',
      count: paid,
      color: 'paid',
      description: 'Invoices fully paid',
    },
    {
      label: 'Partial',
      count: partial,
      color: 'partial',
      description: 'Invoices partially paid',
    },
    {
      label: 'Unpaid',
      count: unpaid,
      color: 'unpaid',
      description: 'Invoices awaiting payment',
    },
  ]

  return (
    <div className="rb-status-progress-grid">
      {statuses.map((item) => {
        const percentage =
          total > 0
            ? Math.round((item.count / total) * 100)
            : 0

        const remaining = Math.max(total - item.count, 0)

        return (
          <div
            className="rb-status-progress-item"
            key={item.label}
          >
            <div
              className={`rb-status-ring ${item.color}`}
              style={{
                '--progress': `${percentage}%`,
              } as React.CSSProperties}
              role="img"
              aria-label={`${item.label}: ${percentage}%`}
            >
              <div className="rb-status-ring-inner">
                <strong>{percentage}%</strong>
              </div>
            </div>

            <strong className="rb-status-progress-label">
              {item.label}
            </strong>

            <p>{item.description}</p>

            <div className="rb-status-progress-legend">
              <span>
                <i className="current" />
                {item.count} Invoices
              </span>

              <span>
                <i className="remaining" />
                {remaining} Others
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ========================================
// RECORD BOOK
// ========================================

function RecordBook() {
  const [activeTab, setActiveTab] = useState<RecordTab>('Invoices')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('All Payments')
  const [sortBy, setSortBy] = useState('Newest First')

  // ======================================
  // KPI CALCULATIONS
  // ======================================

  const invoiceRecords = records.filter(
    (record) => record.type === 'Invoice'
  )

  const totalSales = invoiceRecords.reduce(
    (sum, record) => sum + record.amount,
    0
  )

  const receivedAmount = invoiceRecords.reduce(
    (sum, record) => sum + record.received,
    0
  )

  const pendingAmount = invoiceRecords.reduce(
    (sum, record) => sum + record.amount - record.received,
    0
  )

  const invoiceCount = invoiceRecords.length

  // ======================================
  // INVOICE STATUS COUNTS
  // ======================================

  const paidCount = invoiceRecords.filter(
    (record) => record.status === 'Paid'
  ).length

  const partialCount = invoiceRecords.filter(
    (record) => record.status === 'Partial'
  ).length

  const unpaidCount = invoiceRecords.filter(
    (record) => record.status === 'Unpaid'
  ).length

  // ======================================
  // RECORD FILTERING
  // ======================================

  const filteredRecords = useMemo(() => {
    let result = records.filter((record) => {
      const matchesSearch =
        `${record.id} ${record.customer} ${record.phone}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesPayment =
        paymentStatus === 'All Payments' ||
        (paymentStatus === 'Paid' && record.status === 'Paid') ||
        (paymentStatus === 'Unpaid' && record.status === 'Unpaid') ||
        (paymentStatus === 'Partial Payment' && record.status === 'Partial')

      const matchesFrom = !dateFrom || record.date >= dateFrom
      const matchesTo = !dateTo || record.date <= dateTo

      let matchesTab = true

      if (activeTab === 'Invoices') {
        matchesTab = record.type === 'Invoice'
      }

      if (activeTab === 'Quotations') {
        matchesTab = record.type === 'Quotation'
      }

      if (activeTab === 'Approved') {
        matchesTab = record.approval === 'Approved'
      }

      if (activeTab === 'Rejected') {
        matchesTab = record.approval === 'Rejected'
      }

      return (
        matchesSearch &&
        matchesPayment &&
        matchesFrom &&
        matchesTo &&
        matchesTab
      )
    })

    result = [...result].sort((a, b) =>
      sortBy === 'Oldest First'
        ? a.date.localeCompare(b.date)
        : sortBy === 'Highest Amount'
          ? b.amount - a.amount
          : sortBy === 'Lowest Amount'
            ? a.amount - b.amount
            : b.date.localeCompare(a.date)
    )

    return result
  }, [
    activeTab,
    search,
    dateFrom,
    dateTo,
    paymentStatus,
    sortBy,
  ])

  const tabs: RecordTab[] = [
    'Quotations',
    'Invoices',
    'Approved',
    'Rejected',
  ]

  // ======================================
  // KPI CARDS
  // ======================================

  const kpis = [
    {
      title: 'Total Sales',
      value: formatPKR(totalSales),
      note: 'Invoice sales value',
      icon: TrendingUp,
      color: 'green',
      info: 'Displays the total sales value generated from all invoice records.',
      formula: 'Sum of All Invoice Grand Totals',
    },
    {
      title: 'Received Amount',
      value: formatPKR(receivedAmount),
      note: 'Payments received',
      icon: Wallet,
      color: 'gold',
      info: 'Displays the total payments received from customers against invoices.',
      formula: 'Sum of All Received Payments Against Invoices',
    },
    {
      title: 'Pending Amount',
      value: formatPKR(pendingAmount),
      note: 'Outstanding balance',
      icon: Clock,
      color: 'orange',
      info: 'Displays the remaining amount customers still need to pay.',
      formula: 'Total Invoice Amount - Received Amount',
    },
    {
      title: 'Total Invoices',
      value: String(invoiceCount),
      note: 'Generated invoices',
      icon: FileText,
      color: 'blue',
      info: 'Displays the total number of invoice records.',
      formula: 'Count of All Generated Invoice Records',
    },
    {
      title: 'Returns',
      value: 'PKR 12,500',
      note: 'Return value',
      icon: RotateCcw,
      color: 'purple',
      info: 'Displays the total value of products returned by customers.',
      formula: 'Sum of All Approved Return Amounts',
    },
  ]

  // ======================================
  // PAGE UI
  // ======================================

  return (
    <div className="record-book">

      {/* PAGE HEADING */}

      <div className="rb-page-heading">
        <div>
          <span className="rb-eyebrow">
            SALES MANAGEMENT
          </span>

          <h1>Record Book</h1>

          <p>
            Manage your quotations, invoices and payment records.
          </p>
        </div>

        <button
          type="button"
          className="rb-export-button"
          onClick={() => window.print()}
        >
          <Download size={16} />
          Export / Print
        </button>
      </div>

      {/* DEMO NOTICE */}

      <div className="rb-demo-note">
        <Info size={16} />

        <span>
          Demo data is currently displayed. Records will be connected to your backend later.
        </span>
      </div>

      {/* KPI CARDS */}

      <section className="rb-kpi-grid">
        {kpis.map((item) => {
          const Icon = item.icon

          return (
            <article
              className="rb-kpi-card"
              key={item.title}
            >
              <div className="rb-kpi-top">
                <span className={`rb-kpi-icon ${item.color}`}>
                  <Icon size={19} />
                </span>

                <InfoTip
                  title={item.title}
                  text={item.info}
                  formula={item.formula}
                />
              </div>

              <span className="rb-kpi-title">
                {item.title}
              </span>

              <strong className="rb-kpi-value">
                {item.value}
              </strong>

              <span className="rb-kpi-note">
                {item.note}
              </span>
            </article>
          )
        })}
      </section>

      {/* SALES RECORDS */}

      <section className="rb-record-panel">

        <div className="rb-section-heading">
          <div>
            <h2>Sales Records</h2>

            <p>
              Search, filter and review your sales transactions.
            </p>
          </div>

          <span className="rb-record-count">
            {filteredRecords.length} Records
          </span>
        </div>

        {/* FILTERS */}

        <div className="rb-filters">

          <label className="rb-search-field">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order, customer or phone..."
            />
          </label>

          <label className="rb-filter-field">
            <span>Date From</span>

            <div>
              <CalendarDays size={15} />

              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </div>
          </label>

          <label className="rb-filter-field">
            <span>Date To</span>

            <div>
              <CalendarDays size={15} />

              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </div>
          </label>

          <label className="rb-filter-field">
            <span>Sort By</span>

            <div>
              <Filter size={15} />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Highest Amount</option>
                <option>Lowest Amount</option>
              </select>

              <ChevronDown size={14} />
            </div>
          </label>

          <label className="rb-filter-field">
            <span>Payment Status</span>

            <div>
              <select
                value={paymentStatus}
                onChange={(event) => setPaymentStatus(event.target.value)}
              >
                <option>All Payments</option>
                <option>Paid</option>
                <option>Unpaid</option>
                <option>Partial Payment</option>
              </select>

              <ChevronDown size={14} />
            </div>
          </label>

        </div>

      {/* FOUR TABS */}

<div className={`rb-tabs ${activeTab.toLowerCase()}`}>
  {tabs.map((tab) => (
    <button
      type="button"
      key={tab}
      className={`${tab.toLowerCase()} ${activeTab === tab ? 'active' : ''}`}
      onClick={() => setActiveTab(tab)}
    >
      {tab}
    </button>
  ))}
</div>

        {/* RECORD TABLE */}

        <div className="rb-table-wrap">
          <table className="rb-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Received</th>
                <th>Balance</th>
                <th>Payment</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>

                  <td className="rb-order-id">
                    {record.id}
                  </td>

                  <td>
                    <strong>{record.customer}</strong>
                    <small>{record.phone}</small>
                  </td>

                  <td>
                    {new Date(`${record.date}T00:00:00`).toLocaleDateString('en-GB')}
                  </td>

                  <td>{formatPKR(record.amount)}</td>

                  <td>{formatPKR(record.received)}</td>

                  <td>
                    {formatPKR(record.amount - record.received)}
                  </td>

                  <td>
                    <span className={`rb-status ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>

                  <td>{record.type}</td>

                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="rb-empty">
                    No records found. Try changing your filters.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </section>

      {/* SALES ANALYTICS */}

      <section className="rb-analytics">

        <div className="rb-analytics-heading">
          <div>
            <h2>Sales Analytics</h2>

            <p>
              Insights based on the currently available demo dataset.
            </p>
          </div>

          <span>Last 6 Months</span>
        </div>

        <div className="rb-chart-grid">

         {/* SALES PERFORMANCE */}

<article className="rb-chart-card rb-performance-card">

  <div className="rb-chart-title">
    <div>
      <h3>Sales Performance</h3>
      <p>Revenue, expenses and profit</p>
    </div>

    <InfoTip
      title="Sales Performance"
      text="Displays the six-month comparison of revenue, expenses and profit."
      formula="Profit = Revenue - Expenses"
    />
  </div>

  <div className="rb-legend">
    <span><i className="revenue" />Revenue</span>
    <span><i className="expense" />Expense</span>
    <span><i className="profit" />Profit</span>
  </div>

  <div className="rb-bar-chart-3d">

    {/* Y AXIS */}
    <div className="rb-chart-y-axis">
      <span>500K</span>
      <span>375K</span>
      <span>250K</span>
      <span>125K</span>
      <span>0</span>
    </div>

    {/* PLOT */}
    <div className="rb-chart-plot">

      {/* GRID */}
      <div className="rb-chart-grid">
        {[0, 1, 2, 3, 4].map((line) => (
          <span key={line} />
        ))}
      </div>

      {/* MONTHS */}
      <div className="rb-chart-month-groups">

        {monthlyData.map((month) => (
          <div className="rb-chart-month" key={month.month}>

            <div className="rb-chart-bars">

              {/* REVENUE */}
              <div
                className="rb-3d-bar revenue"
                style={{
                  height: `${month.revenue / 500000 * 100}%`,
                }}
                title={`Revenue ${formatPKR(month.revenue)}`}
              >
                <span className="rb-bar-front" />
                <span className="rb-bar-side" />
                <span className="rb-bar-top" />
              </div>

              {/* EXPENSE */}
              <div
                className="rb-3d-bar expense"
                style={{
                  height: `${month.expense / 500000 * 100}%`,
                }}
                title={`Expense ${formatPKR(month.expense)}`}
              >
                <span className="rb-bar-front" />
                <span className="rb-bar-side" />
                <span className="rb-bar-top" />
              </div>

              {/* PROFIT */}
              <div
                className="rb-3d-bar profit"
                style={{
                  height: `${month.profit / 500000 * 100}%`,
                }}
                title={`Profit ${formatPKR(month.profit)}`}
              >
                <span className="rb-bar-front" />
                <span className="rb-bar-side" />
                <span className="rb-bar-top" />
              </div>

            </div>

            <small>{month.month}</small>

          </div>
        ))}

      </div>

    </div>

  </div>

</article>
          
{/* ONLINE VS OFFLINE */}

<article className="rb-chart-card rb-channel-donut-card">

  <div className="rb-chart-title">
    <div>
      <h3>Online vs Offline Sales</h3>
      <p>Sales channel distribution</p>
    </div>

    <InfoTip
      title="Online vs Offline Sales"
      text="Compares sales generated through online and offline sales channels."
      formula="Channel Percentage = Channel Sales / Total Sales × 100"
    />
  </div>

  <div className="rb-channel-donut-grid">

    {/* ONLINE */}
    <div className="rb-channel-donut-item">

      <div
        className="rb-channel-donut online-donut"
        style={{
          background: `conic-gradient(#315C49 0% 35%, #E7E6DD 35% 100%)`,
        }}
      >
        <div className="rb-channel-donut-inner">
          <strong>35%</strong>
        </div>
      </div>

      <strong className="rb-channel-donut-label">
        Online
      </strong>

      <p>Online Sales </p>

    </div>

    {/* OFFLINE */}
    <div className="rb-channel-donut-item">

      <div
        className="rb-channel-donut offline-donut"
        style={{
          background: `conic-gradient(#C49A5A 0% 65%, #E7E6DD 65% 100%)`,
        }}
      >
        <div className="rb-channel-donut-inner">
          <strong>65%</strong>
        </div>
      </div>

      <strong className="rb-channel-donut-label">
        Offline
      </strong>

      <p>Offline Sales </p>

    </div>

  </div>

  {/* COMPACT LEGEND */}
  <div className="rb-channel-legend">

    <div className="rb-channel-legend-item">
      <i className="online-dot" />
      <span>Online</span>
    </div>

    <div className="rb-channel-legend-item">
      <i className="offline-dot" />
      <span>Offline</span>
    </div>

  </div>

</article>
         

          {/* INVOICE STATUS - THREE CIRCULAR GRAPHS */}

          <article className="rb-chart-card rb-invoice-status-card">

            <div className="rb-chart-title">
              <div>
                <h3>Invoice Status</h3>
                <p>Payment status overview</p>
              </div>

              <InfoTip
                title="Invoice Status"
                text="Displays the percentage distribution of paid, partially paid and unpaid invoices."
                formula="Status Percentage = Status Count / Total Invoices × 100"
              />
            </div>

            <InvoiceStatusChart
              paid={paidCount}
              partial={partialCount}
              unpaid={unpaidCount}
              total={invoiceCount}
            />

          </article>
           {/* TOP 5 PRODUCTS */}

          <article className="rb-chart-card">

            <div className="rb-chart-title">
              <div>
                <h3>Top 5 Selling Products</h3>
                <p>Products by quantity sold</p>
              </div>

              <InfoTip
                title="Top 5 Selling Products"
                text="Shows the five products with the highest quantities sold."
                formula="Product Ranking = Total Quantity Sold"
              />
            </div>

            <div className="rb-products">
              {products.map((product, index) => (
                <div
                  className="rb-product-row"
                  key={product.name}
                >
                  <span className="rb-product-rank">
                    {index + 1}
                  </span>

                  <div className="rb-product-details">
                    <strong>{product.name}</strong>

                    <div>
                      <span
                        style={{
                          width: `${product.quantity / 480 * 100}%`,
                        }}
                      />
                    </div>

                    <small>{product.quantity} units sold</small>
                  </div>

                  <strong className="rb-product-amount">
                    {formatPKR(product.amount)}
                  </strong>
                </div>
              ))}
            </div>

          </article>

          {/* ORDER PATTERNS */}

          <article className="rb-chart-card rb-pattern-card">

           <div className="rb-heatmap">
            <div className="rb-chart-title">
  <div>
    <h3>Order Patterns</h3>
    <p>Weekly order activity by time</p>
  </div>
</div>

  <div className="rb-heatmap-times">
    <span className="rb-heatmap-axis-empty" />

    {['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map((time) => (
      <span key={time}>{time}</span>
    ))}
  </div>

  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (day, dayIndex) => (
      <div className="rb-heatmap-row" key={day}>
        <span className="rb-heatmap-day">{day}</span>

        {Array.from({ length: 5 }, (_, timeIndex) => {
          const level =
            (dayIndex * 3 + timeIndex * 2 + 1) % 5

          return (
  <i
    key={timeIndex}
    className={`level-${level}`}
    title={`${day} — ${
      ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'][timeIndex]
    } — Activity Level ${level}`}
  />
)
        })}
      </div>
    )
  )}

</div>
{/* ORDER PATTERN COLOR LEGEND */}

<div className="rb-heatmap-legend">
  <span>Low activity</span>

  <div className="rb-heatmap-legend-scale">
    <i className="level-0" />
    <i className="level-1" />
    <i className="level-2" />
    <i className="level-3" />
    <i className="level-4" />
  </div>

  <span>High activity</span>
</div>
          </article>
         <footer className="rb-page-footer">
  <span>© 2026 Zakhira Management System</span>
</footer>
        </div>
      </section>

    </div>
  )
}

export default RecordBook
