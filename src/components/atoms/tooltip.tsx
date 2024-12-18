import React, { useState, useRef, useEffect, ReactNode } from 'react';

type TooltipContextType = {
  showTooltip: () => void;
  hideTooltip: () => void;
};

const TooltipContext = React.createContext<TooltipContextType | null>(null);

export const TooltipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

type TooltipProps = {
  children: ReactNode;
  delay?: number;
};

export const Tooltip: React.FC<TooltipProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        setPosition({
          top: triggerRect.top - tooltipRect.height - 10,
          left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
        });
      }
    };

    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible]);

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      <div className='relative inline-block'>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TooltipTrigger) {
            //@ts-ignore
            return React.cloneElement(child, { ref: triggerRef });
          }
          return child;
        })}
        {isVisible && (
          <div
            ref={tooltipRef}
            className='absolute z-50'
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === TooltipContent && isVisible) {
                return child;
              }
              return null;
            })}
          </div>
        )}
      </div>
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  { children: ReactNode; asChild?: boolean }
>(({ children, asChild }, ref) => {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error('TooltipTrigger must be used within a Tooltip');

  const trigger = asChild ? React.Children.only(children) : <div>{children}</div>;

  return React.cloneElement(trigger as React.ReactElement, {
    ref,
    onMouseEnter: context.showTooltip,
    onMouseLeave: context.hideTooltip,
  });
});

TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm'>
      {children}
      <div className='absolute w-2 h-2 bg-gray-900 rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2'></div>
    </div>
  );
};
