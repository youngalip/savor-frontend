// src/components/owner/reports/PeakHoursChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, AlertCircle } from 'lucide-react';

/**
 * Peak Hours Chart Component
 * Shows hourly order distribution with bar chart
 */
const PeakHoursChart = ({ data, loading = false }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Transform data for Recharts
  const chartData = data?.map(item => ({
    hour: `${String(item.hour).padStart(2, '0')}:00`,
    orders: item.orders_count,
    revenue: item.revenue,
    avgOrder: item.avg_order_value
  })) || [];

  // Find peak hour
  const peakHour = chartData.reduce((max, item) => 
    item.orders > (max?.orders || 0) ? item : max, null
  );

  // Color bars based on volume (green = high, yellow = medium, gray = low)
  const getBarColor = (orders, maxOrders) => {
    const ratio = orders / maxOrders;
    if (ratio > 0.7) return '#10b981'; // Green
    if (ratio > 0.4) return '#f59e0b'; // Orange
    return '#94a3b8'; // Gray
  };

  const maxOrders = Math.max(...chartData.map(d => d.orders), 1);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Jam Sibuk</h2>
        <div className="w-full h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Jam Sibuk</h2>
        <div className="w-full h-80 flex flex-col items-center justify-center text-gray-500">
          <Clock size={48} className="mb-4 text-gray-400" />
          <p className="text-center">Tidak ada data untuk periode ini</p>
        </div>
      </div>
    );
  }

  // Check if we have meaningful data
  const hasEnoughData = chartData.filter(d => d.orders > 0).length >= 3;

  if (!hasEnoughData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Jam Sibuk</h2>
        <div className="w-full h-80 flex flex-col items-center justify-center text-gray-500">
          <AlertCircle size={48} className="mb-4 text-gray-400" />
          <p className="text-center">Data belum cukup untuk analisis jam sibuk</p>
          <p className="text-sm text-center mt-2">Minimal 3 jam dengan pesanan diperlukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Jam Sibuk</h2>
        {peakHour && (
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Peak:</span> {peakHour.hour} 
            <span className="ml-2">({peakHour.orders} orders)</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="hour" 
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'orders') return [`${value} pesanan`, 'Total Pesanan'];
              return [formatCurrency(value), name];
            }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Bar 
            dataKey="orders" 
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.orders, maxOrders)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Jam Sibuk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-gray-600">Sedang</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-gray-600">Sepi</span>
        </div>
      </div>
    </div>
  );
};

export default PeakHoursChart;