import React from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import Elements from "../CustomProperties/Elements";

const RecipeListRoute = (props) => {
    return (
      <React.Fragment>
        <Appbar.Header>
          <Appbar.Content title="Recipes"/>
        </Appbar.Header>
        <SearchBar />
        <ScrollView>
          {Elements.map(function(e) {
            return <CustomCard
              navigation = {props.navigation}
              recipe = {e}
              key={e.id}
              title={e.title}
              uri={e.uri}
            />
          })}
        </ScrollView>
      </React.Fragment>
    );
}

export default RecipeListRoute;