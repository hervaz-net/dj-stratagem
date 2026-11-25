export default function AppAreaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="min-h-svh bg-base-100">{children}</main>;
}
