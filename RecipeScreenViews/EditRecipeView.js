import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {StackActions} from '@react-navigation/native';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';

const RecipeEditRoute = (props) => {
    let recipe = props.route.params.recipe;
    return (
        <View><Text>{recipe.title}</Text></View>
    );
}

export default RecipeEditRoute;
