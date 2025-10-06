import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function List() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text>Nhóm</Text>
        <Link href={'/users/list'}>
          <MaterialIcons name="add-circle-outline" size={36} />
        </Link>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "gray",
  }
})
