import { Table, Skeleton, Checkbox } from "@mantine/core";

export default function BaseTableSkeleton({
  headers,
  height = 105,
  rows = 5,
  allowChecks = false,
}: {
  headers: string[];
  height?: number;
  rows?: number;
  allowChecks?: boolean;
}) {
  return (
    <Table striped highlightOnHover withTableBorder className="!text-xs">
      <Table.Thead>
        <Table.Tr>
          {allowChecks && <Table.Th><Checkbox disabled /></Table.Th>}
          {headers.map((header) => (
            <Table.Th key={header}>{header}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <Table.Tr key={rowIdx}>
            {allowChecks && <Table.Td><Checkbox disabled /></Table.Td>}
            {headers.map((_, colIdx) => (
              <Table.Td key={colIdx}>
                <Skeleton height={height} radius="sm" />
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}