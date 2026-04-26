import { View, Text, Pressable, Modal, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router"
import IngredientList from '@/src/components/IngredientList'
import { useState } from 'react'
import { Plus } from 'lucide-react-native'
import { addIngredient } from "@/src/database/operations";
import { getIngredients } from "@/src/database/operations";
import Header from "@/src/components/Header";
import ErrorScreen from "@/src/components/ErrorScreen";

export const handleFindRecipes = async () => {
    let ingredients = await getIngredients()
    if(ingredients.length > 0){
      router.push({pathname: "/results", params: {ingredients: JSON.stringify(ingredients)}})
    }else {
      router.push({pathname: "/results", params: {ingredients: []}})
    }
    
}
export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [input, setInput] = useState("");
  const [error, setError] = useState(false)


  const handleAdd = async () => {
    if (!input.trim()) return;
    setInput("");
    setModalVisible(false);
    try {
      await addIngredient(input.trim());
    } catch (err: any){
      setError(true)
    }
  };
  
  if (error == true) return <ErrorScreen error={"Cannot add duplicate ingredients!"}/>
  return (
    <SafeAreaView edges={['top']}className="flex-1 bg-[rgb(28,29,33)]">
      <View className="flex-1 bg-[rgb(28,29,33)]">
        <Header />
        <ScrollView><IngredientList /></ScrollView>
         <Pressable onPress={() => setModalVisible(true)} className="absolute bottom-24 right-6 bg-[rgb(237,84,19)] rounded-full p-4">
            <Plus color="rgb(28,29,33)" size={28} />
          </Pressable>
        <Pressable onPress={handleFindRecipes}className="absolute bottom-4 left-10 right-10 bg-[rgb(237,84,19)] rounded-2xl mx-10">
            <Text className="p-4 text-center text-[rgb(28,29,33)] text-xl font-bold">Find Recipes</Text>
        </Pressable>
      </View>
      <Modal 
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable className="flex-1 justify-center items-center bg-black/60" onPress={() => setModalVisible(false)}>
          <Pressable className="bg-[rgb(42,44,50)] p-6 rounded-3xl w-4/5">
            <Text className="text-white text-2xl font-bold mb-4">Add Ingredients</Text>
            <TextInput 
              value={input}
              onChangeText={setInput}
              placeholder="e.g. chicken"
              placeholderTextColor="rgb(120,120,120)"
              className="bg-[rgb(59,61,69)] text-white text-lg p-4 rounded-2xl font-bold mb-4"
              autoFocus
            />
            <Pressable onPress={handleAdd} className="rounded-2xl p-4 bg-[rgb(237,84,19)]">
              <Text className="text-[rgb(28,29,33)] text-center font-bold text-lg">Add</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
