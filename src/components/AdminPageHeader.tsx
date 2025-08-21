import { Anchor, Breadcrumbs, Button, Card, ThemeIcon, useMantineTheme } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPageHeader({
  title,
  backURL,
  crumbs,
  children
}: {
  title: string;
  backURL?: string;
  crumbs: {
    title: string;
    href: string;
  }[];
  children: ReactNode
}) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  return (
    <Card className="admin-page-header" style={{
      backgroundColor: theme.colors.dark[5]
    }}>
      <div className="flex items-center gap-4 px-1">
        {backURL && <IconArrowLeft 
          className="cursor-pointer transform hover:-translate-x-1 transition-transform"
          onClick={() => navigate(backURL)} 
        />}
        <div className="flex-1 w-full">
          <h3 className="text-xl">{title}</h3>
          {crumbs && crumbs.length > 0 && <Breadcrumbs>
            {crumbs.map((crumb, index) => (
              <Anchor href={crumb.href} key={`breadcrumb-${index}`}>
                {crumb.title}
              </Anchor>
            ))}
          </Breadcrumbs>}
        </div>
        <div className="flex-none">
          {children}
        </div>
      </div>
      
    </Card>
  )
}