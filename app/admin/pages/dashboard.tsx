"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/admin-layout";
import DashboardLayout from "../components/dashboard-layout";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium">Total Users</h3>
              <p className="text-3xl font-bold mt-2">
                {isLoading ? "..." : users.length}
              </p>
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

          {/* You can add more dashboard sections here */}
        </div>
      </DashboardLayout>
    </AdminLayout>
  );
}
