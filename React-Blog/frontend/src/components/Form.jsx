import React, { useState } from 'react';
import Button from './Button';
import { Send, CheckCircle2 } from 'lucide-react';

/**
 * Reusable Form Component
 * Can render standard input fields, textareas, dropdowns, and handles validation feedback.
 */
export const Form = ({
  title,
  description,
  fields = [],
  initialValues = {},
  onSubmit,
  submitText = 'Submit',
  submitIcon: SubmitIcon = Send,
  cancelText,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    fields.forEach((field) => {
      if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
        newErrors[field.name] = `${field.label || field.name} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <form className={`custom-form glass-card ${className}`} onSubmit={handleSubmit} novalidate>
      {title && <h3 className="form-header-title">{title}</h3>}
      {description && <p className="form-header-desc">{description}</p>}

      {fields.map((field) => {
        const { name, label, type = 'text', placeholder, options, rows = 4, icon: FieldIcon } = field;
        const hasError = !!errors[name];

        return (
          <div key={name} className={`form-field-group ${hasError ? 'has-error' : ''}`}>
            {label && <label htmlFor={name} className="form-label">{label}</label>}

            <div className="form-input-container">
              {FieldIcon && <FieldIcon className="form-field-icon" size={18} />}

              {type === 'textarea' ? (
                <textarea
                  id={name}
                  name={name}
                  rows={rows}
                  placeholder={placeholder}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  className={`form-control ${FieldIcon ? 'has-icon' : ''}`}
                />
              ) : type === 'select' ? (
                <select
                  id={name}
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  className={`form-control ${FieldIcon ? 'has-icon' : ''}`}
                >
                  <option value="">Select option...</option>
                  {options && options.map((opt) => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                      {opt.label || opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  id={name}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  className={`form-control ${FieldIcon ? 'has-icon' : ''}`}
                />
              )}
            </div>

            {hasError && <span className="field-error-message">{errors[name]}</span>}
          </div>
        );
      })}

      <div className="form-actions-row">
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            {cancelText || 'Cancel'}
          </Button>
        )}
        <Button variant="primary" type="submit" icon={SubmitIcon}>
          {submitText}
        </Button>
      </div>

      {isSubmitted && (
        <div className="form-success-banner">
          <CheckCircle2 size={18} />
          <span>Form submitted successfully!</span>
        </div>
      )}
    </form>
  );
};

export default Form;
