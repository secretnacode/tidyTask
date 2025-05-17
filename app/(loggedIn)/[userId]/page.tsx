import {
  DashboardCreateButton,
  TodayTableTask,
} from "@/app/component/clientComponent/dashboardPage";
import { TaskStatusCard, UserLogo } from "@/app/component/dashboardPage";
import {
  AlarmClock,
  CheckSquare,
  ClipboardList,
  Hourglass,
} from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-row w-full gap-7 ">
      <main className="w-[70%]">
        {/* header of dashboard page  */}
        <div className="p-7 pr-0 flex flex-row justify-between items-center">
          <p className="title-page">Dashboard</p>

          {/* creation of new task  */}
          <DashboardCreateButton />
        </div>
        {/* content of the dahsboard  */}
        <div className="ml-10">
          <div className="w-full grid grid-cols-4 gap-6">
            {/* a status card that takes a logo, status name., style name, and count or name as a props  */}
            <TaskStatusCard
              logo={Hourglass}
              status="In progress"
              name="cleaning bathroom"
              style="process-status-card status-cards"
            />
            <TaskStatusCard
              logo={ClipboardList}
              status="To Do Task"
              count={123}
              style="pending-status-card status-cards"
            />
            <TaskStatusCard
              logo={CheckSquare}
              status="Complete Task"
              count={123}
              style="cancel-status-card status-cards"
            />
            <TaskStatusCard
              logo={AlarmClock}
              status="Due Task"
              count={123}
              style="due-status-card status-cards"
            />
          </div>

          {/* a tabale of list that contains all the task within the day */}
          <div>
            <TodayTableTask />
          </div>
        </div>
      </main>
      <div className="w-[30%]">
        <UserLogo name="Clark" />
        <div></div>
      </div>
    </div>
  );
}
