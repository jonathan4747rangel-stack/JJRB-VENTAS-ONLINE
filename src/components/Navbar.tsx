'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const cart = localStorage.getItem('cart')
    if (cart) {
      const cartItems = JSON.parse(cart)
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(totalItems)
    }
  }, [])

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
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Catálogo
              </Link>
              {session?.user?.role === 'administrador' && (
                <Link 
                  href="/dashboard" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Panel Admin
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <Link href="/checkout" className="relative p-2">
                <ShoppingCartIcon className="h-6 w-6 text-gray-500 hover:text-primary-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {status === 'loading' ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center space-x-2">
                  <Link href="/perfil" className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{session.user?.name}</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
