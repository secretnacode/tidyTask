import { Navbar } from "@/app/component/clientComponent/dashboardPage";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-row w-screen">
      <Navbar />
      <div className="w-[85%]">{children}</div>
    </div>
  );
}
