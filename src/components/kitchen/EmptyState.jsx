import { Package } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
        <Package size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada item</h3>
      <p className="text-gray-500">Tidak ada item yang sesuai dengan filter</p>
    </div>
  );
};

export default EmptyState;