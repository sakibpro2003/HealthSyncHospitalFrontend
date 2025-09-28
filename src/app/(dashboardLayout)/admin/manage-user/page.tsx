"use client";

import React, { useState } from "react";
import {
  useBlockUserMutation,
  useGetAllUserQuery,
  useUnblockUserMutation,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";

const ManageUser = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim();

  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useGetAllUserQuery({
    page,
    limit: 10,
    searchTerm: normalizedSearch || undefined,
  });

  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const users = usersData?.data ?? [];
  const meta = usersData?.meta;

  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [unblockingUserId, setUnBlockingUserId] = useState<string | null>(null);

  const handleBlock = async (userId: string) => {
    try {
      setBlockingUserId(userId);
      const res = await blockUser(userId).unwrap();

      refetch();
    } catch (error) {
      console.error("Failed to block user:", error);
    } finally {
      setBlockingUserId(null);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    console.log(role, "new role");
    try {
      const res = await updateUserRole({ userId, role }).unwrap();
      toast.success(res?.message + ` to ${role}`);
      refetch();
    } catch (error) {
      toast.error("Failed to change user role:");
    }
  };

  const handleUnBlock = async (userId: string) => {
    try {
      setUnBlockingUserId(userId);
      const res = await unblockUser(userId).unwrap();
      console.log(res, "unblock");
      refetch();
    } catch (error) {
      console.error("Failed to block user:", error);
    } finally {
      setUnBlockingUserId(null);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading users...</p>;
  }
  if (isError) {
    return <p className="text-center text-red-500">Failed to load users.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="mb-4 flex items-center gap-2">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, or phone"
          className="w-64"
        />
        <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
      </div>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found for the current filters.</p>
      ) : (
        <Table>
          <TableCaption>A list of all registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.bloodGroup}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(newRole) =>
                    handleRoleChange(user._id, newRole)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                {user.isBlocked === true ? (
                  <Button
                    className="w-28 bg-green-700"
                    disabled={unblockingUserId === user._id}
                    onClick={() => handleUnBlock(user._id)}
                  >
                    {unblockingUserId === user._id
                      ? "Unblocking..."
                      : "Unblock"}
                  </Button>
                ) : (
                  <Button
                    className="w-28"
                    variant="destructive"
                    size="sm"
                    disabled={blockingUserId === user._id}
                    onClick={() => handleBlock(user._id)}
                  >
                    {blockingUserId === user._id ? "Blocking..." : "Block"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      <div className="mt-4 flex justify-end items-center gap-2">
        <span className="text-sm text-gray-500">Page {meta?.page ?? page} of {meta?.totalPage ?? 1}</span>
        <Button
          variant="outline"
          disabled={(meta?.page ?? page) <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={(meta?.page ?? page) >= (meta?.totalPage ?? 1)}
          onClick={() => setPage((prev) => (meta?.totalPage ? Math.min(meta.totalPage, prev + 1) : prev + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ManageUser;
