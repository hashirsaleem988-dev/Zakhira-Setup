
import '../../styles/category-product-graph.css'

interface CategoryProduct {
  name: string
  count: number
  percentage?: number
}

interface CategoryProductGraphProps {
  categories?: CategoryProduct[]
}

const categoryColors = [
  '#174638',
  '#C49A5A',
  '#315C49',
  '#B18443',
  '#537663',
  '#96703B',
]

/* TEMPORARY DEMO DATA */

const demoCategories: CategoryProduct[] = [
  { name: 'Tech', count: 80 },
  { name: 'Furniture', count: 20 },
]

export default function CategoryProductGraph({
  categories = [],
}: CategoryProductGraphProps) {

  const activeCategories =
    categories.length > 0 ? categories : demoCategories

  const totalProducts = activeCategories.reduce(
    (total, category) => total + category.count,
    0,
  )

  const displayCategories = activeCategories.map((category, index) => {
    const percentage =
      totalProducts > 0
        ? Math.round((category.count / totalProducts) * 100)
        : 0

    return {
      ...category,
      percentage,
      color: categoryColors[index % categoryColors.length],
    }
  })

  return (
    <section className="category-product-card">

      {/* HEADER */}

      <div className="category-product-heading">

        <div>
          <span className="category-product-eyebrow">
            INVENTORY ANALYTICS
          </span>

          <h2>Category / Product</h2>

          <p>Product distribution across categories</p>
        </div>

        <div className="category-product-total">
          <span>Total Categories</span>
          <strong>{activeCategories.length}</strong>
        </div>

      </div>

      {/* CATEGORY DONUTS */}

      <div className="category-progress-grid">

        {displayCategories.map((category, index) => {

          const radius = 46
          const circumference = 2 * Math.PI * radius
          const progress =
            (category.percentage / 100) * circumference

          return (

            <article
              className="category-progress-item"
              key={`${category.name}-${index}`}
            >

              {/* DONUT */}

              <div className="category-progress-ring">

                <svg
                  viewBox="0 0 120 120"
                  className="category-progress-svg"
                >

                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#E6E6E0"
                    strokeWidth="9"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={category.color}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                    transform="rotate(-90 60 60)"
                    className="category-progress-circle"
                  />

                </svg>

                <div className="category-progress-center">

                  <strong style={{ color: category.color }}>
                    {category.percentage}
                  </strong>

                  <span>%</span>

                </div>

              </div>

              {/* CATEGORY DETAILS */}

              <div className="category-progress-info">

                <h3>{category.name}</h3>

                <p>
                  {category.count} products
                </p>

              </div>

              {/* LEGEND */}

              <div className="category-progress-legend">

                <div className="category-legend-item">

                  <span
                    className="category-legend-dot"
                    style={{ background: category.color }}
                  />

                  <span>
                    {category.count} Products
                  </span>

                </div>

                <div className="category-legend-item">

                  <span className="category-legend-dot category-legend-muted" />

                  <span>
                    {Math.max(totalProducts - category.count, 0)} Other
                  </span>

                </div>

              </div>

            </article>

          )
        })}

      </div>

    </section>
  )
}
