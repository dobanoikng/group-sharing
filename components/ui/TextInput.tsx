
import { TextInputProps } from "react-native"

export default function TextInput({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={className}
      {...props}
    />
  )
}


