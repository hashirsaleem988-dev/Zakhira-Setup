
import { useEffect, useState } from 'react'

import {
  Languages,
  Ruler,
  ClipboardList,
  Printer,
  CircleHelp,
  Settings,
  Globe,
  Plus,
  RotateCcw,
  Pencil,
  Trash2,
  Check,
  MessageCircle,
  Mail,
  UserRound,
  Info,
} from 'lucide-react'

import AppLayout from '../layout/AppLayout'

import '../../styles/settings.css'

interface SettingsLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

type SettingsCategory =
  | 'Language'
  | 'Units'
  | 'Sales Form'
  | 'Print'
  | 'Help'

type LanguageOption = {
  name: string
  code: string
  direction: 'LTR' | 'RTL'
}

type Unit = {
  id: number
  name: string
  label: string
}

type SalesField = {
  id: number
  english: string
  urdu: string
}

const categories = [
  { title: 'Language' as const, icon: Languages },
  { title: 'Units' as const, icon: Ruler },
  { title: 'Sales Form' as const, icon: ClipboardList },
  { title: 'Print' as const, icon: Printer },
  { title: 'Help' as const, icon: CircleHelp },
]

const languages: LanguageOption[] = [
  { name: 'English', code: 'EN', direction: 'LTR' },
  { name: 'العربية', code: 'AR', direction: 'RTL' },
  { name: 'اردو', code: 'UR', direction: 'RTL' },
  { name: 'हिन्दी', code: 'HI', direction: 'LTR' },
]

const initialUnits: Unit[] = [
  { id: 1, name: 'piece', label: 'Piece' },
  { id: 2, name: 'kg', label: 'Kilogram (kg)' },
  { id: 3, name: 'gram', label: 'Gram (g)' },
  { id: 4, name: 'litre', label: 'Litre (L)' },
  { id: 5, name: 'metre', label: 'Metre (m)' },
  { id: 6, name: 'box', label: 'Box' },
  { id: 7, name: 'dozen', label: 'Dozen' },
]

const initialFields: SalesField[] = [
  { id: 1, english: 'Customer ID', urdu: 'کسٹمر آئی ڈی' },
  { id: 2, english: 'Customer Name', urdu: 'کسٹمر کا نام' },
  { id: 3, english: 'Phone', urdu: 'فون' },
  { id: 4, english: 'Email', urdu: 'ای میل' },
  { id: 5, english: 'City', urdu: 'شہر' },
  { id: 6, english: 'Address', urdu: 'پتہ' },
  { id: 7, english: 'Reference / PO No.', urdu: 'ریفرنس / PO نمبر' },
  { id: 8, english: 'Invoice Date', urdu: 'انوائس کی تاریخ' },
  { id: 9, english: 'Due Date', urdu: 'واجب الادا تاریخ' },
  { id: 10, english: 'Payment Terms', urdu: 'ادائیگی کی شرائط' },
  { id: 11, english: 'Material', urdu: 'میٹریل' },
  { id: 12, english: 'Qty', urdu: 'مقدار' },
  { id: 13, english: 'Price', urdu: 'قیمت' },
  { id: 14, english: 'Discount %', urdu: 'ڈسکاؤنٹ %' },
  { id: 15, english: 'Notes', urdu: 'نوٹس' },
]

const printFormats = [
  { id: 'A4', name: 'A4 — Full Page', detail: '210 × 297 mm (standard office paper)' },
  { id: 'A5', name: 'A5 — Half Page', detail: '148 × 210 mm (half of A4)' },
  { id: '80mm', name: 'Thermal Receipt 80mm', detail: '80 mm thermal printer (most common)' },
  { id: '58mm', name: 'Thermal Receipt 58mm', detail: '58 mm thermal printer (small)' },
]

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

