import { ReactNode } from "react";

export default function AdminPageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-8 pt-4 pb-16">
      {children}
    </div>
  )
}