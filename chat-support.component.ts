import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  sender: string;
  content: string;
}

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.css']
})
export class ChatSupportComponent {
  messages: ChatMessage[] = [
    { sender: 'AI', content: 'Hello! I am ready to assist you. Ask me anything about the courses.' }
  ];
  newMessage: string = '';

  private API_URL = 'http://localhost:8080/api/chat'; 

  constructor(private http: HttpClient) {}

  // ✅ Remove loadChatHistory() because backend doesn’t support GET
  // Or you can keep it if you later add chat history to backend.

  sendMessage(): void {
    const messageContent = this.newMessage.trim();
    if (!messageContent) return;

    // Add user message locally
    const userMessage: ChatMessage = { sender: 'User', content: messageContent };
    this.messages.push(userMessage);
    this.newMessage = '';

    // Backend expects: { "message": "Hello" }
    this.http.post<any>(this.API_URL, { message: messageContent }).subscribe({
      next: (response) => {
        // Backend returns ChatResponse object → { reply: "some text" }
        this.messages.push({ sender: 'AI', content: response.reply });
      },
      error: (err) => {
        console.error('Error getting AI response:', err);
        this.messages.push({ sender: 'System', content: 'Error contacting AI service.' });
      }
    });
  }
}
