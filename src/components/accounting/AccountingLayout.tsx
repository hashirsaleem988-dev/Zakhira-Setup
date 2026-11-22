
import { useState } from 'react'

import {
  TrendingUp,
  Wallet,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  FileText,
  Plus,
  Info,
} from 'lucide-react'

import AppLayout from '../layout/AppLayout'
import NewEntryModal from './NewEntryModal'
import FinancialPerformanceChart from './charts/FinancialPerformanceChart'
import '../../styles/accounting.css'

/* ========================================
   TYPES
======================================== */

interface AccountingLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface AccountingEntry {
  type: string
  customer: string
  company: string
  invoice: string
  amount: number
  date: string
  status: string
  mode: string
  notes: string
  file: File | null
}

/* ========================================
   FINANCIAL STATS
======================================== */

const financialStats = [
  { title: 'NET PROFIT', value: '0', icon: Wallet, color: 'green' },
  { title: 'TOTAL REVENUE', value: '0', icon: TrendingUp, color: 'forest' },
  { title: 'CASH IN BANK', value: '0', icon: Wallet, color: 'mustard' },
  { title: 'RECEIVABLES', value: '0', icon: ArrowDown, color: 'olive' },
  { title: 'PAYABLES', value: '0', icon: ArrowUp, color: 'red' },
  { title: 'COST OF GOODS SOLD', value: '0', icon: FileText, color: 'green' },
  { title: 'OTHER EXPENSES', value: '0', icon: Wallet, color: 'pink' },
]

/* ========================================
   TRANSACTION STATS
======================================== */

const transactionStats = [
  { title: 'ALL', value: '0', icon: Wallet, color: 'mustard' },
  { title: 'IN', value: '0', icon: ArrowDown, color: 'forest' },
  { title: 'OUT', value: '0', icon: ArrowUp, color: 'dark' },
  { title: 'RETURN', value: '0', icon: RotateCcw, color: 'mustard' },
]
/* ========================================
   CASH FLOW DEMO DATA
======================================== */

const cashFlowDays = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]

const cashFlowMonths = [
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
]

// 0 = Very Low, 1 = Low, 2 = Normal, 3 = High, 4 = Peak

const cashFlowData = [
  [1, 2, 0, 3, 4, 2],
  [4, 1, 2, 0, 3, 2],
  [2, 4, 1, 3, 0, 2],
  [0, 3, 4, 1, 2, 3],
  [3, 0, 2, 4, 1, 3],
  [1, 2, 0, 3, 4, 1],
  [4, 1, 3, 0, 2, 3],
]

/* ========================================
   MONTHLY OVERVIEW DEMO DATA
======================================== */

const monthlyOverviewData = [
  { month: 'Aug 26', revenue: 0, expenses: 0, inflow: 0, outflow: 0 },
  { month: 'Sep 26', revenue: 0, expenses: 0, inflow: 0, outflow: 0 },
  { month: 'Oct 26', revenue: 0, expenses: 0, inflow: 0, outflow: 0 },
  { month: 'Nov 26', revenue: 100, expenses: 20, inflow: 229, outflow: 50 },
]

/* ========================================
   EXPENSE BREAKDOWN DEMO DATA
======================================== */

const expenseBreakdownData = [
  {
    title: 'Cost of Goods Sold',
    percentage: 50,
    amount: 50,
    color: '#315C49',
  },
  {
    title: 'Operating Expenses',
    percentage: 33,
    amount: 33,
    color: '#C49A5A',
  },
  {
    title: 'Other Expenses',
    percentage: 17,
    amount: 17,
    color: '#66745A',
  },
]



/* ========================================
   CHART INFORMATION BUTTON
======================================== */

function ChartInfo({
  text,
}: {
  text: string
}) {
  return (
    <span className="accounting-chart-info">
      <button
        type="button"
        className="accounting-chart-info-button"
        aria-label="Chart information"
        title="Chart information"
      >
        <Info size={17} strokeWidth={2} />
      </button>

      <span className="accounting-chart-tooltip">
        {text}
      </span>
    </span>
  )
}



/* ========================================
   CASH FLOW HEATMAP
======================================== */

