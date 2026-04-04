import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { flex: 1 }, headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
    </Stack>
  );
}
