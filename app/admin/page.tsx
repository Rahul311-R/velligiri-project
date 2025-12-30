import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    if (!token) {
        redirect("/admin/login");
    }

    return <AdminDashboard />;
}
