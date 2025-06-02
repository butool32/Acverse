"use client";

//import AdminLayout from "../components/admin-layout";
//import DashboardLayout from "../components/dashboard-layout";

export default function DashboardPage() {
  return (
    //<AdminLayout>
      //<DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Dashboard cards/stats */}
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium">Total Users</h3>
              {/* Add user count */}
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium">Total Products</h3>
              {/* Add product count */}
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium">Total Orders</h3>
              {/* Add order count */}
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium">Total Revenue</h3>
              {/* Add revenue */}
            </div>
          </div>
        </div>
      //</DashboardLayout>
    //</AdminLayout>
  );
}
