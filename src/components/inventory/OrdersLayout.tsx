import { useMemo, useState, type FormEvent } from 'react'

import {
  Wallet,
  Clock,
  ShoppingCart,
  Truck,
  SlidersHorizontal,
  Search,
  Eye,
  Printer,
  MessageCircle,
  X,
  Package,
  CalendarDays,
  CreditCard,
} from 'lucide-react'

import AppLayout from '../layout/AppLayout'
import '../../styles/orders.css'

interface OrdersLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface Order {
  id: string
  date: string
  vendor: string
  vendorCode: string
  product: string
  quantity: string
  amount: number
  paidAmount: number
  payment: 'Paid' | 'Partial' | 'Unpaid'
  status: 'Received' | 'Pending' | 'Cancelled'
}

const sampleOrders: Order[] = [
  {
    id: 'ORD-0001',
    date: '2026-11-18',
    vendor: 'nes',
    vendorCode: 'VND-0001',
    product: 'laptop',
    quantity: '1 Piece',
    amount: 50,
    paidAmount: 50,
    payment: 'Paid',
    status: 'Received',
  },
]

const getLocalDate = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000)
    .toISOString()
    .split('T')[0]
}

export default function OrdersLayout({
  activePage,
  onNavigate,
  onLogout,
}: OrdersLayoutProps) {
  const [showPlaceOrder, setShowPlaceOrder] = useState(false)

  // ORDERS
  const [orders, setOrders] = useState<Order[]>(sampleOrders)

  // FILTERS
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [paymentFilter, setPaymentFilter] = useState('All Payments')
  const [vendorFilter, setVendorFilter] = useState('All Vendors')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // ORDER FORM
  const [newVendor, setNewVendor] = useState('')
  const [newVendorCode, setNewVendorCode] = useState('')
  const [newProduct, setNewProduct] = useState('')
  const [newQuantity, setNewQuantity] = useState('1')
  const [newUnit, setNewUnit] = useState('Piece')
  const [newAmount, setNewAmount] = useState('')
  const [newPaidAmount, setNewPaidAmount] = useState('')
  const [newDate, setNewDate] = useState(getLocalDate())
  const [newStatus, setNewStatus] =
    useState<Order['status']>('Pending')

  // ORDER NUMBER
  const nextOrderNumber = useMemo(() => {
    const highestNumber = orders.reduce((max, order) => {
      const number = Number(order.id.replace('ORD-', ''))
      return Number.isFinite(number) ? Math.max(max, number) : max
    }, 0)

    return `ORD-${String(highestNumber + 1).padStart(4, '0')}`
  }, [orders])

  // PAYMENT CALCULATIONS
  const orderTotal = Number(newAmount) || 0
  const amountPaid = Number(newPaidAmount) || 0
  const balanceDue = Math.max(orderTotal - amountPaid, 0)

  const calculatedPayment: Order['payment'] =
    orderTotal <= 0 || amountPaid <= 0
      ? 'Unpaid'
      : amountPaid >= orderTotal
        ? 'Paid'
        : 'Partial'

  // FILTER ORDERS
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        `${order.id} ${order.vendor} ${order.product} ${order.vendorCode}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const statusMatch =
        statusFilter === 'All Statuses' ||
        order.status === statusFilter

      const paymentMatch =
        paymentFilter === 'All Payments' ||
        order.payment === paymentFilter

      const vendorMatch =
        vendorFilter === 'All Vendors' ||
        order.vendor === vendorFilter

      const dateFromMatch =
        !dateFrom || order.date >= dateFrom

      const dateToMatch =
        !dateTo || order.date <= dateTo

      return (
        searchMatch &&
        statusMatch &&
        paymentMatch &&
        vendorMatch &&
        dateFromMatch &&
        dateToMatch
      )
    })
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    vendorFilter,
    dateFrom,
    dateTo,
  ])

  // RESET FILTERS
  const resetFilters = () => {
    setSearch('')
    setStatusFilter('All Statuses')
    setPaymentFilter('All Payments')
    setVendorFilter('All Vendors')
    setDateFrom('')
    setDateTo('')
  }

  // RESET FORM
  const resetOrderForm = () => {
    setNewVendor('')
    setNewVendorCode('')
    setNewProduct('')
    setNewQuantity('1')
    setNewUnit('Piece')
    setNewAmount('')
    setNewPaidAmount('')
    setNewDate(getLocalDate())
    setNewStatus('Pending')
  }

  // OPEN FORM
  const openOrderForm = () => {
    resetOrderForm()
    setShowPlaceOrder(true)
  }

  // SUBMIT ORDER
  const handlePlaceOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !newVendor.trim() ||
      !newProduct.trim() ||
      !newAmount ||
      Number(newAmount) <= 0 ||
      Number(newQuantity) <= 0 ||
      amountPaid < 0 ||
      amountPaid > orderTotal
    ) {
      return
    }

    const nextOrder: Order = {
      id: nextOrderNumber,
      date: newDate,
      vendor: newVendor.trim(),
      vendorCode: newVendorCode.trim() || 'VND-0000',
      product: newProduct.trim(),
      quantity: `${newQuantity} ${newUnit}`,
      amount: orderTotal,
      paidAmount: amountPaid,
      payment: calculatedPayment,
      status: newStatus,
    }

    setOrders((prev) => [nextOrder, ...prev])

    resetOrderForm()
    setShowPlaceOrder(false)
  }

  // SUMMARY
  const monthlyPurchases = orders.filter(
    (order) => order.status === 'Received'
  ).length

  const pendingOrders = orders.filter(
    (order) => order.status === 'Pending'
  ).length

  const supplierPayable = orders.reduce(
    (total, order) => total + Math.max(order.amount - order.paidAmount, 0),
    0
  )

  const totalVendors = new Set(
    orders.map((order) => order.vendor)
  ).size

  return (
    <AppLayout
      className="inventory-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="orders-page">

        {/* PAGE HEADER */}

        <header className="orders-heading">
          <div>
            <span className="orders-eyebrow">
              INVENTORY MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Manage purchases, vendors and order payments
            </p>
          </div>
        </header>

        {/* SUMMARY CARDS */}

        <section className="orders-summary-grid">

          <article className="orders-summary-card">
            <div className="orders-summary-icon forest">
              <Wallet size={19} />
            </div>

            <div className="orders-summary-content">
              <h3>{monthlyPurchases}</h3>
              <span>MONTHLY PURCHASES</span>
              <p>Received this month</p>
            </div>
          </article>

          <article className="orders-summary-card">
            <div className="orders-summary-icon brass">
              <Clock size={19} />
            </div>

            <div className="orders-summary-content">
              <h3>{pendingOrders}</h3>
              <span>PENDING ORDERS</span>
              <p>Awaiting processing</p>
            </div>
          </article>

          <article className="orders-summary-card">
            <div className="orders-summary-icon charcoal">
              <ShoppingCart size={19} />
            </div>

            <div className="orders-summary-content">
              <h3>
                PKR {supplierPayable.toLocaleString()}
              </h3>
              <span>SUPPLIER PAYABLE</span>
              <p>Outstanding balance</p>
            </div>
          </article>

          <article className="orders-summary-card">
            <div className="orders-summary-icon forest">
              <Truck size={19} />
            </div>

            <div className="orders-summary-content">
              <h3>{totalVendors}</h3>
              <span>TOTAL VENDORS</span>
              <p>Active vendors</p>
            </div>
          </article>

        </section>

        {/* ACTION */}

        <div className="orders-main-actions">

          <button
            type="button"
            className="orders-place-button"
            onClick={openOrderForm}
          >
            <ShoppingCart size={18} />
            Place Order
          </button>

        </div>

        {/* FILTER PANEL */}

        <section className="orders-filter-panel">

          <div className="orders-filter-heading">

            <span className="orders-filter-icon">
              <SlidersHorizontal size={19} />
            </span>

            <h3>FILTERS</h3>

            <button
              type="button"
              className="orders-reset-button"
              onClick={resetFilters}
            >
              Reset
            </button>

          </div>

          <div className="orders-filter-grid">

            <div className="orders-filter-field orders-search-field">
              <label>SEARCH</label>

              <div className="orders-search-box">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Order no, vendor, product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="orders-filter-field">
              <label>STATUS</label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Received</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="orders-filter-field">
              <label>PAYMENT</label>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option>All Payments</option>
                <option>Paid</option>
                <option>Partial</option>
                <option>Unpaid</option>
              </select>
            </div>

            <div className="orders-filter-field">
              <label>VENDOR</label>

              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
              >
                <option>All Vendors</option>

                {[...new Set(orders.map((order) => order.vendor))]
                  .map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
              </select>
            </div>

            <div className="orders-filter-field">
              <label>DATE FROM</label>

              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="orders-filter-field">
              <label>DATE TO</label>

              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

          </div>

        </section>

        {/* ORDERS TABLE */}

        <section className="orders-table-panel">

          <div className="orders-table-heading">
            <h3>
              Orders <span>({filteredOrders.length})</span>
            </h3>
          </div>

          <div className="orders-table-wrapper">

            <table className="orders-table">

              <thead>
                <tr>
                  <th>ORDER NO.</th>
                  <th>DATE</th>
                  <th>VENDOR</th>
                  <th>PRODUCT</th>
                  <th>AMOUNT</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>

                      <td className="orders-number">
                        {order.id}
                      </td>

                      <td>
                        {new Date(
                          `${order.date}T00:00:00`
                        ).toLocaleDateString('en-GB')}
                      </td>

                      <td>
                        <div className="orders-vendor-cell">
                          <strong>{order.vendor}</strong>
                          <small>{order.vendorCode}</small>
                        </div>
                      </td>

                      <td>
                        <div className="orders-product-cell">
                          <strong>{order.product}</strong>
                          <small>{order.quantity}</small>
                        </div>
                      </td>

                      <td className="orders-amount">
                        PKR {order.amount.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`orders-payment-badge ${order.payment.toLowerCase()}`}
                        >
                          {order.payment}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`orders-status-badge ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <div className="orders-table-actions">

                          <button
                            type="button"
                            title="View order"
                            className="orders-action-view"
                            onClick={() =>
                              alert(
                                `Order: ${order.id}\nVendor: ${order.vendor}\nProduct: ${order.product}\nTotal: PKR ${order.amount.toLocaleString()}\nPaid: PKR ${order.paidAmount.toLocaleString()}\nBalance: PKR ${(order.amount - order.paidAmount).toLocaleString()}`
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            title="Print order"
                            className="orders-action-print"
                            onClick={() => window.print()}
                          >
                            <Printer size={17} />
                          </button>

                          <button
                            type="button"
                            title="WhatsApp"
                            className="orders-action-whatsapp"
                            onClick={() => {
                              const message = encodeURIComponent(
                                `Order ${order.id}\nVendor: ${order.vendor}\nProduct: ${order.product}\nTotal: PKR ${order.amount.toLocaleString()}\nPaid: PKR ${order.paidAmount.toLocaleString()}\nBalance: PKR ${(order.amount - order.paidAmount).toLocaleString()}`
                              )

                              window.open(
                                `https://wa.me/?text=${message}`,
                                '_blank'
                              )
                            }}
                          >
                            <MessageCircle size={17} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <div className="orders-empty-state">
                        No orders found
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* PLACE ORDER MODAL */}

        {showPlaceOrder && (

          <div
            className="orders-modal-overlay"
            onClick={() => setShowPlaceOrder(false)}
          >

            <div
              className="orders-modal orders-place-order-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}

              <div className="orders-modal-header">

                <div className="orders-modal-title-group">
                  <div className="orders-modal-title-icon">
                    <ShoppingCart size={20} />
                  </div>

                  <div>
                    <h2>Place Order</h2>
                    <p>Create a new purchase order</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="orders-modal-close"
                  onClick={() => setShowPlaceOrder(false)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handlePlaceOrder}
                className="orders-modal-form"
              >

                {/* ORDER INFORMATION */}

                <section className="orders-form-section">

                  <div className="orders-form-section-heading">
                    <CalendarDays size={17} />
                    <h3>Order Information</h3>
                  </div>

                  <div className="orders-form-grid">

                    {/* ORDER NUMBER */}

                    <div className="orders-form-field">
                      <label>ORDER NUMBER</label>

                      <input
                        type="text"
                        value={nextOrderNumber}
                        readOnly
                        className="orders-readonly-field"
                      />
                    </div>

                    {/* ORDER DATE */}

                    <div className="orders-form-field">
                      <label>ORDER DATE <span>*</span></label>

                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        required
                      />
                    </div>

                  </div>

                </section>

                {/* VENDOR */}

                <section className="orders-form-section">

                  <div className="orders-form-section-heading">
                    <Truck size={17} />
                    <h3>Vendor Information</h3>
                  </div>

                  <div className="orders-form-grid">

                    <div className="orders-form-field">
                      <label>VENDOR NAME <span>*</span></label>

                      <input
                        type="text"
                        placeholder="Enter vendor name"
                        value={newVendor}
                        onChange={(e) => setNewVendor(e.target.value)}
                        required
                      />
                    </div>

                    <div className="orders-form-field">
                      <label>VENDOR CODE</label>

                      <input
                        type="text"
                        placeholder="Enter vendor code"
                        value={newVendorCode}
                        onChange={(e) => setNewVendorCode(e.target.value)}
                      />
                    </div>

                  </div>

                </section>

                {/* PRODUCT */}

                <section className="orders-form-section">

                  <div className="orders-form-section-heading">
                    <Package size={17} />
                    <h3>Product Details</h3>
                  </div>

                  <div className="orders-product-form-card">

                    <div className="orders-form-grid">

                      <div className="orders-form-field">
                        <label>PRODUCT NAME <span>*</span></label>

                        <input
                          type="text"
                          placeholder="Enter product name"
                          value={newProduct}
                          onChange={(e) => setNewProduct(e.target.value)}
                          required
                        />
                      </div>

                      <div className="orders-form-field">
                        <label>QUANTITY <span>*</span></label>

                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(e.target.value)}
                          required
                        />
                      </div>

                      <div className="orders-form-field">
                        <label>UNIT</label>

                        <select
                          value={newUnit}
                          onChange={(e) => setNewUnit(e.target.value)}
                        >
                          <option>Piece</option>
                          <option>Box</option>
                          <option>Kg</option>
                          <option>Bag</option>
                          <option>Liter</option>
                          <option>Meter</option>
                          <option>Set</option>
                          <option>Dozen</option>
                          <option>Pack</option>
                        </select>
                      </div>

                      <div className="orders-form-field">
                        <label>TOTAL AMOUNT (PKR) <span>*</span></label>

                        <input
                          type="number"
                          min="1"
                          placeholder="Enter order amount"
                          value={newAmount}
                          onChange={(e) => {
                            setNewAmount(e.target.value)

                            const nextTotal = Number(e.target.value)

                            if (Number(newPaidAmount) > nextTotal) {
                              setNewPaidAmount(e.target.value)
                            }
                          }}
                          required
                        />
                      </div>

                    </div>

                  </div>

                </section>

                {/* ORDER TOTAL */}

                <div className="orders-total-highlight">

                  <div>
                    <span>ORDER TOTAL</span>
                    <p>Total purchase amount</p>
                  </div>

                  <strong>
                    PKR {orderTotal.toLocaleString()}
                  </strong>

                </div>

                {/* PAYMENT */}

                <section className="orders-form-section orders-payment-section">

                  <div className="orders-form-section-heading">
                    <CreditCard size={17} />
                    <h3>Advance Payment</h3>
                  </div>

                  <p className="orders-payment-description">
                    Enter the amount paid to the vendor now.
                    Leave it at zero if payment will be made later.
                  </p>

                  <div className="orders-form-grid">

                    {/* PAID */}

                    <div className="orders-form-field">

                      <label>AMOUNT PAID (PKR)</label>

                      <div className="orders-paid-input-wrap">

                        <input
                          type="number"
                          min="0"
                          max={orderTotal}
                          placeholder="0.00"
                          value={newPaidAmount}
                          onChange={(e) => {
                            const value = e.target.value

                            if (value === '') {
                              setNewPaidAmount('')
                              return
                            }

                            const parsedValue = Number(value)

                            if (parsedValue >= 0 && parsedValue <= orderTotal) {
                              setNewPaidAmount(value)
                            }
                          }}
                        />

                        <button
                          type="button"
                          className="orders-full-payment-button"
                          onClick={() => setNewPaidAmount(String(orderTotal))}
                          disabled={orderTotal <= 0}
                        >
                          Full
                        </button>

                      </div>

                    </div>

                    {/* BALANCE */}

                    <div className="orders-form-field">

                      <label>BALANCE DUE</label>

                      <input
                        type="text"
                        value={`PKR ${balanceDue.toLocaleString()}`}
                        readOnly
                        className="orders-balance-field"
                      />

                    </div>

                  </div>

                  {/* PAYMENT OVERVIEW */}

                  <div className="orders-payment-overview">

                    <div>
                      <span>ORDER TOTAL</span>
                      <strong>
                        {orderTotal.toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>PAYING NOW</span>
                      <strong>
                        {amountPaid.toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span>REMAINING</span>
                      <strong className="orders-remaining-amount">
                        {balanceDue.toLocaleString()}
                      </strong>
                    </div>

                  </div>

                  {/* PAYMENT STATUS */}

                  <div className="orders-payment-status-row">

                    <span>Payment Status</span>

                    <span
                      className={`orders-payment-badge ${calculatedPayment.toLowerCase()}`}
                    >
                      {calculatedPayment}
                    </span>

                  </div>

                </section>

                {/* ORDER STATUS */}

                <section className="orders-form-section">

                  <div className="orders-form-section-heading">
                    <Clock size={17} />
                    <h3>Order Status</h3>
                  </div>

                  <div className="orders-form-field">

                    <label>STATUS</label>

                    <select
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(
                          e.target.value as Order['status']
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                  </div>

                </section>

                {/* FOOTER */}

                <div className="orders-modal-footer">

                  <button
                    type="button"
                    className="orders-modal-cancel"
                    onClick={() => {
                      resetOrderForm()
                      setShowPlaceOrder(false)
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="orders-modal-submit"
                  >
                    <ShoppingCart size={17} />
                    Submit Order
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
    </AppLayout>
  )
}