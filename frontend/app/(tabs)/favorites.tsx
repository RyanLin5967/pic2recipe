import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoritesList from "@/src/components/FavoritesList";
import FavoritesHeader from "@/src/components/FavoritesHeader";

export default function FavoritesScreen(){
    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-[rgb(28,29,33)]">
            <FavoritesHeader />
            <ScrollView>
                <FavoritesList />
            </ScrollView>
        </SafeAreaView>
    )
}