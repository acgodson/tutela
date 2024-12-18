import React, { createContext, useContext, useState } from 'react';

type AvatarContextType = {
  imageLoadError: boolean;
  setImageLoadError: React.Dispatch<React.SetStateAction<boolean>>;
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

type AvatarProps = {
  children: React.ReactNode;
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({ children, className = '' }) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <AvatarContext.Provider value={{ imageLoadError, setImageLoadError }}>
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden select-none w-10 h-10 rounded-full bg-neutral-200 ${className}`}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
};

type AvatarImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className = '' }) => {
  const context = useContext(AvatarContext);
  if (!context) throw new Error('AvatarImage must be used within an Avatar');

  const { setImageLoadError } = context;

  const handleImageError = () => {
    setImageLoadError(true);
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={handleImageError}
    />
  );
};

type AvatarFallbackProps = {
  children: React.ReactNode;
  className?: string;
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className = '' }) => {
  const context = useContext(AvatarContext);
  if (!context) throw new Error('AvatarFallback must be used within an Avatar');

  const { imageLoadError } = context;

  if (!imageLoadError) return null;

  return (
    <div
      className={`absolute inset-0 w-full h-full flex items-center justify-center bg-neutral-100 text-primary-600 text-sm font-medium ${className}`}
    >
      {children}
    </div>
  );
};

// Utility function to generate initials
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.substring(0, 1))
    .join('')
    .toUpperCase();
};
