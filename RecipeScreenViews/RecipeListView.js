import React, {useState, useEffect} from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import Elements from "../CustomProperties/Elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

var ld = require('lodash');
//var rnfs = require('react-native-fs');

const storeData = async () => {
  let keyValPairs = Elements.map((e) => [e.id.toString(), JSON.stringify(e)]);
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
  [keys, setKeys] = useState([1,2,3,4,5]);

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem("5")
    } catch(e) {
      // remove error
    }

    console.log('Done.')
  }
  // removeValue();

  const loadData = async (items,setter) => {
    let finished = false;
    let key = 1;
    // while(!finished){
      // let newItems = ld.cloneDeep(items);
    for(var i = 0; i < 10; i++){
      try {
        let item = await AsyncStorage.getItem(key.toString(), (error, result) => {
          if (error){
            finished = true;
            console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb")
          }
          else{
            // console.log(JSON.parse(result));
            console.log("1111111")
          }

          if (result) {
            // let newItem = ld.cloneDeep(JSON.parse(result));
            // items.push(JSON.parse(result));
            // let newItems = ld.cloneDeep(items);
            // newItems.push(JSON.parse(result));
            // console.log(newItems)
            setter((previous) => {
              console.log(result);
              let b = ld.cloneDeep(previous)
              let a = b.push(result);
              console.log(a);
              return a
            });  
            

          }
          key++
        });
      } 
      catch (e) {
        // console.log(e);
        console.log("NOOOOO")
      }
    }
  }

  // WARNING: the contents of the array passed into useEffect are compared to their previous state.
  // The function is called only when there is a change to the contents (I think) of the array.
  // This may result in the recipe list not showing new/modified recipes.
  let keys = [ 1, 2, 3, 4, 5];
  useEffect( () => { 
    loadData(recipes, setRecipes); 
  }, []);

    return (
      <React.Fragment>
        <Appbar.Header>
          <Appbar.Content title="Recipes"/>
        </Appbar.Header>
        <SearchBar />
        <ScrollView>
          {recipes.map(function(recipe) {
            console.log(recipe)
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