import { NextRequest, NextResponse } from 'next/server'
import { getSheetData } from '@/lib/googleSheets'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user?.role !== 'administrador') {
      return NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      )
    }

    const [orders, products, clients, config] = await Promise.all([
      getSheetData('PEDIDOS', 'A2:M'),
      getSheetData('PRODUCTOS', 'A2:K'),
      getSheetData('CLIENTES', 'A2:I'),
      getSheetData('CONFIG', 'A2:B')
    ])

    const tasaBCV = parseFloat(config.find((row: any[]) => row[0] === 'tasabcv')?.[1] || '36')
    
    // Calcular ventas totales
    const totalSalesUSD = orders.reduce((sum: number, order: any[]) => 
      sum + (parseFloat(order[7]) || 0), 0
    )
    
    const totalSalesVES = orders.reduce((sum: number, order: any[]) => 
      sum + (parseFloat(order[8]) || 0), 0
    )
    
    // Contar pedidos activos
    const activeOrders = orders.filter((order: any[]) => 
      order[9] === 'pendiente' || order[9] === 'pagado'
    ).length
    
    // Contar productos con stock bajo (<10 unidades)
    const lowStockProducts = products.filter((product: any[]) => 
      (parseInt(product[6]) || 0) < 10
    ).length
    
    // Obtener clientes registrados este mes
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const newClients = clients.filter((client: any[]) => {
      const date = new Date(client[8] || '')
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear
    }).length
    
    // Obtener pedidos recientes (últimos 5)
    const recentOrders = orders
      .slice(-5)
      .reverse()
      .map((order: any[]) => {
        const client = clients.find((c: any[]) => c[0] === order[1])
        return {
          idpedido: order[0],
          empresa: client ? client[1] : 'Cliente no encontrado',
          fecha_creacion: order[12],
          totalusd: parseFloat(order[7]) || 0,
          totalves: parseFloat(order[8]) || 0,
          estado: order[9] || 'pendiente'
        }
      })
    
    // Calcular tendencias (simplificado)
    const lastMonthOrders = orders.filter((order: any[]) => {
      const orderDate = new Date(order[12] || '')
      const lastMonth = new Date().getMonth() - 1
      return orderDate.getMonth() === lastMonth
    }).length
    
    const currentMonthOrders = orders.filter((order: any[]) => {
      const orderDate = new Date(order[12] || '')
      return orderDate.getMonth() === currentMonth
    }).length
    
    const orderTrend = lastMonthOrders > 0 
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
      : '100'

    return NextResponse.json({
      metrics: {
        totalSalesUSD,
        totalSalesVES,
        activeOrders,
        lowStockProducts,
        newClients,
        totalProducts: products.length,
        totalClients: clients.length
      },
      recentOrders,
      trends: {
        orders: orderTrend
      }
    })
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}
