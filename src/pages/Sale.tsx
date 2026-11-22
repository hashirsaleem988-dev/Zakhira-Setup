
import { useMemo, useRef, useState } from "react";



import html2canvas from "html2canvas";

import { UserRound } from 'lucide-react'

import { jsPDF } from "jspdf";


import BrandLogo from '../components/brand-logo'


import {



  



  FileText,



  Package,



  Wallet,



  Plus,



  Trash2,



  Search,



  Eye,



  Save,



  Download,



  Printer,



  RotateCcw,



  XCircle,



  MessageCircle,



  SlidersHorizontal,



  AlertTriangle,



} from "lucide-react";





const COUNTRY_CODE = "+966";





type Customer = {



  id: number;



  name: string;



  company: string;



  email: string;



  phone: string;



  city: string;



  address: string;



  vatNumber: string;



};





type Product = {



  id: number;



  name: string;



  price: number;



  image?: string;



};





type SaleItem = {



  id: number;



  productId: number | "";



  quantity: number;



  unitPrice: number;



};





const customers: Customer[] = [];





const inventory: Product[] = [];





const initialItem = (): SaleItem => ({



  id: Date.now() + Math.random(),



  productId: "",



  quantity: 1,



  unitPrice: 0,



});





const currency = (amount: number) =>



  amount.toLocaleString("en-US", {



    minimumFractionDigits: 2,



    maximumFractionDigits: 2,



  });





const getLocalPhone = (phone: string) =>
  phone.replace(/^\+?966/, "").replace(/\D/g, "");





