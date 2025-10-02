import ControllerInput from "@/components/ui/ControllerInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, StyleSheet, View } from "react-native";
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

  return <View style={styles.wrapper}>
    <View style={styles.groupInput}>
      <ControllerInput control={control} name="name" placeholder="Group Name" />
    </View>
    <View style={styles.groupInput}>
      <ControllerInput control={control} name="description" placeholder="Description" />
    </View>
    <Button title="Tạo nhóm" onPress={handleSubmit(onSubmit)} />
  </View>
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
    padding: 20
  },
  groupInput: {
    marginBottom: 10
  }
})
