import { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  label?: string;
  isRequired?: boolean;
}

export function Input({ icon, error, helperText, label, isRequired, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-2">
          {label}
          {isRequired && <span className="text-danger-red ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 rounded-xl
            bg-input-background border border-input
            text-foreground placeholder:text-muted-foreground/60
            focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary
            transition-all duration-200
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-danger-red focus:ring-danger-red/15' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger-red">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

interface SearchInputProps extends Omit<InputProps, 'icon'> {}

export function SearchInput({ className = '', ...props }: SearchInputProps) {
  return (
    <Input
      icon={<Search className="w-4 h-4" strokeWidth={2} />}
      className={className}
      {...props}
    />
  );
}
