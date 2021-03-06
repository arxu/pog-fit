import React, {useState, useEffect} from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import Elements from "../CustomProperties/Elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async () => {
  keyValPairs = Elements.map((e) => [e.id.toString(), JSON.stringify(e)]);
  keyValPairs.forEach( (e) => console.log("/////////////////\n" + e));
  try {
    await AsyncStorage.multiSet(keyValPairs);
  }
  catch (e) {
    console.log(e);
  }
}

const RecipeListRoute = (props) => {
  [recipes, setRecipes] = useState([]);

  const loadData = async (keys) => {
    try {
      let keysStr = keys.map((key) => key.toString())
      let items = await AsyncStorage.multiGet(keysStr);
      if (items) {
        setRecipes(items);
      }
    } 
    catch (e) {
      console.log(e);
    }
  }

  // WARNING: the contents of the array passed into useEffect are compared to their previous state.
  // The function is called only when there is a change to the contents (I think) of the array.
  // This may result in the recipe list not showing new/modified recipes.
  let keys = [ 1, 2, 3, 4, 5];
  useEffect( () => { 
    loadData(keys); 
  }, []);

    return (
      <React.Fragment>
        <Appbar.Header>
          <Appbar.Content title="Recipes"/>
        </Appbar.Header>
        <SearchBar />
        <ScrollView>
          {recipes.map(function(data) {
            let recipe = JSON.parse(data[1]);
            return <CustomCard
              navigation = {props.navigation}
              recipe = {recipe}
              key={recipe.id}
              title={recipe.title}
              uri={recipe.uri}
            />
          })}
        </ScrollView>
      </React.Fragment>
    );
}

export default RecipeListRoute;