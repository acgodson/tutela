import React from "react";
import { MessageCircle } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      className={`
        bg-blue-500 
        hover:bg-blue-600 
        text-white 
        font-bold 
        py-2 
        px-4 
        rounded-full 
        shadow-lg 
        transition-colors 
        duration-200 
        flex 
        items-center 
        justify-center
        ${className}
      `}
      onClick={onClick}
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default ChatButton;
