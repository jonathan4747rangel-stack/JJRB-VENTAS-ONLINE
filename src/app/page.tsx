import { Suspense } from 'react'
import ProductCatalog from '@/components/ProductCatalog'
import Navbar from '@/components/Navbar'

export default function Home() {
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

        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        }>
          <ProductCatalog />
        </Suspense>
      </main>
    </div>
  )
}
