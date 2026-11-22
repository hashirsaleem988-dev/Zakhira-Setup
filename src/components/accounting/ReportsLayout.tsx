
import { useEffect, useMemo, useState } from 'react'

import {
  ChartLine,
  Clock,
  CalendarDays,
  FileText,
  Download,
  Printer,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react'

import AppLayout from '../layout/AppLayout'
import '../../styles/reports.css'

/* ========================================
   TYPES
======================================== */

interface ReportsLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface WeeklyReport {
  startDate: string
  endDate: string
  week: string
  profit: string
  sales: string
  payments: string
  outstanding: string
  purchases: string
}

/* ========================================
   WEEKLY REPORT DATA
======================================== */

const weeklyReports: WeeklyReport[] = [
  {
    startDate: '2026-11-07',
    endDate: '2026-11-13',
    week: '07 Nov 2026 – 13 Nov 2026',
    profit: 'SAR 26,800',
    sales: 'SAR 42,500',
    payments: 'SAR 38,000',
    outstanding: 'SAR 4,500',
    purchases: 'SAR 12,500',
  },
  {
    startDate: '2026-10-31',
    endDate: '2026-11-06',
    week: '31 Oct 2026 – 06 Nov 2026',
    profit: 'SAR 23,400',
    sales: 'SAR 36,800',
    payments: 'SAR 31,200',
    outstanding: 'SAR 5,600',
    purchases: 'SAR 10,800',
  },
  {
    startDate: '2026-10-24',
    endDate: '2026-10-30',
    week: '24 Oct 2026 – 30 Oct 2026',
    profit: 'SAR 29,200',
    sales: 'SAR 47,200',
    payments: 'SAR 44,100',
    outstanding: 'SAR 3,100',
    purchases: 'SAR 14,200',
  },
  {
    startDate: '2026-10-17',
    endDate: '2026-10-23',
    week: '17 Oct 2026 – 23 Oct 2026',
    profit: 'SAR 24,300',
    sales: 'SAR 39,500',
    payments: 'SAR 35,000',
    outstanding: 'SAR 4,500',
    purchases: 'SAR 11,600',
  },
]

/* ========================================
   QUICK PICK OPTIONS
======================================== */

const quickPicks = [
  { label: '1 s', value: '1', unit: 'Seconds' },
  { label: '30 s', value: '30', unit: 'Seconds' },
  { label: '1 m', value: '1', unit: 'Minutes' },
  { label: '1 h', value: '1', unit: 'Hours' },
  { label: '1 d', value: '1', unit: 'Days' },
  { label: '1 w', value: '1', unit: 'Weeks' },
]

/* ========================================
   INTERVAL HELPER
======================================== */

const getIntervalMilliseconds = (
  value: string,
  unit: string
): number => {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount < 1) {
    return 1000
  }

  const multipliers: Record<string, number> = {
    Seconds: 1000,
    Minutes: 60 * 1000,
    Hours: 60 * 60 * 1000,
    Days: 24 * 60 * 60 * 1000,
    Weeks: 7 * 24 * 60 * 60 * 1000,
  }

  return amount * (multipliers[unit] ?? 1000)
}

/* ========================================
   REPORTS COMPONENT
======================================== */

