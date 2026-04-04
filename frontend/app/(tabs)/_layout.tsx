import { Tabs } from "expo-router";
import { Camera, UtensilsCrossed } from "lucide-react-native"

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
        backgroundColor: "bg-[rgb(28,29,33)]",
        borderTopWidth: 0,
        },
        tabBarActiveTintColor: "rgba(237, 84, 19)",
        tabBarLabelStyle: {
          fontSize: 13
        }
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
        name="results"
        options={{ href: null}}
      />
    </Tabs>
  );
}
