
import { useEffect, useRef, useState, type ElementType } from 'react'
import { createPortal } from 'react-dom'

import {
  TrendingUp,
  CreditCard,
  Package,
  Truck,
  ChartNoAxesCombined,
  Info,
} from 'lucide-react'

type StatCardProps = {
  title: string
  value: string
  icon: ElementType
  iconStyle: string
  trendLabel: string
  purpose: string
  formula: string
}

const stats: StatCardProps[] = [
  {
    title: 'TOTAL SALES',
    value: '0',
    icon: ChartNoAxesCombined,
    iconStyle: 'sales-icon',
    trendLabel: 'Sales overview',
    purpose:
      'Displays sales revenue from approved documents after deducting tax and returns.',
    formula:
      '(Approved Document Grand Total − Tax Total) − Total Returns',
  },
  {
    title: 'NET PROFIT',
    value: '0',
    icon: TrendingUp,
    iconStyle: 'profit-icon',
    trendLabel: 'Profit overview',
    purpose:
      'Displays the remaining profit after deducting cost of goods sold and other expenses.',
    formula:
      'Total Revenue − Cost of Goods Sold (COGS) − Other Expenses',
  },
  {
    title: 'RECEIVED AMOUNT',
    value: '0',
    icon: CreditCard,
    iconStyle: 'received-icon',
    trendLabel: 'Payments received',
    purpose:
      'Displays the total payment amounts recorded against approved documents.',
    formula:
      'Sum of payment_amount from Approved Documents',
  },
  {
    title: 'INVENTORY VALUE',
    value: '0',
    icon: Package,
    iconStyle: 'inventory-icon',
    trendLabel: 'Current stock value',
    purpose:
      'Displays the total cost value of stock held in active products.',
    formula:
      'Available Stock Quantity × Product Cost Price',
  },
  {
    title: 'SUPPLIER PAYABLES',
    value: '0',
    icon: Truck,
    iconStyle: 'payable-icon',
    trendLabel: 'Pending payments',
    purpose:
      'Displays the outstanding amount still payable against purchase orders.',
    formula:
      'Sum of balance_due from Purchase Orders',
  },
]

/* =========================================
   FLOATING INFORMATION TOOLTIP
========================================= */

type StatInfoProps = {
  title: string
  purpose: string
  formula: string
}

function StatInfo({ title, purpose, formula }: StatInfoProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isOpen, setIsOpen] = useState(false)

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    placement: 'above' as 'above' | 'below',
  })

  // Cancel pending close timer
  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  // Open tooltip
  const openPopup = () => {
    cancelClose()
    setIsOpen(true)
  }

  // Close tooltip with a small delay
  const scheduleClose = () => {
    cancelClose()

    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false)
      closeTimerRef.current = null
    }, 180)
  }

  // Calculate popup position
  useEffect(() => {
    if (!isOpen) return

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect()

      if (!rect) return

      const popupWidth = Math.min(300, window.innerWidth - 24)

      const centerX = rect.left + rect.width / 2

      const left = Math.min(
        Math.max(centerX, popupWidth / 2 + 12),
        window.innerWidth - popupWidth / 2 - 12
      )

      const placement = rect.top > 190 ? 'above' : 'below'

      setPosition({
        left,
        top: placement === 'above' ? rect.top - 12 : rect.bottom + 12,
        placement,
      })
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen])

  // Clear timer when component unmounts
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* INFO ICON */}

      <div className="stat-info-wrap">
        <button
          ref={buttonRef}
          type="button"
          className="stat-info-btn"
          aria-label={`Show calculation information for ${title}`}
          aria-expanded={isOpen}
          onMouseEnter={openPopup}
          onMouseLeave={scheduleClose}
          onFocus={openPopup}
          onBlur={scheduleClose}
        >
          <Info size={15} strokeWidth={2} />
        </button>
      </div>

      {/* FLOATING POPUP */}

      {isOpen &&
        createPortal(
          <div
            className={`stat-info-popup ${position.placement}`}
            style={{
              position: 'fixed',
              left: position.left,
              top: position.top,
              transform:
                position.placement === 'above'
                  ? 'translate(-50%, -100%)'
                  : 'translate(-50%, 0)',
            }}
            role="tooltip"
            onMouseEnter={openPopup}
            onMouseLeave={scheduleClose}
          >
            {/* POPUP HEADER */}

            <div className="stat-info-popup-header">
              <span className="stat-info-popup-icon">
                <Info size={15} />
              </span>

              <div>
                <span className="stat-info-popup-label">
                  KPI EXPLANATION
                </span>

                <h4>{title}</h4>
              </div>
            </div>

            {/* KPI PURPOSE */}

            <p className="stat-info-purpose">
              {purpose}
            </p>

            {/* CALCULATION FORMULA */}

            <div className="stat-formula">
              <span>CALCULATION FORMULA</span>

              <p>{formula}</p>
            </div>

            {/* POPUP ARROW */}

            <span className="stat-info-popup-arrow" />
          </div>,
          document.body
        )}
    </>
  )
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  title,
  value,
  icon: Icon,
  iconStyle,
  trendLabel,
  purpose,
  formula,
}: StatCardProps) {
  return (
    <article className="stat-card">

      {/* KPI HEADER */}

      <div className="stat-card-top">

        <div className={`stat-card-icon ${iconStyle}`}>
          <Icon size={22} strokeWidth={1.8} />
        </div>

        <div className="stat-card-content">
          <p className="stat-card-title">{title}</p>

          <h3 className="stat-card-value">{value}</h3>
        </div>

        {/* INFO COMPONENT */}

        <StatInfo
          title={title}
          purpose={purpose}
          formula={formula}
        />

      </div>

      {/* KPI DESCRIPTION */}

      <div className="stat-card-footer">
        <span className="stat-card-description">
          {trendLabel}
        </span>
      </div>

    </article>
  )
}

/* =========================================
   STAT CARDS GRID
========================================= */

export default function StatCards() {
  return (
    <section
      className="stats-grid"
      aria-label="Business overview"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          {...stat}
        />
      ))}
    </section>
  )
}
