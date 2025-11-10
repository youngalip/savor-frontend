import { useState, useEffect } from "react";
import OwnerSidebar, {
  useOwnerSidebar,
} from "../../components/owner/OwnerSidebar";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Download,
  Filter,
  Clock,
  PieChart,
  BarChart3,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Note: dummy data below follows the controller response shape used by the backend

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  loading,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-full">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-lg bg-primary-500">
        <Icon size={24} className="text-white" />
      </div>
      {trend && !loading && (
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span>{Math.abs(trendValue)}%</span>
        </div>
      )}
    </div>
    {loading ? (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    ) : (
      <>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </>
    )}
  </div>
);

const SalesReport = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [sortBy, setSortBy] = useState("revenue");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Dummy response-shaped data (match backend controller shape)
  const overviewData = {
    period: {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      days_count: 7,
    },
    summary: {
      total_revenue: 89250000,
      total_orders: 542,
      total_customers: 324,
      avg_order_value: 164665,
      growth_rate: 12.5,
    },
    daily_breakdown: [
      {
        date: "2024-01-15",
        revenue: 15750000,
        orders: 87,
        customers: 52,
        avg_order_value: 181034,
      },
      {
        date: "2024-01-14",
        revenue: 14200000,
        orders: 79,
        customers: 48,
        avg_order_value: 179747,
      },
      {
        date: "2024-01-13",
        revenue: 16800000,
        orders: 92,
        customers: 58,
        avg_order_value: 182608,
      },
      {
        date: "2024-01-12",
        revenue: 13500000,
        orders: 75,
        customers: 45,
        avg_order_value: 180000,
      },
      {
        date: "2024-01-11",
        revenue: 15200000,
        orders: 84,
        customers: 50,
        avg_order_value: 180952,
      },
      {
        date: "2024-01-10",
        revenue: 14900000,
        orders: 82,
        customers: 49,
        avg_order_value: 181707,
      },
      {
        date: "2024-01-09",
        revenue: 13800000,
        orders: 76,
        customers: 44,
        avg_order_value: 181578,
      },
    ],
    category_breakdown: [
      {
        category_id: 1,
        category_name: "Kitchen",
        revenue: 50625000,
        orders: 308,
        percentage: 56.8,
      },
      {
        category_id: 2,
        category_name: "Bar",
        revenue: 23830500,
        orders: 178,
        percentage: 26.7,
      },
      {
        category_id: 3,
        category_name: "Pastry",
        revenue: 14794500,
        orders: 98,
        percentage: 16.5,
      },
    ],
    top_menus: [
      {
        menu_id: 1,
        name: "Nasi Goreng Spesial",
        category: "Kitchen",
        quantity_sold: 156,
        revenue: 5460000,
      },
      {
        menu_id: 2,
        name: "Ayam Bakar",
        category: "Kitchen",
        quantity_sold: 98,
        revenue: 4410000,
      },
      {
        menu_id: 3,
        name: "Spaghetti Carbonara",
        category: "Kitchen",
        quantity_sold: 87,
        revenue: 4785000,
      },
      {
        menu_id: 4,
        name: "Es Teh Manis",
        category: "Bar",
        quantity_sold: 245,
        revenue: 1960000,
      },
      {
        menu_id: 5,
        name: "Kopi Susu",
        category: "Bar",
        quantity_sold: 178,
        revenue: 3204000,
      },
    ],
    payment_methods: [
      { method: "Cash", count: 298, amount: 48967500, percentage: 54.9 },
      { method: "Online", amount: 40282500, count: 244, percentage: 45.1 },
    ],
  };

  const peakHoursData = {
    period: {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    },
    hourly_data: [
      { hour: 7, orders_count: 12, revenue: 1850000, avg_order_value: 154166 },
      { hour: 8, orders_count: 24, revenue: 3920000, avg_order_value: 163333 },
      { hour: 9, orders_count: 18, revenue: 2890000, avg_order_value: 160555 },
      { hour: 10, orders_count: 15, revenue: 2450000, avg_order_value: 163333 },
      { hour: 11, orders_count: 32, revenue: 5440000, avg_order_value: 170000 },
      {
        hour: 12,
        orders_count: 68,
        revenue: 11560000,
        avg_order_value: 170000,
      },
      { hour: 13, orders_count: 54, revenue: 9180000, avg_order_value: 170000 },
      { hour: 14, orders_count: 28, revenue: 4760000, avg_order_value: 170000 },
      { hour: 15, orders_count: 22, revenue: 3520000, avg_order_value: 160000 },
      { hour: 16, orders_count: 18, revenue: 2880000, avg_order_value: 160000 },
      { hour: 17, orders_count: 38, revenue: 6270000, avg_order_value: 165000 },
      {
        hour: 18,
        orders_count: 72,
        revenue: 12240000,
        avg_order_value: 170000,
      },
      {
        hour: 19,
        orders_count: 85,
        revenue: 14875000,
        avg_order_value: 175000,
      },
      { hour: 20, orders_count: 48, revenue: 8400000, avg_order_value: 175000 },
      { hour: 21, orders_count: 32, revenue: 5280000, avg_order_value: 165000 },
    ],
  };

  const menuPerformanceData = {
    period: {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    },
    menus: [
      {
        menu_id: 1,
        menu_name: "Nasi Goreng Spesial",
        category: "Kitchen",
        subcategory: "Main Course",
        quantity_sold: 156,
        revenue: 5460000,
        avg_price: 35000,
        orders_count: 142,
      },
      {
        menu_id: 2,
        menu_name: "Ayam Bakar",
        category: "Kitchen",
        subcategory: "Main Course",
        quantity_sold: 98,
        revenue: 4410000,
        avg_price: 45000,
        orders_count: 89,
      },
      {
        menu_id: 3,
        menu_name: "Spaghetti Carbonara",
        category: "Kitchen",
        subcategory: "Pasta",
        quantity_sold: 87,
        revenue: 4785000,
        avg_price: 55000,
        orders_count: 82,
      },
      {
        menu_id: 4,
        menu_name: "Es Teh Manis",
        category: "Bar",
        subcategory: "Beverage",
        quantity_sold: 245,
        revenue: 1960000,
        avg_price: 8000,
        orders_count: 198,
      },
      {
        menu_id: 5,
        menu_name: "Kopi Susu",
        category: "Bar",
        subcategory: "Beverage",
        quantity_sold: 178,
        revenue: 3204000,
        avg_price: 18000,
        orders_count: 165,
      },
    ],
  };

  // Get filtered and sorted menu list
  const getFilteredMenus = () => {
    let filtered = [...menuPerformanceData.menus];

    // Apply category filter
    if (categoryFilter !== "all") {
      const categoryName = overviewData.category_breakdown.find(
        (cat) => cat.category_id.toString() === categoryFilter
      )?.category_name;

      filtered = filtered.filter((menu) => menu.category === categoryName);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "revenue") {
        return b.revenue - a.revenue;
      } else if (sortBy === "quantity") {
        return b.quantity_sold - a.quantity_sold;
      }
      return 0;
    });

    return filtered;
  };

  const handleExport = (type, format) => {
    const params = new URLSearchParams({
      type: type,
      format: format,
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    });
    console.log(`Exporting: ${type} as ${format}`);
    console.log(`URL: /api/reports/export?${params.toString()}`);
    alert(`Export ${type} sebagai ${format} akan diunduh`);
  };

  // simulate loading when user clicks refresh
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />

      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="p-8 mt-16 lg:mt-0 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Laporan Penjualan
              </h1>
              <p className="text-gray-600 mt-1">
                Analisis performa dan statistik penjualan
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLoading(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={18} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => handleExport(activeTab, "csv")}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Download size={18} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap">
                Terapkan Filter
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Menampilkan data dari {formatDate(dateRange.start_date)} sampai{" "}
              {formatDate(dateRange.end_date)} ({overviewData.period.days_count}{" "}
              hari)
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 relative z-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === "overview"
                  ? "bg-primary-500 text-white relative z-10 shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <PieChart size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("menu-performance")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === "menu-performance"
                  ? "bg-primary-500 text-white relative z-10 shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <BarChart3 size={18} />
              Menu Performance
            </button>
            <button
              onClick={() => setActiveTab("peak-hours")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === "peak-hours"
                  ? "bg-primary-500 text-white relative z-10 shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Clock size={18} />
              Peak Hours
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
                <StatCard
                  title="Total Pendapatan"
                  value={formatCurrency(overviewData.summary.total_revenue)}
                  icon={DollarSign}
                  trend={overviewData.summary.growth_rate > 0 ? "up" : "down"}
                  trendValue={overviewData.summary.growth_rate}
                  loading={loading}
                />
                <StatCard
                  title="Total Pesanan"
                  value={overviewData.summary.total_orders}
                  subtitle="Pesanan selesai"
                  icon={ShoppingBag}
                  loading={loading}
                />
                <StatCard
                  title="Total Pelanggan"
                  value={overviewData.summary.total_customers}
                  subtitle="Pelanggan unik"
                  icon={Users}
                  loading={loading}
                />
                <StatCard
                  title="Rata-rata Pesanan"
                  value={formatCurrency(overviewData.summary.avg_order_value)}
                  icon={Calendar}
                  loading={loading}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Breakdown Harian
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {overviewData.daily_breakdown.map((day) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[64px]"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatDate(day.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {day.orders} pesanan • {day.customers} pelanggan
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">
                            {formatCurrency(day.revenue)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Avg: {formatCurrency(day.avg_order_value)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Menus */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Menu Terlaris
                  </h2>
                  <div className="space-y-3">
                    {overviewData.top_menus.map((item, index) => (
                      <div
                        key={item.menu_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-600">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.category} • {item.quantity_sold} terjual
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">
                            {formatCurrency(item.revenue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Breakdown per Kategori
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {overviewData.category_breakdown.map((cat) => (
                    <div
                      key={cat.category_id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">
                          {cat.category_name}
                        </p>
                        <span className="text-sm font-medium text-primary-600">
                          {cat.percentage}%
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {formatCurrency(cat.revenue)}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        {cat.orders} pesanan
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menu Performance Tab */}
          {activeTab === "menu-performance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="1">Kitchen</option>
                      <option value="2">Bar</option>
                      <option value="3">Pastry</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urutkan Berdasarkan
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="revenue">Revenue Tertinggi</option>
                      <option value="quantity">Quantity Terbanyak</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Performa Menu
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Rank
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Menu
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Kategori
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Terjual
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Revenue
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Harga Avg
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Pesanan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredMenus().map((menu, index) => (
                        <tr
                          key={menu.menu_id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary-600">
                                #{index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {menu.menu_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {menu.subcategory}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                              {menu.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            {menu.quantity_sold}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-primary-600">
                            {formatCurrency(menu.revenue)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">
                            {formatCurrency(menu.avg_price)}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">
                            {menu.orders_count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Peak Hours Tab */}
          {activeTab === "peak-hours" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Analisis Jam Sibuk
                </h2>
                <div className="space-y-2">
                  {peakHoursData.hourly_data.map((hour) => {
                    const maxRevenue = Math.max(
                      ...peakHoursData.hourly_data.map((h) => h.revenue)
                    );
                    const percentage = (hour.revenue / maxRevenue) * 100;
                    const isPeak = hour.orders_count > 50;
                    return (
                      <div key={hour.hour} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-gray-700">
                          {String(hour.hour).padStart(2, "0")}:00
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <div className="w-full bg-gray-100 rounded-full h-10 overflow-hidden">
                              <div
                                className={`h-10 rounded-full transition-all duration-500 ${
                                  isPeak ? "bg-primary-500" : "bg-primary-300"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                              <span className="text-xs font-semibold text-gray-900">
                                {hour.orders_count} pesanan
                              </span>
                              <span className="text-xs font-bold text-gray-900">
                                {formatCurrency(hour.revenue)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isPeak && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                            PEAK
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-green-100">
                      <Calendar className="text-green-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Total Jam Operasional
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    15 jam
                  </p>
                  <p className="text-sm text-gray-600">07:00 - 21:00</p>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="text-primary-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">
                      Rekomendasi Operasional
                    </h3>
                    <ul className="space-y-2 text-sm text-primary-800">
                      <li>
                        • Jam sibuk terjadi pada 12:00-13:00 dan 18:00-20:00
                      </li>
                      <li>
                        • Pertimbangkan menambah staff pada jam-jam tersebut
                      </li>
                      <li>
                        • Persiapkan stok bahan baku lebih banyak sebelum jam
                        sibuk
                      </li>
                      <li>
                        • Optimalkan layout dapur untuk efisiensi maksimal
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
