import '../../../styles/financial-graph-3d.css'
interface MonthData {
  label: string
  revenue: number
  expenses: number
  profit: number
}

const months: MonthData[] = [
  { label: 'Jun', revenue: 290000, expenses: 170000, profit: 130000 },
  { label: 'Jul', revenue: 330000, expenses: 190000, profit: 145000 },
  { label: 'Aug', revenue: 270000, expenses: 160000, profit: 120000 },
  { label: 'Sep', revenue: 390000, expenses: 225000, profit: 185000 },
  { label: 'Oct', revenue: 345000, expenses: 195000, profit: 155000 },
  { label: 'Nov', revenue: 420000, expenses: 245000, profit: 190000 },
]

const maxValue = 500000

export default function FinancialGraph() {
  return (
    <div className="financial-3d-chart">

      {/* Y Axis */}
      <div className="financial-3d-axis">
        {[500, 400, 300, 200, 100, 0].map((value) => (
          <div className="financial-3d-axis-row" key={value}>
            <span>
              {value === 0 ? '0' : `${value}K`}
            </span>
          </div>
        ))}
      </div>

      {/* Graph Plot */}
      <div className="financial-3d-plot">

        {/* Grid Lines */}
        <div className="financial-3d-grid-lines">
          {[500, 400, 300, 200, 100, 0].map((value) => (
            <div
              className="financial-3d-grid-line"
              key={value}
            />
          ))}
        </div>

        {/* Months */}
        <div className="financial-3d-months">
          {months.map((month) => (
            <div
              className="financial-3d-month"
              key={month.label}
            >

              {/* Bars */}
              <div className="financial-3d-bars">

                {/* Revenue */}
                <div
                  className="financial-3d-bar financial-3d-bar--revenue"
                  style={{
                    height: `${(month.revenue / maxValue) * 100}%`,
                  }}
                  title={`Revenue: Rs ${month.revenue.toLocaleString()}`}
                >
                  <span className="financial-3d-top" />
                  <span className="financial-3d-side" />
                </div>

                {/* Expenses */}
                <div
                  className="financial-3d-bar financial-3d-bar--expenses"
                  style={{
                    height: `${(month.expenses / maxValue) * 100}%`,
                  }}
                  title={`Expenses: Rs ${month.expenses.toLocaleString()}`}
                >
                  <span className="financial-3d-top" />
                  <span className="financial-3d-side" />
                </div>

                {/* Profit */}
                <div
                  className="financial-3d-bar financial-3d-bar--profit"
                  style={{
                    height: `${(month.profit / maxValue) * 100}%`,
                  }}
                  title={`Profit: Rs ${month.profit.toLocaleString()}`}
                >
                  <span className="financial-3d-top" />
                  <span className="financial-3d-side" />
                </div>

              </div>

              {/* Month Label */}
              <span className="financial-3d-label">
                {month.label}
              </span>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}