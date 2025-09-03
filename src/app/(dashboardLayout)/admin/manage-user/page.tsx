"use client";

import React from "react";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";

const ManageUser = () => {
  const { data: usersData, isLoading, isError, refetch } = useGetAllUserQuery(undefined);

  if (isLoading)
    return <p className="text-center text-gray-500">Loading users...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load users.</p>;

  const handleBlock = (userId: string) => {
    console.log("Block user:", userId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.data?.result?.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.gender}</td>
                <td>{user.bloodGroup}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleBlock(user._id)}
                  >
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
