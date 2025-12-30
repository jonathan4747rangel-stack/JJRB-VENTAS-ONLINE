'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  precioUSD: number
  precioVES: number
  stock: number
  idcategoria: string
  urlimagen: string
  activo: boolean
  fecha_creacion: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.idcategoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            JJRB VENTAS ONLINE
          </h1>
          <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
            Catálogo de productos para Inversiones Guicar 2025
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="1">Cartulinas</option>
              <option value="2">Foami</option>
              <option value="3">Cintas doble faz</option>
              <option value="4">Cinta de embalaje</option>
              <option value="5">Pegas blancas</option>
              <option value="6">Cintas adhesivas transparentes</option>
              <option value="7">Cintas adhesivas marrón</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-end">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              Ver Carrito (0)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No se encontraron productos</h3>
            <p className="mt-1 text-gray-500">Intenta con otro término de búsqueda o categoría</p>
          </div>
        )}
      </main>
    </div>
  )
}
