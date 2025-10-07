'use client'

import { Box } from '@mui/material'
import { ChatWindow } from './chat-window'
import { useChat } from '@/contexts/chat-context'

export function ChatContainer() {
  const { openChats, closeChat, minimizeChat, maximizeChat, sendMessage } = useChat()

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 24,
        display: 'flex',
        gap: 2,
        zIndex: 1000
      }}
    >
      {openChats.map((chat) => (
        <ChatWindow
          key={chat.userId}
          username={chat.username}
          avatar={chat.avatar}
          isMinimized={chat.isMinimized}
          messages={chat.messages}
          friendshipStatus={chat.friendshipStatus}
          onClose={() => closeChat(chat.userId)}
          onMinimize={() => chat.isMinimized ? maximizeChat(chat.userId) : minimizeChat(chat.userId)}
          onSendMessage={(content) => sendMessage(chat.userId, content)}
        />
      ))}
    </Box>
  )
} 