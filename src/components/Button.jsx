import React from 'react';

/**
 * Reusable Button Component
 * Supports variants: primary, secondary, outline, ghost, danger
 * Supports sizes: sm, md, lg
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyle = 'btn';
  const variantStyle = `btn-${variant}`;
  const sizeStyle = `btn-${size}`;
  const combinedClasses = `${baseStyle} ${variantStyle} ${sizeStyle} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
