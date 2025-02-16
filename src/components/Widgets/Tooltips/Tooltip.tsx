import React, { ReactElement, useState } from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  text: string; // The tooltip text
  children: ReactElement; // The child element that triggers the tooltip
  className?: string; // Optional custom classes for the tooltip
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [[childX, childY, childWidth, childHeight], setChildPosition] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const [tooltipDirection, setTooltipDirection] = useState<'left' | 'right'>('right'); // Tooltip direction (left or right)

  const showTooltip = (e: React.MouseEvent<HTMLElement>) => {
    const target = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setChildPosition([target.x, target.y, target.width, target.height]);

    // Determine if there's enough space on the right side, otherwise switch to the left
    const screenWidth = window.innerWidth;
    if (target.x + target.width + 150 > screenWidth) {
      setTooltipDirection('left');
    } else {
      setTooltipDirection('right');
    }

    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div className="">
      {(isVisible && text) && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`fixed px-3 py-2  rounded bg-teal-600 text-gray-200 shadow-lg ${className || ''}`}
          style={{
            top: childY ,
            left: childX + childWidth + 8,
            marginLeft: tooltipDirection === 'right' ? '5px' : undefined,
            marginRight: tooltipDirection === 'left' ? '5px' : undefined,
          } as React.CSSProperties}
        >
          {text}

          <div
            className="fixed w-4 h-4 transform rotate-45 bg-teal-600"
            style={{
              top: childY + (childHeight / 2),
              left: childX + childWidth,
              marginLeft: tooltipDirection === 'right' ? '5px' : undefined,
              marginRight: tooltipDirection === 'left' ? '5px' : undefined,
            } as React.CSSProperties}
          />
        </motion.div>
      )}

      {/* Trigger the tooltip */}
      {React.cloneElement(children, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      })}
    </div>
  );
};

export default Tooltip;
