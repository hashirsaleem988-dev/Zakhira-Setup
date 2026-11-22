import { useState } from 'react'

import DashboardLayout from './components/dashboard/DashboardLayout'
import AccountingLayout from './components/accounting/AccountingLayout'
import ReportsLayout from './components/accounting/ReportsLayout'

import InventoryLayout from './components/inventory/InventoryLayout'
import OrdersLayout from './components/inventory/OrdersLayout'
import VendorLayout from './components/inventory/VendorLayout'
import CategoriesLayout from './components/inventory/CategoriesLayout'

import SalesLayout from './components/sales/SalesLayout'
import RecordBookLayout from './components/sales/RecordBookLayout'
import CustomerLayout from './components/sales/CustomerLayout'

import SettingsLayout from './components/settings/SettingsLayout'
import Login from './pages/login'

import './App.css'

/* ========================================
   PAGE TYPES
======================================== */

type ActivePage =
  | 'Dashboard'
  | 'Accounting'
  | 'Reports'
  | 'Inventory'
  | 'Sales'
  | 'Record Book'
  | 'Customer'
  | 'Settings'
  | 'Order'
  | 'Vendor'
  | 'Categories'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('zakhira-demo-auth') === 'true'
  )

  const [activePage, setActivePage] = useState<ActivePage>('Dashboard')

  /* ========================================
     LOGIN
  ======================================== */

  const handleLogin = () => {
    sessionStorage.setItem('zakhira-demo-auth', 'true')
    setIsLoggedIn(true)
    setActivePage('Dashboard')
  }

  /* ========================================
     LOGOUT
  ======================================== */

  const handleLogout = () => {
    sessionStorage.removeItem('zakhira-demo-auth')
    setIsLoggedIn(false)
    setActivePage('Dashboard')
  }

  /* ========================================
     PAGE NAVIGATION
  ======================================== */

  const handleNavigate = (page: string) => {
    console.log('Clicked Page:', page)

    const allowedPages: ActivePage[] = [
      'Dashboard',
      'Accounting',
      'Reports',
      'Inventory',
      'Sales',
      'Record Book',
      'Customer',
      'Settings',
      'Order',
      'Vendor',
      'Categories',
    ]

    if (allowedPages.includes(page as ActivePage)) {
      setActivePage(page as ActivePage)
    } else {
      console.warn('Page not registered:', page)
    }
  }

  /* ========================================
     LOGIN PAGE
======================================== */

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  /* ========================================
     CUSTOMER PAGE
======================================== */

  if (activePage === 'Customer') {
    return (
      <CustomerLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     RECORD BOOK PAGE
======================================== */

  if (activePage === 'Record Book') {
    return (
      <RecordBookLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     REPORTS PAGE
======================================== */

  if (activePage === 'Reports') {
    return (
      <ReportsLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     ORDERS PAGE
======================================== */

  if (activePage === 'Order') {
    return (
      <OrdersLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     VENDOR PAGE
======================================== */

  if (activePage === 'Vendor') {
    return (
      <VendorLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     INVENTORY PAGE
======================================== */

  if (activePage === 'Inventory') {
    return (
      <InventoryLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     CATEGORIES PAGE
======================================== */

  if (activePage === 'Categories') {
    return (
      <CategoriesLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     SALES PAGE
======================================== */

  if (activePage === 'Sales') {
    return (
      <SalesLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     ACCOUNTING PAGE
======================================== */

  if (activePage === 'Accounting') {
    return (
      <AccountingLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     SETTINGS PAGE
======================================== */

  if (activePage === 'Settings') {
    return (
      <SettingsLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )
  }

  /* ========================================
     DASHBOARD PAGE
======================================== */

  return (
    <DashboardLayout
      activePage={activePage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  )
}

export default App