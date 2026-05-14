import { Link } from "@tanstack/react-router";

interface SidebarProps {
  userName?: string;
}

const menuItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Todos", to: "/dashboard/todos" },
  { label: "Categories", to: "/dashboard/category" }
];

export function Sidebar({ userName }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-800 min-h-screen text-white">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">AIGEM</h1>
        {userName && <p className="text-sm text-slate-400 mt-1">{userName}</p>}
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="block px-4 py-2 rounded transition-colors hover:bg-blue-600"
                activeProps={{ className: "bg-blue-600 font-semibold" }}
                activeOptions={{ exact: true }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
