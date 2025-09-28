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

const Paginate = ({ totalPage, currentPage }: { totalPage: number; currentPage?: number }) => {
  const searchParams = useSearchParams();
  const pageFromQuery = searchParams.get("page");
  const activePage = currentPage ?? (pageFromQuery ? Number(pageFromQuery) : 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`?page=${Math.max(activePage - 1, 1)}`} />
        </PaginationItem>

        {Array.from({ length: Math.max(totalPage, 1) }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href={`?page=${index + 1}`}
              isActive={index + 1 === activePage}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>{/* <PaginationEllipsis /> */}</PaginationItem>

        <PaginationItem>
          <PaginationNext href={`?page=${Math.min(activePage + 1, Math.max(totalPage, 1))}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginate;
