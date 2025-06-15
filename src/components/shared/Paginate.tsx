import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import React from "react";

const Paginate = ({ totalPage }: { totalPage: number }) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  console.log(page, "p2");

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>

        {Array.from({ length: totalPage }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href={`?page=${index + 1}`}
              isActive={index === Number(page) - 1}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>{/* <PaginationEllipsis /> */}</PaginationItem>

        <PaginationItem>
          <PaginationNext href={`?page=${totalPage}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginate;
