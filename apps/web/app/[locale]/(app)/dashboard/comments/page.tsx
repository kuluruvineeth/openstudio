import Comments from "./_components/Comments";
import { DashboardHeader } from "@/components/header/DashboardHeader";

export default function CommentsPage() {
  return (
    <>
      <DashboardHeader />
      <main className="h-full w-full">
        <Comments />
      </main>
    </>
  );
}
