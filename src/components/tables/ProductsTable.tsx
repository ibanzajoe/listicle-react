import { Button, Checkbox, Table } from "@mantine/core";
import BaseTable from "./BaseTable";
import { IconEye } from "@tabler/icons-react";
import { useTableContext } from "./useTableContext";
import { useNavigate } from "react-router-dom";
import { useAdminProduct } from "@/context/AdminProductsContext";

export const ProductTableHeader = ['SKU', 'Image', 'Name', 'Status', 'Created', 'Displayed', 'Actions'];

export default function ProductsTable() {
  const { products } = useAdminProduct();

  const navigate = useNavigate();

  const { selectedRows, setSelectedRows } = useTableContext();

  return <BaseTable headers={ProductTableHeader} allowChecks>
    {products && products.length > 0 && products.map((product) => (
      <Table.Tr key={product.id}>
        <Table.Td><Checkbox checked={selectedRows.includes(product.id!)} onChange={(e) => {
          if (e.target.checked) {
            setSelectedRows([...selectedRows, product.id!]);
          } else {
            setSelectedRows(selectedRows.filter((id) => id !== product.id));
          }
        }} /></Table.Td>
        <Table.Td>{product.sku}</Table.Td>
        <Table.Td>
            <img src={product.main_image} alt={product.name} className="w-[60px] h-[90px] object-cover rounded-sm" />
        </Table.Td>
        <Table.Td>{product.name}</Table.Td>
        <Table.Td>{product.stock_status}</Table.Td>
        <Table.Td>{new Date(product.created_at!).toLocaleDateString()}</Table.Td>
        <Table.Td>{new Date(product.displayed_at!).toLocaleDateString()}</Table.Td>
        <Table.Td>
          <Button variant="subtle" color="blue" onClick={() => navigate(`/admin/products/${product.id}`)}><IconEye /></Button>
        </Table.Td>
      </Table.Tr> 
    ))}
  </BaseTable>;
}