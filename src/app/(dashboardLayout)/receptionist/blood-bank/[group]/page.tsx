import React from "react";

const page = ({ params }: { params: string }) => {
  console.log(decodeURIComponent(params.group), "grp");

  return <div></div>;
};

export default page;
