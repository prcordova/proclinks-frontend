'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, IconButton, TextField, Typography, Paper, Alert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MinimizeIcon from '@mui/icons-material/Minimize'
import SendIcon from '@mui/icons-material/Send'
import { useAuth } from '@/contexts/auth-context'
import { format } from 'date-fns'

interface Message {
  _id: string
  senderId: string
  content: string
  timestamp: Date
}

interface ChatWindowProps {
  username: string
  messages: Message[]
  onClose: () => void
  onMinimize: () => void
  onSendMessage: (content: string) => void
  isMinimized: boolean
  friendshipStatus?: 'NONE' | 'PENDING' | 'FRIENDLY'
}

export function ChatWindow({
  username,
  messages,
  onClose,
  onMinimize,
  onSendMessage,
  isMinimized,
  friendshipStatus = 'NONE'
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && friendshipStatus === 'FRIENDLY') {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isMinimized) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 20,
          width: 200,
          height: 40,
          bgcolor: 'primary.main',
          color: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        }}
        onClick={onMinimize}
      >
        <Typography variant="body2" noWrap>
          {username}
        </Typography>
        <Box>
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 20,
        width: 320,
        height: 400,
        bgcolor: 'background.paper',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="body1" sx={{ ml: 1 }}>
          {username}
        </Typography>
        <Box>
          <IconButton size="small" color="inherit" onClick={onMinimize}>
            <MinimizeIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: '#f5f5f5'
        }}
      >
        {messages.map((message) => {
          const isSentByMe = message.senderId === user?.id
          
          return (
            <Box
              key={message._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isSentByMe ? 'flex-end' : 'flex-start',
                alignSelf: isSentByMe ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  bgcolor: isSentByMe ? 'primary.main' : '#494a4d',
                  color: isSentByMe ? 'white' : 'text.primary',
                  borderRadius: 2,
                  wordBreak: 'break-word'
                }}
              >
                <Typography variant="body1">
                  {message.content}
                </Typography>
              </Paper>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: '0.7rem' }}
              >
                {format(new Date(message.timestamp), "HH:mm")}
              </Typography>
            </Box>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Alerta quando não são amigos */}
      {friendshipStatus !== 'FRIENDLY' && (
        <Alert 
          severity="info" 
          sx={{ 
            m: 2, 
            borderRadius: 1,
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center'
            }
          }}
        >
          {friendshipStatus === 'PENDING' 
            ? 'Aguardando aceitação da solicitação de amizade'
            : 'Vocês precisam ser amigos para trocar mensagens'}
        </Alert>
      )}

      {/* Input Area - só mostra se forem amigos */}
      {friendshipStatus === 'FRIENDLY' && (
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
} 