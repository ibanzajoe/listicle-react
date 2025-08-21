import { Button, Container, Loader, Select, TextInput, Title } from "@mantine/core";
import UsersTable from "@/components/tables/UsersTable";
import { TableProvider, useTableContext } from "@/components/tables/useTableContext";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import { BasePagination } from "@/components/tables/BaseTable";
import { Pagination, useAdminUsers } from "@/context/AdminUsersContext";
import { useMemo } from "react";
import AdminPageWrapper from "@/components/AdminPageWrapper";

export default function UsersPage() {
  return (
    <TableProvider>
      <AdminPageWrapper>
        <Title order={1} my={16}>Users</Title>
        <TableSettings />
        <TableView />
        <ConsoleView></ConsoleView>
      </AdminPageWrapper>
    </TableProvider>
  );
}

export function TableSettings() {
  const { pagination, setPagination } = useAdminUsers();

  const form = useForm({
    mode: 'uncontrolled',
    name: 'user-search-pagination',
    initialValues: {
      page: 1,
      itemsPerPage: 20,
      search: '',
      sortBy: 'created_at',
      sortDesc: true,
      status: 'All'
    }
  })

  const handlePagination = (pagination: Pagination) => {
    setPagination(pagination);
  }

  return (
    <div className="table-settings border border-neutral-700 p-4 rounded-sm">
      <form onSubmit={form.onSubmit(handlePagination)} className="bg-transparent flex items-center gap-4">
        <div className="flex items-center">
          <TextInput
            placeholder="Name, Email"
            leftSection={<IconSearch />}
            key={form.key('search')}
            {...form.getInputProps('search')}
            onChange={(event: any) => setPagination((pv) => ({ ...pv, search: event.target.value }))}
            className="text-xs w-[240px]"
          />
          <Button color="gray">Search</Button>
        </div>

        <div className="flex items-center">
          <Select
            placeholder="Status"
            data={['All', 'pending', 'approved']}
            value={pagination.status}
            onChange={(value: string | null) => setPagination((pv) => ({...pv, status: value ?? 'All'}))}
          />
        </div>
      </form>
    </div>
  )
}

export function TableView() {
  return (
    <>
        <div className="flex items-center justify-end py-4">
          <BasePagination />
        </div>
        <UsersTable />
        <div className="flex items-center justify-end py-4">
          <BasePagination />
        </div>
      </>
  )
}

export function ConsoleView() {
  const { selectedRows, setSelectedRows } = useTableContext();

  return (
    <div>
      {selectedRows && selectedRows.length > 0 && selectedRows.map((item) => <p key={item}>{item}</p>)} 
    </div>
  )
}