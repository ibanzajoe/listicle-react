import { getCategoryWithProducts } from "@/api";
import AdminCard from "@/components/AdminCard";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import ProductCard from "@/components/products/ProductCard";
import { Button, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Remove local Product and CategoryWithProducts types and import the shared type instead
import type { CategoryWithProducts } from "@/lib/types";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 20,
    sortBy: 'updated_at',
    sortDesc: true
  })
  
  const { data: categoryData, isLoading, error } = useQuery<CategoryWithProducts>({
    queryKey: ['categoryWithProducts', id],
    queryFn: () => getCategoryWithProducts(id!, pagination),
  });

  const category = useMemo(() => {
    return categoryData ? categoryData.category : null;
  }, [categoryData])

  const categoryProducts = useMemo(() => {
    return categoryData ? categoryData.products : [];
  }, [categoryData]);

  const breadcrumbs: { title: string, href: string }[] = useMemo(() => {
    return [
      { title: "Categories", href: "/admin/categories" },
      { title: category ? category.name : 'Loading...', href: "#"}
    ]
  }, [category]);

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
          >
            <div>
              Hello
            </div>
          </AdminPageHeader>
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
              <Text className="w-32">Name:</Text>
              <Text>{category.name}</Text>
            </div>
            <div className="flex items-center gap-4">
              <Text className="w-32">Rank:</Text>
              <Text>{category.rank}</Text>
            </div>
            <div className="flex items-center gap-4">
              <Text className="w-32">Parent ID:</Text>
              <Text>{category.parent_id === 0 ? 'Root Category' : category.parent_id}</Text>
            </div>
            <div className="flex items-center gap-4">
              <Text className="w-32">Created:</Text>
              <Text>{new Date(category.created_at).toLocaleDateString()}</Text>
            </div>
            {category.updated_at && (
              <div className="flex items-center gap-4">
                <Text className="w-32">Updated:</Text>
                <Text>{new Date(category.updated_at).toLocaleDateString()}</Text>
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      <div className="mb-4">
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <Text size="xl">Products ({categoryProducts && categoryProducts.length})</Text>
            <Button variant="light">Add Product</Button>
          </div>
          
          {categoryProducts && categoryProducts.length === 0 ? (
            <Text color="dimmed" className="text-center py-8">
              No products found in this category.
            </Text>
          ) : (
            <div className="flex flex-wrap gap-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPageWrapper>
  );
}