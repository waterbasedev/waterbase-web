"use client";

import { useChat } from "ai/react";
import { useRef, useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  return (
    <div>
      <div>
        {messages.map((m) => (
          <div key={m.id}>
            <div>
              <div>{m.role}</div>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
