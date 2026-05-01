import Link from "next/link";
import type { UserRole } from "@/lib/db.types";

const NAV: Array<{ href: string; label: string; section: string; roles?: UserRole[] }> = [
  { href: "/admin", label: "Dashboard", section: "main" },
  { href: "/admin/inventory", label: "Inventory", section: "main" },
  { href: "/admin/inventory/new", label: "Add vehicle", section: "main" },
  { href: "/admin/leads", label: "Leads", section: "main" },
  { href: "/admin/conversations", label: "Conversations", section: "main" },

  {
    href: "/admin/finance-applications",
    label: "Finance applications",
    section: "finance",
    roles: ["owner", "manager", "finance"],
  },
  {
    href: "/admin/audit",
    label: "PII access audit",
    section: "finance",
    roles: ["owner", "manager"],
  },

  { href: "/admin/feeds", label: "Marketplace feeds", section: "ops" },
  { href: "/admin/marketing", label: "Marketing", section: "ops" },
  { href: "/admin/cms", label: "CMS pages", section: "ops" },
  { href: "/admin/analytics", label: "Analytics", section: "ops" },

  { href: "/admin/users", label: "Staff", section: "settings", roles: ["owner", "manager"] },
];

const SECTIONS: Array<{ key: string; title: string }> = [
  { key: "main", title: "Operations" },
  { key: "finance", title: "Finance & compliance" },
  { key: "ops", title: "Marketing & ops" },
  { key: "settings", title: "Settings" },
];

type Props = { role: UserRole; email: string };

export function AdminSidebar({ role, email }: Props) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <div className="border-b border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</p>
          <p className="mt-1 truncate text-sm font-medium">{email}</p>
          <p className="text-xs text-muted-foreground capitalize">{role}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 text-sm">
          {SECTIONS.map((section) => {
            const items = NAV.filter(
              (item) => item.section === section.key && (!item.roles || item.roles.includes(role)),
            );
            if (items.length === 0) return null;
            return (
              <div key={section.key} className="mb-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-md px-3 py-1.5 text-sm transition hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </div>
    </aside>
  );
}
