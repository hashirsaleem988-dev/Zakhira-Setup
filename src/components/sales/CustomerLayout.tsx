
import AppLayout from '../layout/AppLayout'
import Customer from '../../pages/Customer'
import '../../styles/customer.css'

interface CustomerLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export default function CustomerLayout({
  activePage,
  onNavigate,
  onLogout,
}: CustomerLayoutProps) {
  return (
    <AppLayout
      className="customer-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="customer-page-content">
        <Customer />
      </div>
    </AppLayout>
  )
}
