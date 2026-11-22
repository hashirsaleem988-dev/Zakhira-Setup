
import { Package, Info } from 'lucide-react'

/* ========================================
   TYPES
======================================== */

export interface ProductSales {
  id: string
  name: string
  unitsSold: number
  amount?: number
}

interface TopProductsChartProps {
  products: ProductSales[]
}

/* ========================================
   FORMAT CURRENCY
======================================== */

const formatPKR = (value: number) =>
  `PKR ${value.toLocaleString('en-PK')}`

/* ========================================
   TOP 5 PRODUCTS CHART
======================================== */

export default function TopProductsChart({
  products,
}: TopProductsChartProps) {

  const topProducts = [...products]
    .filter((product) => product.unitsSold >= 0)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5)

  const maxUnits = Math.max(
    ...topProducts.map((product) => product.unitsSold),
    1
  )

  return (
    <article className="dashboard-panel lower-panel top-products-chart-panel">

      {/* HEADER */}

      <div className="tp-heading">

        <div>
          <h2>Top 5 Selling Products</h2>
          <p>Products by quantity sold</p>
        </div>

        <span className="tp-info-wrap">
          <button
            type="button"
            className="tp-info-button"
            aria-label="Top selling products information"
          >
            <Info size={18} />
          </button>

          <span className="tp-info-tooltip">
            Displays the five products with the highest quantities sold.

            <span>
              <strong>CALCULATION FORMULA</strong>
              <small>Product Ranking = Total Quantity Sold</small>
            </span>
          </span>
        </span>

      </div>

      {/* PRODUCT LIST */}

      <div className="tp-product-list">

        {topProducts.length > 0 ? (

          topProducts.map((product, index) => {

            const barWidth =
              (product.unitsSold / maxUnits) * 100

            return (
              <div
                className="tp-product-row"
                key={product.id}
              >

                {/* RANK */}

                <span className="tp-product-rank">
                  {index + 1}
                </span>

                {/* PRODUCT DETAILS */}

                <div className="tp-product-details">

                  <strong className="tp-product-name">
                    {product.name}
                  </strong>

                  <div
                    className="tp-product-track"
                    role="progressbar"
                    aria-label={`${product.name} units sold`}
                    aria-valuemin={0}
                    aria-valuemax={maxUnits}
                    aria-valuenow={product.unitsSold}
                  >
                    <span
                      className="tp-product-bar"
                      style={{
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <small>
                    {product.unitsSold.toLocaleString('en-PK')} units sold
                  </small>

                </div>

                {/* PRODUCT AMOUNT */}

                {product.amount !== undefined && (
                  <strong className="tp-product-amount">
                    {formatPKR(product.amount)}
                  </strong>
                )}

              </div>
            )
          })

        ) : (

          <div className="tp-empty">
            <Package size={25} />
            <span>No product sales available</span>
          </div>

        )}

      </div>

    </article>
  )
}
