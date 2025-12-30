import { NextRequest, NextResponse } from 'next/server'
import { getSheetData } from '@/lib/googleSheets'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    const [products, config] = await Promise.all([
      getSheetData('PRODUCTOS', 'A2:K'),
      getSheetData('CONFIG', 'A2:B')
    ])
    
    const tasaBCV = parseFloat(config.find((row: any[]) => row[0] === 'tasabcv')?.[1] || '36')
    
    let filteredProducts = products.map((row: any[]) => ({
      id: row[0] || '',
      codigo: row[1] || '',
      nombre: row[2] || '',
      descripcion: row[3] || '',
      precioUSD: parseFloat(row[4]) || 0,
      precioVES: (parseFloat(row[4]) || 0) * tasaBCV,
      stock: parseInt(row[6]) || 0,
      idcategoria: row[7] || '',
      urlimagen: row[8] || '/placeholder-product.png',
      activo: row[9] === 'TRUE' || row[9] === 'true',
      fecha_creacion: row[10] || ''
    })).filter(product => product.activo)

    // Filtrar por categoría si se especifica
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.idcategoria === category
      )
    }

    // Filtrar por búsqueda si se especifica
    if (search) {
      filteredProducts = filteredProducts.filter(
        product => 
          product.nombre.toLowerCase().includes(search.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(search.toLowerCase()) ||
          product.codigo.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json(filteredProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}
