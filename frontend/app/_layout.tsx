import { Stack, useNavigationContainerRef } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider'
import { database } from '@/src/database'
import * as Sentry from "@sentry/react-native";
import "../global.css";
import { useEffect } from "react";

const queryClient = new QueryClient()

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  maxBreadcrumbs: 20,
  beforeSend(event) {
    return event
  },
  debug: __DEV__,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.reactNavigationIntegration(),
  ]
  
});

export default Sentry.wrap(function RootLayout() {

  const navigationRef = useNavigationContainerRef()

  useEffect(() => {
    if (navigationRef) {
      Sentry.reactNavigationIntegration().registerNavigationContainer(navigationRef);
    }
  }, [navigationRef])
  return (
    <DatabaseProvider database={database}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ contentStyle: { flex: 1 }, headerShown: false }}>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="recipe/[id]" />
          <Stack.Screen name="confirm" />
        </Stack>
      </QueryClientProvider>
    </DatabaseProvider>
  );
});
