import { getCategoryWithProducts } from "@/api";
import AdminCard from "@/components/AdminCard";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import ProductCard from "@/components/products/ProductCard";
import { Button, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category_id: number;
  created_at: Date;
  updated_at: Date | null;
}

type CategoryWithProducts = {
  id: number;
  name: string;
  parent_id: number;
  rank: number;
  created_at: Date;
  updated_at: Date | null;
  products: Product[];
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: category, isLoading, error } = useQuery<CategoryWithProducts>({
    queryKey: ['categoryWithProducts', id],
    queryFn: () => getCategoryWithProducts(id!),
    enabled: !!id
  });

  const breadcrumbs: { title: string, href: string }[] = [
    { title: "Categories", href: "/admin/categories" },
    { title: category ? category.name : 'Loading...', href: "#"}
  ];

  if (isLoading) {
    return (
      <AdminPageWrapper>
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </AdminPageWrapper>
    );
  }

  if (error || !category) {
    return (
      <AdminPageWrapper>
        <div className="mb-4">
          <AdminPageHeader 
            title="Category Not Found" 
            crumbs={breadcrumbs}
            backURL="/admin/categories"
          />
        </div>
        <AdminCard>
          <Text color="red">Error loading category details.</Text>
        </AdminCard>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      <div className="mb-4">
        <AdminPageHeader 
          title={`Category: ${category.name}`} 
          crumbs={breadcrumbs}
          backURL="/admin/categories"
        >
          <Button>Edit Category</Button>
        </AdminPageHeader>
      </div>

      <div className="mb-6">
        <AdminCard>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Text weight={600} className="w-32">Name:</Text>
              <Text>{category.name}</Text>
            </div>
            <div className="flex items-center gap-4">
              <Text weight={600} className="w-32">Rank:</Text>
              <Text>{category.rank}</Text>
            </div>
            <div className="flex items-center gap-4">
              <Text weight={600} className="w-32">Parent ID:</Text>
              <Text>{category.parent_id === 0 ? 'Root Category' : category.parent_id}</Text>
            </div>
            <div className="flex items-center gap-4">
              <Text weight={600} className="w-32">Created:</Text>
              <Text>{new Date(category.created_at).toLocaleDateString()}</Text>
            </div>
            {category.updated_at && (
              <div className="flex items-center gap-4">
                <Text weight={600} className="w-32">Updated:</Text>
                <Text>{new Date(category.updated_at).toLocaleDateString()}</Text>
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      <div className="mb-4">
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <Text size="xl" weight={600}>Products ({category.products.length})</Text>
            <Button variant="light">Add Product</Button>
          </div>
          
          {category.products.length === 0 ? (
            <Text color="dimmed" className="text-center py-8">
              No products found in this category.
            </Text>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPageWrapper>
  );
}