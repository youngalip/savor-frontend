// src/components/common/EmptyState.jsx
import { UtensilsCrossed } from 'lucide-react'

const EmptyState = ({ 
  icon: Icon = UtensilsCrossed,
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia',
  action
}) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState