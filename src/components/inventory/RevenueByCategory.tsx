
import '../../styles/revenue-by-category.css'

interface RevenueCategory {
  name: string
  revenue: number
}

interface RevenueByCategoryProps {
  categories?: RevenueCategory[]
}

const demoData: RevenueCategory[] = [
  { name: 'Tech', revenue: 82000 },
  { name: 'Furniture', revenue: 54000 },
  { name: 'Electronics', revenue: 38000 },
  { name: 'Accessories', revenue: 24000 },
  { name: 'Office', revenue: 16000 },
]

const formatRevenue = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

export default function RevenueByCategory({
  categories = demoData,
}: RevenueByCategoryProps) {
  const sortedCategories = [...categories].sort(
    (a, b) => b.revenue - a.revenue,
  )

  const totalRevenue = sortedCategories.reduce(
    (sum, item) => sum + item.revenue,
    0,
  )

  const maxRevenue = Math.max(
    ...sortedCategories.map((item) => item.revenue),
    1,
  )

  const colors = ['green', 'gold', 'green', 'gold', 'green']

  return (
    <section className="revenue-category-card">

      {/* HEADER */}

      <div className="revenue-category-header">

        <div>
          <span className="revenue-category-eyebrow">
            SALES ANALYTICS
          </span>

          <h2>Revenue by Category</h2>

          <p>Revenue contribution across categories</p>
        </div>

        <div className="revenue-category-total">
          <span>Total Revenue</span>
          <strong>{formatRevenue(totalRevenue)}</strong>
        </div>

      </div>

      {/* GRAPH */}

      {sortedCategories.length > 0 ? (

        <div className="revenue-category-chart">

          {sortedCategories.map((category, index) => {

            const percentage =
              totalRevenue > 0
                ? (category.revenue / totalRevenue) * 100
                : 0

            const width =
              (category.revenue / maxRevenue) * 100

            const color = colors[index % colors.length]

            return (

              <div
                className="revenue-category-row"
                key={category.name}
              >

                {/* LABEL */}

                <div className="revenue-category-label">

                  <span className="revenue-category-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="revenue-category-name">
                    {category.name}
                  </span>

                </div>

                {/* BAR */}

                <div className="revenue-category-bar-area">

                  <div className="revenue-category-track">

                    <div
                      className={`revenue-category-bar ${color}`}
                      style={{ width: `${width}%` }}
                    >

                      <div className="revenue-category-bar-face" />

                      <div className="revenue-category-bar-side" />

                    </div>

                  </div>

                </div>

                {/* VALUE */}

                <div className="revenue-category-value">

                  <strong>
                    {formatRevenue(category.revenue)}
                  </strong>

                  <span>
                    {percentage.toFixed(1)}%
                  </span>

                </div>

              </div>

            )
          })}

        </div>

      ) : (

        <div className="revenue-category-empty">
          <h3>No revenue data available</h3>
          <p>Revenue data will appear here when available.</p>
        </div>

      )}

      {/* FOOTER */}

      {sortedCategories.length > 0 && (

        <div className="revenue-category-footer">

          <div className="revenue-category-legend">
            <span className="revenue-category-legend-dot green" />
            <span>Primary categories</span>
          </div>

          <div className="revenue-category-legend">
            <span className="revenue-category-legend-dot gold" />
            <span>Alternate categories</span>
          </div>

        </div>

      )}

    </section>
  )
}
