import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Package, Search, Edit, RefreshCw, Download, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface InventoryItem {
  id: string;
  name: string;
  stock_quantity: number;
  condition: string;
  is_active: boolean;
  categories?: {
    name: string;
  };
  low_stock_threshold?: number;
}

const AdminInventory = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [newStockQuantity, setNewStockQuantity] = useState(0);
  const { toast } = useToast();

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          stock_quantity,
          condition,
          is_active,
          categories (
            name
          )
        `)
        .order('stock_quantity', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      await fetchInventory();
      toast({
        title: "Success",
        description: "Stock quantity updated",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    if (quantity <= 5) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: TrendingDown };
    if (quantity <= 20) return { status: 'Medium Stock', color: 'bg-blue-100 text-blue-800', icon: Package };
    return { status: 'Good Stock', color: 'bg-green-100 text-green-800', icon: TrendingUp };
  };

  const exportInventory = () => {
    const csvContent = [
      ['Product Name', 'Category', 'Stock Quantity', 'Condition', 'Status', 'Stock Status'].join(','),
      ...filteredProducts.map(product => {
        const stockStatus = getStockStatus(product.stock_quantity);
        return [
          product.name,
          product.categories?.name || 'Uncategorized',
          product.stock_quantity,
          product.condition,
          product.is_active ? 'Active' : 'Inactive',
          stockStatus.status
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Inventory exported successfully",
    });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = products.filter(p => p.stock_quantity <= 5);
  const outOfStockItems = products.filter(p => p.stock_quantity === 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage product stock levels
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportInventory}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={fetchInventory}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Inventory Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">In inventory</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items unavailable</p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Low Stock Alert
              </CardTitle>
              <CardDescription className="text-yellow-700">
                The following items need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-3">
                {lowStockItems.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="outline" className="text-yellow-800 border-yellow-300">
                      {item.stock_quantity} left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Details</CardTitle>
            <CardDescription>
              Complete inventory with stock levels and management actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock_quantity);
                  const StockIcon = stockStatus.icon;
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.categories?.name || 'Uncategorized'}</TableCell>
                      <TableCell className="font-mono">{product.stock_quantity}</TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          <StockIcon className="h-3 w-3 mr-1" />
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setNewStockQuantity(product.stock_quantity);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Stock Level</DialogTitle>
                              <DialogDescription>
                                Adjust the stock quantity for {selectedProduct?.name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedProduct && (
                              <div className="space-y-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="currentStock">Current Stock</Label>
                                  <Input
                                    id="currentStock"
                                    value={selectedProduct.stock_quantity}
                                    disabled
                                    className="bg-muted"
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="newStock">New Stock Quantity</Label>
                                  <Input
                                    id="newStock"
                                    type="number"
                                    min="0"
                                    value={newStockQuantity}
                                    onChange={(e) => setNewStockQuantity(parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedProduct(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      updateStock(selectedProduct.id, newStockQuantity);
                                      setSelectedProduct(null);
                                    }}
                                  >
                                    Update Stock
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;