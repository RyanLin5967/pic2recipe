import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider'
import { database } from '@/src/database'
import "../global.css";

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <DatabaseProvider database={database}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ contentStyle: { flex: 1 }, headerShown: false }}>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="recipe/[id]" />
        </Stack>
      </QueryClientProvider>
    </DatabaseProvider>
  );
}