export default function ReportsLayout({
  activePage,
  onNavigate,
  onLogout,
}: ReportsLayoutProps) {

  /* ========================================
     STATES
  ======================================== */

  const [autoGenerate, setAutoGenerate] = useState(false)

  const [intervalValue, setIntervalValue] = useState('1')
  const [unit, setUnit] = useState('Weeks')

  const [quickPick, setQuickPick] = useState('1 w')

  const [weekFrom, setWeekFrom] = useState('')
  const [weekTo, setWeekTo] = useState('')

  const [lastGenerated, setLastGenerated] = useState(
    'Not generated yet'
  )

  /* ========================================
     GENERATE REPORT
  ======================================== */

  const handleGenerate = () => {
    setLastGenerated(new Date().toLocaleTimeString())
  }

  /* ========================================
     AUTO GENERATION
  ======================================== */

  useEffect(() => {
    if (!autoGenerate) return

    const milliseconds = getIntervalMilliseconds(
      intervalValue,
      unit
    )

    const timerId = window.setInterval(() => {
      setLastGenerated(new Date().toLocaleTimeString())
    }, milliseconds)

    return () => {
      window.clearInterval(timerId)
    }

  }, [autoGenerate, intervalValue, unit])

  /* ========================================
     DATE FILTER
  ======================================== */

  const filteredReports = useMemo(() => {

    return weeklyReports.filter((report) => {

      const reportStart = new Date(
        `${report.startDate}T00:00:00`
      )

      const reportEnd = new Date(
        `${report.endDate}T23:59:59`
      )

      const selectedFrom = weekFrom
        ? new Date(`${weekFrom}T00:00:00`)
        : null

      const selectedTo = weekTo
        ? new Date(`${weekTo}T23:59:59`)
        : null

      if (selectedFrom && reportEnd < selectedFrom) {
        return false
      }

      if (selectedTo && reportStart > selectedTo) {
        return false
      }

      return true
    })

  }, [weekFrom, weekTo])

  /* ========================================
     QUICK PICK HANDLER
  ======================================== */

  const handleQuickPick = (
    item: typeof quickPicks[number]
  ) => {
    setQuickPick(item.label)
    setIntervalValue(item.value)
    setUnit(item.unit)
  }

  /* ========================================
     APPLY INTERVAL
  ======================================== */

  const handleApply = () => {
    if (!intervalValue || Number(intervalValue) < 1) {
      return
    }

    setAutoGenerate(true)
  }

  /* ========================================
     PRINT / PDF
  ======================================== */

  const handlePrint = () => {
    window.print()
  }

  /* ========================================
     CLEAR DATE FILTERS
  ======================================== */

  const handleClearFilters = () => {
    setWeekFrom('')
    setWeekTo('')
  }

  /* ========================================
     RENDER
  ======================================== */

  return (
    <AppLayout
      className="accounting-layout reports-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="reports-page-content">

          {/* REPORT HEADER */}

          <section className="reports-hero">

            <div className="reports-hero-icon">
              <ChartLine size={25} />
            </div>

            <div className="reports-hero-info">
              <span>ACCOUNTING / REPORTS</span>

              <h1>Weekly Reports</h1>

              <p>
                Saturday → Friday · View, filter and download weekly summaries
              </p>
            </div>

            <span className="reports-count">
              {filteredReports.length} REPORTS
            </span>

          </section>

          {/* AUTO GENERATE */}

          <section className="reports-panel auto-generate-panel">

            <div className="reports-panel-heading">

              <div className="reports-heading-icon">
                <Clock size={23} />
              </div>

              <div>
                <h2>Auto-Generate Reports</h2>

                <p>
                  Pick an interval to automatically update report generation.
                </p>
              </div>

              <label className="reports-toggle">

                <span>
                  {autoGenerate ? 'Auto ON' : 'Auto OFF'}
                </span>

                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={(event) =>
                    setAutoGenerate(event.target.checked)
                  }
                />

                <span className="reports-toggle-track" />

              </label>

            </div>

            {/* GENERATOR CONTROLS */}

            <div className="reports-generator-controls">

              <div className="reports-interval-field">

                <label htmlFor="report-interval">
                  Every
                </label>

                <input
                  id="report-interval"
                  type="number"
                  min="1"
                  value={intervalValue}
                  onChange={(event) => {
                    setIntervalValue(event.target.value)
                    setQuickPick('')
                  }}
                />

              </div>

              <div className="reports-unit-field">

                <label htmlFor="report-unit">
                  Interval
                </label>

                <select
                  id="report-unit"
                  value={unit}
                  onChange={(event) => {
                    setUnit(event.target.value)
                    setQuickPick('')
                  }}
                >
                  <option>Seconds</option>
                  <option>Minutes</option>
                  <option>Hours</option>
                  <option>Days</option>
                  <option>Weeks</option>
                </select>

              </div>

              <button
                type="button"
                className="reports-apply-btn"
                disabled={
                  !intervalValue ||
                  Number(intervalValue) < 1
                }
                onClick={handleApply}
              >
                Apply
              </button>

              <button
                type="button"
                className="reports-generate-btn"
                onClick={handleGenerate}
              >
                <RefreshCw size={17} />
                Generate Now
              </button>

            </div>

            {/* QUICK PICKS */}

            <div className="reports-quick-picks">

              <span>Quick pick</span>

              {quickPicks.map((item) => (

                <button
                  type="button"
                  key={item.label}
                  className={
                    quickPick === item.label ? 'active' : ''
                  }
                  onClick={() => handleQuickPick(item)}
                >
                  {item.label}
                </button>

              ))}

            </div>

            {/* AUTO SAVE INFORMATION */}

            <div className="reports-auto-save">
              <CheckCircle2 size={17} />
              PDF can be saved through the print dialog
            </div>

            {/* PROGRESS */}

            <div className="reports-progress-track">
              <span
                className={autoGenerate ? 'running' : ''}
              />
            </div>

            {/* GENERATOR FOOTER */}

            <div className="reports-generator-footer">

              <span>
                Last generated:{' '}
                <strong>{lastGenerated}</strong>
              </span>

              <span>
                {autoGenerate
                  ? `Auto-generation is on · Every ${intervalValue} ${unit}`
                  : 'Auto-generation is off'}
              </span>

            </div>

          </section>

          {/* SUMMARY CARDS */}

          <section className="reports-summary-grid">

            <article className="reports-summary-card">
              <span>
                <i className="summary-dot mustard" />
                REPORTS
              </span>

              <strong>{filteredReports.length}</strong>
            </article>

            <article className="reports-summary-card">
              <span>
                <i className="summary-dot mustard" />
                TOTAL SALES
              </span>

              <strong>SAR 165,600</strong>
            </article>

            <article className="reports-summary-card">
              <span>
                <i className="summary-dot olive" />
                TOTAL PAYMENTS RECEIVED
              </span>

              <strong>SAR 146,100</strong>
            </article>

            <article className="reports-summary-card">
              <span>
                <i className="summary-dot forest" />
                NET PROFIT
              </span>

              <strong>SAR 103,700</strong>
            </article>

          </section>

          {/* DATE FILTER */}

          <section className="reports-date-filter">

            <div>

              <label htmlFor="week-from">
                Week From
              </label>

              <div className="reports-date-input">
                <CalendarDays size={18} />

                <input
                  id="week-from"
                  type="date"
                  value={weekFrom}
                  max={weekTo || undefined}
                  onChange={(event) =>
                    setWeekFrom(event.target.value)
                  }
                />
              </div>

            </div>

            <div>

              <label htmlFor="week-to">
                Week To
              </label>

              <div className="reports-date-input">
                <CalendarDays size={18} />

                <input
                  id="week-to"
                  type="date"
                  value={weekTo}
                  min={weekFrom || undefined}
                  onChange={(event) =>
                    setWeekTo(event.target.value)
                  }
                />
              </div>

            </div>

            <span className="reports-result-count">
              {filteredReports.length} / {weeklyReports.length}
            </span>

          </section>

          {/* WEEKLY REPORT CARDS */}

          <section className="weekly-reports-grid">

            {filteredReports.length > 0 ? (

              filteredReports.map((report) => (

                <article
                  className="weekly-report-card"
                  key={report.week}
                >

                  {/* REPORT HEADING */}

                  <div className="weekly-report-heading">

                    <div>
                      <span className="weekly-report-label">
                        WEEK <small>SAMPLE</small>
                      </span>

                      <h2>{report.week}</h2>
                    </div>

                    <span className="weekly-report-file-icon">
                      <FileText size={19} />
                    </span>

                  </div>

                  {/* NET PROFIT */}

                  <div className="weekly-profit">
                    <span>Net Profit</span>
                    <strong>{report.profit}</strong>
                  </div>

                  {/* REPORT METRICS */}

                  <div className="weekly-report-metrics">

                    <div>
                      <span>Total Sales</span>
                      <strong>{report.sales}</strong>
                    </div>

                    <div>
                      <span>Total Payments Received</span>
                      <strong>{report.payments}</strong>
                    </div>

                    <div>
                      <span>Outstanding Balances</span>
                      <strong>{report.outstanding}</strong>
                    </div>

                    <div>
                      <span>Total Purchases</span>
                      <strong>{report.purchases}</strong>
                    </div>

                  </div>

                  {/* REPORT FOOTER */}

                  <div className="weekly-report-footer">

                    <span>
                      Generated {lastGenerated}
                    </span>

                    <div>

                      <button
                        type="button"
                        className="report-print-btn"
                        aria-label="Print report"
                        onClick={handlePrint}
                      >
                        <Printer size={17} />
                      </button>

                      <button
                        type="button"
                        className="report-download-btn"
                        onClick={handlePrint}
                      >
                        <Download size={16} />
                        Download PDF
                      </button>

                    </div>

                  </div>

                </article>

              ))

            ) : (

              <div className="reports-empty-state">

                <FileText size={30} />

                <h2>No reports found</h2>

                <p>
                  No weekly reports match the selected date range.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>

              </div>

            )}

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
