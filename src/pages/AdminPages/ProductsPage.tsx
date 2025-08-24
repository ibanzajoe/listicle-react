import AdminPageWrapper from "@/components/AdminPageWrapper";
import { BasePagination } from "@/components/tables/BaseTable";
import BaseTableSkeleton from "@/components/tables/BaseTableSkeleton";
import ProductsTable, { ProductTableHeader } from "@/components/tables/ProductsTable";
import { TableProvider } from "@/components/tables/useTableContext";
import { Pagination, useAdminProduct } from "@/context/AdminProductsContext";
import { Button, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import { useMemo } from "react";

export default function ProductsPage() {
  return (
    <TableProvider>
      <AdminPageWrapper>
        <Title order={1} my={16}>Products</Title>
        <TableSettings />
        <TableView />
      </AdminPageWrapper>
    </TableProvider>
  )
}

export function TableSettings() {
  const { pagination, setPagination, categories: rawCategories } = useAdminProduct();

  const categories = useMemo(() => {
      if (rawCategories) {
        return ['All'].concat(rawCategories.map((c) => (c.name)));
      }
      return [];
    }, [rawCategories]);

  const mappedCategoriesByName = useMemo(() => {
    return rawCategories ? rawCategories.reduce((acc, category) => {
      acc[category.name] = category.id.toString();
      return acc;
    }, {} as Record<string, string>) : {};
  }, [rawCategories])

  const mappedCategoriesById = useMemo(() => {
    return rawCategories ? rawCategories.reduce((acc, category) => {
      acc[category.id.toString()] = category.name;
      return acc;
    }, {} as Record<string, string>) : {};
  }, [rawCategories])

  const form = useForm({
    mode: 'uncontrolled',
    name: 'user-search-pagination',
    initialValues: {
      page: 1,
      itemsPerPage: 20,
      search: '',
      sortBy: 'displayed_at',
      sortDesc: true,
      status: 'All'
    }
  })

  const handlePagination = (pagination: Pagination) => {
    setPagination(pagination);
  }

  console.log('categories: ', categories);

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
            data={['All', 'Active', 'inactive']}
            value={pagination.status}
            onChange={(value: string | null) => setPagination((pv) => ({...pv, status: value ?? 'All'}))}
          />
        </div>

        <div className="flex items-center">
          <Select
            placeholder="Category"
            data={categories}
            value={pagination.category_id !== '' ? mappedCategoriesById[pagination.category_id!] : 'All'}
            onChange={(value: string | null) => setPagination((pv) => ({...pv, category_id: value !== "All" ? mappedCategoriesByName[value!] : ''}))}
          />
        </div>
      </form>
    </div>
  )
}

export function TableView() {
  const { count: total, pagination, setPagination, isFetching } = useAdminProduct();

  return (
    <>
        <div className="flex items-center justify-end py-4">
          <BasePagination total={total} pagination={pagination} setPagination={setPagination} />
        </div>
        {isFetching ? <BaseTableSkeleton headers={ProductTableHeader} rows={20} /> : <ProductsTable />}
        <div className="flex items-center justify-end py-4">
          <BasePagination total={total} pagination={pagination} setPagination={setPagination} />
        </div>
    </>
  )
}