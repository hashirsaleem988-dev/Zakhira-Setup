
import '../../styles/inventory-value-by-category.css'

interface InventoryCategoryValue {
  name: string
  value: number
}

interface InventoryValueByCategoryProps {
  categories?: InventoryCategoryValue[]
}

const demoData: InventoryCategoryValue[] = [
  { name: 'Tech', value: 82000 },
  { name: 'Furniture', value: 54000 },
  { name: 'Electronics', value: 38000 },
  { name: 'Accessories', value: 24000 },
  { name: 'Office', value: 16000 },
]

const formatValue = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

export default function InventoryValueByCategory({
  categories = demoData,
}: InventoryValueByCategoryProps) {
  const sortedCategories = [...categories].sort(
    (a, b) => b.value - a.value,
  )

  const maxValue = Math.max(
    ...sortedCategories.map((item) => item.value),
    1,
  )

  const barWidth = 48
  const barDepth = 12
  const gap = 38
  const chartLeft = 48
  const chartBottom = 270
  const chartHeight = 185

  const chartWidth =
    chartLeft +
    sortedCategories.length * (barWidth + gap) +
    30

  return (
    <section className="inventory-value-card">

      {/* HEADER */}

      <div className="inventory-value-header">

        <div className="inventory-value-heading">

          <span className="inventory-value-eyebrow">
            INVENTORY ANALYTICS
          </span>

          <h2>Inventory Value</h2>

          <p>Value distribution across categories</p>

        </div>

        <div className="inventory-value-total">

          <span>Total Value</span>

          <strong>
            {formatValue(
              sortedCategories.reduce(
                (sum, item) => sum + item.value,
                0,
              ),
            )}
          </strong>

        </div>

      </div>

      {/* GRAPH */}

      {sortedCategories.length > 0 ? (

        <div className="inventory-value-chart-scroll">

          <svg
            className="inventory-value-svg"
            viewBox={`0 0 ${chartWidth} 350`}
            preserveAspectRatio="xMinYMin meet"
          >

            <defs>

              {/* GREEN FRONT */}

              <linearGradient
                id="valueGreenFront"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#315C49" />
                <stop offset="45%" stopColor="#174638" />
                <stop offset="100%" stopColor="#10382D" />
              </linearGradient>

              {/* GOLD FRONT */}

              <linearGradient
                id="valueGoldFront"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#DAB982" />
                <stop offset="45%" stopColor="#C49A5A" />
                <stop offset="100%" stopColor="#96703B" />
              </linearGradient>

              {/* TOP */}

              <linearGradient
                id="valueTop"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#E8D3A7" />
                <stop offset="100%" stopColor="#B58C50" />
              </linearGradient>

              {/* SIDE */}

              <linearGradient
                id="valueSide"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#10382D" />
                <stop offset="100%" stopColor="#09271F" />
              </linearGradient>

              {/* GOLD SIDE */}

              <linearGradient
                id="valueGoldSide"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#96703B" />
                <stop offset="100%" stopColor="#705329" />
              </linearGradient>

              {/* SHADOW */}

              <filter
                id="valueColumnShadow"
                x="-50%"
                y="-20%"
                width="200%"
                height="180%"
              >
                <feGaussianBlur stdDeviation="4" />
              </filter>

            </defs>

            {/* BASELINE */}

            <line
              x1={chartLeft - 10}
              y1={chartBottom}
              x2={chartWidth - 15}
              y2={chartBottom}
              stroke="#B6BDAE"
              strokeWidth="1.5"
            />

            {/* GRID LINES */}

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {

              const y = chartBottom - chartHeight * ratio

              return (
                <g key={ratio}>

                  <line
                    x1={chartLeft - 10}
                    y1={y}
                    x2={chartWidth - 15}
                    y2={y}
                    stroke="#D8D9D0"
                    strokeWidth="1"
                    strokeDasharray="4 5"
                  />

                </g>
              )
            })}

            {/* 3D COLUMNS */}

            {sortedCategories.map((category, index) => {

              const x =
                chartLeft +
                index * (barWidth + gap)

              const height =
                (category.value / maxValue) *
                chartHeight

              const y = chartBottom - height

              const isGold = index === 1

              const frontFill = isGold
                ? 'url(#valueGoldFront)'
                : 'url(#valueGreenFront)'

              const sideFill = isGold
                ? 'url(#valueGoldSide)'
                : 'url(#valueSide)'

              return (

                <g
                  key={`${category.name}-${index}`}
                  className="inventory-value-column"
                >

                  {/* GROUND SHADOW */}

                  <ellipse
                    cx={x + barWidth / 2 + barDepth}
                    cy={chartBottom + 9}
                    rx={barWidth + 5}
                    ry="7"
                    fill="#173E31"
                    opacity="0.12"
                    filter="url(#valueColumnShadow)"
                  />

                  {/* SIDE FACE */}

                  <polygon
                    points={`
                      ${x + barWidth},${y}
                      ${x + barWidth + barDepth},${y - barDepth}
                      ${x + barWidth + barDepth},${chartBottom - barDepth}
                      ${x + barWidth},${chartBottom}
                    `}
                    fill={sideFill}
                  />

                  {/* TOP FACE */}

                  <polygon
                    points={`
                      ${x},${y}
                      ${x + barDepth},${y - barDepth}
                      ${x + barWidth + barDepth},${y - barDepth}
                      ${x + barWidth},${y}
                    `}
                    fill="url(#valueTop)"
                    opacity={isGold ? '0.95' : '0.7'}
                  />

                  {/* FRONT FACE */}

                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    rx="1"
                    fill={frontFill}
                    className="inventory-value-front"
                  />

                  {/* EDGE HIGHLIGHT */}

                  <line
                    x1={x + 2}
                    y1={y + 3}
                    x2={x + 2}
                    y2={chartBottom - 3}
                    stroke="#FFFFFF"
                    strokeOpacity="0.22"
                    strokeWidth="1.5"
                  />

                  {/* VALUE LABEL */}

                  <text
                    x={x + barWidth / 2 + barDepth / 2}
                    y={y - barDepth - 15}
                    textAnchor="middle"
                    className="inventory-value-number"
                  >
                    {formatValue(category.value)}
                  </text>

                  {/* CATEGORY LABEL */}

                  <text
                    x={x + barWidth / 2 + barDepth / 2}
                    y={chartBottom + 38}
                    textAnchor="middle"
                    className="inventory-value-category-label"
                  >
                    {category.name.length > 12
                      ? `${category.name.slice(0, 11)}…`
                      : category.name}
                  </text>

                </g>

              )
            })}

          </svg>

        </div>

      ) : (

        <div className="inventory-value-empty">

          <h3>No category values available</h3>

          <p>
            Add inventory products to view category-wise inventory value.
          </p>

        </div>

      )}

      {/* LEGEND */}

      {sortedCategories.length > 0 && (

        <div className="inventory-value-legend">

          <span className="inventory-value-legend-item">

            <i className="inventory-value-legend-green" />

            Highest value

          </span>

          <span className="inventory-value-legend-item">

            <i className="inventory-value-legend-gold" />

            Highlighted category

          </span>

        </div>

      )}

    </section>
  )
}
