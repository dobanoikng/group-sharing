import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text } from "react-native";
import TextInput from "./TextInput";

interface ControllerInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function ControllerInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  secureTextEntry,
}: ControllerInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: error ? "red" : "#ccc",
              padding: 8,
              marginBottom: 4,
            }}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
          />
          {error && <Text style={{ color: "red" }}>{error.message}</Text>}
        </>
      )}
    />
  );
}
