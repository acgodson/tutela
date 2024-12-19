import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Loader } from "lucide-react";
import ChatButton from "../atoms/chatButton";
import { PlaceholdersAndVanishInput } from "../atoms/query-input";
import QueryResponse from "../atoms/query-response";
import { trpc } from "@/trpc/client";
import { useEthContext } from "@/contexts/EthContext";
import { usePrivy } from "@privy-io/react-auth";
import { useFetchContext } from "@/hooks/useFetchContext";
import { ChainResponse, Message } from "@/utils/openAI";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! Welcome to Tutela", sender: "agent" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { selectedRegion, currentFarmId } = useEthContext();

  const { contextData, isLoading: contextLoading } =
    useFetchContext(currentFarmId);

  const getAIResponse = trpc.getAIResponse.useMutation();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        // First attempt without context
        const initialResponse = await getAIResponse.mutateAsync({
          prompt: inputMessage,
          context: null,
        });

        const response = initialResponse as ChainResponse;

        if (response.needsContext) {
          // If context is needed, send a pending message
          const pendingMessage: Message = {
            id: Date.now(),
            text: response.content,
            sender: "agent",
            needsContext: true,
            classification: response.classification,
          };
          setMessages((prev) => [...prev, pendingMessage]);

          // Then fetch with context
          const contextualResponse = await getAIResponse.mutateAsync({
            prompt: inputMessage,
            context: contextData
              ? {
                  summary: contextData.summary,
                  details: contextData.details,
                }
              : null,
          });

          const finalResponse = contextualResponse as ChainResponse;

          // Add the contextual response
          const aiResponse: Message = {
            id: Date.now(),
            text: finalResponse.content,
            sender: "agent",
            classification: finalResponse.classification,
          };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          // If no context needed, just show the response
          const aiResponse: Message = {
            id: Date.now(),
            text: response.content,
            sender: "agent",
            classification: response.classification,
          };
          setMessages((prev) => [...prev, aiResponse]);
        }
      } catch (error) {
        console.error("Error getting AI response:", error);
        const errorMessage: Message = {
          id: Date.now(),
          text: "Sorry, I'm having trouble responding right now. Please try again later.",
          sender: "agent",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const placeholders = [
    "Type your message...",
    "Ask a question...",
    "Need help with something?",
  ];

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <ChatButton
          className="fixed bottom-4 right-4 w-14 h-14 bg-purple-500 hover:bg-purple-600"
          onClick={() => setIsOpen(true)}
        />
      )}
      <div
        style={{
          zIndex: 2147483647,
        }}
        className={`fixed inset-x-0 md:inset-x-auto md:right-3 bottom-0 rounded-t-lg bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          ${isOpen ? "h-full md:h-3/4" : "h-16"}
          w-full md:w-[400px] lg:w-[500px]`}
      >
        {!isOpen && (
          <div
            className="h-16 flex items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <span className="w-16 h-1 bg-purple-300 rounded-full" />
          </div>
        )}
        {isOpen && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b bg-purple-500 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">AI Chat</h2>
              <button
                className="text-white hover:text-blue-200"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div
              ref={chatContainerRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "user" ? (
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-purple-500 text-white">
                      {message.text}
                    </div>
                  ) : (
                    <div className="max-w-xs px-4 py-2 text-black rounded-lg bg-gray-200 border border-gray-300">
                      {message.text} {/* Change this line */}
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <QueryResponse
                            text={message.text}
                            attachments={message.attachments}
                          />
                        )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm">
                    <Loader className="animate-spin text-purple-500" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-white">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={(e: any) => setInputMessage(e.target.value)}
                onSubmit={handleSendMessage}
                value={inputMessage}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LiveChat;
