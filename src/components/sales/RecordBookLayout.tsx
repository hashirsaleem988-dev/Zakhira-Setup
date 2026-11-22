
import AppLayout from '../layout/AppLayout'
import RecordBook from '../../pages/RecordBook'

import '../../styles/recordBook.css'

interface RecordBookLayoutProps {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export default function RecordBookLayout({
  activePage,
  onNavigate,
  onLogout,
}: RecordBookLayoutProps) {
  return (
    <AppLayout
      className="record-book-layout"
      activePage={activePage}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="record-book-page-content">
        <RecordBook />
      </div>
    </AppLayout>
  )
}
