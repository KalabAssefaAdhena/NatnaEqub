import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

export default function SuperuserLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const activeClass = 'text-white bg-blue-600 px-3 py-2 rounded-md';
  const inactiveClass = 'text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md';

  return (
    <div className="flex min-h-screen">
      {/* Mobile toggle button */}
      <button
        className="absolute top-4 left-4 md:hidden text-2xl text-gray-700 z-20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <nav
        className={`
          fixed inset-y-0 left-0 w-60 bg-gray-50 border-r p-4 flex flex-col gap-2
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex
        `}
      >
        <h2 className="text-xl font-bold mt-8 mb-4">Superuser</h2>
        <NavLink
          to="/superuser"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          end
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/superuser/groups"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          onClick={() => setIsOpen(false)}
        >
          Public Groups
        </NavLink>
        <NavLink
          to="/superuser/balances"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          onClick={() => setIsOpen(false)}
        >
          User Balances
        </NavLink>
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6 md:ml-60">
        <Outlet />
      </main>
    </div>
  );
}
