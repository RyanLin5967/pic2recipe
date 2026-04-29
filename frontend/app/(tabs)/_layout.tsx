import { Tabs } from "expo-router";
import { Camera, UtensilsCrossed, Heart } from "lucide-react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "bg-[rgb(28,29,33)]",
          borderTopWidth: 0,
          paddingTop: 0,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: "rgba(237, 84, 19)",
        tabBarLabelStyle: {
          fontSize: 13,
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'flex-start',
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ 
          title: "Pantry",
          tabBarIcon: ({color, size})=>(
            <UtensilsCrossed color={color} size={size}/>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title:"Scan",
          tabBarIcon: ({color, size})=> (
            <Camera color={color} size={size}/>
          )
        }}
      />
      <Tabs.Screen 
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({color, size, focused}) => (
            <Heart color={color} size={size} fill={focused ? color: "transparent"}/>
          )
        }}
      />
      <Tabs.Screen 
        name="results"
        options={{ href: null}}
      />
    </Tabs>
  );
}
