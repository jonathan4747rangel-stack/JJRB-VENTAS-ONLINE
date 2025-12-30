'use client'

import Image from 'next/image'
import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

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

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      onAddToCart(product)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={product.urlimagen || '/placeholder-product.png'}
          alt={product.nombre}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-product.png'
          }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Agotado</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{product.nombre}</h3>
          <span className="text-xs text-gray-500">SKU: {product.codigo}</span>
        </div>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.descripcion}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-primary-600">${product.precioUSD.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Bs. {product.precioVES.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">4.8</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Sin stock'}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              product.stock === 0 || isAdding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isAdding ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
