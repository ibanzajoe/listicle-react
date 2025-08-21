import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface TableContextType {
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const value = useMemo(() => ({
    selectedRows,
    setSelectedRows,
  }), [selectedRows]);

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  )
}

export const useTableContext = (): TableContextType => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext muxt be used within a Table Provider')
  }
  return context;
}