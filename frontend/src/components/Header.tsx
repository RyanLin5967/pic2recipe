import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/src/database/index"
import Ingredient from "../database/models/Ingredient";
import { View, Text } from 'react-native'

function Header({ingredients}: {ingredients: Ingredient[]}){
  return (
  <View>
    <Text className="text-4xl font-bold text-white text-center mt-4">{ingredients.length > 0 ? "Ready to Cook?": "Add some ingredients!"}</Text>
  </View>
  )
}

const enhance = withObservables([], () => ({
  ingredients: database.get<Ingredient>('ingredients').query().observe()
}))

export default enhance(Header)