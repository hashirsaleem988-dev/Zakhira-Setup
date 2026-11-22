
import { useMemo, useState, type FormEvent } from 'react'

import {
  UserRound,
  Users,
  Wallet,
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  Save,
  ChevronDown,
} from 'lucide-react'

import '../styles/customer.css'

type Customer = {
  id: string
  name: string
  company: string
  phoneWithCode: string
  phoneWithoutCode: string
  email: string
  city: string
  address: string
  revenue: number
  createdAt: string
}

type CustomerForm = Omit<Customer, 'id' | 'revenue' | 'createdAt'>

type ModalMode = 'add' | 'edit' | 'view' | null

const STORAGE_KEY = 'zakhira_customers'

const emptyForm: CustomerForm = {
  name: '',
  company: '',
  phoneWithCode: '',
  phoneWithoutCode: '',
  email: '',
  city: '',
  address: '',
}

const initialCustomers: Customer[] = [
  {
    id: 'CUS-1001',
    name: 'Ahmed Al-Farsi',
    company: 'Al-Farsi Trading Co.',
    phoneWithCode: '+966 50 123 4567',
    phoneWithoutCode: '0501234567',
    email: 'ahmed@example.com',
    city: 'Riyadh',
    address: 'Olaya Street, Riyadh',
    revenue: 0,
    createdAt: '2026-11-17',
  },
]

function loadCustomers(): Customer[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Customer[]) : initialCustomers
  } catch {
    return initialCustomers
  }
}

function formatPKR(value: number) {
  return `PKR ${value.toLocaleString('en-PK')}`
}

