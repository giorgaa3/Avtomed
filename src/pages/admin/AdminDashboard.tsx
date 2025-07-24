import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch orders count and revenue
        const { data: orders, count: ordersCount } = await supabase
          .from('orders')
          .select('total_amount', { count: 'exact' });

        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

        setStats({
          totalProducts: productsCount || 0,
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: t('admin.totalProducts'),
      value: stats.totalProducts,
      description: 'Active products in catalog',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: t('admin.totalUsers'),
      value: stats.totalUsers,
      description: 'Registered users',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: t('admin.totalOrders'),
      value: stats.totalOrders,
      description: 'Orders placed',
      icon: ShoppingCart,
      color: 'text-orange-600',
    },
    {
      title: t('admin.revenue'),
      value: `₾${stats.totalRevenue.toFixed(2)}`,
      description: 'Total revenue',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('admin.welcome')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.recentActivity')}</CardTitle>
              <CardDescription>
                Latest actions in your admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New product added
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Order processed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      1 hour ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New user registered
                    </p>
                    <p className="text-sm text-muted-foreground">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.quickActions')}</CardTitle>
              <CardDescription>
                Common admin tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-2">
                <a href="/admin/products/new" className="text-sm hover:underline">
                  → Add new product
                </a>
                <a href="/admin/orders" className="text-sm hover:underline">
                  → View recent orders
                </a>
                <a href="/admin/users" className="text-sm hover:underline">
                  → Manage users
                </a>
                <a href="/admin/settings" className="text-sm hover:underline">
                  → Update settings
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.systemStatus')}</CardTitle>
              <CardDescription>
                Current system information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Database</span>
                  <span className="text-sm text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Authentication</span>
                  <span className="text-sm text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage</span>
                  <span className="text-sm text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API Status</span>
                  <span className="text-sm text-green-600">●</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;