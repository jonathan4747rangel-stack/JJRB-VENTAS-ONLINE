'use client'

import Link from 'next/link'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                JJRB VENTAS ONLINE
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Catálogo
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="#" className="p-2">
              <ShoppingCartIcon className="h-6 w-6 text-gray-500 hover:text-primary-600" />
            </Link>
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
