import React from 'react';
import {DataTable} from 'react-native-paper';

export default function RecipeDataTable(props) {
    let recipe = props.recipe;
    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Nutritients</DataTable.Title>
                <DataTable.Title numeric>Grams</DataTable.Title>
                <DataTable.Title numeric>Calories</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Cell>Fat</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.fat)}</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.fat * 9)}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
                <DataTable.Cell>Protein</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.protein)}</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.protein * 4)}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
                <DataTable.Cell>Carbohydrates</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.carbohydrates)}</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.carbohydrates * 4)}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
                <DataTable.Cell>Sugars</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.sugars)}</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.sugars * 4)}</DataTable.Cell>
            </DataTable.Row>             

            <DataTable.Row>
                <DataTable.Cell>Total</DataTable.Cell>
                <DataTable.Cell numeric>{Math.round(recipe.protein + recipe.fat + recipe.carbohydrates)}</DataTable.Cell>
                <DataTable.Cell numeric>{(Math.round(recipe.protein * 4 + recipe.fat * 9 + recipe.carbohydrates * 4))}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    );
}