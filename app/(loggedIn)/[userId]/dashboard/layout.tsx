import Navbar from "@/app/component/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
