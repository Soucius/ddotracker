import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UserCircle,
  ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Kullanıcı",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Çıkış yapıldı.");

    navigate("/");
  };

  const navItems = [
    {
      name: "Genel Bakış",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Tedbir Listesi",
      path: "/dashboard/measures",
      icon: <ClipboardList size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-montserrat">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-indigo-600 tracking-wide">
            DDO<span className="text-gray-900">TRACKER</span>
          </span>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <Link
            to="/dashboard/profile"
            className="ml-auto flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user.username}
              </p>

              <p className="text-xs text-gray-500">Kullanıcı</p>
            </div>

            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <UserCircle size={28} />
            </div>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
