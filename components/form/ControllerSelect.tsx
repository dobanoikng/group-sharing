import { Select, SelectItem } from '@ui-kitten/components';
import React from 'react';
import { Controller } from 'react-hook-form';

interface Option {
  label: string;
  value: string | number;
}

interface ControllerSelectProps {
  control: any;
  name: string;
  placeholder?: string;
  options: Option[];
  label?: string;
  rules?: object;
}

export const ControllerSelect: React.FC<ControllerSelectProps> = ({
  control,
  name,
  placeholder,
  options,
  label,
  rules = {},
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Select
          label={label}
          placeholder={placeholder}
          onSelect={(idx: any) => {
            const option = options[idx.row];
            onChange(option.value);
          }}
          value={options.find((o) => o.value === value)?.label || placeholder || 'Chọn...'}
          status={error ? 'danger' : 'basic'}
          caption={error?.message}
        >
          {options.map((option, i) => (
            <SelectItem key={i} title={option.label} />
          ))}
        </Select>
      )}
    />
  );
};
