import { Card, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";

export default function AdminCard({ className, children }: { className: string; children: ReactNode }) {
  const theme = useMantineTheme();

  return (
    <Card
      style={{
        backgroundColor: theme.colors.dark[5]
      }} 
      className={`admin-card p-4 rounded-md ${className}`}
    >
      {children}
    </Card>
  )
}