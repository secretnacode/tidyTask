import { TasksFormTable } from "@/app/component/clientComponent/taskPage";
import { UserLogo } from "@/app/component/dashboardPage";

export default function Page() {
  const date = new Date().toISOString().split("T")[0];
  return (
    <div className="overflow-y-auto min-h-screen max-h-fit">
      {/* header  */}
      <div className="p-7 flex flex-row justify-between items-center ">
        <p className="title-page">
          Todo Tasks<span className="text-sm text-gray-500 ml-2">{date}</span>
        </p>

        <UserLogo name="clark" />
      </div>

      <TasksFormTable />
    </div>
  );
}
