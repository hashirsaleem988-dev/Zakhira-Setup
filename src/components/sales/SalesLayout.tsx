
import AppLayout from '../layout/AppLayout'
import Sale from '../../pages/Sale'

import '../../styles/sales.css'

interface SalesLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export default function SalesLayout({
  activePage,
  onNavigate,
  onLogout,
}: SalesLayoutProps) {
  return (
    <AppLayout
      className="sales-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="sales-page-content">
        <Sale />
      </div>
    </AppLayout>
  )
}
