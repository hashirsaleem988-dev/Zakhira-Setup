import { useMemo, useState, type FormEvent } from 'react'
import {
  Truck,
  Plus,
  SlidersHorizontal,
  Search,
  Eye,
  Pencil,
  Archive,
  Trash2,
  X,
  
  Building2,
} from 'lucide-react'

import AppLayout from '../layout/AppLayout'
import '../../styles/vendor.css'

interface Vendor {
  id: string
  name: string
  company: string
  phone: string
  email: string
  city: string
  address: string
  status: 'Active' | 'Inactive'
}

interface VendorLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const sampleVendors: Vendor[] = [
  {
    id: 'VND-0001',
    name: 'Tauheed',
    company: 'nes',
    phone: '+923270257832',
    email: '',
    city: 'Vehari',
    address: '',
    status: 'Active',
  },
]

export default function VendorLayout({
  activePage,
  onNavigate,
  onLogout,
}: VendorLayoutProps) {
  const [vendors, setVendors] = useState<Vendor[]>(sampleVendors)

  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [statusFilter, setStatusFilter] = useState('Active')

  const [showModal, setShowModal] = useState(false)
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [vendorStatus, setVendorStatus] =
    useState<Vendor['status']>('Active')

  // VENDOR FILTER
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const searchMatch =
        `${vendor.id} ${vendor.name} ${vendor.company} ${vendor.phone} ${vendor.city}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const cityMatch =
        cityFilter === 'All Cities' || vendor.city === cityFilter

      const statusMatch =
        statusFilter === 'All Statuses' ||
        vendor.status === statusFilter

      return searchMatch && cityMatch && statusMatch
    })
  }, [vendors, search, cityFilter, statusFilter])

  // CITIES
  const cities = useMemo(() => {
    return [...new Set(vendors.map((vendor) => vendor.city).filter(Boolean))]
  }, [vendors])

  // SUMMARY
  const totalVendors = vendors.length

  const activeVendors = vendors.filter(
    (vendor) => vendor.status === 'Active'
  ).length

  const inactiveVendors = vendors.filter(
    (vendor) => vendor.status === 'Inactive'
  ).length

  // RESET FORM
  const resetForm = () => {
    setName('')
    setCompany('')
    setPhone('')
    setEmail('')
    setCity('')
    setAddress('')
    setVendorStatus('Active')
    setEditingVendor(null)
  }

  // OPEN ADD
  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  // OPEN EDIT
  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor)

    setName(vendor.name)
    setCompany(vendor.company)
    setPhone(vendor.phone)
    setEmail(vendor.email)
    setCity(vendor.city)
    setAddress(vendor.address)
    setVendorStatus(vendor.status)

    setShowModal(true)
  }

  // SAVE VENDOR
  const handleSaveVendor = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim() || !phone.trim() || !city.trim()) return

    if (editingVendor) {
      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.id === editingVendor.id
            ? {
                ...vendor,
                name: name.trim(),
                company: company.trim(),
                phone: phone.trim(),
                email: email.trim(),
                city: city.trim(),
                address: address.trim(),
                status: vendorStatus,
              }
            : vendor
        )
      )
    } else {
      const highestNumber = vendors.reduce((max, vendor) => {
        const number = Number(vendor.id.replace('VND-', ''))
        return Number.isFinite(number) ? Math.max(max, number) : max
      }, 0)

      const newVendor: Vendor = {
        id: `VND-${String(highestNumber + 1).padStart(4, '0')}`,
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        status: vendorStatus,
      }

      setVendors((prev) => [newVendor, ...prev])
    }

    resetForm()
    setShowModal(false)
  }

  // ARCHIVE / STATUS TOGGLE
  const toggleVendorStatus = (vendor: Vendor) => {
    setVendors((prev) =>
      prev.map((item) =>
        item.id === vendor.id
          ? {
              ...item,
              status:
                item.status === 'Active' ? 'Inactive' : 'Active',
            }
          : item
      )
    )
  }

  // DELETE
  const deleteVendor = (vendor: Vendor) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${vendor.name}?`
    )

    if (!confirmDelete) return

    setVendors((prev) =>
      prev.filter((item) => item.id !== vendor.id)
    )
  }

  // RESET FILTERS
  const resetFilters = () => {
    setSearch('')
    setCityFilter('All Cities')
    setStatusFilter('All Statuses')
  }

  return (
    <AppLayout
      className="inventory-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="vendor-page">

        {/* HEADER */}

        <header className="vendor-heading">
          <div>
            <span className="vendor-eyebrow">
              INVENTORY MANAGEMENT
            </span>

            <h1>Vendors</h1>

            <p>Maintain your vendor directory</p>
          </div>
        </header>

        {/* SUMMARY */}

        <section className="vendor-summary-grid">

          <article className="vendor-summary-card">

            <div className="vendor-summary-icon">
              <Truck size={18} />
            </div>

            <div>
              <h3>{totalVendors}</h3>
              <span>TOTAL VENDORS</span>
            </div>

          </article>

          <article className="vendor-summary-card">

            <div className="vendor-summary-icon active-icon">
              <Building2 size={18} />
            </div>

            <div>
              <h3>{activeVendors}</h3>
              <span>ACTIVE VENDORS</span>
            </div>

          </article>

          <article className="vendor-summary-card">

            <div className="vendor-summary-icon inactive-icon">
              <Archive size={18} />
            </div>

            <div>
              <h3>{inactiveVendors}</h3>
              <span>INACTIVE VENDORS</span>
            </div>

          </article>

        </section>

        {/* ADD VENDOR */}

        <div className="vendor-main-actions">

          <button
            type="button"
            className="vendor-add-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Vendor
          </button>

        </div>

        {/* FILTERS */}

        <section className="vendor-filter-panel">

          <div className="vendor-filter-heading">

            <SlidersHorizontal size={17} />

            <h3>FILTERS</h3>

            <button
              type="button"
              className="vendor-reset-button"
              onClick={resetFilters}
            >
              Reset
            </button>

          </div>

          <div className="vendor-filter-grid">

            {/* SEARCH */}

            <div className="vendor-filter-field">

              <label>SEARCH</label>

              <div className="vendor-search-box">

                <Search size={17} />

                <input
                  type="text"
                  placeholder="Name, company, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>

            {/* CITY */}

            <div className="vendor-filter-field">

              <label>CITY</label>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option>All Cities</option>

                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

            </div>

            {/* STATUS */}

            <div className="vendor-filter-field">

              <label>STATUS</label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

          </div>

        </section>

        {/* TABLE */}

        <section className="vendor-table-panel">

          <div className="vendor-table-heading">
            <h3>
              Vendors <span>({filteredVendors.length})</span>
            </h3>
          </div>

          <div className="vendor-table-wrapper">

            <table className="vendor-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>COMPANY</th>
                  <th>PHONE</th>
                  <th>CITY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id}>

                      <td className="vendor-id">
                        {vendor.id}
                      </td>

                      <td>
                        <strong className="vendor-name">
                          {vendor.name}
                        </strong>
                      </td>

                      <td>
                        {vendor.company || '—'}
                      </td>

                      <td className="vendor-phone">
                        {vendor.phone}
                      </td>

                      <td className="vendor-city">
                        {vendor.city}
                      </td>

                      <td>
                        <span
                          className={`vendor-status-badge ${vendor.status.toLowerCase()}`}
                        >
                          {vendor.status}
                        </span>
                      </td>

                      <td>

                        <div className="vendor-table-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            className="vendor-action-view"
                            title="View vendor"
                            onClick={() => setViewVendor(vendor)}
                          >
                            <Eye size={15} />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            className="vendor-action-edit"
                            title="Edit vendor"
                            onClick={() => openEditModal(vendor)}
                          >
                            <Pencil size={15} />
                          </button>

                          {/* ARCHIVE */}

                          <button
                            type="button"
                            className="vendor-action-archive"
                            title={
                              vendor.status === 'Active'
                                ? 'Deactivate vendor'
                                : 'Activate vendor'
                            }
                            onClick={() => toggleVendorStatus(vendor)}
                          >
                            <Archive size={15} />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="vendor-action-delete"
                            title="Delete vendor"
                            onClick={() => deleteVendor(vendor)}
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="vendor-empty-state">
                        No vendors found
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ADD / EDIT MODAL */}

        {showModal && (

          <div
            className="vendor-modal-overlay"
            onClick={() => setShowModal(false)}
          >

            <div
              className="vendor-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="vendor-modal-header">

                <div>
                  <h2>
                    {editingVendor ? 'Edit Vendor' : 'Add Vendor'}
                  </h2>

                  <p>
                    {editingVendor
                      ? 'Update vendor information'
                      : 'Add a vendor to your directory'}
                  </p>
                </div>

                <button
                  type="button"
                  className="vendor-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <X size={19} />
                </button>

              </div>

              <form onSubmit={handleSaveVendor}>

                <div className="vendor-modal-body">

                  <div className="vendor-form-grid">

                    {/* NAME */}

                    <div className="vendor-form-field">
                      <label>VENDOR NAME <span>*</span></label>

                      <input
                        type="text"
                        placeholder="Enter vendor name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {/* COMPANY */}

                    <div className="vendor-form-field">
                      <label>COMPANY NAME</label>

                      <input
                        type="text"
                        placeholder="Enter company name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>

                    {/* PHONE */}

                    <div className="vendor-form-field">
                      <label>PHONE <span>*</span></label>

                      <input
                        type="tel"
                        placeholder="+92..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    {/* EMAIL */}

                    <div className="vendor-form-field">
                      <label>EMAIL</label>

                      <input
                        type="email"
                        placeholder="vendor@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* CITY */}

                    <div className="vendor-form-field">
                      <label>CITY <span>*</span></label>

                      <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>

                    {/* STATUS */}

                    <div className="vendor-form-field">
                      <label>STATUS</label>

                      <select
                        value={vendorStatus}
                        onChange={(e) =>
                          setVendorStatus(
                            e.target.value as Vendor['status']
                          )
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* ADDRESS */}

                    <div className="vendor-form-field vendor-address-field">
                      <label>ADDRESS</label>

                      <textarea
                        placeholder="Enter vendor address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                      />
                    </div>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="vendor-modal-footer">

                  <button
                    type="button"
                    className="vendor-cancel-button"
                    onClick={() => {
                      resetForm()
                      setShowModal(false)
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="vendor-save-button"
                  >
                    <Plus size={16} />
                    {editingVendor ? 'Update Vendor' : 'Save Vendor'}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* VIEW DETAILS */}

        {viewVendor && (

          <div
            className="vendor-modal-overlay"
            onClick={() => setViewVendor(null)}
          >

            <div
              className="vendor-modal vendor-view-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="vendor-modal-header">

                <div>
                  <h2>Vendor Details</h2>
                  <p>Vendor profile information</p>
                </div>

                <button
                  type="button"
                  className="vendor-modal-close"
                  onClick={() => setViewVendor(null)}
                >
                  <X size={19} />
                </button>

              </div>

              <div className="vendor-view-body">

                <div className="vendor-profile-header">

                  <div className="vendor-profile-icon">
                    <Truck size={22} />
                  </div>

                  <div>
                    <h3>{viewVendor.name}</h3>
                    <span>{viewVendor.id}</span>
                  </div>

                </div>

                <div className="vendor-detail-grid">

                  <div className="vendor-detail-item">
                    <span>COMPANY</span>
                    <strong>{viewVendor.company || '—'}</strong>
                  </div>

                  <div className="vendor-detail-item">
                    <span>PHONE</span>
                    <strong>{viewVendor.phone || '—'}</strong>
                  </div>

                  <div className="vendor-detail-item">
                    <span>EMAIL</span>
                    <strong>{viewVendor.email || '—'}</strong>
                  </div>

                  <div className="vendor-detail-item">
                    <span>CITY</span>
                    <strong>{viewVendor.city || '—'}</strong>
                  </div>

                  <div className="vendor-detail-item vendor-detail-address">
                    <span>ADDRESS</span>
                    <strong>{viewVendor.address || '—'}</strong>
                  </div>

                  <div className="vendor-detail-item">
                    <span>STATUS</span>

                    <strong>
                      <span
                        className={`vendor-status-badge ${viewVendor.status.toLowerCase()}`}
                      >
                        {viewVendor.status}
                      </span>
                    </strong>
                  </div>

                </div>

              </div>

              <div className="vendor-modal-footer">

                <button
                  type="button"
                  className="vendor-cancel-button"
                  onClick={() => setViewVendor(null)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="vendor-save-button"
                  onClick={() => {
                    const vendor = viewVendor
                    setViewVendor(null)
                    openEditModal(vendor)
                  }}
                >
                  <Pencil size={15} />
                  Edit Vendor
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </AppLayout>
  )
}