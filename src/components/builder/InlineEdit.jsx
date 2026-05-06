'use client';
import React, { useState, useRef } from 'react';

export function InlineEdit({ value, onChange, placeholder, style, className, as: Component = 'span' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const elRef = useRef(null);

  // Determine what the current valid "saved" value should be
  const displayValue = (value !== undefined && value !== null) ? value : placeholder;
  
  const handleBlur = (e) => {
    setIsEditing(false);
    const currentText = (e.currentTarget.textContent || '').trim();
    
    // Call onChange with the cleanly trimmed text if it differs from what we had
    if (currentText !== (value !== undefined ? value : placeholder)) {
      onChange(currentText);
    } else {
      // Revert any weird formatting like spaces if it didn't really change
      e.currentTarget.textContent = displayValue;
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && Component !== 'p') {
      e.preventDefault();
      elRef.current.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (elRef.current) {
        elRef.current.textContent = displayValue;
        elRef.current.blur();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // If user has explicitly saved an empty string, and we are not currently editing it...
  const isEmpty = !isEditing && displayValue.trim() === '';

  // If it's completely empty, we render absolutely nothing so the layout auto-adjusts (collapses)
  if (isEmpty) {
    return null;
  }

  return (
    <Component
      ref={elRef}
      className={className}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        outline: isEditing ? '0.125rem dashed var(--color-selection)' : (isHovered ? '0.0625rem dashed var(--color-selection-hover)' : 'none'),
        outlineOffset: 2,
        cursor: 'text',
        display: style?.display || 'initial',
        minWidth: isEditing ? 10 : undefined,
      }}
      dangerouslySetInnerHTML={{ __html: displayValue }}
    />
  );
}
