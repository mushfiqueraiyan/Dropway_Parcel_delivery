import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const RiderDashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "rider") {
    redirect("/");
  }

  return <div>RiderDashboard</div>;
};

export default RiderDashboard;
