import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

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

        // Usuarios de prueba (luego conectarás con Google Sheets)
        const testUsers = [
          { 
            id: 'admin-001', 
            email: 'admin@jjrb.com', 
            password: 'admin123', 
            name: 'Administrador', 
            role: 'administrador',
            permissions: ['all']
          },
          { 
            id: 'cliente-001', 
            email: 'cliente@ejemplo.com', 
            password: 'cliente123', 
            name: 'Cliente Ejemplo', 
            role: 'cliente',
            permissions: ['view_products', 'place_orders']
          }
        ]
        
        const user = testUsers.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        )
        
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions
          }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }: any) {
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
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
