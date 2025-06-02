"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../components/admin-layout";
import DashboardLayout from "../components/dashboard-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("arcverse-token")}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("arcverse-token")}`,
          },
          body: JSON.stringify(newUser),
        }
      );

      if (!response.ok) throw new Error("Failed to create user");

      toast({
        title: "Success",
        description: "User created successfully",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Users & Admins
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <InputField
                    label="Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    required
                  />
                  <InputField
                    label="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                  <InputField
                    label="Password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <label>Role:</label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          role: e.target.value as "user" | "admin",
                        })
                      }
                      className="border rounded p-2"
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    Create User
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
verflow-hidden bg-card">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>className="bg-muted/50">
                <TableRow>semibold w-20">#ID</TableHead>
                  <TableHead>Name</TableHead>emibold">Name</TableHead>
                  <TableHead>Email</TableHead>semibold">Email</TableHead>
                  <TableHead>Role</TableHead>ibold">Role</TableHead>
                  <TableHead>Actions</TableHead>d className="font-semibold w-32">Created</TableHead>
                </TableRow> className="font-semibold w-40 text-right">
              </TableHeader>ns
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>r) => (
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }bleCell className="text-muted-foreground">
                      >
                        {user.role === "admin" ? "Admin" : "User"}l>
                      </Badge>lassName="font-medium">{user.name}</TableCell>
                    </TableCell>className="text-muted-foreground">
                    <TableCell>
                      <Button variant="ghost" size="sm">ell>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"le === "admin" ? "default" : "secondary"
                        size="sm"
                        className="text-destructive" className="font-medium"
                      >
                        Deleteole === "admin" ? "Admin" : "User"}
                      </Button>
                    </TableCell>ll>
                  </TableRow> <TableCell className="text-muted-foreground">
                ))} Date(user.createdAt).toLocaleDateString("en-US", {
              </TableBody>    year: "numeric",
            </Table>        month: "short",
          </div>          day: "numeric",
        </div>}
      </DashboardLayout>  </TableCell>
    </AdminLayout>                <TableCell className="text-right">
  );                     <div className="flex justify-end gap-2">
}                        <Button

                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10 border hover:text-primary"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-destructive/10 border hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    </AdminLayout>
  );
}
