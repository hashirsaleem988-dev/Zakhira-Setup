
import { Info } from 'lucide-react'

import '../../../styles/financial-performance-chart.css'

/* ========================================
   FINANCIAL PERFORMANCE DEMO DATA
======================================== */

const financialChartData = [
  { month: 'Jun', revenue: 280000, expenses: 155000, profit: 125000 },
  { month: 'Jul', revenue: 320000, expenses: 185000, profit: 135000 },
  { month: 'Aug', revenue: 260000, expenses: 150000, profit: 110000 },
  { month: 'Sep', revenue: 380000, expenses: 210000, profit: 170000 },
  { month: 'Oct', revenue: 340000, expenses: 190000, profit: 150000 },
  { month: 'Nov', revenue: 420000, expenses: 240000, profit: 180000 },
]

const formatSAR = (value: number) =>
  `SAR ${value.toLocaleString('en-US')}`

/* ========================================
   CHART INFORMATION
======================================== */

function ChartInfo({ text }: { text: string }) {
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
   FINANCIAL PERFORMANCE CHART
======================================== */

export default function FinancialPerformanceChart() {
  const maxValue = 500000

  const gridValues = [
    500000,
    400000,
    300000,
    200000,
    100000,
    0,
  ]

  return (
    <article className="accounting-panel accounting-chart-card accounting-performance-card">

      <div className="accounting-chart-header">
        <div>
          <span className="accounting-chart-eyebrow">
            FINANCIAL ANALYTICS
          </span>

          <h2>Revenue vs Expenses vs Profit</h2>

          <p>Track your financial performance</p>
        </div>
      </div>

      <ChartInfo
        text="This chart compares monthly revenue, expenses and profit. Profit is calculated as revenue minus expenses."
      />

      <div className="accounting-chart-legend">
        <span>
          <i className="revenue-dot" />
          Revenue
        </span>

        <span>
          <i className="expenses-dot" />
          Expenses
        </span>

        <span>
          <i className="profit-dot" />
          Profit
        </span>
      </div>

      <div className="accounting-performance-chart">

        <div className="accounting-chart-y-axis">
          {gridValues.map((value) => (
            <span key={value}>
              {value === 0 ? '0' : `${value / 1000}K`}
            </span>
          ))}
        </div>

        <div className="accounting-performance-plot">

          <div className="accounting-chart-grid-lines">
            {gridValues.map((value) => (
              <span key={value} />
            ))}
          </div>

          <div className="accounting-month-groups">
            {financialChartData.map((item) => (
              <div
                className="accounting-month-group"
                key={item.month}
              >
                <div className="accounting-month-bars">

                  <div
                    className="accounting-financial-bar revenue-bar"
                    style={{
                      height: `${(item.revenue / maxValue) * 100}%`,
                    }}
                    title={`Revenue: ${formatSAR(item.revenue)}`}
                  />

                  <div
                    className="accounting-financial-bar expenses-bar"
                    style={{
                      height: `${(item.expenses / maxValue) * 100}%`,
                    }}
                    title={`Expenses: ${formatSAR(item.expenses)}`}
                  />

                  <div
                    className="accounting-financial-bar profit-bar"
                    style={{
                      height: `${(item.profit / maxValue) * 100}%`,
                    }}
                    title={`Profit: ${formatSAR(item.profit)}`}
                  />

                </div>

                <span className="accounting-month-label">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="accounting-chart-demo-label">
        Illustrative demo data · Not connected to actual transactions
      </div>

    </article>
  )
}
