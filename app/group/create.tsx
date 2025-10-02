import ControllerInput from "@/components/ui/ControllerInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, View } from "react-native";
import { z } from "zod";


const groupSchema = z.object({
  name: z.string().min(1, "Tên nhóm không được để trống"),
  description: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

export default function Create() {
  const { control, handleSubmit } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: GroupFormValues) => {
    console.log("Form Data:", data);
  };

  return <View>
    <ControllerInput control={control} name="name" placeholder="Group Name" />
    <ControllerInput control={control} name="description" placeholder="Description" />
    <Button title="Tạo nhóm" onPress={handleSubmit(onSubmit)} />
  </View>
}