function CashFlowChart() {
  const levels = [
    'Very Low',
    'Low',
    'Normal',
    'High',
    'Peak',
  ]

  return (
    <article className="accounting-panel accounting-chart-card accounting-cashflow-card">

      <div className="accounting-chart-header">
        <div>
          <span className="accounting-chart-eyebrow">
            CASH FLOW ANALYTICS
          </span>

          <h2>Cash Flow</h2>

          <p>Cash activity by day and month</p>
        </div>
      </div>

      <ChartInfo text="This heatmap illustrates cash-flow activity across weekdays and months. Darker cells represent higher activity." />

      <div className="accounting-cashflow-grid">

        <div className="accounting-cashflow-months">
          <span />

          {cashFlowMonths.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>

        {cashFlowDays.map((day, dayIndex) => (
          <div
            className="accounting-cashflow-row"
            key={day}
          >
            <span className="accounting-cashflow-day">
              {day}
            </span>

            {cashFlowData[dayIndex].map((level, monthIndex) => (
              <span
                key={`${day}-${monthIndex}`}
                className={`accounting-cashflow-cell level-${level}`}
                title={`${day}, ${cashFlowMonths[monthIndex]}: ${levels[level]} activity`}
              />
            ))}
          </div>
        ))}

      </div>

      <div className="accounting-cashflow-legend">
        <span>Very Low</span>

        {levels.map((level, index) => (
          <i
            key={level}
            className={`level-${index}`}
            title={level}
          />
        ))}

        <span>Peak</span>
      </div>

      <div className="accounting-chart-demo-label">
        Illustrative demo data · Not connected to actual transactions
      </div>

    </article>
  )
}

/* ========================================
   MONTHLY OVERVIEW - HORIZONTAL BARS
======================================== */

function MonthlyOverviewChart() {
  const series = [
    { key: 'revenue', label: 'Revenue', color: '#123C32' },
    { key: 'expenses', label: 'Expenses', color: '#B95D4C' },
    { key: 'inflow', label: 'Inflow', color: '#3D8060' },
    { key: 'outflow', label: 'Outflow', color: '#C49A5A' },
  ] as const

  const maxValue = Math.max(
    100,
    ...monthlyOverviewData.flatMap((item) => [
      item.revenue,
      item.expenses,
      item.inflow,
      item.outflow,
    ])
  )

  return (
    <article className="accounting-panel accounting-chart-card accounting-monthly-card">

      <div className="accounting-secondary-chart-header">
        <div>
          <span className="accounting-chart-eyebrow">
            FINANCIAL SUMMARY
          </span>

          <h2>Monthly Overview</h2>

          <p>Monthly revenue and expense movement</p>
        </div>

        <ChartInfo text="This chart compares monthly revenue, expenses, inflow and outflow. Values are illustrative until connected to actual transactions." />
      </div>

      <div className="accounting-horizontal-chart">

        {monthlyOverviewData.map((month) => (
          <div
            className="accounting-horizontal-month"
            key={month.month}
          >

            <div className="accounting-horizontal-month-label">
              {month.month}
            </div>

            <div className="accounting-horizontal-bars">

              {series.map((item) => {
                const value = month[item.key]

                return (
                  <div
                    className="accounting-horizontal-bar-row"
                    key={item.key}
                  >
                    <div className="accounting-horizontal-track">
                      <div
                        className="accounting-horizontal-bar"
                        style={{
                          width: `${(value / maxValue) * 100}%`,
                          backgroundColor: item.color,
                        }}
                        title={`${item.label}: ${value}`}
                      />
                    </div>

                    <span className="accounting-horizontal-value">
                      {value}
                    </span>
                  </div>
                )
              })}

            </div>
          </div>
        ))}

      </div>

      <div className="accounting-horizontal-legend">
        {series.map((item) => (
          <span key={item.key}>
            <i style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="accounting-chart-demo-label">
        Illustrative demo data · Not connected to actual transactions
      </div>

    </article>
  )
}

/* ========================================
   EXPENSE BREAKDOWN - CIRCULAR CHARTS
======================================== */

function ExpenseBreakdownChart() {
  return (
    <article className="accounting-panel accounting-chart-card accounting-expense-breakdown-card">

      <div className="accounting-secondary-chart-header">
        <div>
          <span className="accounting-chart-eyebrow">
            EXPENSE ANALYTICS
          </span>

          <h2>Expense Breakdown</h2>

          <p>Distribution of total expenses</p>
        </div>

        <ChartInfo text="This chart displays the percentage distribution of expenses across categories. Percentages and amounts are illustrative demo data." />
      </div>

      <div className="accounting-expense-rings">

        {expenseBreakdownData.map((item) => (
          <div
            className="accounting-expense-ring-item"
            key={item.title}
          >

            <div
              className="accounting-expense-ring"
              style={{
                background: `conic-gradient(
                  ${item.color} ${item.percentage}%,
                  #E8E7DE ${item.percentage}% 100%
                )`,
              }}
            >
              <div className="accounting-expense-ring-inner">
                <strong>{item.percentage}%</strong>
              </div>
            </div>

            <h3>{item.title}</h3>

            <p>Expense category</p>

            <div className="accounting-expense-ring-amount">
              <i style={{ backgroundColor: item.color }} />
              <span>SAR {item.amount}</span>
            </div>

          </div>
        ))}

      </div>

      <div className="accounting-chart-demo-label">
        Illustrative demo data · Not connected to actual transactions
      </div>

    </article>
  )
}

/* ========================================
   ACCOUNTING COMPONENT
======================================== */

export default function AccountingLayout({
  activePage,
  onNavigate,
  onLogout,
}: AccountingLayoutProps) {

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)

  /* OPEN / CLOSE MODAL */

  const openEntryModal = () => {
    setIsEntryModalOpen(true)
  }

  const closeEntryModal = () => {
    setIsEntryModalOpen(false)
  }

  /* SAVE ENTRY */

  const handleSaveEntry = (entry: AccountingEntry) => {
    console.log('New Accounting Entry:', entry)

    // Backend integration baad mein yahan add hogi.

    setIsEntryModalOpen(false)
  }

  /* EXPORT PDF */

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <AppLayout
      className="accounting-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="accounting-page-content">

        {/* PAGE HEADING */}

        <header className="accounting-heading">

          <div>
            <span className="accounting-eyebrow">
              FINANCIAL MANAGEMENT
            </span>

            <h1>Accounting</h1>

            <p>
              Track In, Out, and Return transactions
            </p>
          </div>

          <div className="accounting-heading-actions">

            <button
              className="accounting-export-btn"
              type="button"
              onClick={handleExportPDF}
            >
              <FileText size={17} />
              Export PDF
            </button>

            <button
              className="accounting-primary-btn"
              type="button"
              onClick={openEntryModal}
            >
              <Plus size={18} />
              New Entry
            </button>

          </div>

        </header>

        {/* FINANCIAL OVERVIEW */}

        <section className="accounting-panel financial-overview">

          <div className="accounting-section-heading">
            <TrendingUp size={18} />
            <h2>FINANCIAL OVERVIEW</h2>
          </div>

          <div className="financial-stats-grid">

            {financialStats.map((item) => {
              const Icon = item.icon

              return (
                <article
                  className="financial-stat-card"
                  key={item.title}
                >
                  <div className={`financial-stat-icon ${item.color}`}>
                    <Icon size={21} />
                  </div>

                  <span>{item.title}</span>

                  <strong>{item.value}</strong>
                </article>
              )
            })}

          </div>

        </section>

        {/* TRANSACTION SUMMARY */}

        <section className="transaction-summary-grid">

          {transactionStats.map((item) => {
            const Icon = item.icon

            return (
              <article
                className="transaction-summary-card"
                key={item.title}
              >
                <div className={`transaction-summary-icon ${item.color}`}>
                  <Icon size={20} />
                </div>

                <div>
                  <strong>{item.value}</strong>
                  <h3>{item.title}</h3>
                  <p>SAR 0 total</p>
                </div>

              </article>
            )
          })}

        </section>

        {/* FILTERS */}

        <section className="accounting-panel accounting-filters">

          <div className="accounting-section-heading">
            <FileText size={18} />
            <h2>FILTERS</h2>
          </div>

          <div className="accounting-filter-grid">

            <div className="accounting-filter-field">
              <label>SEARCH</label>

              <input
                type="search"
                placeholder="Txn no, customer, company, invoice..."
              />
            </div>

            <div className="accounting-filter-field">
              <label>SORT</label>

              <select defaultValue="recent">
                <option value="recent">Recent first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

          </div>

          <div className="accounting-filter-options">

            <div>
              <label>TRANSACTION MODE</label>

              <div className="accounting-filter-pills">

                {[
                  'All',
                  'Cash',
                  'Card',
                  'Bank Transfer',
                  'Other',
                ].map((mode, index) => (
                  <button
                    type="button"
                    className={index === 0 ? 'active' : ''}
                    key={mode}
                  >
                    {mode}
                  </button>
                ))}

              </div>
            </div>

            <div>
              <label>DATE RANGE (PRESET)</label>

              <div className="accounting-filter-pills">

                {[
                  'All',
                  '7 Days',
                  '30 Days',
                  '3 Months',
                  '6 Months',
                  '1 Year',
                ].map((date, index) => (
                  <button
                    type="button"
                    className={index === 0 ? 'active' : ''}
                    key={date}
                  >
                    {date}
                  </button>
                ))}

              </div>
            </div>

          </div>

          <div className="accounting-custom-dates">

            <div>
              <label>CUSTOM FROM</label>
              <input type="date" />
            </div>

            <div>
              <label>CUSTOM TO</label>
              <input type="date" />
            </div>

          </div>

        </section>

        {/* TRANSACTION LIST */}

        <div className="accounting-entry-count">
          Showing <strong>0</strong> entries
        </div>

        {/* EMPTY STATE */}

        <section className="accounting-empty-state">

          <div className="accounting-empty-icon">
            <Wallet size={25} />
          </div>

          <h2>No entries found</h2>

          <p>Create your first transaction</p>

          <button
            type="button"
            className="accounting-primary-btn"
            onClick={openEntryModal}
          >
            <Plus size={18} />
            Create First Entry
          </button>

        </section>

        {/* ANALYTICS */}

        <section className="accounting-charts-grid">

          <FinancialPerformanceChart />

          <CashFlowChart />

          <MonthlyOverviewChart />

          <ExpenseBreakdownChart />

        </section>

      </div>

      {/* NEW ENTRY MODAL */}

      <NewEntryModal
        isOpen={isEntryModalOpen}
        onClose={closeEntryModal}
        onSave={handleSaveEntry}
      />
      {/* ACCOUNTING FOOTER */}

<footer className="accounting-footer">
  <span>© 2026 Zakhira Management System</span>
  <span>Designed for smarter business management</span>
</footer>
    </AppLayout>
  )
}
