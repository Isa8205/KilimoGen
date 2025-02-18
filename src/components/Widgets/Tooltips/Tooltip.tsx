import React, { ReactElement, useState } from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  text: string; // The tooltip text
  children: ReactElement; // The child element that triggers the tooltip
  className?: string; // Optional custom classes for the tooltip
  position?: 'left' | 'right' | 'bottom' | 'top'; // Tooltip position
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [tooltipDirection, setTooltipDirection] = useState(position);

  const showTooltip = (e: React.MouseEvent<HTMLElement>) => {
    const target = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Default tooltip positioning logic
    let newTop = target.top;
    let newLeft = target.left;
    let newDirection = position;

    switch (position) {
      case 'top':
        newTop = target.top - 8; // Adjust tooltip above the element
        newLeft = target.left + target.width / 2; // Center horizontally
        if (newTop < 0) newDirection = 'bottom'; // Adjust if out of bounds
        break;

      case 'bottom':
        newTop = target.bottom + 8; // Adjust tooltip below the element
        newLeft = target.left + target.width / 2; // Center horizontally
        if (newTop + 50 > screenHeight) newDirection = 'top'; // Adjust if out of bounds
        break;

      case 'left':
        newTop = target.top + target.height / 2; // Center vertically
        newLeft = target.left - 8; // Place to the left
        if (newLeft < 0) newDirection = 'right'; // Adjust if out of bounds
        break;

      case 'right':
      default:
        newTop = target.top + target.height / 2; // Center vertically
        newLeft = target.right + 8; // Place to the right
        if (newLeft + 150 > screenWidth) newDirection = 'left'; // Adjust if out of bounds
        break;
    }

    // Final adjustments for the tooltip based on new direction
    if (newDirection === 'bottom') {
      newTop = target.bottom + 8;
    } else if (newDirection === 'top') {
      newTop = target.top - 8;
    } else if (newDirection === 'left') {
      newLeft = target.left - 8;
    } else if (newDirection === 'right') {
      newLeft = target.right + 8;
    }

    setTooltipPosition({ top: newTop, left: newLeft });
    setTooltipDirection(newDirection);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative">
      {/* Tooltip Element */}
      {isVisible && text && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed z-auto px-3 py-2 rounded bg-teal-600 text-gray-200 shadow-lg whitespace-nowrap ${className || ''}`}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform:
              tooltipDirection === 'top' || tooltipDirection === 'bottom'
                ? 'translateX(-50%)'
                : tooltipDirection === 'left'
                ? 'translateY(-50%)'
                : 'translateY(-50%)',
          }}
        >
          {text}

          {/* Arrow */}
          <div
            className="fixed w-2 h-2 transform rotate-45 bg-teal-600"
            style={{
              top:
                tooltipDirection === 'top'
                  ? '100%' // Arrow at the bottom of tooltip when on top
                  : tooltipDirection === 'bottom'
                  ? '-4px' // Arrow at the top of tooltip when on bottom
                  : '50%', // Center vertically for left/right
              left:
                tooltipDirection === 'left'
                  ? '100%' // Arrow at the right of tooltip when on left
                  : tooltipDirection === 'right'
                  ? '-4px' // Arrow at the left of tooltip when on right
                  : '50%', // Center horizontally for top/bottom
              transform:
                tooltipDirection === 'top' || tooltipDirection === 'bottom'
                  ? 'translateX(-50%)' // Center arrow horizontally
                  : 'translateY(-50%)', // Center arrow vertically
            }}
          />
        </motion.div>
      )}

      {/* Child Trigger */}
      {React.cloneElement(children, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      })}
    </div>
  );
};

export default Tooltip;
