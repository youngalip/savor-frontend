// src/components/owner/reports/RevenueChart.jsx
import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

/**
 * Revenue Chart Component
 * Menampilkan bar chart revenue dengan comparison periode sebelumnya
 */
const RevenueChart = ({ data, loading = false }) => {
  const [viewType, setViewType] = useState('3m');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate available years (last 3 years)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }, []);

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format currency short version (untuk chart)
  const formatCurrencyShort = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}jt`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}rb`;
    }
    return value.toString();
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data?.current || !data?.previous) return [];

    // Map current and previous data by month
    const currentMap = new Map(
      data.current.map(item => [item.month, item])
    );
    const previousMap = new Map(
      data.previous.map(item => [item.month, item])
    );

    // Get all unique months
    const allMonths = new Set([
      ...data.current.map(d => d.month),
      ...data.previous.map(d => d.month)
    ]);

    return Array.from(allMonths)
      .sort((a, b) => a - b)
      .map(month => {
        const current = currentMap.get(month);
        const previous = previousMap.get(month);
        
        return {
          month: month,
          monthName: current?.month_name || previous?.month_name || '',
          currentRevenue: current?.revenue || 0,
          previousRevenue: previous?.revenue || 0,
          currentOrders: current?.orders_count || 0,
          previousOrders: previous?.orders_count || 0
        };
      });
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const growthRate = data.previousRevenue > 0
      ? (((data.currentRevenue - data.previousRevenue) / data.previousRevenue) * 100)
      : 0;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{data.monthName}</p>
        
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-primary-600">● Periode Ini:</span>
            <span className="font-semibold">{formatCurrency(data.currentRevenue)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">● Periode Lalu:</span>
            <span className="font-semibold">{formatCurrency(data.previousRevenue)}</span>
          </div>
          
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className={`flex items-center gap-1 ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="font-semibold">
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>Pesanan: {data.currentOrders} ({data.currentOrders - data.previousOrders >= 0 ? '+' : ''}{data.currentOrders - data.previousOrders})</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Revenue Trends</h2>
          <p className="text-sm text-gray-600 mt-1">
            Perbandingan dengan periode sebelumnya
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* View Type Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('3m')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewType === '3m'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3 Bulan
            </button>
            <button
              onClick={() => setViewType('6m')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewType === '6m'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              6 Bulan
            </button>
            <button
              onClick={() => setViewType('1y')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewType === '1y'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1 Tahun
            </button>
          </div>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Summary */}
      {data?.comparison && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
            <p className="text-xs text-primary-700 font-medium mb-1">Periode Ini</p>
            <p className="text-xl font-bold text-primary-900">
              {formatCurrency(data.comparison.current_total)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Periode Sebelumnya</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(data.comparison.previous_total)}
            </p>
          </div>
          
          <div className={`rounded-lg p-4 ${
            data.comparison.growth_rate >= 0 
              ? 'bg-gradient-to-br from-green-50 to-green-100' 
              : 'bg-gradient-to-br from-red-50 to-red-100'
          }`}>
            <p className="text-xs font-medium mb-1 text-gray-600">Pertumbuhan</p>
            <div className="flex items-center gap-2">
              {data.comparison.growth_rate >= 0 ? (
                <TrendingUp className="text-green-600" size={20} />
              ) : (
                <TrendingDown className="text-red-600" size={20} />
              )}
              <p className={`text-xl font-bold ${
                data.comparison.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.comparison.growth_rate >= 0 ? '+' : ''}{data.comparison.growth_rate}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="monthName"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tickFormatter={formatCurrencyShort}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
              formatter={(value) => {
                return value === 'currentRevenue' ? 'Periode Ini' : 'Periode Sebelumnya';
              }}
            />
            <Bar
              dataKey="currentRevenue"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <Bar
              dataKey="previousRevenue"
              fill="#d1d5db"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Calendar size={48} className="mb-4 text-gray-400" />
          <p>Tidak ada data untuk periode ini</p>
        </div>
      )}

      {/* Insights */}
      {chartData.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">💡 Insights:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Bulan terbaik: {chartData.reduce((max, item) => 
                item.currentRevenue > max.currentRevenue ? item : max
              ).monthName} ({formatCurrency(chartData.reduce((max, item) => 
                item.currentRevenue > max.currentRevenue ? item : max
              ).currentRevenue)})
            </li>
            <li>
              • Rata-rata per bulan: {formatCurrency(
                chartData.reduce((sum, item) => sum + item.currentRevenue, 0) / chartData.length
              )}
            </li>
            {data?.comparison?.growth_rate !== undefined && (
              <li>
                • Trend keseluruhan: {data.comparison.growth_rate >= 0 ? '📈 Naik' : '📉 Turun'} {Math.abs(data.comparison.growth_rate).toFixed(1)}% vs periode sebelumnya
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;