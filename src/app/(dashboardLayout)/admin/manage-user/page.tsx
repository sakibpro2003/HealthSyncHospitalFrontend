"use client";

import React, { useState } from "react";
import {
  useBlockUserMutation,
  useGetAllUserQuery,
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

const ManageUser = () => {
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useGetAllUserQuery(undefined);

  const [blockUser] = useBlockUserMutation();

  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  const handleBlock = async (userId: string) => {
    try {
      setBlockingUserId(userId); // mark this user as blocking
      const res = await blockUser(userId).unwrap();
      console.log(res, "block res");
      refetch(); // refresh users after blocking
    } catch (error) {
      console.error("Failed to block user:", error);
    } finally {
      setBlockingUserId(null); // reset after action
    }
  };

  if (isLoading)
    return <p className="text-center text-gray-500">Loading users...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load users.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

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
          {usersData?.data?.result?.map((user: any) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.bloodGroup}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                {user.isBlocked === true ? (
                  <Button
                    className="w-28 bg-green-700"
                    disabled={blockingUserId === user._id}
                    onClick={() => handleBlock(user._id)}
                  >
                    {blockingUserId === user._id ? "Unblocking..." : "Unblock"}
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
    </div>
  );
};

export default ManageUser;
