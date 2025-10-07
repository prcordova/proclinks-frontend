'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Tabs,
  Tab,
  Badge
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ChatIcon from '@mui/icons-material/Chat'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAuth } from '@/contexts/auth-context'
import { useChat } from '@/contexts/chat-context'
import { userApi, messageApi } from '@/services/api'
import { getImageUrl } from '@/utils/url'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface User {
  _id: string
  username: string
  avatar?: string
  friendshipStatus?: 'NONE' | 'PENDING' | 'FRIENDLY'
  friendshipId?: string
  isRequester?: boolean
  isRecipient?: boolean
  createdAt?: string
}

interface Message {
  _id: string
  senderId: string
  recipientId: string
  content: string
  timestamp: Date
  read: boolean
}

interface Conversation {
  user: User
  lastMessage?: Message
  unreadCount: number
}

export default function ChatsPage() {
  const { user, loading: authLoading } = useAuth()
  const { openChat } = useChat()
  const [friends, setFriends] = useState<User[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)

  // Buscar amigos do usuário
  const fetchFriends = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await userApi.friendships.listFriends()
      setFriends(response.data.data || [])
    } catch (error) {
      console.error('Erro ao buscar amigos:', error)
      toast.error('Erro ao carregar amigos')
    } finally {
      setLoading(false)
    }
  }

  // Buscar conversas com mensagens recentes
  const fetchConversations = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await messageApi.getConversations()
      const conversationsData = response.data.data || []

      // Converter os dados do backend para o formato esperado
      const formattedConversations: Conversation[] = conversationsData.map((conv: any) => ({
        user: conv.user,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount || 0
      }))

      setConversations(formattedConversations)
    } catch (error) {
      console.error('Erro ao buscar conversas:', error)
      toast.error('Erro ao carregar conversas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchFriends()
      fetchConversations()
    }
  }, [user])

  const handleStartChat = (friend: User) => {
    openChat({
      userId: friend._id,
      username: friend.username,
      avatar: friend.avatar,
      friendshipStatus: friend.friendshipStatus || 'FRIENDLY'
    })
  }

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredConversations = conversations.filter(conv =>
    conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Se ainda está carregando a autenticação, mostra loading
  if (authLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography variant="h6" color="text.secondary">
            Carregando...
          </Typography>
        </Box>
      </Container>
    )
  }

  // Só mostra erro se realmente não está autenticado (depois do loading)
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5" textAlign="center">
          Você precisa estar logado para acessar os chats
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Mensagens
      </Typography>

      {/* Barra de pesquisa */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar amigos ou conversas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab
            label={
              <Badge badgeContent={conversations.length} color="primary" max={99}>
                Conversas
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={friends.length} color="secondary" max={99}>
                Amigos
              </Badge>
            }
          />
        </Tabs>
      </Box>

      {/* Lista de conversas */}
      {activeTab === 0 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            {filteredConversations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhuma conversa encontrada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Suas conversas aparecerão aqui quando você trocar mensagens com amigos
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredConversations.map((conversation) => (
                  <ListItem
                    key={conversation.user._id}
                    component="div"
                    onClick={() => handleStartChat(conversation.user)}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="error"
                        badgeContent={conversation.unreadCount}
                        max={99}
                        invisible={conversation.unreadCount === 0}
                      >
                        <Avatar
                          src={conversation.user.avatar ? getImageUrl(conversation.user.avatar) : undefined}
                          sx={{ width: 48, height: 48 }}
                        >
                          {conversation.user.username?.slice(0, 2).toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {conversation.user.username}
                          </Typography>
                          {conversation.lastMessage && (
                            <Chip
                              label={format(new Date(conversation.lastMessage.timestamp), 'dd/MM')}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        conversation.lastMessage ? (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {conversation.lastMessage.content}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Iniciar conversa
                          </Typography>
                        )
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleStartChat(conversation.user)}>
                        <ChatIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de amigos */}
      {activeTab === 1 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            {filteredFriends.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <PersonAddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nenhum amigo encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Adicione amigos para começar a trocar mensagens
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredFriends.map((friend) => (
                  <ListItem
                    key={friend._id}
                    component="div"
                    onClick={() => handleStartChat(friend)}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={friend.avatar ? getImageUrl(friend.avatar) : undefined}
                        sx={{ width: 48, height: 48 }}
                      >
                        {friend.username.slice(0, 2).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {friend.username}
                          </Typography>
                          {friend.friendshipStatus === 'PENDING' && (
                            <Chip label="Pendente" size="small" color="warning" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {friend.friendshipStatus === 'PENDING'
                            ? (friend.isRequester ? 'Solicitação enviada' : 'Solicitação recebida')
                            : 'Clique para enviar mensagem'
                          }
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleStartChat(friend)}>
                        <ChatIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  )
}
