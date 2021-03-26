import React, {useEffect} from 'react';
import {Headline, Subheading, Paragraph, List, Appbar, TextInput} from 'react-native-paper';
import {Image, StyleSheet, ScrollView, View} from "react-native";

import RecipeDataTable from '../Components/RecipeDataTable';

var ld = require('lodash');
//var rnfs = require('react-native-fs');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
//const filePath = rnfs.DocumentDirectoryPath + '/CustomProperties/Elements.json';

export default function RecipeView(props) {
    let recipe = props.route.params.data;
    let editing = false;
    let newRecipe = undefined;
    
    function enterEditMode(){
        editing = true;
        newRecipe = ld.cloneDeep(recipe);
    }

    function saveAndExitEditMode() {
        // save the recipe to file
        recipe = newRecipe;
        editing = false;
    }

    function cancelAndExitEditMode() {
        newRecipe = undefined;
        editing = false;
    }

    function EditableHeadline(editing) {
        if (!editing) {
            return <Headline>{recipe.title}</Headline>;
        }
        else {
            return <TextInput label="title" value={recipe.title}/>
        }
    }   
    
    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.Content title={recipe.title}/>
                <Appbar.Action icon={MORE_ICON} onPress={ () =>enterEditMode()}/>
            </Appbar.Header>
            <ScrollView>
                <React.Fragment>
                    <Image source={{ uri: recipe.uri }} style={styles.image}/>
                    
                    {/* Ingredient list */}
                    <List.Section>
                        <List.Accordion title="Ingredients" description="Tap to see the list of ingredients">
                            {recipe.ingredients.map((ingredient, index) => <List.Item key={index} title={ingredient.title}/>)}
                        </List.Accordion>
                    </List.Section>                                    

                    <View style={{paddingLeft: 17, paddingRight: 17}}>   
                        <Subheading>Method</Subheading>
                        <Paragraph>{recipe.method}</Paragraph>
                        
                    </View>
                    
                    <View style={{paddingLeft: 17, paddingRight: 17}}>
                        <RecipeDataTable recipe={recipe}/>
                    </View>
                </React.Fragment>
            </ScrollView>
        </React.Fragment>
        
    );
}

const styles = StyleSheet.create({
    image: {
        flexDirection: 'row',
        height: 150
    }
});