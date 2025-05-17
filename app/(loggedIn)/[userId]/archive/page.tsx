import { ArchivedTaskTable } from "@/app/component/clientComponent/archivePage";
import { fetchArchivedTasks } from "@/util/orm/Archive";

export default async function Page({ params }: { params: { userId: string } }) {
  const archivedTasks = await fetchArchivedTasks((await params).userId);

  return (
    <div className="p-10">
      <div className="bg-white shadow-sm rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Archived Tasks</h1>
        <ArchivedTaskTable taskVal={archivedTasks} />
      </div>
    </div>
  );
}
