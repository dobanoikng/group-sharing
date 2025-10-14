import { Input, Text } from '@ui-kitten/components';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, TextInputProps, View } from 'react-native';

interface ControllerInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  secureTextEntry?: boolean;
  textInputProps?: TextInputProps;
  required?: boolean;
  label?: string;
}

export default function ControllerInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  secureTextEntry,
  textInputProps,
  required,
  label,
}: ControllerInputProps<T>) {
  return (
    <View>
      {label && (
        <Text style={styles.label} category="label">
          {label}{' '}
          {required && (
            <Text category="p1" appearance="hint" status="danger">
              *
            </Text>
          )}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <View>
            <Input
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
              status={error ? 'danger' : 'success'}
              autoCapitalize="none"
              {...textInputProps}
            />

            {error && <Text status="danger">{error.message}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: '800',
  },
});