export default function Customer() {
  const [customers, setCustomers] = useState<Customer[]>(loadCustomers)

  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [sortBy, setSortBy] = useState('Date Added (newest)')

  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState<CustomerForm>(emptyForm)
  const [error, setError] = useState('')

  const persistCustomers = (next: Customer[]) => {
    setCustomers(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const cities = useMemo(
    () =>
      [...new Set(customers.map((customer) => customer.city).filter(Boolean))]
        .sort(),
    [customers],
  )

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return customers
      .filter((customer) => {
        const searchable = [
          customer.name,
          customer.company,
          customer.phoneWithCode,
          customer.phoneWithoutCode,
          customer.email,
          customer.city,
        ]
          .join(' ')
          .toLowerCase()

        return (
          searchable.includes(query) &&
          (cityFilter === 'All Cities' || customer.city === cityFilter)
        )
      })
      .sort((a, b) => {
        if (sortBy === 'Date Added (oldest)') {
          return a.createdAt.localeCompare(b.createdAt)
        }

        if (sortBy === 'Name (A-Z)') {
          return a.name.localeCompare(b.name)
        }

        if (sortBy === 'Name (Z-A)') {
          return b.name.localeCompare(a.name)
        }

        return b.createdAt.localeCompare(a.createdAt)
      })
  }, [customers, search, cityFilter, sortBy])

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  )

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.revenue,
    0,
  )

  const openAddModal = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setModalMode('add')
  }

  const openEditModal = (customer: Customer) => {
    setForm({
      name: customer.name,
      company: customer.company,
      phoneWithCode: customer.phoneWithCode,
      phoneWithoutCode: customer.phoneWithoutCode,
      email: customer.email,
      city: customer.city,
      address: customer.address,
    })

    setEditingId(customer.id)
    setError('')
    setModalMode('edit')
  }

  const openViewModal = (customer: Customer) => {
    setForm({
      name: customer.name,
      company: customer.company,
      phoneWithCode: customer.phoneWithCode,
      phoneWithoutCode: customer.phoneWithoutCode,
      email: customer.email,
      city: customer.city,
      address: customer.address,
    })

    setEditingId(customer.id)
    setError('')
    setModalMode('view')
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const updateField = (field: keyof CustomerForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter the customer name.')
      return
    }

    if (!form.phoneWithCode.trim() && !form.phoneWithoutCode.trim()) {
      setError('Please enter at least one phone number.')
      return
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      setError('Please enter a valid email address.')
      return
    }

    if (modalMode === 'edit' && editingId) {
      const updated = customers.map((customer) =>
        customer.id === editingId ? { ...customer, ...form } : customer,
      )

      persistCustomers(updated)
    } else {
      const newCustomer: Customer = {
        ...form,
        id: `CUS-${Date.now().toString().slice(-7)}`,
        revenue: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      }

      persistCustomers([newCustomer, ...customers])
    }

    closeModal()
  }

  const deleteCustomer = (customer: Customer) => {
    const confirmed = window.confirm(
      `Delete customer "${customer.name}"? This action cannot be undone.`,
    )

    if (!confirmed) return

    persistCustomers(
      customers.filter((item) => item.id !== customer.id),
    )

    if (selectedCustomerId === customer.id) {
      setSelectedCustomerId('')
    }
  }

  return (
    <div className="customer-page">

      {/* PAGE HEADING */}

      <div className="customer-heading">
        <div>
          <span className="customer-eyebrow">SALES MANAGEMENT</span>
          <h1>Customers</h1>
          <p>Maintain and manage your customer directory.</p>
        </div>

        <button className="customer-primary-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <section className="customer-summary-grid">

        <article className="customer-summary-card">
          <div className="customer-3d-icon green">
            <Users size={22} />
          </div>

          <div>
            <strong>{customers.length}</strong>
            <span>Total Customers</span>
          </div>
        </article>

        <article className="customer-summary-card revenue-summary">

          <div className="customer-summary-top">
            <div className="customer-3d-icon brass">
              <Wallet size={21} />
            </div>

            <div>
              <strong>Customer Revenue</strong>
              <span>VAT-exclusive · net of returns</span>
            </div>
          </div>

          <label className="customer-revenue-select">
            <select
              value={selectedCustomerId}
              onChange={(event) =>
                setSelectedCustomerId(event.target.value)
              }
            >
              <option value="">Select a customer to view revenue</option>

              {customers.map((customer) => (
                <option value={customer.id} key={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </label>

          <strong className="customer-revenue-value">
            {selectedCustomer
              ? formatPKR(selectedCustomer.revenue)
              : formatPKR(totalRevenue)}
          </strong>
        </article>

      </section>

      {/* FILTER PANEL */}

      <section className="customer-filter-panel">

        <div className="customer-filter-heading">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </div>

        <div className="customer-filters">

          <label className="customer-filter-field">
            <span>Search</span>

            <div className="customer-input-shell">
              <Search size={16} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, company, phone, email..."
              />
            </div>
          </label>

          <label className="customer-filter-field">
            <span>City</span>

            <div className="customer-input-shell">
              <select
                value={cityFilter}
                onChange={(event) => setCityFilter(event.target.value)}
              >
                <option>All Cities</option>

                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>

              <ChevronDown size={16} />
            </div>
          </label>

          <label className="customer-filter-field">
            <span>Sort By</span>

            <div className="customer-input-shell">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option>Date Added (newest)</option>
                <option>Date Added (oldest)</option>
                <option>Name (A-Z)</option>
                <option>Name (Z-A)</option>
              </select>

              <ChevronDown size={16} />
            </div>
          </label>

        </div>
      </section>

      {/* CUSTOMER TABLE */}

      <section className="customer-table-panel">

        <div className="customer-table-heading">
          <div>
            <h2>Customer Directory</h2>
            <p>{filteredCustomers.length} customers found</p>
          </div>

          <span className="customer-count-badge">
            {filteredCustomers.length} Records
          </span>
        </div>

        <div className="customer-table-scroll">

          <table className="customer-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Email</th>
                <th>City</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>

                  <td>
                    <strong>{customer.name}</strong>
                    <small>{customer.id}</small>
                  </td>

                  <td>{customer.company || '—'}</td>

                  <td>
                    {customer.phoneWithCode ||
                      customer.phoneWithoutCode ||
                      '—'}
                  </td>

                  <td>{customer.email || '—'}</td>

                  <td>{customer.city || '—'}</td>

                  <td>
                    {new Date(
                      `${customer.createdAt}T00:00:00`,
                    ).toLocaleDateString('en-GB')}
                  </td>

                  <td>
                    <div className="customer-actions">

                      <button
                        className="customer-action-btn view"
                        aria-label="View customer"
                        title="View"
                        onClick={() => openViewModal(customer)}
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        className="customer-action-btn edit"
                        aria-label="Edit customer"
                        title="Edit"
                        onClick={() => openEditModal(customer)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="customer-action-btn delete"
                        aria-label="Delete customer"
                        title="Delete"
                        onClick={() => deleteCustomer(customer)}
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="customer-empty">
                    <Users size={27} />
                    <strong>No customers found</strong>
                    <span>
                      Try another search or add a new customer.
                    </span>
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      </section>

      {/* CUSTOMER MODAL */}

      {modalMode && (
        <div
          className="customer-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >

          <section
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
          >

            {/* MODAL HEADER */}

            <div className="customer-modal-heading">

              <div className="customer-modal-title-row">

                <div className="customer-3d-icon small green">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 id="customer-modal-title">
                    {modalMode === 'add'
                      ? 'Add Customer'
                      : modalMode === 'edit'
                        ? 'Edit Customer'
                        : 'Customer Details'}
                  </h2>

                  <p>
                    {modalMode === 'view'
                      ? 'Review customer information'
                      : 'Enter the customer information below'}
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

            </div>

            {/* MODAL FORM */}

            <form onSubmit={handleSubmit}>

              <div className="customer-form-grid">

                {/* CUSTOMER NAME */}

                <label className="customer-form-field">
                  <span>
                    Customer Name <b>*</b>
                  </span>

                  <div className="customer-form-input">
                    <UserRound size={16} />

                    <input
                      value={form.name}
                      onChange={(event) =>
                        updateField('name', event.target.value)
                      }
                      placeholder="Ahmed Al-Farsi"
                      required
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </label>

                {/* COMPANY */}

                <label className="customer-form-field">
                  <span>Company</span>

                  <div className="customer-form-input">
                    <Building2 size={16} />

                    <input
                      value={form.company}
                      onChange={(event) =>
                        updateField('company', event.target.value)
                      }
                      placeholder="Company name"
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </label>

                {/* PHONE WITH COUNTRY CODE */}

                <label className="customer-form-field">
                  <span>Phone Number</span>
                  <small>Fill in at least one of the two.</small>

                  <div className="customer-form-input">
                    <Phone size={16} />

                    <input
                      value={form.phoneWithCode}
                      onChange={(event) =>
                        updateField('phoneWithCode', event.target.value)
                      }
                      placeholder="+966 50 123 4567"
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </label>

                {/* PHONE WITHOUT COUNTRY CODE */}

                <label className="customer-form-field">
                  <span>Without Country Code</span>

                  <div className="customer-form-input">
                    <Phone size={16} />

                    <input
                      value={form.phoneWithoutCode}
                      onChange={(event) =>
                        updateField('phoneWithoutCode', event.target.value)
                      }
                      placeholder="0501234567"
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </label>

                {/* EMAIL */}

                <label className="customer-form-field">
                  <span>Email</span>

                  <div className="customer-form-input">
                    <Mail size={16} />

                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField('email', event.target.value)
                      }
                      placeholder="ahmed@example.com"
                      disabled={modalMode === 'view'}
                    />
                  </div>

                  <small>Optional — for invoices and reminders.</small>
                </label>

                {/* CITY */}

                <label className="customer-form-field">
                  <span>City</span>

                  <div className="customer-form-input">
                    <MapPin size={16} />

                    <input
                      value={form.city}
                      onChange={(event) =>
                        updateField('city', event.target.value)
                      }
                      placeholder="Riyadh"
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </label>

                {/* ADDRESS */}

                <label className="customer-form-field full">
                  <span>Address</span>

                  <div className="customer-form-input">
                    <MapPin size={16} />

                    <input
                      value={form.address}
                      onChange={(event) =>
                        updateField('address', event.target.value)
                      }
                      placeholder="Street, building, area"
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </label>

              </div>

              {/* ERROR */}

              {error && (
                <p className="customer-form-error">
                  {error}
                </p>
              )}

              {/* MODAL ACTIONS */}

              <div className="customer-modal-footer">

                {modalMode === 'view' ? (
                  <button
                    type="button"
                    className="customer-primary-btn"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="customer-primary-btn"
                    >
                      <Save size={16} />

                      {modalMode === 'edit'
                        ? 'Update Customer'
                        : 'Save Customer'}
                    </button>

                    <button
                      type="button"
                      className="customer-secondary-btn"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </>
                )}

              </div>

            </form>

          </section>

        </div>
      )}

      {/* PAGE FOOTER */}

      <footer className="customer-footer">
        <span>© 2026 Zakhira Management System</span>
        <span>Designed for smarter business management</span>
      </footer>

    </div>
  )
}
