import React from 'react';
import {Headline, Subheading, Paragraph, List, DataTable, Appbar, TextInput} from 'react-native-paper';
import {Image, StyleSheet, ScrollView} from "react-native";

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

    function EditableHeader(editing) {
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
                <Appbar.Action icon={MORE_ICON} onPress={ () => enterEditMode()}/>
            </Appbar.Header>
            <ScrollView>
                <React.Fragment>
                    <Image source={{ uri: recipe.uri }} style={styles.image}/>                                
                        
                    <Subheading>Description</Subheading>
                    <Paragraph>{recipe.method}</Paragraph>

                    <DataTable>
                        <DataTable.Title numeric>Reps</DataTable.Title>
                        <DataTable.Title numeric>Sets</DataTable.Title>
                        <DataTable.Title numeric>Calories Burnt</DataTable.Title>

                        <DataTable.Cell numeric>{workout.reps}</DataTable.Cell>
                        <DataTable.Cell numeric>{workout.sets}</DataTable.Cell>
                        <DataTable.Cell numeric>{workout.calPerSet * sets}</DataTable.Cell>
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