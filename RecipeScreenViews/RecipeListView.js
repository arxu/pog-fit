import React from 'react';
import { ScrollView } from "react-native";
import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import Elements from "../CustomProperties/Elements";

const RecipeListRoute = (props) => {
    return (
      <React.Fragment>
        <SearchBar />
        <ScrollView>
          {Elements.map(function(e) {
            return <CustomCard
              recipe = {e}
              navigation = {props.navigation}
              key={e.id}
              title={e.title}
              content={e.content}
              uri={e.uri}
              comment={e.comment}
              shares={e.shares}
              views={e.views}
              likes={e.likes}
            />
          })}
        </ScrollView>
      </React.Fragment>
    );
}

export default RecipeListRoute;