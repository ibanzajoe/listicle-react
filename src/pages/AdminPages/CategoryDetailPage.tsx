import { getCategoryWithProducts, removeItemsFromCategory } from "@/api";
import AdminCard from "@/components/AdminCard";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import ProductCard from "@/components/products/ProductCard";
import { Button, Loader, Text, Pagination, Checkbox, Group, Stack, Badge } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

// Remove local Product and CategoryWithProducts types and import the shared type instead
import type { CategoryWithProducts, CategoryProduct } from "@/lib/types";

interface SelectedProduct {
  id: number;
  name: string;
  sku: string;
  main_image: string;
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 20,
    sortBy: 'updated_at',
    sortDesc: true
  });
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  
  const { data: categoryData, isLoading, error } = useQuery<CategoryWithProducts>({
    queryKey: ['categoryWithProducts', id, pagination.page, pagination.itemsPerPage, pagination.sortBy, pagination.sortDesc],
    queryFn: () => getCategoryWithProducts(id!, pagination),
    enabled: !!id
  });

  const removeProductsMutation = useMutation({
    mutationFn: (productIds: number[]) => removeItemsFromCategory(id!, productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryWithProducts', id] });
      setSelectedProducts([]);
    }
  });

  const category = useMemo(() => {
    return categoryData ? categoryData.category : null;
  }, [categoryData])

  const categoryProducts = useMemo(() => {
    return categoryData ? categoryData.products : [];
  }, [categoryData]);

  const totalPages = useMemo(() => {
    return Math.ceil((categoryProducts.length || 0) / pagination.itemsPerPage);
  }, [categoryProducts.length, pagination.itemsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleProductSelect = useCallback((product: CategoryProduct, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts(prev => {
        const exists = prev.find(p => p.id === product.id);
        if (!exists) {
          return [...prev, {
            id: product.id,
            name: product.name,
            sku: product.sku,
            main_image: product.main_image
          }];
        }
        return prev;
      });
    } else {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    }
  }, []);

  const handleRemoveSelected = useCallback(() => {
    if (selectedProducts.length > 0) {
      removeProductsMutation.mutate(selectedProducts.map(p => p.id));
    }
  }, [selectedProducts, removeProductsMutation]);

  const isProductSelected = useCallback((productId: number) => {
    return selectedProducts.some(p => p.id === productId);
  }, [selectedProducts]);

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
            <Group>
              <Text size="xl">Products ({categoryProducts && categoryProducts.length})</Text>
              {selectedProducts.length > 0 && (
                <Badge color="blue">{selectedProducts.length} selected</Badge>
              )}
            </Group>
            <Group>
              {selectedProducts.length > 0 && (
                <Button 
                  color="red" 
                  variant="outline"
                  onClick={handleRemoveSelected}
                  loading={removeProductsMutation.isPending}
                >
                  Remove Selected ({selectedProducts.length})
                </Button>
              )}
              <Button variant="light">Add Product</Button>
            </Group>
          </div>
          
          {categoryProducts && categoryProducts.length === 0 ? (
            <Text color="dimmed" className="text-center py-8">
              No products found in this category.
            </Text>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {categoryProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={isProductSelected(product.id)}
                        onChange={(event) => handleProductSelect(product, event.currentTarget.checked)}
                        size="md"
                        styles={{
                          input: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderColor: '#000'
                          }
                        }}
                      />
                    </div>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    value={pagination.page}
                    onChange={handlePageChange}
                    total={totalPages}
                    size="md"
                  />
                </div>
              )}
            </>
          )}
        </AdminCard>
      </div>
      
      {selectedProducts.length > 0 && (
        <div className="mb-4">
          <AdminCard>
            <Text size="lg" className="mb-4">Selected Products for Removal</Text>
            <Stack gap="sm">
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <Group>
                    <img src={product.main_image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <Text size="sm" fw={500}>{product.name}</Text>
                      <Text size="xs" color="dimmed">SKU: {product.sku}</Text>
                    </div>
                  </Group>
                  <Button 
                    size="xs" 
                    variant="light" 
                    color="red"
                    onClick={() => handleProductSelect(product as CategoryProduct, false)}
                  >
                    Remove from selection
                  </Button>
                </div>
              ))}
            </Stack>
          </AdminCard>
        </div>
      )}
    </AdminPageWrapper>
  );
}