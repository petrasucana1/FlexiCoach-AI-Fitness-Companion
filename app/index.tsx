//import { Text, View } from "react-native";
import { Redirect } from 'expo-router';

export default function Index() {
  /*return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screenss.</Text>
    </View>
  );*/
  return <Redirect href="/splash" />;
}
