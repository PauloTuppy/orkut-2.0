// src/components/WindowFrame.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import './WindowFrame.css';

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  onClose?: () => void;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  minimizable?: boolean;
  maximizable?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

export default function WindowFrame({
  title,
  children,
  icon = '📁',
  onClose,
  initialX = 0,
  initialY = 0,
  initialWidth = 500,
  initialHeight = 400,
  minimizable = true,
  maximizable = true,
  zIndex = 1000,
  onFocus
}: WindowFrameProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    onFocus?.();
  };

  const handleDoubleClick = () => {
    if (maximizable) {
      setIsMaximized(!isMaximized);
    }
  };

  return (
    <motion.div
      ref={windowRef}
      className={`window-frame ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''}`}
      style={{
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 0 : `${position.y}px`,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? '100%' : isMinimized ? 'auto' : `${size.height}px`,
        zIndex
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className="window-titlebar"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="titlebar-content">
          <span className="window-icon">{icon}</span>
          <span className="window-title">{title}</span>
        </div>
        
        <div className="titlebar-buttons" data-no-drag>
          {minimizable && (
            <button
              className="window-button minimize"
              onClick={() => setIsMinimized(!isMinimized)}
              title="Minimizar"
            >
              <Minus className="w-3 h-3" />
            </button>
          )}
          
          {maximizable && (
            <button
              className="window-button maximize"
              onClick={() => setIsMaximized(!isMaximized)}
              title="Maximizar"
            >
              <Square className="w-3 h-3" />
            </button>
          )}
          
          <button
            className="window-button close"
            onClick={onClose}
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="window-content">
          {children}
        </div>
      )}
    </motion.div>
  );
}
