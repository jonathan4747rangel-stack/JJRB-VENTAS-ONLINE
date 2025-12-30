'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardCard from '@/components/DashboardCard'
import Navbar from '@/components/Navbar'

interface DashboardData {
  metrics: {
    totalSalesUSD: number
    totalSalesVES: number
    activeOrders: number
    lowStockProducts: number
    newClients: number
    totalProducts: number
    totalClients: number
  }
  recentOrders: Array<{
    idpedido: string
    empresa: string
    fecha_creacion: string
    totalusd: number
    totalves: number
    estado: string
  }>
  trends: {
    orders: string
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user?.role !== 'administrador') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'administrador') {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        setError('Error al cargar datos del dashboard')
      }
    } catch (error) {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'administrador') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-1 text-sm text-gray-600">
            Bienvenido, {session.user?.name}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Ventas Totales (USD)"
                value={`$${data.metrics.totalSalesUSD.toFixed(2)}`}
                icon="💰"
              />
              <DashboardCard
                title="Ventas Totales (Bs)"
                value={`Bs. ${data.metrics.totalSalesVES.toFixed(2)}`}
                icon="💱"
                trend={`${data.trends.orders}%`}
              />
              <DashboardCard
                title="Pedidos Activos"
                value={data.metrics.activeOrders}
                icon="📦"
              />
              <DashboardCard
                title="Productos con Stock Bajo"
                value={data.metrics.lowStockProducts}
                icon="⚠️"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCard
                title="Clientes Nuevos (mes)"
                value={data.metrics.newClients}
                icon="👥"
              />
              <DashboardCard
                title="Total Productos"
                value={data.metrics.totalProducts}
                icon="📊"
              />
              <DashboardCard
                title="Total Clientes"
                value={data.metrics.totalClients}
                icon="👤"
              />
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
                    {data.recentOrders.map((order) => (
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
                          ${order.totalusd.toFixed(2)}
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
          </>
        )}
      </main>
    </div>
  )
}
