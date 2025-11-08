import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

// Dummy Sales Data
const salesData = {
  today: {
    revenue: 15750000,
    orders: 87,
    avgOrder: 181034,
    growth: 12.5
  },
  week: {
    revenue: 89250000,
    orders: 542,
    avgOrder: 164665,
    growth: 8.3
  },
  month: {
    revenue: 387500000,
    orders: 2345,
    avgOrder: 165245,
    growth: 15.7
  }
};

const dailySales = [
  { date: '2024-01-15', revenue: 15750000, orders: 87 },
  { date: '2024-01-14', revenue: 14200000, orders: 79 },
  { date: '2024-01-13', revenue: 16800000, orders: 92 },
  { date: '2024-01-12', revenue: 13500000, orders: 75 },
  { date: '2024-01-11', revenue: 15200000, orders: 84 },
  { date: '2024-01-10', revenue: 14900000, orders: 82 },
  { date: '2024-01-09', revenue: 13800000, orders: 76 }
];

const topItems = [
  { name: 'Nasi Goreng Spesial', sold: 156, revenue: 5460000 },
  { name: 'Ayam Bakar', sold: 98, revenue: 4410000 },
  { name: 'Spaghetti Carbonara', sold: 87, revenue: 4785000 },
  { name: 'Es Teh Manis', sold: 245, revenue: 1960000 },
  { name: 'Kopi Susu', sold: 178, revenue: 3204000 }
];

const categoryBreakdown = [
  { category: 'Kitchen', revenue: 8950000, percentage: 56.8 },
  { category: 'Bar', revenue: 4200000, percentage: 26.7 },
  { category: 'Pastry', revenue: 2600000, percentage: 16.5 }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => (
  <div className="card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-primary-500`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{trendValue}%</span>
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-gray-700">{title}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const SalesReport = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [period, setPeriod] = useState('today');

  const currentData = salesData[period];

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />
      
      <div className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan Penjualan</h1>
              <p className="text-gray-600 mt-1">Analisis performa penjualan restaurant</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setPeriod('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === 'today'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === 'week'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === 'month'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Pendapatan"
              value={formatCurrency(currentData.revenue)}
              icon={DollarSign}
              trend="up"
              trendValue={currentData.growth}
            />
            <StatCard
              title="Total Pesanan"
              value={currentData.orders}
              subtitle="Pesanan selesai"
              icon={ShoppingBag}
              trend="up"
              trendValue={currentData.growth}
            />
            <StatCard
              title="Rata-rata per Pesanan"
              value={formatCurrency(currentData.avgOrder)}
              icon={Calendar}
              trend="up"
              trendValue={5.2}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Sales */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Penjualan Harian</h2>
              <div className="space-y-3">
                {dailySales.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{formatDate(day.date)}</p>
                      <p className="text-sm text-gray-500">{day.orders} pesanan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{formatCurrency(day.revenue)}</p>
                      {index > 0 && (
                        <p className={`text-xs ${
                          day.revenue > dailySales[index - 1].revenue 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {day.revenue > dailySales[index - 1].revenue ? '↑' : '↓'}
                          {' '}
                          {Math.abs(
                            ((day.revenue - dailySales[index - 1].revenue) / dailySales[index - 1].revenue * 100)
                          ).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Items */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Menu Terlaris</h2>
              <div className="space-y-3">
                {topItems.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.sold} terjual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{formatCurrency(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Breakdown per Kategori</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category} className="p-4 bg-cream-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{cat.category}</p>
                    <span className="text-sm font-medium text-primary-600">{cat.percentage}%</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(cat.revenue)}</p>
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
      </div>
    </div>
  );
};

export default SalesReport;