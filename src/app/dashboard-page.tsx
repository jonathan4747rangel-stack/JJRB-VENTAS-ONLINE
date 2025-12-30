'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalSalesUSD: 0,
    totalSalesVES: 0,
    activeOrders: 0,
    lowStockProducts: 0,
    recentOrders: []
  })

  useEffect(() => {
    // Verificar autenticación
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/signin')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'administrador' && parsedUser.role !== 'manager') {
      router.push('/')
      return
    }
    
    setUser(parsedUser)
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      // Datos simulados para empezar
      setDashboardData({
        totalSalesUSD: 12500.50,
        totalSalesVES: 450018.00,
        activeOrders: 8,
        lowStockProducts: 3,
        recentOrders: [
          { idpedido: 'PED00123', empresa: 'Inversiones Guicar', totalusd: 1250.50, estado: 'pendiente', fecha_creacion: '2024-01-15' },
          { idpedido: 'PED00122', empresa: 'Empresa Ejemplo', totalusd: 850.75, estado: 'pagado', fecha_creacion: '2024-01-14' },
          { idpedido: 'PED00121', empresa: 'Cliente VIP', totalusd: 2200.00, estado: 'enviado', fecha_creacion: '2024-01-13' }
        ]
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-1 text-sm text-gray-600">
            Bienvenido, {user.name} ({user.role})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">💰</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Totales (USD)</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${dashboardData.totalSalesUSD.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">💱</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Totales (Bs)</p>
                <p className="text-2xl font-semibold text-gray-900">
                  Bs. {dashboardData.totalSalesVES.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">📦</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos Activos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.activeOrders}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">⚠️</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboardData.lowStockProducts}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => router.push('/dashboard/productos')}
              className="px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Agregar Producto
            </button>
            <button 
              onClick={() => router.push('/dashboard/pedidos')}
              className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              Ver Pedidos
            </button>
            <button 
              onClick={() => router.push('/dashboard/clientes')}
              className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Gestionar Clientes
            </button>
            <button 
              onClick={() => router.push('/dashboard/config')}
              className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Configuración
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pedidos Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (USD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.map((order: any) => (
                  <tr key={order.idpedido}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.idpedido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.fecha_creacion).toLocaleDateString('es-VE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalusd?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.estado === 'completado' 
                          ? 'bg-green-100 text-green-800' 
                          : order.estado === 'pagado'
                          ? 'bg-blue-100 text-blue-800'
                          : order.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
