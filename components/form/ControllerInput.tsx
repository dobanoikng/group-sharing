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
}

export default function ControllerInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  secureTextEntry,
  textInputProps,
}: ControllerInputProps<T>) {
  return (
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
            status={error ? 'danger' : 'info'}
            autoCapitalize="none"
            {...textInputProps}
          />

          {error && (
            <Text style={styles.text} status="danger">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  text: {},
});
