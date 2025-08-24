import { getCategoryWithProducts, removeItemsFromCategory } from "@/api";
import AdminCard from "@/components/AdminCard";
import AdminPageHeader from "@/components/AdminPageHeader";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import ProductCard from "@/components/products/ProductCard";
import { Button, Loader, Text, Pagination, Checkbox, Group, Stack, Badge } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

// Remove local Product and CategoryWithProducts types and import the shared type instead
import { type CategoryWithProducts, type CategoryProduct, Category } from "@/lib/types";

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
    itemsPerPage: 22,
    sortBy: 'updated_at',
    sortDesc: true
  });
  const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([]);
  const [category, setCategory] = useState<Category>();
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const selectedProductIds = useMemo(() => selectedProducts.map(p => p.id), [selectedProducts]);
  
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

  useEffect(() => {
    if (categoryData && categoryData.products && categoryData.products.length > 0) {
      setCategoryProducts(categoryData.products);
    }
    if (categoryData && categoryData.category) {
      setCategory(categoryData.category);
    }
    if (categoryData && categoryData.count) {
      setTotalCount(categoryData.count);
    }
  }, [categoryData])

  /* const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []); */

  /* const handleProductSelect = useCallback((product: CategoryProduct, isSelected: boolean) => {
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
  }, [selectedProducts]); */

  const breadcrumbs: { title: string, href: string }[] = useMemo(() => {
    return [
      { title: "Categories", href: "/admin/categories" },
      { title: category ? category.name : 'Loading...', href: "#"}
    ]
  }, [category]);

  if (error) {
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
          title={`Category: ${category && category.name}`} 
          crumbs={breadcrumbs}
          backURL="/admin/categories"
        >
          <Button>Edit Category</Button>
        </AdminPageHeader>
      </div>

      <div className="mb-6">
        <AdminCard>
          {category && <div className="flex flex-col gap-4">
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
            {category && category.updated_at && (
              <div className="flex items-center gap-4">
                <Text className="w-32">Updated:</Text>
                <Text>{new Date(category.updated_at).toLocaleDateString()}</Text>
              </div>
            )}
          </div>}
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
                  onClick={() => {}}
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
              <div className="flex flex-wrap gap-4 mb-4">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`relative rounded-md ${selectedProductIds.includes(product.id) ? 'border-2 border-red-500' : 'border-2 border-transparent'} `}
                    onClick={() => {
                      const isChecked = selectedProducts.some(p => p.id === product.id);
                      if (isChecked) {
                        setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
                      } else {
                        setSelectedProducts(prev => [...prev, {
                          id: product.id,
                          name: product.name,
                          sku: product.sku,
                          main_image: product.main_image
                        }]);
                      }
                    }}  
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedProductIds.includes(product.id)}
                        onChange={(event) => {
                          const isChecked = selectedProducts.some(p => p.id === product.id);
                          if (isChecked) {
                            setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
                          } else {
                            setSelectedProducts(prev => [...prev, {
                              id: product.id,
                              name: product.name,
                              sku: product.sku,
                              main_image: product.main_image
                            }]);
                          }
                        }}
                        size="xs"
                      />
                    </div>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {totalCount > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    value={pagination.page}
                    onChange={(event) => setPagination(prev => ({ ...prev, page: event }))}
                    total={totalCount ? Math.ceil(totalCount / pagination.itemsPerPage) : 1}
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
                    onClick={() => {}}
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