export default function Sale() {



  const [customer, setCustomer] = useState<Customer | null>(null);



  const [customerSearch, setCustomerSearch] = useState("");



  const [customerName, setCustomerName] = useState("");



  const [company, setCompany] = useState("");



  const [email, setEmail] = useState("");



  const [phone, setPhone] = useState("");



  const [city, setCity] = useState("");



  const [address, setAddress] = useState("");



  const [vatNumber, setVatNumber] = useState("");



  const [vatRate, setVatRate] = useState(15);





  const [invoiceDate, setInvoiceDate] = useState(



    new Date().toISOString().slice(0, 10)



  );





  const [items, setItems] = useState<SaleItem[]>([initialItem()]);



  const [discount, setDiscount] = useState(0);



  const [amountReceived, setAmountReceived] = useState(0);



  const [notes, setNotes] = useState("");





  const [showCustomers, setShowCustomers] = useState(false);



  const [showPreview, setShowPreview] = useState(false);



const [previewType, setPreviewType] = useState<"invoice" | "quotation">("invoice");





const previewDocumentRef = useRef<HTMLDivElement>(null);



  const [invoiceSearch, setInvoiceSearch] = useState("");



  const [dateFrom, setDateFrom] = useState("");



  const [dateTo, setDateTo] = useState("");



  const [sortBy, setSortBy] = useState("newest");



const [paymentFilter, setPaymentFilter] = useState("all");



const [activeSaleTab, setActiveSaleTab] = useState("invoices");



  const subtotal = useMemo(



    () =>



      items.reduce(



        (total, item) => total + item.quantity * item.unitPrice,



        0



      ),



    [items]



  );





  const discountAmount = subtotal * (discount / 100);



  const discountedSubtotal = subtotal - discountAmount;



  const vatAmount = discountedSubtotal * (vatRate / 100);



  const grandTotal = discountedSubtotal + vatAmount;



  const balanceDue = Math.max(0, grandTotal - amountReceived);





  const paymentStatus =



    grandTotal > 0 && amountReceived >= grandTotal



      ? "PAID"



      : amountReceived > 0



        ? "PARTIAL"



        : "UNPAID";





  const fullPhone = phone.trim()



    ? `${COUNTRY_CODE}${phone.replace(/\D/g, "")}`



    : "";





  const filteredCustomers = customers.filter((item) =>



    `${item.name} ${item.company} ${item.phone}`



      .toLowerCase()



      .includes(customerSearch.toLowerCase())



  );





  const selectCustomer = (selected: Customer) => {



    setCustomer(selected);



    setCustomerName(selected.name);



    setCompany(selected.company);



    setEmail(selected.email);



    setPhone(getLocalPhone(selected.phone));



    setCity(selected.city);



    setAddress(selected.address);



    setVatNumber(selected.vatNumber);



    setShowCustomers(false);



    setCustomerSearch("");



  };





  const updateItem = (



    id: number,



    field: keyof SaleItem,



    value: number | string



  ) => {



    setItems((previous) =>



      previous.map((item) => {



        if (item.id !== id) return item;





        if (field === "productId") {



          const product = inventory.find(



            (product) => product.id === Number(value)



          );





          return {



            ...item,



            productId: value === "" ? "" : Number(value),



            unitPrice: product?.price ?? 0,



          };



        }





        return { ...item, [field]: Number(value) };



      })



    );



  };





  const addProduct = () => {



    setItems((previous) => [...previous, initialItem()]);



  };





  const removeProduct = (id: number) => {



    setItems((previous) =>



      previous.length > 1



        ? previous.filter((item) => item.id !== id)



        : previous



    );



  };





  const getDraft = () => ({



    customer,



    customerName,



    company,



    email,



    phone,



    city,



    address,



    vatNumber,



    vatRate,



    invoiceDate,



    items,



    discount,



    amountReceived,



    notes,



  });





  const saveDraft = () => {



    localStorage.setItem(



      "zakhira-sale-draft",



      JSON.stringify(getDraft())



    );





    alert("Draft saved successfully.");



  };





  const restoreDraft = () => {



    const saved = localStorage.getItem("zakhira-sale-draft");





    if (!saved) {



      alert("No saved draft found.");



      return;



    }





    try {



      const draft = JSON.parse(saved);





      setCustomer(draft.customer ?? null);



      setCustomerName(draft.customerName ?? "");



      setCompany(draft.company ?? "");



      setEmail(draft.email ?? "");



      setPhone(getLocalPhone(draft.phone ?? ""));



      setCity(draft.city ?? "");



      setAddress(draft.address ?? "");



      setVatNumber(draft.vatNumber ?? "");



      setVatRate(draft.vatRate ?? 15);



      setInvoiceDate(draft.invoiceDate ?? "");



      setItems(draft.items?.length ? draft.items : [initialItem()]);



      setDiscount(draft.discount ?? 0);



      setAmountReceived(draft.amountReceived ?? 0);



      setNotes(draft.notes ?? "");





      alert("Draft restored successfully.");



    } catch {



      alert("Unable to restore this draft.");



    }



  };





  const resetForm = () => {



    if (!window.confirm("Are you sure you want to reset this form?")) return;





    setCustomer(null);



    setCustomerName("");



    setCompany("");



    setEmail("");



    setPhone("");



    setCity("");



    setAddress("");



    setVatNumber("");



    setVatRate(15);



    setInvoiceDate(new Date().toISOString().slice(0, 10));



    setItems([initialItem()]);



    setDiscount(0);



    setAmountReceived(0);



    setNotes("");



    setShowPreview(false);



  };




const createInvoice = () => {
  if (!customerName.trim()) {
    alert("Please enter or select a customer.");
    return;
  }

  if (!phone.trim()) {
    alert("Please enter the customer's mobile number.");
    return;
  }
  if (!address.trim()) {
  alert("Please enter the customer's address.");
  return;
}

  if (!items.some((item) => item.productId !== "" && item.quantity > 0)) {
    alert("Please add at least one valid product.");
    return;
  }

  // Backend/API integration will be added here.
  alert("Invoice details are ready. Backend integration is pending.");
};





  const sendWhatsApp = () => {

    if (!phone.trim()) {

      alert("Please enter the customer's mobile number.");

      return;

    }



    const message = [

      `Hello ${customerName || "Customer"},`,

      `Here are your ${previewType === "quotation" ? "quotation" : "invoice"} details:`,

      `Subtotal: ${currency(subtotal)}`,

      `Discount: ${discount}%`,

      `VAT: ${currency(vatAmount)}`,

      `Grand Total: ${currency(grandTotal)}`,

      `Amount Received: ${currency(amountReceived)}`,

      `Balance Due: ${currency(balanceDue)}`,

    ].join("\n");



    const whatsappPhone = fullPhone.replace(/\D/g, "");

    window.open(

      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,

      "_blank",

      "noopener,noreferrer"

    );

  };



  const handleDownloadPDF = async () => {

    const documentElement = previewDocumentRef.current;

    if (!documentElement) {

      alert("Preview document is not ready. Please open Preview again.");

      return;

    }



    try {

      const canvas = await html2canvas(documentElement, {

        scale: 2,

        useCORS: true,

        backgroundColor: "#FFFFFF",

        logging: false,

      });



      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 190;

      const pageHeight = 277;

      const imageHeight = (canvas.height * pageWidth) / canvas.width;

      const totalPages = Math.max(1, Math.ceil(imageHeight / pageHeight));



      for (let page = 0; page < totalPages; page += 1) {

        if (page > 0) pdf.addPage();

        pdf.addImage(

          imageData,

          "PNG",

          10,

          10 - page * pageHeight,

          pageWidth,

          imageHeight,

          undefined,

          "FAST"

        );

      }



      const prefix = previewType === "invoice" ? "INV" : "QT";

      pdf.save(`${prefix}-${invoiceDate}.pdf`);

    } catch (error) {

      console.error("PDF generation failed:", error);

      alert("Unable to generate PDF. Please try again.");

    }

  };



  const handlePrint = () => {

    if (!previewDocumentRef.current) {

      alert("Preview document is not ready. Please open Preview again.");

      return;

    }

    window.print();

  };



  return (      <main className="sale-page">





        <header className="sale-header">



          <div className="sale-header-info">



            <span className="sale-eyebrow">



              SALES OVERVIEW



            </span>





            <h1>Sales - Invoice / Quotation</h1>





            <p>



              Create a quotation or invoice, send via WhatsApp



            </p>



          </div>



        </header>





        <div className="sale-toolbar">





          <button type="button" onClick={saveDraft}>



            <Save size={17} /> Save Draft



          </button>





          <button type="button" onClick={restoreDraft}>



            <RotateCcw size={17} /> Restore



          </button>





          <button type="button" onClick={resetForm}>



            <XCircle size={17} /> Reset



          </button>





        </div>





        <div className="sale-layout">





          <div className="sale-main-column">





            {/* CUSTOMER INFORMATION */}





            <section className="sale-card">





              <div className="sale-customer-header">





              <div className="customer-info-heading">
  <span className="customer-info-3d-icon">
    <UserRound size={22} strokeWidth={2.2} />
  </span>

  <h2>Customer Information</h2>
</div>





                <div className="sale-customer-search">





                  <Search size={17} />





                  <input



                    value={customerSearch}



                    onChange={(e) => {



                      setCustomerSearch(e.target.value);



                      setShowCustomers(true);



                    }}



                    onFocus={() => setShowCustomers(true)}



                    placeholder="Type or select customer..."



                  />





                  {showCustomers && (



                    <div className="sale-customer-dropdown">





                      {filteredCustomers.length ? (



                        filteredCustomers.map((item) => (



                          <button



                            type="button"



                            key={item.id}



                            onClick={() => selectCustomer(item)}



                          >



                            <strong>{item.name}</strong>



                            <span>



                              {item.company} · {item.phone}



                            </span>



                          </button>



                        ))



                      ) : (



                        <p>No matching customer found.</p>



                      )}





                    </div>



                  )}





                </div>





              </div>





              <p className="sale-helper">



                Details fill in automatically - you can still edit them



              </p>





              <div className="sale-form-grid">





                <label>



                  Customer Name





                  <input



                    value={customerName}



                    onChange={(e) => setCustomerName(e.target.value)}



                    placeholder="Enter Customer Name"



                  />



                </label>





                <label>



                  Company





                  <input



                    value={company}



                    onChange={(e) => setCompany(e.target.value)}



                    placeholder="Enter Company"



                  />



                </label>





                <label>



                  Email





                  <input



                    type="email"



                    value={email}



                    onChange={(e) => setEmail(e.target.value)}



                    placeholder="Enter Email Address"



                  />



                </label>





                <label>



                  Phone Number





                  <div className="sale-phone-field">





                    <span className="sale-country-code">



                      +966



                    </span>





                    <input



                      type="tel"



                      inputMode="numeric"



                      value={phone}



                      onChange={(e) =>



                        setPhone(e.target.value.replace(/\D/g, ""))



                      }



                      placeholder="50 123 4567"



                    />





                  </div>



                </label>





                <label>



                  City





                  <input



                    value={city}



                    onChange={(e) => setCity(e.target.value)}



                    placeholder="Enter City"



                  />



                </label>





                <label className="sale-full-width">



                  Address





                  <input



                    value={address}



                    onChange={(e) => setAddress(e.target.value)}



                    placeholder="Enter Address"



                  />



                </label>





              </div>





              <p className="sale-helper">



                Country code +966 is fixed. Enter the mobile number only.



              </p>





            </section>





            {/* ORDER DETAILS */}





            <section className="sale-card">





              
<div className="order-details-heading">
  <span className="order-details-3d-icon">
    <FileText size={22} strokeWidth={2.2} />
  </span>

  <h2>Order Details</h2>
</div>





              <div className="sale-form-grid">





                <label>



                  VAT Number (Customer)





                  <input



                    value={vatNumber}



                    onChange={(e) => setVatNumber(e.target.value)}



                    placeholder="Enter VAT Number"



                  />



                </label>





                <label>



                  VAT Rate (%)





                  <input



                    type="number"



                    min="0"



                    max="100"



                    value={vatRate}



                    onChange={(e) =>



                      setVatRate(Math.max(0, Number(e.target.value)))



                    }



                  />



                </label>





                <label>



                  Invoice Date





                  <input



                    type="date"



                    value={invoiceDate}



                    onChange={(e) => setInvoiceDate(e.target.value)}



                  />



                </label>





              </div>





            </section>





            {/* PRODUCTS */}





            <section className="sale-card">




<div className="products-heading">
 <span className="products-3d-icon">
  <Package size={22} strokeWidth={2.2} />
</span>
  <h2>Products (From Inventory)</h2>
</div>





              {inventory.length === 0 && (



                <div className="sale-warning">



                  <AlertTriangle size={18} />



                  No products in inventory.



                </div>



              )}





              {items.map((item, index) => {





                const product = inventory.find(



                  (product) => product.id === item.productId



                );





                return (



                  <div className="sale-product-row" key={item.id}>





                    <div className="sale-product-row-top">





                      <strong>



                        ITEM {index + 1}



                      </strong>





                      <button



                        type="button"



                        aria-label="Remove product"



                        onClick={() => removeProduct(item.id)}



                      >



                        <Trash2 size={17} />



                      </button>





                    </div>





                    <div className="sale-product-grid">





                      <label className="sale-product-select">



                        Product *





                        <select



                          value={item.productId}



                          onChange={(e) =>



                            updateItem(item.id, "productId", e.target.value)



                          }



                        >



                          <option value="">



                            Select Product



                          </option>





                          {inventory.map((product) => (



                            <option



                              key={product.id}



                              value={product.id}



                            >



                              {product.name}



                            </option>



                          ))}





                        </select>



                      </label>





                      <label>



                        Quantity





                        <input



                          type="number"



                          min="1"



                          value={item.quantity}



                          onChange={(e) =>



                            updateItem(item.id, "quantity", e.target.value)



                          }



                        />



                      </label>





                      <div className="sale-product-image">



                        <span>Product Image</span>





                        {product?.image ? (



                          <img



                            src={product.image}



                            alt={product.name}



                          />



                        ) : (



                          <div>



                            <Package size={20} />



                          </div>



                        )}



                      </div>





                      <label>



                        Unit Price





                        <input



                          type="number"



                          min="0"



                          value={item.unitPrice}



                          onChange={(e) =>



                            updateItem(item.id, "unitPrice", e.target.value)



                          }



                        />



                      </label>





                      <label>



                        Line Total





                        <input



                          value={currency(item.quantity * item.unitPrice)}



                          readOnly



                        />



                      </label>





                    </div>





                  </div>



                );



              })}





              <button



                type="button"



                className="sale-add-product"



                onClick={addProduct}



              >



                <Plus size={18} /> Add Product



              </button>





            </section>





            {/* GRAND TOTAL */}





            <section className="sale-card">





            <div className="grand-total-heading">
  <span className="grand-total-3d-icon">
    <Wallet size={22} strokeWidth={2.2} />
  </span>

  <h2>Grand Total</h2>
</div>




              <div className="sale-form-grid">





                <label>



                  Total Amount



                  <input value={currency(subtotal)} readOnly />



                </label>





                <label>



                  Discount (%)





                  <input



                    type="number"



                    min="0"



                    max="100"



                    value={discount}



                    onChange={(e) =>



                      setDiscount(



                        Math.min(100, Math.max(0, Number(e.target.value)))



                      )



                    }



                    placeholder="Enter Discount"



                  />



                </label>





                <label>



                  Discounted Price (before VAT)



                  <input



                    value={currency(discountedSubtotal)}



                    readOnly



                  />



                </label>





                <label>



                  VAT Amount



                  <input value={currency(vatAmount)} readOnly />



                </label>





                <label>



                  Grand Total



                  <input value={currency(grandTotal)} readOnly />



                </label>





              </div>





            </section>





            {/* PAYMENT DETAILS */}





            <section className="sale-card">





             <div className="sale-section-heading">

  <span className="payment-details-3d-icon">
    <Wallet size={22} strokeWidth={2.2} />
  </span>

  <h2>Payment Details</h2>

  <span className={`sale-status ${paymentStatus.toLowerCase()}`}>
    {paymentStatus}
  </span>

</div>





              <div className="sale-form-grid">





                <label>



                  Amount Received





                  <input



                    type="number"



                    min="0"



                    max={grandTotal}



                    value={amountReceived}



                    onChange={(e) =>



                      setAmountReceived(



                        Math.min(grandTotal, Math.max(0, Number(e.target.value)))



                      )



                    }



                  />



                </label>





                <label>



                  Balance Due





                  <input



                    value={currency(balanceDue)}



                    readOnly



                  />



                </label>





              </div>





            </section>





            {/* ACTIONS */}





            <section className="sale-card">





              <div className="sale-section-heading">

  <span className="actions-3d-icon">
    <FileText size={22} strokeWidth={2.2} />
  </span>

  <h2>Actions</h2>

</div>





              <div className="sale-action-buttons">





                <button



                  type="button"



                  onClick={sendWhatsApp}



                >



                  <MessageCircle size={19} />



                  Send via WhatsApp



                </button>





                <button



                  type="button"



                  className="sale-primary-btn"



                  onClick={createInvoice}



                >



                  <FileText size={18} />



                  Create Invoice



                </button>





              </div>





            </section>            {/* NOTES */}





            <section className="sale-card">





             <div className="sale-section-heading">

  <span className="notes-3d-icon">
    <FileText size={22} strokeWidth={2.2} />
  </span>

  <h2>Notes</h2>

</div>





              <label>



                Notes





                <textarea



                  value={notes}



                  onChange={(e) => setNotes(e.target.value)}



                  placeholder="Delivery, Payment Terms or Other Notes..."



                  rows={4}



                />



              </label>





            </section>





          </div>





          {/* RIGHT SIDE SUMMARY */}





          <aside className="sale-side-column">





            <section className="sale-card sale-summary">





              <div className="sale-summary-heading">





                <div className="sale-summary-brand">
  <BrandLogo />
</div>





                <button



                  type="button"



                  onClick={() => setShowPreview(true)}



                >



                  <Eye size={17} /> Preview



                </button>





              </div>





              <p className="sale-draft-label">



                DRAFT (NOT SAVED)



              </p>





              <strong>



                QT-2026-0001 / INV-2026-0001



              </strong>





              <p>{invoiceDate}</p>





              <div className="sale-summary-customer">



                {customerName || "No Customer Selected"}



              </div>





              <div className="sale-summary-line">



                <span>Subtotal</span>



                <strong>{currency(subtotal)}</strong>



              </div>





              <div className="sale-summary-line">



                <span>VAT</span>



                <strong>{currency(vatAmount)}</strong>



              </div>





              <div className="sale-summary-line sale-grand-total">



                <span>Grand Total</span>



                <strong>{currency(grandTotal)}</strong>



              </div>





              <div className="sale-summary-line">



                <span>Balance Due</span>



                <strong>{currency(balanceDue)}</strong>



              </div>





            </section>





          </aside>





        </div>





        {/* INVOICE FILTERS */}





        <section className="sale-card sale-invoice-list">





         <div className="sale-section-heading">

  <span className="filters-3d-icon">
    <SlidersHorizontal size={22} strokeWidth={2.2} />
  </span>

  <h2>Filters</h2>

</div>





          <div className="sale-filter-grid">





            <label>



              Search





              <input



                value={invoiceSearch}



                onChange={(e) => setInvoiceSearch(e.target.value)}



                placeholder="Search invoice or customer..."



              />



            </label>





            <label>



              Date From





              <input



                type="date"



                value={dateFrom}



                onChange={(e) => setDateFrom(e.target.value)}



              />



            </label>





            <label>



              Date To





              <input



                type="date"



                value={dateTo}



                onChange={(e) => setDateTo(e.target.value)}



              />



            </label>





            <label>



              Sort By





              <select



                value={sortBy}



                onChange={(e) => setSortBy(e.target.value)}



              >



                <option value="newest">Newest First</option>



                <option value="oldest">Oldest First</option>



                <option value="highest">Highest Amount</option>



                <option value="lowest">Lowest Amount</option>



              </select>



            </label>



            <label>



  Payment





  <select



    value={paymentFilter}



    onChange={(e) => setPaymentFilter(e.target.value)}



  >



    <option value="all">All Payments</option>



    <option value="paid">Paid</option>



    <option value="unpaid">Unpaid</option>



    <option value="partial">Partial Payment</option>



  </select>



</label>



          </div>





{/* SALES TABS */}





<div className="sale-record-tabs">





  <button



    type="button"



    className={activeSaleTab === "invoices" ? "active" : ""}



    onClick={() => setActiveSaleTab("invoices")}



  >



    Invoices



  </button>





  <button



    type="button"



    className={activeSaleTab === "quotations" ? "active" : ""}



    onClick={() => setActiveSaleTab("quotations")}



  >



    Quotations



  </button>





  <button



    type="button"



    className={activeSaleTab === "approved" ? "active" : ""}



    onClick={() => setActiveSaleTab("approved")}



  >



    Approved



  </button>





  <button



    type="button"



    className={activeSaleTab === "rejected" ? "active" : ""}



    onClick={() => setActiveSaleTab("rejected")}



  >



    Rejected



  </button>





</div>





          <div className={`sale-invoice-table ${activeSaleTab}`}>



            <p>



              Invoice records will appear here after backend integration.



            </p>



          </div>





        </section>





        {/* INVOICE PREVIEW MODAL */}





        {showPreview && (

          <div className="sale-preview-overlay" role="dialog" aria-modal="true" aria-label="Document preview">

            <div className="sale-preview-modal">

              <div className="sale-preview-toolbar">

                <div className="sale-preview-type-switch" role="group" aria-label="Document type">

                  <button

                    type="button"

                    className={previewType === "invoice" ? "active" : ""}

                    onClick={() => setPreviewType("invoice")}

                  >

                    Invoice

                  </button>

                  <button

                    type="button"

                    className={previewType === "quotation" ? "active" : ""}

                    onClick={() => setPreviewType("quotation")}

                  >

                    Quotation

                  </button>

                </div>

                <div className="sale-preview-actions">

                  <button type="button" onClick={handleDownloadPDF}>

                    <Download size={16} /> Download PDF

                  </button>

                  <button type="button" onClick={handlePrint}>

                    <Printer size={16} /> Print

                  </button>

                  <button

                    type="button"

                    className="sale-preview-close"

                    onClick={() => setShowPreview(false)}

                    aria-label="Close preview"

                  >

                    <XCircle size={21} />

                  </button>

                </div>

              </div>



              <div className="sale-preview-scroll">

                <div className="sale-preview-document" ref={previewDocumentRef}>

                  <div className="sale-preview-document-header">

                    <div>

                      <p className="sale-preview-brand">ZAKHIRA</p>

                      <p className="sale-preview-subtitle">Sales & Inventory Management</p>

                    </div>

                    <div className="sale-preview-document-title">

                      <h2>{previewType === "invoice" ? "TAX INVOICE" : "QUOTATION"}</h2>

                      <span className={`sale-preview-status sale-preview-status-${paymentStatus.toLowerCase()}`}>

                        {previewType === "quotation" ? "QUOTATION" : paymentStatus}

                      </span>

                    </div>

                  </div>



                  <div className="sale-preview-meta-grid">

                    <div>

                      <h3>Bill To</h3>

                      <p><strong>{customerName || "Customer name not entered"}</strong></p>

                      {company && <p>{company}</p>}

                      <p>{fullPhone || "Mobile number not entered"}</p>

                      {email && <p>{email}</p>}

                      {address && <p>{address}</p>}

                      {city && <p>{city}</p>}

                      {vatNumber && <p>VAT No: {vatNumber}</p>}

                    </div>

                    <div className="sale-preview-document-info">

                      <p><span>Document type</span><strong>{previewType === "invoice" ? "Invoice" : "Quotation"}</strong></p>

                      <p><span>Date</span><strong>{invoiceDate || "—"}</strong></p>

                      <p><span>Payment status</span><strong>{previewType === "quotation" ? "Pending" : paymentStatus}</strong></p>

                    </div>

                  </div>



                  <div className="sale-preview-items-wrap">

                    <table className="sale-preview-items">

                      <thead>

                        <tr>

                          <th>#</th>

                          <th>Product / Description</th>

                          <th>Qty</th>

                          <th>Unit Price</th>

                          <th>VAT</th>

                          <th className="numeric">Amount</th>

                        </tr>

                      </thead>

                      <tbody>

                        {items.map((item, index) => {

                          const product = inventory.find((entry) => entry.id === item.productId);

                          const lineSubtotal = item.quantity * item.unitPrice;

                          const lineVat = lineSubtotal * (vatRate / 100);

                          return (

                            <tr key={item.id}>

                              <td>{index + 1}</td>

                              <td>{product?.name || (item.productId === "" ? "Product not selected" : `Product #${item.productId}`)}</td>

                              <td>{item.quantity}</td>

                              <td>{currency(item.unitPrice)}</td>

                              <td>{vatRate}%</td>

                              <td className="numeric">{currency(lineSubtotal + lineVat)}</td>

                            </tr>

                          );

                        })}

                      </tbody>

                    </table>

                  </div>



                  <div className="sale-preview-bottom-grid">

                    <div className="sale-preview-notes">

                      <h3>Notes</h3>

                      <p>{notes.trim() || "Thank you for your business."}</p>

                    </div>

                    <div className="sale-preview-totals">

                      <p><span>Subtotal</span><strong>{currency(subtotal)}</strong></p>

                      <p><span>Discount ({discount}%)</span><strong>- {currency(discountAmount)}</strong></p>

                      <p><span>VAT ({vatRate}%)</span><strong>{currency(vatAmount)}</strong></p>

                      <p className="sale-preview-grand-total"><span>Grand Total</span><strong>{currency(grandTotal)}</strong></p>

                      {previewType === "invoice" && <>

                        <p><span>Amount Received</span><strong>{currency(amountReceived)}</strong></p>

                        <p><span>Balance Due</span><strong>{currency(balanceDue)}</strong></p>

                      </>}

                    </div>

                  </div>

                  <div className="sale-preview-footer">Generated by Zakhira · {invoiceDate}</div>

                </div>

              </div>

            </div>

            <style>{`@media print {

              @page { size: A4; margin: 12mm; }

              body * { visibility: hidden !important; }

              .sale-preview-document, .sale-preview-document * { visibility: visible !important; }

              .sale-preview-document { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; }

              .sale-preview-overlay, .sale-preview-modal, .sale-preview-scroll { position: static !important; display: block !important; overflow: visible !important; width: auto !important; height: auto !important; max-height: none !important; background: #fff !important; padding: 0 !important; box-shadow: none !important; }

              .sale-preview-toolbar { display: none !important; }

              .sale-preview-items { width: 100% !important; }

            }`}</style>

          </div>

        )}


        <footer className="sale-footer">
  <span>© 2026 Zakhira Management System</span>
  <span>Designed for smarter business management</span>
</footer>
      </main>



  );



}