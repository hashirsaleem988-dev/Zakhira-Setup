import type { ReactNode } from 'react'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

import './AppLayout.css'

type AppLayoutProps = {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  children: ReactNode
  className?: string
  overlay?: ReactNode
  showDecorations?: boolean
}

export default function AppLayout({
  activePage,
  onNavigate,
  onLogout,
  children,
  className,
  overlay,
  showDecorations = false,
}: AppLayoutProps) {
  const layoutClassName = ['dashboard-layout', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={layoutClassName}>
      {showDecorations && (
        <>
          <div className="dashboard-decoration decoration-one" />
          <div className="dashboard-decoration decoration-two" />
        </>
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        <Topbar />
        {children}
      </main>

      {overlay}
    </div>
  )
}
