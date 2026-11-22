
import '../../styles/top-7-products-sold.css'

interface SoldProduct {
  name: string
  sold: number
}

interface Top7ProductsSoldProps {
  products?: SoldProduct[]
}

const demoProducts: SoldProduct[] = [
  { name: 'Laptop', sold: 80 },
  { name: 'Chair', sold: 65 },
  { name: 'Desk', sold: 52 },
  { name: 'Monitor', sold: 42 },
  { name: 'Keyboard', sold: 31 },
  { name: 'Mouse', sold: 24 },
  { name: 'Printer', sold: 15 },
]

const barColors = [
  '#174638',
  '#C49A5A',
  '#315C49',
  '#B18443',
  '#537663',
  '#96703B',
  '#174638',
]

export default function Top7ProductsSold({
  products = demoProducts,
}: Top7ProductsSoldProps) {
  const sortedProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 7)

  const totalSold = sortedProducts.reduce(
    (total, product) => total + product.sold,
    0,
  )

  const maxSold = Math.max(
    ...sortedProducts.map((product) => product.sold),
    1,
  )

  return (
    <section className="top7-products-card">

      {/* HEADER */}

      <header className="top7-products-header">

        <div className="top7-products-heading">
          <span className="top7-products-eyebrow">
            SALES ANALYTICS
          </span>

          <h2>Top 7 Products Sold</h2>

          <p>Best-selling products by quantity</p>
        </div>

        <div className="top7-products-total">
          <span>Total Sold</span>
          <strong>{totalSold}</strong>
        </div>

      </header>

      {/* CHART */}

      {sortedProducts.length > 0 ? (

        <div className="top7-products-chart">

          {sortedProducts.map((product, index) => {

            const percentage = (product.sold / maxSold) * 100

            return (

              <div
                className="top7-product-row"
                key={`${product.name}-${index}`}
              >

                {/* LABEL */}

                <div className="top7-product-label">

                  <span className="top7-product-rank">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="top7-product-title">
                    {product.name}
                  </span>

                </div>

                {/* BAR AREA */}

                <div className="top7-product-bar-area">

                  <div className="top7-product-track">

                    <div
                      className="top7-product-bar"
                      style={{
                        width: `${percentage}%`,
                        background: barColors[index % barColors.length],
                      }}
                    />

                  </div>

                  <span className="top7-product-value">
                    {product.sold}
                  </span>

                </div>

              </div>

            )
          })}

        </div>

      ) : (

        <div className="top7-products-empty">
          <h3>No sales data available</h3>
          <p>Products will appear here when sales are recorded.</p>
        </div>

      )}

      {/* FOOTER */}

      <footer className="top7-products-footer">

        <div className="top7-products-footer-dot" />

        <span>
          Showing top {sortedProducts.length} products by sales quantity
        </span>

      </footer>

    </section>
  )
}
