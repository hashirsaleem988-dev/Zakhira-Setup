
import { useEffect, useMemo, useState } from 'react'
import {
  X,
  Plus,
  Upload,
  Check,
  Image as ImageIcon,
} from 'lucide-react'
import '../../styles/add-product-modal.css'

type ProductFormData = {
  sku: string
  name: string
  price: number
  costPrice: number
  category: string
  stock: number
  lowStockAlert: number
  unit: string
  description: string
  images: File[]
}

type AddProductModalProps = {
  onClose: () => void
  onSave: (product: ProductFormData) => void
}

const AddProductModal = ({
  onClose,
  onSave,
}: AddProductModalProps) => {
  const [sku] = useState(
    () => `SKU-${Math.floor(1000 + Math.random() * 9000)}`
  )

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [stock, setStock] = useState('10')
  const [lowStockAlert, setLowStockAlert] = useState('5')
  const [unit, setUnit] = useState('Piece')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [error, setError] = useState('')

  const profit = useMemo(() => {
    const selling = Number(price) || 0
    const cost = Number(costPrice) || 0
    return selling - cost
  }, [price, costPrice])

  const previews = useMemo(
    () => images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    })),
    [images]
  )

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [previews])

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || [])
    const remainingSlots = 5 - images.length
    const validFiles = selectedFiles
      .filter((file) =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      )
      .slice(0, remainingSlots)

    setImages((previous) => [...previous, ...validFiles])
    event.target.value = ''
  }

  const removeImage = (index: number) => {
    setImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    )
  }

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim()

    if (!trimmedCategory) return

    if (
      categories.some(
        (item) => item.toLowerCase() === trimmedCategory.toLowerCase()
      )
    ) {
      setError('This category already exists.')
      return
    }

    setCategories((previous) => [...previous, trimmedCategory])
    setCategory(trimmedCategory)
    setNewCategory('')
    setShowCategoryInput(false)
    setError('')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !price || Number(price) <= 0) {
      setError('Please enter product name and a valid selling price.')
      return
    }

    if (!category) {
      setError('Please select a category.')
      return
    }

    if (Number(stock) < 0 || Number(lowStockAlert) < 0) {
      setError('Stock values cannot be negative.')
      return
    }

    onSave({
      sku,
      name: name.trim(),
      price: Number(price),
      costPrice: Number(costPrice) || 0,
      category,
      stock: Number(stock) || 0,
      lowStockAlert: Number(lowStockAlert) || 0,
      unit,
      description: description.trim(),
      images,
    })
  }

  return (
    <div className="add-product-overlay" onMouseDown={onClose}>
      <section
        className="add-product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="add-product-header">
          <div>
            <h2 id="add-product-title">Add Product</h2>
            <p>SKU: {sku} (auto-generated)</p>
          </div>

          <button
            type="button"
            className="add-product-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </header>

        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="add-product-fields">
            <div className="add-product-grid two-columns">
              <div className="add-product-field">
                <label>Product Name <span>*</span></label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="add-product-field">
                <label>Price <span>*</span></label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1250"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </div>

              <div className="add-product-field">
                <label>Cost Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={costPrice}
                  onChange={(event) => setCostPrice(event.target.value)}
                />
                <small>Purchase cost — used for profit calculation</small>
              </div>

              <div className="add-product-field">
                <label>Profit</label>
                <div className="add-product-profit">
                  {price ? profit.toFixed(2) : '—'}
                </div>
                <small>per unit</small>
              </div>
            </div>

            <div className="add-product-field category-field">
              <label>Category <span>*</span></label>

              <div className="add-product-category-row">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="Uncategorized">Uncategorized</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <button
                  type="button"
                  className="add-category-btn"
                  onClick={() => setShowCategoryInput((previous) => !previous)}
                >
                  <Plus size={18} /> Add
                </button>
              </div>

              {showCategoryInput ? (
                <div className="add-category-input-row">
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                  />
                  <button type="button" onClick={handleAddCategory}>
                    Add Category
                  </button>
                </div>
              ) : (
                <small>
                  {categories.length === 0
                    ? 'No categories yet — click Add to create one'
                    : 'Select a category for this product'}
                </small>
              )}
            </div>

            <div className="add-product-grid three-columns">
              <div className="add-product-field">
                <label>Stock <span>*</span></label>
                <input
                  type="number"
                  min="0"
                  placeholder="10"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                />
              </div>

              <div className="add-product-field">
                <label>Low Stock Alert At</label>
                <input
                  type="number"
                  min="0"
                  placeholder="5"
                  value={lowStockAlert}
                  onChange={(event) => setLowStockAlert(event.target.value)}
                />
              </div>

              <div className="add-product-field">
                <label>Measuring Unit <span>*</span></label>
                <select
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                >
                  <option>Piece</option>
                  <option>Box</option>
                  <option>Kg</option>
                  <option>Gram</option>
                  <option>Liter</option>
                  <option>Meter</option>
                  <option>Set</option>
                  <option>Dozen</option>
                </select>
              </div>
            </div>

            <div className="add-product-field">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Optional description..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="add-product-field">
              <label>Images ({images.length}/5) <span>*</span></label>

              <div className="product-image-upload-area">
                {previews.map((preview, index) => (
                  <div className="product-image-preview" key={`${preview.file.name}-${index}`}>
                    <img src={preview.url} alt={`Product ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="product-upload-box">
                    <Upload size={21} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                )}

                {images.length === 0 && (
                  <div className="product-upload-placeholder">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>

              <small>JPG, PNG, WEBP • Max 5 images • First image = thumbnail</small>
            </div>

            {error && <p className="add-product-error">{error}</p>}
          </div>

          <footer className="add-product-footer">
            <button type="submit" className="save-product-btn">
              <Check size={17} /> Save Product
            </button>

            <button
              type="button"
              className="cancel-product-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default AddProductModal
