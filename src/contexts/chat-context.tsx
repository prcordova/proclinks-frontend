'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'

interface Message {
  _id: string
  senderId: string
  recipientId: string
  content: string
  timestamp: Date
  read: boolean
}

interface ChatUser {
  userId: string
  username: string
  avatar?: string
  friendshipStatus?: 'NONE' | 'PENDING' | 'FRIENDLY'
}

interface ChatWindow extends ChatUser {
  isMinimized: boolean
  messages: Message[]
}

interface ChatContextData {
  openChats: ChatWindow[]
  openChat: (user: ChatUser) => void
  closeChat: (userId: string) => void
  minimizeChat: (userId: string) => void
  maximizeChat: (userId: string) => void
  sendMessage: (userId: string, content: string) => void
  updateFriendshipStatus: (userId: string, newStatus: 'NONE' | 'PENDING' | 'FRIENDLY') => void
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [openChats, setOpenChats] = useState<ChatWindow[]>([])
  const { user } = useAuth()

  const updateFriendshipStatus = useCallback((userId: string, newStatus: 'NONE' | 'PENDING' | 'FRIENDLY') => {
    setOpenChats(current =>
      current.map(chat =>
        chat.userId === userId ? { ...chat, friendshipStatus: newStatus } : chat
      )
    )
  }, [])

  // Inicializa o socket
  useEffect(() => {
    if (!user) return

    const newSocket = io('http://localhost:8080', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
      path: '/socket.io/'
    })

    newSocket.on('connect', () => {
      console.log('Socket conectado com sucesso')
      newSocket.emit('user_connected', user.id)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Erro na conexão do socket:', error)
    })

    newSocket.on('receive_message', (message: Message) => {
      console.log('Mensagem recebida via socket:', message)
      setOpenChats(chats => {
        // Procura o chat do remetente ou destinatário
        const chatIndex = chats.findIndex(chat => {
          const isRecipient = chat.userId === message.recipientId
          const isSender = chat.userId === message.senderId
          return isRecipient || isSender
        })

        if (chatIndex === -1) {
          console.log('Chat não encontrado para a mensagem:', message)
          return chats
        }

        // Atualiza o chat com a nova mensagem
        const updatedChats = [...chats]
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          messages: [...updatedChats[chatIndex].messages, message]
        }

        return updatedChats
      })
    })

    newSocket.on('friendship_update', ({ userId, status }: { userId: string, status: 'NONE' | 'PENDING' | 'FRIENDLY' }) => {
      console.log('Amizade atualizada:', userId, status)
      updateFriendshipStatus(userId, status)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [user, updateFriendshipStatus])

  const loadChatHistory = useCallback(async (userId: string, otherUserId: string) => {
    try {
      const response = await api.get(`/api/messages/${userId}/${otherUserId}`)
      console.log('Histórico carregado:', response.data)
      return response.data.data || []
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      toast.error('Erro ao carregar mensagens')
      return []
    }
  }, [])

  const maximizeChat = useCallback((userId: string) => {
    setOpenChats(current =>
      current.map(chat =>
        chat.userId === userId ? { ...chat, isMinimized: false } : chat
      )
    )
  }, [])

  const openChat = useCallback(async (chatUser: ChatUser) => {
    if (!user) return

    // Verifica se o chat já está aberto
    const existingChat = openChats.find(chat => chat.userId === chatUser.userId)
    if (existingChat) {
      maximizeChat(chatUser.userId)
      return
    }

    // Limita a 3 chats abertos
    if (openChats.length >= 3) {
      const chatsToKeep = openChats.slice(-2)
      setOpenChats(chatsToKeep)
    }

    try {
      // Carrega o histórico de mensagens
      const history = await loadChatHistory(user.id, chatUser.userId)
      console.log('Histórico carregado para o chat:', history)

      // Adiciona o novo chat
      const newChat: ChatWindow = {
        ...chatUser,
        isMinimized: false,
        messages: history
      }

      setOpenChats(current => [...current, newChat])
    } catch (error) {
      console.error('Erro ao abrir chat:', error)
      toast.error('Erro ao carregar o chat')
    }
  }, [openChats, user, loadChatHistory, maximizeChat])

  const closeChat = useCallback((userId: string) => {
    setOpenChats(current => current.filter(chat => chat.userId !== userId))
  }, [])

  const minimizeChat = useCallback((userId: string) => {
    setOpenChats(current =>
      current.map(chat =>
        chat.userId === userId ? { ...chat, isMinimized: true } : chat
      )
    )
  }, [])

  const sendMessage = useCallback(async (userId: string, content: string) => {
    if (!socket || !user) return

    try {
      // Salva a mensagem no banco
      const response = await api.post('/api/messages', {
        senderId: user.id,
        recipientId: userId,
        content
      })

      const newMessage = response.data.data
      console.log('Mensagem salva no banco:', newMessage)

      // Envia a mensagem via socket
      socket.emit('send_message', newMessage)

      // Atualiza o estado local
      setOpenChats(current =>
        current.map(chat => {
          if (chat.userId === userId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage]
            }
          }
          return chat
        })
      )

      console.log('Mensagem enviada com sucesso:', newMessage)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem')
    }
  }, [socket, user])

  return (
    <ChatContext.Provider value={{
      openChats,
      openChat,
      closeChat,
      minimizeChat,
      maximizeChat,
      sendMessage,
      updateFriendshipStatus
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext) 