import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/src/database/index";
import Favorite from "../database/models/Favorite";
import { Text } from "react-native";

function FavoritesHeader({favorites}: {favorites: Favorite[]}){
    return (
        <Text className="text-3xl font-bold text-white text-center mt-4">
            {favorites.length > 0 ? `You have ${favorites.length} favorite recipe${favorites.length !== 1? "s": ""}`: "No favorites yet!"}
        </Text>
    )
}

const enhance = withObservables([], () => ({
    favorites: database.get<Favorite>("favorites").query().observe()
}))

export default enhance(FavoritesHeader)