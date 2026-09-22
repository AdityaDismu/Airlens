import { NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  Map,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { to: '/routes', label: 'Route Explorer', icon: Map, group: 'Explore' },
  { to: '/analytics', label: 'Analytics', icon: LineChart, group: 'Explore' },
  { to: '/quality', label: 'Data Quality', icon: ShieldCheck, group: 'Operations' },
  { to: '/pipeline', label: 'Collection Pipeline', icon: Zap, group: 'Operations' },
  { to: '/backtesting', label: 'Backtesting', icon: BarChart3, group: 'Research' },
  { to: '/methodology', label: 'Methodology', icon: BookOpen, group: 'Research' },
  { to: '/system', label: 'System Status', icon: Activity, group: 'System' },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const groups = ['Overview', 'Explore', 'Operations', 'Research', 'System'];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-[#16202B]/35 backdrop-blur-[2px] lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-30 flex h-screen w-[248px] flex-col border-r border-white/10 bg-[#16202B] shadow-[10px_0_35px_rgba(10,18,28,0.18)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#1976D2] shadow-[0_8px_18px_rgba(10,18,28,.24)]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M2.5 13.5 8.9 3.2l6.6 10.3" stroke="#FBF9F4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8.9" cy="13.3" r="1.55" fill="#FBF9F4" />
                </svg>
              </div>
              <div>
                <div className="text-[17px] font-extrabold tracking-[-0.04em] text-white">API<span className="text-white">x</span></div>
                <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] !text-white/55">Airfare intelligence</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation">
              <X size={17} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => {
            const items = nav.filter((item) => item.group === group);
            return (
              <div key={group} className="mb-5 last:mb-0">
                <div className="px-3 pb-2 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/55">{group}</div>
                <div className="space-y-1">
                  {items.map(({ to, label, icon: Icon }) => {
                    const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
                    return (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={onClose}
                        style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.92)' }}
                        className={`group flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-[12px] font-bold transition-all duration-150 ${active ? 'border-[#38A9E8] bg-[#223447] !text-white' : 'border-transparent !text-white/90 hover:bg-[rgba(56,169,232,0.10)] hover:!text-white'}`}
                      >
                        <span
                          style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.88)' }}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? 'bg-white/10 !text-white' : 'bg-transparent !text-white/85 group-hover:!text-white'}`}
                        >
                          <Icon size={15} strokeWidth={active ? 2.1 : 1.8} />
                        </span>
                        <span
                          style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.92)' }}
                          className="flex-1"
                        >
                          {label}
                        </span>
                        {active && <ChevronRight size={13} className="!text-white" />}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
            <div className="rounded-2xl border border-white/10 bg-[rgba(34,52,71,0.82)] p-4 shadow-[0_10px_22px_rgba(10,18,28,.14)]">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] !text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#91B09A] shadow-[0_0_0_4px_rgba(145,176,154,.14)]" />
              Prototype workspace
            </div>
            <div className="mt-2 text-[11px] leading-5 !text-white/72">Observed fares, route signals and index health in one place.</div>
          </div>
        </div>
      </aside>
    </>
  );
}
