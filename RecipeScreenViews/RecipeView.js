import React, {useEffect} from 'react';
import {Headline, Subheading, Paragraph, List, DataTable, Appbar, TextInput} from 'react-native-paper';
import {Image, StyleSheet, ScrollView} from "react-native";
import {removeOne} from "../FileStorage/DBManager";

var ld = require('lodash');
//var rnfs = require('react-native-fs');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
//const filePath = rnfs.DocumentDirectoryPath + '/CustomProperties/Elements.json';

const RecipeViewRoute = (props) => {
    let recipe = props.route.params.recipe;
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
                            {recipe.ingredients.map((ingredient, index) => <List.Item key={index} title={ingredient}/>)}
                        </List.Accordion>
                    </List.Section>                                    
                        
                    <Subheading>Method</Subheading>
                    <Paragraph>{recipe.method}</Paragraph>

                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Nutritients</DataTable.Title>
                            <DataTable.Title numeric>Grams</DataTable.Title>
                            <DataTable.Title numeric>Calories</DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row>
                            <DataTable.Cell>Fat</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.fat}</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.fat * 9}</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Protein</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.protein}</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.protein * 4}</DataTable.Cell>
                        </DataTable.Row>
                        
                        <DataTable.Row>
                            <DataTable.Cell>Carbohydrates</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.carbohydrates}</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.carbohydrates * 4}</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>Sugars</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.sugars}</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.sugars * 4}</DataTable.Cell>
                        </DataTable.Row>             

                        <DataTable.Row>
                            <DataTable.Cell>Total</DataTable.Cell>
                            <DataTable.Cell numeric>{recipe.protein + recipe.fat + recipe.carbohydrates}</DataTable.Cell>
                            <DataTable.Cell numeric>{(recipe.protein * 4 + recipe.fat * 9 + recipe.carbohydrates * 4)}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>

                </React.Fragment>
            </ScrollView>
        </React.Fragment>
        
    );
}

export default RecipeViewRoute;

const styles = StyleSheet.create({
    image: {
        flexDirection: 'row',
        height: 150
    }
});