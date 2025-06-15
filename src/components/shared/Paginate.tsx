import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

const Paginate = () => {
  const totalPage = 10;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>

        {Array.from({ length: totalPage }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink href={`?page=${index + 1}`} isActive={index === 0}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          {/* <PaginationEllipsis /> */}
        </PaginationItem>

        <PaginationItem>
          <PaginationNext href={`?page=${totalPage}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginate;
