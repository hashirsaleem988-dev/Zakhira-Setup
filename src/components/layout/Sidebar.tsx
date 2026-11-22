import { useState, type ElementType } from 'react'

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Calculator,
  Settings,
  UserRound,
  LogOut,
  ChevronDown,
} from 'lucide-react'

import BrandLogo from '../brand-logo'

type MenuItem = {
  label: string
  icon: ElementType
  children?: string[]
}

type SidebarProps = {
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Sales',
    icon: ShoppingBag,
    children: ['Record Book', 'Customer'],
  },
  {
    label: 'Inventory',
    icon: Package,
    children: ['Order', 'Vendor', 'Categories'],
  },
  {
    label: 'Accounting',
    icon: Calculator,
    children: ['Reports'],
  },
  { label: 'Settings', icon: Settings },
]

export default function Sidebar({
  activePage,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const handleMenuClick = (item: MenuItem) => {
    setExpandedMenu(null)
    onNavigate(item.label)
  }

  const handleDropdownClick = (label: string) => {
    setExpandedMenu((current) =>
      current === label ? null : label
    )
  }

  const handleSubmenuClick = (child: string) => {
    onNavigate(child)
  }

  const handleSidebarLeave = () => {
    setExpandedMenu(null)
  }

  return (
    <aside
      className="dashboard-sidebar"
      onMouseLeave={handleSidebarLeave}
    >
    {/* SIDEBAR BRAND */}

<div className="sidebar-brand">
  <span className="sidebar-brand-mark sidebar-brand-text">Z</span>

  <div className="sidebar-brand-logo">
    <BrandLogo />
  </div>
</div>

      {/* MAIN NAVIGATION BOX */}

      <nav
        className="sidebar-navigation sidebar-box"
        aria-label="Main navigation"
      >
        {menuItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedMenu === item.label

          const isActive =
            activePage === item.label ||
            item.children?.includes(activePage) === true

          const submenuId = `sidebar-submenu-${item.label.toLowerCase()}`

          return (
            <div
              className="sidebar-menu-group"
              key={item.label}
            >
              <div className="sidebar-item-row">
                {/* MAIN CATEGORY BUTTON */}

                <button
                  type="button"
                  className={`sidebar-item ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => handleMenuClick(item)}
                  aria-label={item.label}
                >
                  <span className="sidebar-icon">
                    <Icon size={21} strokeWidth={1.8} />
                  </span>

                  <span className="sidebar-item-label">
                    {item.label}
                  </span>
                </button>

                {/* DROPDOWN BUTTON */}

                {item.children && (
                  <button
                    type="button"
                    className={`sidebar-dropdown-toggle ${
                      isExpanded ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleDropdownClick(item.label)
                    }
                    aria-label={`Toggle ${item.label} submenu`}
                    aria-expanded={isExpanded}
                    aria-controls={submenuId}
                  >
                    <ChevronDown
                      className={`sidebar-chevron ${
                        isExpanded ? 'rotated' : ''
                      }`}
                      size={16}
                    />
                  </button>
                )}
              </div>

              {/* SUBMENU */}

              {item.children && isExpanded && (
                <div
                  className="sidebar-submenu"
                  id={submenuId}
                >
                  {item.children.map((child) => (
                    <button
                      type="button"
                      key={child}
                      className={`sidebar-submenu-item ${
                        activePage === child ? 'active' : ''
                      }`}
                      onClick={() =>
                        handleSubmenuClick(child)
                      }
                    >
                      <span className="submenu-dot" />
                      <span>{child}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ACCOUNT BOX */}

      <div className="sidebar-bottom sidebar-box">
        {/* ADMIN OWNER */}

        <div className="sidebar-owner">
          <span className="owner-avatar">
            <UserRound size={19} />
          </span>

          <span className="owner-details">
            <strong>Admin Owner</strong>
            <small>Administrator</small>
          </span>
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}