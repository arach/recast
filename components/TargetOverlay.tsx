import React from 'react';

interface TargetOverlayProps {
  className?: string;
  zIndex?: string; // e.g. 'z-20'
  inset?: number; // tailwind spacing unit, e.g. 0 for left-0
  length?: number; // tailwind spacing unit, e.g. 6 for w-6
  color?: string; // e.g. 'rgba(255,255,255,0.25)'
}

/**
 * Renders a Vercel-style '+' cross in all four corners, single color, flush.
 * Place as an absolutely positioned sibling to the content you want to decorate.
 */
const TargetOverlay: React.FC<TargetOverlayProps> = ({
  className = '',
  zIndex = 'z-20',
  inset = 0,
  length = 6,
  color = 'rgba(255,255,255,0.35)',
}) => {
  // px = 4 * length (tailwind spacing unit)
  const px = 4 * length;

  const renderPlus = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    const half = px / 2;
    
    switch (corner) {
      case 'tl':
        return (
          <div className="absolute pointer-events-none" style={{ left: 0, top: 0 }}>
            {/* Horizontal line centered on corner (extends left and right) */}
            <span className="absolute" style={{ left: `-${half}px`, top: 0, width: `${px}px`, height: '1px', background: color }}></span>
            {/* Vertical line centered on corner (extends up and down) */}
            <span className="absolute" style={{ left: 0, top: `-${half}px`, width: '1px', height: `${px}px`, background: color }}></span>
          </div>
        );
      case 'tr':
        return (
          <div className="absolute pointer-events-none" style={{ right: 0, top: 0 }}>
            {/* Horizontal line centered on corner (extends left and right) */}
            <span className="absolute" style={{ right: `-${half}px`, top: 0, width: `${px}px`, height: '1px', background: color }}></span>
            {/* Vertical line centered on corner (extends up and down) */}
            <span className="absolute" style={{ right: 0, top: `-${half}px`, width: '1px', height: `${px}px`, background: color }}></span>
          </div>
        );
      case 'bl':
        return (
          <div className="absolute pointer-events-none" style={{ left: 0, bottom: 0 }}>
            {/* Horizontal line centered on corner (extends left and right) */}
            <span className="absolute" style={{ left: `-${half}px`, bottom: 0, width: `${px}px`, height: '1px', background: color }}></span>
            {/* Vertical line centered on corner (extends up and down) */}
            <span className="absolute" style={{ left: 0, bottom: `-${half}px`, width: '1px', height: `${px}px`, background: color }}></span>
          </div>
        );
      case 'br':
        return (
          <div className="absolute pointer-events-none" style={{ right: 0, bottom: 0 }}>
            {/* Horizontal line centered on corner (extends left and right) */}
            <span className="absolute" style={{ right: `-${half}px`, bottom: 0, width: `${px}px`, height: '1px', background: color }}></span>
            {/* Vertical line centered on corner (extends up and down) */}
            <span className="absolute" style={{ right: 0, bottom: `-${half}px`, width: '1px', height: `${px}px`, background: color }}></span>
          </div>
        );
    }
  };

  return (
    <div className={`pointer-events-none absolute inset-${inset} ${zIndex} ${className}`}>
      {renderPlus('tl')}
      {renderPlus('tr')}
      {renderPlus('bl')}
      {renderPlus('br')}
    </div>
  );
};

export default TargetOverlay; 