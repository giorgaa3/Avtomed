import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

// Validation schema for product data
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().max(5000, "Description must be less than 5000 characters").optional(),
  stock_quantity: z.number().int().min(0, "Stock must be 0 or greater").max(999999, "Stock cannot exceed 999999").optional(),
  manufacturer: z.string().max(100, "Manufacturer must be less than 100 characters").optional(),
  origin_country: z.string().max(100, "Country must be less than 100 characters").optional(),
  image_url: z.string().url("Invalid URL format").max(2000, "URL too long").optional().or(z.literal("")),
  condition: z.enum(["new", "used", "refurbished"]),
});

interface Category {
  id: string;
  name: string;
}

const AddProduct = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    condition: 'new',
    stock_quantity: '',
    image_url: '',
    is_active: true,
    discount_percentage: '',
    discount_start_date: '',
    discount_end_date: '',
    manufacturer: '',
    origin_country: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data before submission
      const stockQuantity = formData.stock_quantity ? parseInt(formData.stock_quantity) : undefined;
      const validationResult = productSchema.safeParse({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        stock_quantity: stockQuantity,
        manufacturer: formData.manufacturer.trim() || undefined,
        origin_country: formData.origin_country.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
        condition: formData.condition,
      });

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => e.message).join(", ");
        toast({
          title: "Validation Error",
          description: errors,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Upload image first if there's a file
      const uploadedImageUrl = await uploadImage();

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category_id: formData.category_id || null,
        condition: formData.condition,
        stock_quantity: stockQuantity ?? 0,
        image_url: uploadedImageUrl || formData.image_url.trim() || null,
        is_active: formData.is_active,
        manufacturer: formData.manufacturer.trim() || null,
        origin_country: formData.origin_country.trim() || null,
      };

      // Use edge function for server-side validation
      const { data: result, error } = await supabase.functions.invoke('manage-product', {
        body: { action: 'create', productData }
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('admin.addProduct')}</h1>
            <p className="text-muted-foreground">
              Create a new product in your catalog
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential product details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Product description..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="refurbished">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category and Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Category & Settings</CardTitle>
                <CardDescription>
                  Product classification and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Product Image</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {imagePreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or use URL
                        </span>
                      </div>
                    </div>
                    
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload an image file or provide a URL
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                      placeholder="e.g. Apple, Samsung..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional: Product manufacturer or brand
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="origin_country">Made In</Label>
                    <Input
                      id="origin_country"
                      value={formData.origin_country}
                      onChange={(e) => handleInputChange('origin_country', e.target.value)}
                      placeholder="e.g. China, USA, Germany..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional: Country of origin
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount_start_date">Discount Start Date</Label>
                    <Input
                      id="discount_start_date"
                      type="datetime-local"
                      value={formData.discount_start_date}
                      onChange={(e) => handleInputChange('discount_start_date', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="discount_end_date">Discount End Date</Label>
                    <Input
                      id="discount_end_date"
                      type="datetime-local"
                      value={formData.discount_end_date}
                      onChange={(e) => handleInputChange('discount_end_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this product visible to customers
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />}
              <Save className="h-4 w-4 mr-2" />
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;