export default function SettingsLayout({
  activePage,
  onNavigate,
  onLogout,
}: SettingsLayoutProps) {
  const [activeCategory, setActiveCategory] =
    useState<SettingsCategory>('Language')

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => readStorage('zakhira-language', 'English')
  )

  const [units, setUnits] = useState<Unit[]>(
    () => readStorage('zakhira-units', initialUnits)
  )

  const [defaultUnit, setDefaultUnit] = useState(
    () => readStorage('zakhira-default-unit', 'piece')
  )

  const [showUnitForm, setShowUnitForm] = useState(false)
  const [editingUnit, setEditingUnit] = useState<number | null>(null)
  const [unitName, setUnitName] = useState('')
  const [unitLabel, setUnitLabel] = useState('')

  const [fields, setFields] = useState<SalesField[]>(
    () => readStorage('zakhira-sales-fields', initialFields)
  )

  const [selectedPrint, setSelectedPrint] = useState(
    () => readStorage('zakhira-print-format', 'A4')
  )

  useEffect(() => {
    localStorage.setItem('zakhira-language', JSON.stringify(selectedLanguage))
  }, [selectedLanguage])

  useEffect(() => {
    localStorage.setItem('zakhira-units', JSON.stringify(units))
  }, [units])

  useEffect(() => {
    localStorage.setItem('zakhira-default-unit', JSON.stringify(defaultUnit))
  }, [defaultUnit])

  useEffect(() => {
    localStorage.setItem('zakhira-sales-fields', JSON.stringify(fields))
  }, [fields])

  useEffect(() => {
    localStorage.setItem('zakhira-print-format', JSON.stringify(selectedPrint))
  }, [selectedPrint])

  const selectedLanguageOption = languages.find(
    (language) => language.name === selectedLanguage
  )

  const resetUnits = () => {
    setUnits(initialUnits)
    setDefaultUnit('piece')
    setShowUnitForm(false)
    setEditingUnit(null)
    setUnitName('')
    setUnitLabel('')
  }

  const openAddUnit = () => {
    setEditingUnit(null)
    setUnitName('')
    setUnitLabel('')
    setShowUnitForm(true)
  }

  const openEditUnit = (unit: Unit) => {
    setEditingUnit(unit.id)
    setUnitName(unit.name)
    setUnitLabel(unit.label)
    setShowUnitForm(true)
  }

  const saveUnit = () => {
    const cleanName = unitName.trim()
    const cleanLabel = unitLabel.trim()

    if (!cleanName || !cleanLabel) return

    if (editingUnit !== null) {
      setUnits((current) =>
        current.map((unit) =>
          unit.id === editingUnit
            ? { ...unit, name: cleanName, label: cleanLabel }
            : unit
        )
      )
    } else {
      setUnits((current) => [
        ...current,
        {
          id: Date.now(),
          name: cleanName,
          label: cleanLabel,
        },
      ])
    }

    setShowUnitForm(false)
    setEditingUnit(null)
    setUnitName('')
    setUnitLabel('')
  }

  const deleteUnit = (unit: Unit) => {
    if (unit.name === defaultUnit) return

    setUnits((current) => current.filter((item) => item.id !== unit.id))
  }

  const updateField = (
    id: number,
    key: 'english' | 'urdu',
    value: string
  ) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    )
  }

  const addField = () => {
    setFields((current) => [
      ...current,
      {
        id: Date.now(),
        english: 'New Field',
        urdu: 'نیا فیلڈ',
      },
    ])
  }

  const removeField = (id: number) => {
    setFields((current) => current.filter((field) => field.id !== id))
  }

  const resetFields = () => {
    setFields(initialFields)
  }

  return (
    <AppLayout
      className="settings-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="settings-page-content">
          <header className="settings-heading">
            <div className="settings-heading-icon">
              <Settings size={23} />
            </div>

            <div>
              <span className="settings-eyebrow">
                PREFERENCES & CONFIGURATION
              </span>
              <h1>Settings</h1>
              <p>
                Language, Units, Sales Form, Print and help preferences
              </p>
            </div>
          </header>

          {/* CATEGORY TABS */}
          <nav className="settings-tabs">
            {categories.map((category) => {
              const Icon = category.icon

              return (
                <button
                  key={category.title}
                  type="button"
                  className={`settings-tab ${
                    activeCategory === category.title ? 'active' : ''
                  }`}
                  onClick={() => setActiveCategory(category.title)}
                >
                  <Icon size={17} />
                  <span>{category.title}</span>
                </button>
              )
            })}
          </nav>

          {/* LANGUAGE */}
          {activeCategory === 'Language' && (
            <section className="settings-card settings-form-card">
              <div className="settings-card-heading">
                <div className="settings-card-title">
                  <span className="settings-round-icon">
                    <Globe size={19} />
                  </span>
                  <div>
                    <h3>Choose Your Language</h3>
                    <p>Entire interface will change</p>
                  </div>
                </div>
              </div>

              <div className="settings-option-list">
                {languages.map((language) => {
                  const selected = selectedLanguage === language.name

                  return (
                    <button
                      type="button"
                      key={language.code}
                      className={`settings-option-row ${
                        selected ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedLanguage(language.name)}
                    >
                      <span className="settings-check">
                        {selected && <Check size={16} />}
                      </span>

                      <span className="settings-option-copy">
                        <strong>{language.name}</strong>
                        <small>
                          {language.code} · {language.direction}
                        </small>
                      </span>

                      {selected && (
                        <span className="settings-selected-label">
                          SELECTED
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="settings-info-note">
                <Info size={16} />
                <span>
                  Selected: {selectedLanguage} · Direction:{' '}
                  {selectedLanguageOption?.direction ?? 'LTR'}. This is a
                  frontend language preference preview.
                </span>
              </div>
            </section>
          )}

          {/* UNITS */}
          {activeCategory === 'Units' && (
            <section className="settings-card settings-form-card">
              <div className="settings-card-heading">
                <div className="settings-card-title">
                  <span className="settings-round-icon">
                    <Ruler size={19} />
                  </span>
                  <div>
                    <h3>Measuring Units</h3>
                    <p>Default unit and units list</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="settings-button settings-button-outline"
                  onClick={resetUnits}
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
              </div>

              <label className="settings-label" htmlFor="default-unit">
                DEFAULT UNIT
              </label>

              <select
                id="default-unit"
                className="settings-select"
                value={defaultUnit}
                onChange={(event) => setDefaultUnit(event.target.value)}
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.name}>
                    {unit.label}
                  </option>
                ))}
              </select>

              <p className="settings-helper">
                New products will open with "
                {units.find((unit) => unit.name === defaultUnit)?.label ??
                  'Piece'}
                " pre-selected
              </p>

              {showUnitForm && (
                <div className="settings-add-unit-form">
                  <h4>{editingUnit ? 'EDIT UNIT' : 'ADD NEW UNIT'}</h4>

                  <div className="settings-unit-input-grid">
                    <label>
                      <span className="settings-label">NAME (INTERNAL)</span>
                      <input
                        className="settings-input"
                        placeholder="kg, piece, box..."
                        value={unitName}
                        onChange={(event) => setUnitName(event.target.value)}
                      />
                    </label>

                    <label>
                      <span className="settings-label">LABEL (DISPLAY)</span>
                      <input
                        className="settings-input"
                        placeholder="Kilogram (kg)"
                        value={unitLabel}
                        onChange={(event) => setUnitLabel(event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="settings-form-actions">
                    <button
                      type="button"
                      className="settings-button settings-button-primary"
                      onClick={saveUnit}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="settings-button settings-button-outline"
                      onClick={() => setShowUnitForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="settings-list-heading">
                <strong>UNITS LIST ({units.length})</strong>

                <button
                  type="button"
                  className="settings-button settings-button-primary"
                  onClick={openAddUnit}
                >
                  <Plus size={16} />
                  Add Unit
                </button>
              </div>

              <div className="settings-unit-list">
                {units.map((unit) => (
                  <div className="settings-unit-row" key={unit.id}>
                    <div className="settings-unit-name">
                      <strong>{unit.label}</strong>
                      <small>({unit.name})</small>

                      {defaultUnit === unit.name && (
                        <span className="settings-default-badge">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <div className="settings-row-actions">
                      <button
                        type="button"
                        className="settings-icon-button edit"
                        aria-label={`Edit ${unit.label}`}
                        onClick={() => openEditUnit(unit)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        className="settings-icon-button delete"
                        aria-label={`Delete ${unit.label}`}
                        disabled={unit.name === defaultUnit}
                        onClick={() => deleteUnit(unit)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SALES FORM */}
          {activeCategory === 'Sales Form' && (
            <section className="settings-card settings-sales-card">
              <div className="settings-sales-heading">
                <div>
                  <h3>Sales Form Fields</h3>
                  <p>Changes save automatically.</p>
                </div>

                <div className="settings-header-actions">
                  <button
                    type="button"
                    className="settings-button settings-button-primary"
                    onClick={addField}
                  >
                    <Plus size={16} />
                    Add Field
                  </button>

                  <button
                    type="button"
                    className="settings-button settings-button-outline"
                    onClick={resetFields}
                  >
                    <RotateCcw size={15} />
                    Reset
                  </button>
                </div>
              </div>

              <div className="settings-sales-list">
                {fields.map((field) => (
                  <div className="settings-sales-row" key={field.id}>
                    <label className="settings-sales-input">
                      <span>ENGLISH</span>
                      <input
                        className="settings-input"
                        value={field.english}
                        onChange={(event) =>
                          updateField(field.id, 'english', event.target.value)
                        }
                      />
                    </label>

                    <label className="settings-sales-input">
                      <span>URDU</span>
                      <input
                        className="settings-input settings-urdu-input"
                        dir="rtl"
                        value={field.urdu}
                        onChange={(event) =>
                          updateField(field.id, 'urdu', event.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="settings-remove-button"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PRINT */}
          {activeCategory === 'Print' && (
            <section className="settings-card settings-form-card">
              <div className="settings-card-heading">
                <div className="settings-card-title">
                  <span className="settings-round-icon">
                    <Printer size={19} />
                  </span>
                  <div>
                    <h3>Print Settings</h3>
                    <p>Default print format for invoices</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="settings-button settings-button-outline"
                  onClick={() => setSelectedPrint('A4')}
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
              </div>

              <label className="settings-label" htmlFor="print-format">
                DEFAULT FORMAT
              </label>

              <select
                id="print-format"
                className="settings-select"
                value={selectedPrint}
                onChange={(event) => setSelectedPrint(event.target.value)}
              >
                {printFormats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.name}
                  </option>
                ))}
              </select>

              <p className="settings-helper">
                New print jobs will open with this format
              </p>

              <div className="settings-print-heading">
                AVAILABLE FORMATS
              </div>

              <div className="settings-option-list">
                {printFormats.map((format) => {
                  const selected = selectedPrint === format.id

                  return (
                    <button
                      type="button"
                      key={format.id}
                      className={`settings-option-row settings-print-option ${
                        selected ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedPrint(format.id)}
                    >
                      <span className="settings-radio">
                        {selected && <span />}
                      </span>

                      <span className="settings-option-copy">
                        <strong>{format.name}</strong>
                        <small>{format.detail}</small>
                      </span>

                      {selected && (
                        <span className="settings-selected-label">
                          DEFAULT
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="settings-info-note">
                <Info size={16} />
                <span>
                  The selected print format is a frontend preference preview.
                </span>
              </div>
            </section>
          )}

          {/* HELP */}
          {activeCategory === 'Help' && (
            <div className="settings-help-content">
              <section className="settings-card settings-help-intro">
                <span className="settings-help-main-icon">
                  <CircleHelp size={27} />
                </span>
                <h3>Need help?</h3>
                <p>
                  Our team is here to help. Reach us on WhatsApp or Email —
                  we'll respond as soon as possible.
                </p>
              </section>

              <div className="settings-contact-grid">
                <a
                  className="settings-card settings-contact-card"
                  href="https://wa.me/923193236529"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="settings-contact-icon whatsapp">
                    <MessageCircle size={25} />
                  </span>
                  <span>
                    <strong>Contact on WhatsApp</strong>
                    <small>Send a message for instant response</small>
                    <b>+92 319 3236529</b>
                  </span>
                </a>

                <a
                  className="settings-card settings-contact-card"
                  href="mailto:nesticktech@gmail.com"
                >
                  <span className="settings-contact-icon">
                    <Mail size={25} />
                  </span>
                  <span>
                    <strong>Send an Email</strong>
                    <small>Describe your issue in detail</small>
                    <b>nesticktech@gmail.com</b>
                  </span>
                </a>
              </div>

              <section className="settings-card settings-company-card">
                <div className="settings-card-title">
                  <span className="settings-round-icon">
                    <UserRound size={19} />
                  </span>
                  <div>
                    <h3>Company Information</h3>
                    <p>Reach out to us</p>
                  </div>
                </div>

                <div className="settings-company-list">
                  <div>
                    <span>COMPANY</span>
                    <strong>Nestick Tech</strong>
                  </div>
                  <div>
                    <span>WHATSAPP</span>
                    <strong>+92 319 3236529</strong>
                  </div>
                  <div>
                    <span>EMAIL</span>
                    <strong>nesticktech@gmail.com</strong>
                  </div>
                  <div>
                    <span>AVAILABILITY</span>
                    <strong>Mon – Sat · 9am – 6pm</strong>
                  </div>
                </div>
              </section>

              <section className="settings-help-note">
                <div>
                  <Info size={18} />
                  <strong>For Faster Help</strong>
                </div>
                <ul>
                  <li>Describe your issue clearly</li>
                  <li>Include a screenshot or error message</li>
                  <li>Mention your company name and phone</li>
                </ul>
              </section>
            </div>
          )}

          <footer className="settings-footer">
            <span>Zakhira Management System</span>
            <span>Settings & Preferences</span>
          </footer>
      </div>
    </AppLayout>
  )
}
