import { redirect } from "next/navigation";
export default function Page() {
  redirect("/dashboard-profile/profile");
  return null;
}
