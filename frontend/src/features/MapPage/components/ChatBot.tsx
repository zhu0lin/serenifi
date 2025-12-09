import { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { sendChatMessage } from "../../../services/chatApi";
import type { Place } from "../../../services/placesApi";
import { mainColor, secondaryColor } from "../../../types";

interface ChatBotProps {
  places: Place[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatBot({ places }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm your Serenifi assistant. Ask me about finding quiet places to study, work, or relax in the city!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage.text, places);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 16,
            width: 350,
            height: 450,
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: mainColor,
              color: "white",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Serenifi Assistant
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              bgcolor: "#f5f5f5",
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: message.isUser ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    p: 1.5,
                    borderRadius: message.isUser
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    bgcolor: message.isUser ? mainColor : "white",
                    color: message.isUser ? "white" : "text.primary",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {message.text}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "16px 16px 16px 4px",
                    bgcolor: "white",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <CircularProgress size={20} sx={{ color: mainColor }} />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              bgcolor: "white",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about quiet places..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              sx={{
                bgcolor: mainColor,
                color: "white",
                "&:hover": { bgcolor: secondaryColor },
                "&:disabled": { bgcolor: "#ccc", color: "#888" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Floating Chat Bubble */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: 56,
          height: 56,
          bgcolor: mainColor,
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000,
          "&:hover": {
            bgcolor: secondaryColor,
          },
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </IconButton>
    </>
  );
}
