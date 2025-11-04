import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth'

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Login com email/senha (sistema atual)
    CredentialsProvider({
      id: 'credentials',
      name: 'Email e Senha',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await authenticateUser(credentials.email, credentials.password)
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.nome,
              role: user.role,
              tenantId: user.tenantId,
              tenant: user.tenant
            }
          }
          return null
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      }
    }),

    // Login com Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Primeira vez logando
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
        token.tenant = user.tenant
      }

      // Login com Google - buscar dados do usuário no banco
      if (account?.provider === 'google' && user?.email) {
        console.log('[JWT CALLBACK] Buscando usuário Google:', user.email)
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: {
            tenant: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        })

        if (existingUser) {
          console.log('[JWT CALLBACK] Usuário encontrado:', existingUser.email)
          token.role = existingUser.role
          token.tenantId = existingUser.tenantId
          token.tenant = existingUser.tenant
          token.userId = existingUser.id
        } else {
          console.log('[JWT CALLBACK] Usuário não encontrado - isso não deveria acontecer')
          // Se chegou aqui, o usuário deveria ter sido criado no signIn
          // Vamos buscar novamente ou usar dados básicos
          token.role = 'CLIENTE_USER'
          token.tenantId = null
          token.tenant = null
          token.userId = user.id
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = (token.userId as string) || (token.sub as string)
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
        session.user.tenant = token.tenant as any
      }
      return session
    },

    async signIn({ user, account, profile }) {
      // Permitir login com credentials sempre
      if (account?.provider === 'credentials') {
        return true
      }

      // Para Google, verificar se usuário existe no banco
      if (account?.provider === 'google' && user?.email) {
        console.log('[GOOGLE LOGIN] Tentativa de login:', user.email)
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (existingUser) {
          console.log('[GOOGLE LOGIN] Usuário encontrado no banco:', existingUser.email)
          return true
        } else {
          console.log('[GOOGLE LOGIN] Usuário não encontrado no banco:', user.email)
          
          // TEMPORÁRIO: Criar usuário automaticamente para teste
          try {
            const newUser = await prisma.user.create({
              data: {
                nome: user.name || user.email?.split('@')[0] || 'Usuário Google',
                email: user.email!,
                senhaHash: '', // OAuth users não precisam de senha
                role: 'CLIENTE_USER',
                ativo: true,
              }
            })
            console.log('[GOOGLE LOGIN] Usuário criado automaticamente:', newUser.email)
            return true
          } catch (error) {
            console.error('[GOOGLE LOGIN] Erro ao criar usuário:', error)
            return false
          }
        }
      }

      return false
    }
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
