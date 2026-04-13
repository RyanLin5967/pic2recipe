import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/src/database/index"
import Ingredient from "../database/models/Ingredient";
import IngredientItem from "./IngredientItem"
import { View } from 'react-native'

function IngredientList({ingredients}: {ingredients: Ingredient[]}){
  return (
  <View>
    {ingredients.map((ing, index) => (
      <IngredientItem key={index} title={ing.title} id={ing.id}/>
    ))}
  </View>
  )
}

const enhance = withObservables([], () => ({
  ingredients: database.get<Ingredient>('ingredients').query().observe()
}))

export default enhance(IngredientList)