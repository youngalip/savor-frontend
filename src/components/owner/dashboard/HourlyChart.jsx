// src/components/owner/dashboard/HourlyChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

/**
 * Orders by Hour Bar Chart
 * Shows order distribution throughout the day
 */
const HourlyChart = ({ data, loading = false }) => {
  // Transform data for Recharts
  const chartData = data?.map(item => ({
    hour: `${String(item.hour).padStart(2, '0')}:00`,
    orders: item.count
  })) || [];

  // Check if we have meaningful data (at least 5 hours with data)
  const hasEnoughData = chartData.filter(d => d.orders > 0).length >= 5;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Orders by Hour (Today)</h2>
        <div className="w-full h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Orders by Hour (Today)</h2>
        <div className="w-full h-80 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  // Show message if not enough data yet (early morning)
  if (!hasEnoughData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Orders by Hour (Today)</h2>
        <div className="w-full h-80 flex flex-col items-center justify-center text-gray-500">
          <AlertCircle size={48} className="mb-4 text-gray-400" />
          <p className="text-center">Not enough data yet</p>
          <p className="text-sm text-center mt-2">Check back later for hourly insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Orders by Hour (Today)</h2>
        <div className="text-sm text-gray-500">
          Peak: {Math.max(...chartData.map(d => d.orders))} orders
        </div>
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
            height={60}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            formatter={(value) => [`${value} orders`, 'Total Orders']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Bar 
            dataKey="orders" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyChart;