import { useState, useRef } from 'react';
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    // Call onFocus when window is clicked
    onFocus?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      ref={windowRef}
      className={`window-frame ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        zIndex: zIndex,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onFocus}
      drag={!isMaximized}
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 0, right: window.innerWidth - size.width, bottom: window.innerHeight - size.height }}
    >
      <div className="title-bar" onMouseDown={handleMouseDown}>
        <div className="title">
          <span className="icon">{icon}</span>
          {title}
        </div>
        <div className="buttons" data-no-drag>
          {minimizable && <button onClick={() => setIsMinimized(!isMinimized)}><Minus size={14} /></button>}
          {maximizable && <button onClick={() => setIsMaximized(!isMaximized)}><Square size={14} /></button>}
          {onClose && <button onClick={onClose}><X size={14} /></button>}
        </div>
      </div>
      <div className="content">
        {!isMinimized && children}
      </div>
    </motion.div>
  );
}