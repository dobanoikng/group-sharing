import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1">
      <View>
        <View className="flex-row justify-between items-center p-3 border-b-4 border-gray-200">
          <Text className="font-medium text-4xl">
            GROUP
          </Text>

          <Link href={'/group/create'}>
            <Link.Trigger>
              <MaterialIcons name="add-circle-outline" size={46} color={"#00ADB5"} />
            </Link.Trigger>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

