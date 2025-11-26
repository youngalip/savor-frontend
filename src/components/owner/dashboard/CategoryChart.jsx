// src/components/owner/dashboard/CategoryChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * Category Breakdown Pie Chart
 * Shows revenue distribution by category (Kitchen, Bar, Pastry)
 */
const CategoryChart = ({ data, loading = false }) => {
  // Color mapping for categories
  const COLORS = {
    'Kitchen': '#FF6B6B',
    'Bar': '#4ECDC4',
    'Pastry': '#FFE66D',
    'default': '#95A5A6'
  };

  // Transform data for Recharts
  const chartData = data?.map(item => ({
    name: item.category,
    value: parseFloat(item.revenue),
    percentage: parseFloat(item.percentage)
  })) || [];

  // Custom label to show percentage
  const renderCustomLabel = ({ name, percentage }) => {
    return `${name}: ${percentage.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h2>
        <div className="w-full h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h2>
        <div className="w-full h-80 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name] || COLORS.default} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(value)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;