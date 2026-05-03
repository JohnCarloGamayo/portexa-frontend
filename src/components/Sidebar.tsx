import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, Key, Settings, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import sidebarExpandedLogo from '../assets/icons-branding/Portexa-lightbg.png';
import sidebarCollapsedLogo from '../assets/icons-branding/portexa-icon-removebg.png';
import clsx from 'clsx';
import { useEffect } from 'react';

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (value: boolean) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (value: boolean) => void;
}

const Sidebar = ({
  isCollapsed = false,
  setIsCollapsed,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen
}: SidebarProps) => {
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Portfolios', path: '/portfolios', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'API Keys', path: '/api-keys', icon: Key },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={clsx(
          "bg-slate-50 border-r border-slate-100 flex flex-col font-sans transition-all duration-300 z-50",
          "fixed md:static md:sticky inset-y-0 left-0 top-0 h-screen",
          isCollapsed ? "w-20" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className={clsx(
          "p-6 pb-8 border-b border-slate-100/50 flex items-start justify-between shrink-0",
          isCollapsed ? "flex-col items-center justify-center p-4 px-2" : ""
        )}>
          <Link to="/" className={clsx("flex flex-col gap-1 hover:opacity-80 transition cursor-pointer", isCollapsed ? "items-center" : "")}>
            <div className="flex items-center gap-2">
               {isCollapsed ? (
                 <img src={sidebarCollapsedLogo} alt="Portexa" className="w-8 h-8 object-contain" />
               ) : (
                 <img src={sidebarExpandedLogo} alt="Portexa" className="w-28 h-auto object-contain" />
               )}
            </div>
          </Link>

          {!isCollapsed && (
            <button 
              className="md:hidden text-slate-400 hover:text-slate-600 mt-1"
              onClick={() => setIsMobileMenuOpen?.(false)}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className={clsx(
          "flex-1 py-6 space-y-1.5 overflow-y-auto",
          isCollapsed ? "px-3" : "px-4"
        )}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex items-center rounded-xl text-sm font-semibold transition-colors group relative",
                  isCollapsed ? "justify-center py-3.5 px-0 w-12 mx-auto" : "px-4 py-3 gap-3 w-full",
                  isActive 
                    ? "bg-white text-brand-600 shadow-sm border border-slate-100/60" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 border border-transparent"
                )}
                title={isCollapsed ? "" : undefined}
              >
                <Icon className={clsx("w-5 h-5 shrink-0 transition-colors", isActive ? "text-brand-500" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                
                {!isCollapsed && (
                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="fixed ml-16 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] pointer-events-none shadow-lg hidden md:block">
                    {item.name}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 transform rotate-45"></div>
                  </div>
                )}

              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100 shrink-0 space-y-3">
          
          {/* New Portfolio Button */}
          <Link
            to="/portfolios"
            className={clsx(
              "w-full flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] transition text-sm relative group overflow-hidden",
              isCollapsed && "px-0 py-3"
            )}
            title={isCollapsed ? "New Portfolio" : undefined}
          >
            <Plus className={clsx("w-4 h-4 shrink-0", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>New Portfolio</span>}
          </Link>

          {/* Collapse Toggle (Desktop Only) */}
          <button 
            onClick={() => setIsCollapsed?.(!isCollapsed)}
            className="w-full hidden md:flex items-center text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 p-2 rounded-lg transition-colors border border-transparent"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
             <div className={clsx(
               "flex items-center transition-all w-full",
               isCollapsed ? "justify-center" : "justify-between px-2"
             )}>
               {isCollapsed ? (
                 <ChevronRight className="w-5 h-5" />
               ) : (
                 <>
                   <span className="text-sm font-semibold whitespace-nowrap">Collapse Menu</span>
                   <ChevronLeft className="w-5 h-5" />
                 </>
               )}
             </div>
          </button>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
