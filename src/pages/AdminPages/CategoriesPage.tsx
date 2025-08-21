import { getCategories } from "@/api";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconEye, IconMinus, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type Category = {
  id: number;
  name: string;
  parent_id: number;
  rank: number;
  created_at: Date;
  updated_at: Date | null;
}

export default function CategoriesPage() {
  const { data, refetch, isFetching, status } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  });

  const parents = useMemo(() => data && data.filter((cat) => cat.parent_id === 0), [data]);
  const childs = useMemo(() => data && data.filter((cat) => cat.parent_id !== 0), [data]);

  const haveChildren = (parentId: number) => childs?.filter((child) => child.parent_id === parentId);
  
  return (
    <AdminPageWrapper>
      <div className="mb-4">
        <AdminPageHeader title="Categories" crumbs={[]}>
          <Button>Add Category</Button>
        </AdminPageHeader>
      </div>

      {parents && parents.map((parent, index) => (
        <div key={`parent-category-${index}`}>
          <div className="flex items-center justify-between w-full border p-2 rounded-md mb-4">
            <p>{parent.name} - <span>(Rank: { parent.rank })</span></p>
            <div className="flex items-center justify-end gap-2">
              <Link to={`/admin/categories/${parent.id}`}>
                <IconEye className="cursor-pointer hover:text-blue-500" />
              </Link>
              <IconPlus />
              {haveChildren(parent.id) && haveChildren(parent.id)?.length === 0 && <IconMinus />}
            </div>
          </div>
          {haveChildren(parent.id) && haveChildren(parent.id)?.map((child, ci) => (
            <div key={`children-category-${ci}`} className="pl-8 w-full">
              <div className="flex items-center justify-between w-full border p-2 rounded-md mb-4">
                <p>{child.name} - <span>(Rank: { child.rank })</span></p>
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/admin/categories/${child.id}`}>
                    <IconEye className="cursor-pointer hover:text-blue-500" />
                  </Link>
                  <IconPlus />
                  <IconMinus />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </AdminPageWrapper>
  );
}