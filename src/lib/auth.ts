import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getSheetData } from './googleSheets'
import { comparePassword } from './bcrypt'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Buscar en administradores
          const admins = await getSheetData('ADMINISTRADORES', 'A2:F')
          const admin = admins.find((row: any[]) => row[1] === credentials.email)

          if (admin) {
            const passwordMatch = await comparePassword(credentials.password, admin[3])
            if (passwordMatch) {
              return {
                id: admin[0],
                email: admin[1],
                name: admin[2],
                role: admin[4],
                permissions: JSON.parse(admin[5] || '[]')
              }
            }
          }

          // Buscar en clientes
          const clients = await getSheetData('CLIENTES', 'A2:I')
          const client = clients.find((row: any[]) => row[3] === credentials.email)

          if (client) {
            const passwordMatch = await comparePassword(credentials.password, client[8])
            if (passwordMatch) {
              return {
                id: client[0],
                email: client[3],
                name: client[2],
                role: 'cliente',
                permissions: ['view_products', 'place_orders']
              }
            }
          }

          return null
        } catch (error) {
          console.error('Error en autenticación:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
