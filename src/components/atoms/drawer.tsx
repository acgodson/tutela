import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  maxHeight?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  direction = 'top',
  maxHeight = '100%',
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentHeight, setCurrentHeight] = useState('0px');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentHeight(maxHeight);
    } else {
      document.body.style.overflow = 'unset';
      setCurrentHeight('0px');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      {isOpen && <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={onClose} />}

      {/* Drawer */}
      <div
        className={cn(
          'fixed z-50  bg-[#ffffff] dark:bg-[#23272f] shadow-xl transition-transform duration-300 ease-in-out',
          direction === 'left' && 'top-0 left-0 h-full w-full sm:w-3/4 md:w-1/2 lg:w-1/3',
          direction === 'right' && 'top-0 right-0 h-full w-full sm:w-3/4 md:w-1/2 lg:w-1/3',
          direction === 'top' && 'top-0 left-0 w-full h-full sm:h-3/4 md:h-1/2',
          direction === 'bottom' && 'bottom-0 left-0 w-full h-full sm:h-3/4 md:h-1/2',
          isOpen
            ? 'translate-x-0 translate-y-0'
            : direction === 'left'
            ? '-translate-x-full'
            : direction === 'right'
            ? 'translate-x-full'
            : direction === 'top'
            ? '-translate-y-full'
            : 'translate-y-full'
        )}
        // style={{
        //   height: currentHeight,
        //   maxHeight: maxHeight,
        // }}
      >
        <button
          onClick={() => {
            onClose();
            // alert('test closing');
          }}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        >
          Close
        </button>
        <div className='p-6 overflow-y-auto h-full'>{children}</div>
      </div>
    </>,
    document.body
  );
};

export default Drawer;
