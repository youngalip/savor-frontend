// src/components/owner/table/TableStats.jsx
import { UtensilsCrossed, CheckCircle, XCircle, QrCode } from 'lucide-react'

const TableStats = ({ tables }) => {
  const stats = {
    total: tables.length,
    free: tables.filter(t => t.status === 'Tersedia').length,
    occupied: tables.filter(t => t.status === 'Terisi').length,
    withQR: tables.filter(t => t.qr_code).length
  }

  const statCards = [
    {
      label: 'Total Meja',
      value: stats.total,
      icon: UtensilsCrossed,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Meja Tersedia',
      value: stats.free,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Meja Terisi',
      value: stats.occupied,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      label: 'QR Generated',
      value: stats.withQR,
      icon: QrCode,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon size={24} className={stat.textColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TableStats