import React from 'react';

export default function Button({
  variant = 'default',
  className = '',
  ...props
}) {
  let baseClasses = 'p-2 rounded font-medium transition-colors';

  if (variant === 'primary') {
    baseClasses += ' bg-[var(--color-primary)] text-white hover:bg-blue-800';
  } else if (variant === 'secondary') {
    baseClasses += ' bg-gray-200 text-gray-800 hover:bg-gray-300';
  }

  return <button className={`${baseClasses} ${className}`} {...props} />;
}
