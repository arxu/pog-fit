import React from 'react';
import {Headline, Subheading, Paragraph, Title, List} from 'react-native-paper';
import { Image, StyleSheet } from "react-native";

const RecipeViewRoute = (props) => {
    return (
        <React.Fragment>
            <Headline>Recipe Name{/* Get title of recipe from recipe object in props*/}</Headline>

            {/* Ingredient list */}
            <List.Section>
                <List.Subheader>Ingredients</List.Subheader>
                {/*
                map recipe ingredients onto this list
                <List.Item></List.Item>
                */}
            </List.Section>
                
            <Subheading>Method</Subheading>
            <Paragraph>Paragraph describing the method goes here{/* Get description of method from recipe object in props */}</Paragraph>

        </React.Fragment>
        
    );
}

export default RecipeViewRoute;