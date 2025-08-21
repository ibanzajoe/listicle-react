import { useAdminUsers } from "@/context/AdminUsersContext";
import { Checkbox, Table } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useEffect, useMemo, useRef } from "react";

export default function BaseTable({ headers, children, allowChecks = false }: { headers: string[], children: React.ReactNode, allowChecks?: boolean }) {
  return <Table striped highlightOnHover withTableBorder className="!text-xs">
    <Table.Thead>
      <Table.Tr>
        {allowChecks && <Table.Th><Checkbox /></Table.Th>}
        {headers.map((header) => (
          <Table.Th key={header}>{header}</Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {children}
    </Table.Tbody>
  </Table>;
}

export function BasePagination() {
  const { count: total, pagination, setPagination } = useAdminUsers();

  const handlePaginationChange = (direction: "left" | "right") => {
    if (direction === "left") {
      if (pagination.page !== 1) {
        setPagination((pv) => ({ ...pv, page: pv.page - 1 }))
      }
    } else {
      if (pagination.page * pagination.itemsPerPage < total) {
        setPagination((pv) => ({ ...pv, page: pv.page + 1 }))
      }
    }
  }

  const prevTotalRef = useRef(total);

  useEffect(() => {
    if (total && prevTotalRef.current !== total) {
      prevTotalRef.current = total;
    }
  }, [total]);

  return (
    <div className="flex items-center gap-4">
      <IconChevronLeft
        className="cursor-pointer"
        onClick={() => handlePaginationChange("left")} 
      />
      <span>
        {pagination.page * pagination.itemsPerPage} / {prevTotalRef.current}
      </span>
      <IconChevronRight
        className="cursor-pointer"
        onClick={() => handlePaginationChange("right")} 
      />
    </div>
  )
}