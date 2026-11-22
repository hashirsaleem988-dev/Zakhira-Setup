
import { useState } from 'react'
import {
  X,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Upload,
  Check,
} from 'lucide-react'

import '../../styles/new-entry-modal.css'

interface NewEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: {
    type: string
    customer: string
    company: string
    invoice: string
    amount: number
    date: string
    status: string
    mode: string
    notes: string
    file: File | null
  }) => void
}

export default function NewEntryModal({
  isOpen,
  onClose,
  onSave,
}: NewEntryModalProps) {
  const [type, setType] = useState('In')
  const [customer, setCustomer] = useState('')
  const [company, setCompany] = useState('')
  const [invoice, setInvoice] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [status, setStatus] = useState('Paid')
  const [mode, setMode] = useState('Cash')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    if (!customer.trim() || !amount || Number(amount) <= 0 || !date) {
      setError('Please fill all required fields correctly.')
      return
    }

    onSave({
      type,
      customer: customer.trim(),
      company: company.trim(),
      invoice: invoice.trim(),
      amount: Number(amount),
      date,
      status,
      mode,
      notes: notes.trim(),
      file,
    })

    setError('')
    onClose()
  }

  const handleFileChange = (selectedFile: File | undefined) => {
    if (!selectedFile) return

    const validType = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ].includes(selectedFile.type)

    if (!validType || selectedFile.size > 2 * 1024 * 1024) {
      setError('Please upload JPG, PNG, WEBP or PDF up to 2MB.')
      return
    }

    setFile(selectedFile)
    setError('')
  }

  return (
    <div className="entry-modal-overlay" onMouseDown={onClose}>
      <section
        className="entry-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="entry-modal-header">
          <div>
            <span className="entry-modal-eyebrow">
              ACCOUNTING / TRANSACTIONS
            </span>
            <h2 id="entry-modal-title">New Entry</h2>
            <p>Record a transaction (In / Out / Return)</p>
          </div>

          <button
            type="button"
            className="entry-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className="entry-modal-body">

          <div className="entry-form-group">
            <label>TRANSACTION TYPE <span>*</span></label>

            <div className="entry-type-options">
              {[
                { name: 'In', icon: ArrowDown },
                { name: 'Out', icon: ArrowUp },
                { name: 'Return', icon: RotateCcw },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`entry-type-btn ${type === item.name ? 'active' : ''}`}
                    onClick={() => setType(item.name)}
                  >
                    <Icon size={18} />
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="entry-form-grid two-columns">
            <div className="entry-form-group">
              <label>CUSTOMER NAME <span>*</span></label>
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Ahmed Al-Farsi"
              />
            </div>

            <div className="entry-form-group">
              <label>COMPANY NAME</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Al-Farsi Trading"
              />
            </div>

            <div className="entry-form-group">
              <label>INVOICE REFERENCE</label>
              <input
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="e.g. INV-2026-1042"
              />
            </div>

            <div className="entry-form-group">
              <label>INVOICE FILE <small>(OPTIONAL)</small></label>
              <label className="entry-file-input">
                <span>
                  {file ? file.name : 'Upload image or PDF (max 2MB)'}
                </span>
                <Upload size={19} />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>

          <div className="entry-form-grid three-columns">
            <div className="entry-form-group">
              <label>AMOUNT (SAR) <span>*</span></label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="entry-form-group">
              <label>DATE <span>*</span></label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="entry-form-group">
              <label>STATUS</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div className="entry-form-group">
            <label>TRANSACTION MODE</label>

            <div className="entry-mode-options">
              {['Cash', 'Card', 'Bank Transfer', 'Other'].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`entry-mode-btn ${mode === item ? 'active' : ''}`}
                  onClick={() => setMode(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="entry-form-group">
            <label>NOTES</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          {error && (
            <p className="entry-form-error">{error}</p>
          )}
        </div>

        <footer className="entry-modal-footer">
          <button
            type="button"
            className="entry-save-btn"
            onClick={handleSave}
          >
            <Check size={18} />
            Save Entry
          </button>

          <button
            type="button"
            className="entry-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </footer>
      </section>
    </div>
  )
}
