'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulación de login (más adelante implementaremos NextAuth)
      if (email === 'admin@jjrb.com' && password === 'admin123') {
        // Guardar sesión simulada
        localStorage.setItem('user', JSON.stringify({
          id: 'admin-001',
          email: 'admin@jjrb.com',
          name: 'Administrador',
          role: 'administrador'
        }))
        router.push('/dashboard')
      } else if (email === 'cliente@ejemplo.com' && password === 'cliente123') {
        localStorage.setItem('user', JSON.stringify({
          id: 'cli-001',
          email: 'cliente@ejemplo.com',
          name: 'Cliente Ejemplo',
          role: 'cliente'
        }))
        router.push('/')
      } else {
        // Intentar buscar en "usuarios de prueba" hardcodeados
        const testUsers = [
          { email: 'admin@jjrb.com', password: 'admin123', name: 'Admin', role: 'administrador' },
          { email: 'cliente@ejemplo.com', password: 'cliente123', name: 'Cliente', role: 'cliente' },
          { email: 'manager@jjrb.com', password: 'manager123', name: 'Manager', role: 'manager' }
        ]
        
        const user = testUsers.find(u => u.email === email && u.password === password)
        
        if (user) {
          localStorage.setItem('user', JSON.stringify({
            id: `${user.role}-001`,
            email: user.email,
            name: user.name,
            role: user.role
          }))
          if (user.role === 'administrador') {
            router.push('/dashboard')
          } else {
            router.push('/')
          }
        } else {
          setError('Credenciales inválidas. Usa admin@jjrb.com / admin123 para probar.')
        }
      }
    } catch (error) {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Panel Administrativo JJRB VENTAS ONLINE
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Usuarios de prueba:</p>
            <p>• Admin: admin@jjrb.com / admin123</p>
            <p>• Cliente: cliente@ejemplo.com / cliente123</p>
            <p>• Manager: manager@jjrb.com / manager123</p>
          </div>
          
          <div className="text-center">
            <Link href="/" className="text-primary-600 hover:text-primary-500">
              Volver al catálogo
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
