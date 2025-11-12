"use client";

import React, { useState } from "react";
import {
  useBlockUserMutation,
  useGetAllUserQuery,
  useGetRoleMetricsQuery,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";
import type { UserSummary } from "@/redux/features/user/userApi";

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { message?: unknown } }).data?.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

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

  const { data: roleMetrics } = useGetRoleMetricsQuery(undefined);

  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const users = usersData?.data ?? [];
  const meta = usersData?.meta;

  const summary = roleMetrics?.summary ?? {
    admin: { active: 0, blocked: 0 },
    receptionist: { active: 0, blocked: 0 },
    doctor: { active: 0, blocked: 0 },
  };

  const metrics = [
    {
      label: "Admins",
      active: summary.admin?.active ?? 0,
      blocked: summary.admin?.blocked ?? 0,
    },
    {
      label: "Receptionists",
      active: summary.receptionist?.active ?? 0,
      blocked: summary.receptionist?.blocked ?? 0,
    },
    {
      label: "Doctors",
      active: summary.doctor?.active ?? 0,
      blocked: summary.doctor?.blocked ?? 0,
    },
  ];

  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [unblockingUserId, setUnBlockingUserId] = useState<string | null>(null);

  const handleBlock = async (userId: string) => {
    try {
      setBlockingUserId(userId);
      await blockUser(userId).unwrap();
      toast.success("User blocked successfully");
      await refetch();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to block user"));
    } finally {
      setBlockingUserId(null);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const response = await updateUserRole({ userId, role }).unwrap();
      const message =
        response.message ?? `User role updated to ${role.toLowerCase()}`;
      toast.success(message);
      await refetch();
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Failed to change user role")
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Loader fullScreen={false} label="Loading users" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-center text-red-500">
          Unable to load users right now. Please try again later.
        </p>
      </div>
    );
  }

  const handleUnBlock = async (userId: string) => {
    try {
      setUnBlockingUserId(userId);
      await unblockUser(userId).unwrap();
      toast.success("User unblocked successfully");
      await refetch();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to unblock user"));
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

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  Active: {metric.active}
                </p>
                <p className="text-sm text-gray-500">Blocked: {metric.blocked}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
          {users.map((user: UserSummary) => (
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
