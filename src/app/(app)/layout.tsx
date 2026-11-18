export default function AppAreaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="app-route-shell">{children}</main>;
}
