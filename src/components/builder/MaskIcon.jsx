import React from 'react';

export const MaskIcon = ({ icon, color = 'currentColor', size = 18, className = "" }) => {
  // Convierte tamaños numéricos a rem para respetar el escalado global proporcional
  const finalSize = typeof size === 'number' || !isNaN(Number(size)) 
    ? `${Number(size) / 16}rem` 
    : size;

  return (
    <div 
      className={`shrink-0 ${className}`}
      style={{
        width: finalSize,
        height: finalSize,
        backgroundColor: color,
        maskImage: `url("${icon}")`,
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
        maskPosition: 'center',
        WebkitMaskImage: `url("${icon}")`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        WebkitMaskPosition: 'center',
      }}
    />
  );
};
