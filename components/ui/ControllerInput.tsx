import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

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
        <View>
          <TextInput
            className={"h-9 rounded-md border px-3 py-1 text-base shadow-xs "}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
          />
          {error && <Text className="text-red-600">{error.message}</Text>}
        </View>
      )}
    />
  );
}
