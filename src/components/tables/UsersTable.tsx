import { Button, Checkbox, Table } from "@mantine/core";
import BaseTable from "./BaseTable";
import { IconEye } from "@tabler/icons-react";
import { useTableContext } from "./useTableContext";
import { useNavigate } from "react-router-dom";
import { useAdminUsers } from "@/context/AdminUsersContext";

export default function UsersTable() {
  const { users } = useAdminUsers();

  const navigate = useNavigate();

  const { selectedRows, setSelectedRows } = useTableContext();

  return <BaseTable headers={['Name', 'Email', 'Company', 'Status', 'Created', 'Actions']} allowChecks>
    {users && users.length > 0 && users.map((user) => (
      <Table.Tr key={user.id}>
        <Table.Td><Checkbox checked={selectedRows.includes(user.id!)} onChange={(e) => {
          if (e.target.checked) {
            setSelectedRows([...selectedRows, user.id!]);
          } else {
            setSelectedRows(selectedRows.filter((id) => id !== user.id));
          }
        }} /></Table.Td>
        <Table.Td>{user.first_name} {user.last_name}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.company}</Table.Td>
        <Table.Td>{user.status}</Table.Td>
        <Table.Td>{new Date(user.created_at!).toLocaleDateString()}</Table.Td>
        <Table.Td>
          <Button variant="subtle" color="blue" onClick={() => navigate(`/admin/users/${user.id}`)}><IconEye /></Button>
        </Table.Td>
      </Table.Tr> 
    ))}
  </BaseTable>;
}