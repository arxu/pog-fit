import React, {Component, useState} from 'react';
import {Subheading, Paragraph, List, Appbar, Dialog, Portal, TextInput, Headline, Button} from 'react-native-paper';
import {Image, StyleSheet, ScrollView, View} from "react-native";
import {TouchableWithoutFeedback as TWF} from 'react-native-gesture-handler';

import RecipeDataTable from '../Components/RecipeDataTable';
import { disableExpoCliLogging } from 'expo/build/logs/Logs';

var ld = require('lodash');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default class RecipeView extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            editMode: false,
            editDialogVisible: false,
            editDialogIsNumeric: true,
            editDialogLabel: null,
            editDialogTitle: null,
            currEditedElements: [],
            recipe: ld.cloneDeep(props.route.params.data),
            editedRecipe: ld.cloneDeep(props.route.params.data)
        }

        this.openEditDialog = (elements, dialogTitle, dialogLabel) => {
            this.setState({
                editDialogIsNumeric: false,
                currEditedElements: elements,
                editDialogTitle: dialogTitle,
                editDialogLabel: dialogLabel  
            }, () => { 
                console.log(this.state.currEditedElements); // Logs array ["title"]
                this.setState({editDialogVisible: true,});
            });
        }
    }
    
    render() { 
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content 
                        title={this.state.editMode ? this.state.editedRecipe.title : this.state.recipe.title} 
                        onPress={ ()=> {
                            this.state.editMode ?
                                this.openEditDialog(["title"], "Recipe Title", "New Recipe Title")
                            : 
                                null;
                        }}
                    />
                    <Appbar.Action 
                        icon={MORE_ICON} 
                        onPress={ () => { this.setState({editMode: !this.state.editMode, editedRecipe: ld.cloneDeep(this.state.recipe)});}}
                    />
                </Appbar.Header>
                <ScrollView>
                    <React.Fragment>
                        <Image source={{ uri: this.state.recipe.uri }} style={styles.image}/>
                        
                        {/* Ingredient list */}
                        <List.Section>
                            <List.Accordion title="Ingredients" description="Tap to see the list of ingredients">
                                {this.state.editMode ?
                                    this.state.editedRecipe.ingredients.map((ingredient, index) => {
                                        let measurement = ingredient.measurement === "none" ? "" : ingredient.measurement;
                                        return (
                                            <List.Item 
                                                titleStyle={{fontSize: 14}}
                                                key={index} 
                                                title={ingredient.quantity + " " + measurement + " " + ingredient.item}
                                                onPress={null}
                                            />
                                        );
                                    })
                                :
                                    this.state.recipe.ingredients.map((ingredient, index) => {
                                        let measurement = ingredient.measurement === "none" ? "" : ingredient.measurement;
                                        return (
                                            <List.Item 
                                                titleStyle={{fontSize: 14}}
                                                key={index} 
                                                title={ingredient.quantity + " " + measurement + " " + ingredient.item}
                                                onPress={null}
                                            />
                                        );
                                    })
                                }
                            </List.Accordion>
                        </List.Section>                                    

                        <View style={{paddingLeft: 17, paddingRight: 17}}>   
                            <Subheading>Method</Subheading>
                            <Paragraph>{this.state.recipe.method}</Paragraph>
                        </View>
                        
                        <View style={{paddingLeft: 17, paddingRight: 17}}>
                            <RecipeDataTable recipe={this.state.recipe}/>
                        </View>
                    </React.Fragment>
                </ScrollView>
                <Portal>
                    <EditDialog 
                        visible={this.state.editDialogVisible}
                        onDismiss={() => { this.setState({editDialogVisible: false}); }}
                        title={this.state.editDialogTitle}
                        label={this.state.editDialogLabel}
                        isNumeric={this.state.editDialogIsNumeric}
                        initValues={() => {
                            console.log(this.state.currEditedElements); // Logs empty array as soon as this component renders. 
                                                                        // Doesn't update until EditDialog popup is closed
                            return this.state.currEditedElements.map((elm, idx) => this.state.editedRecipe[elm]);
                        }}
                        onSubmit={(newVals) => { 
                            let updated = ld.cloneDeep(this.state.editedRecipe);
                            this.state.currEditedElements.forEach((elm, idx) => { updated[elm] = newVals[idx]; });
                            this.setState({editedRecipe: updated}); 
                        }}
                    />
                </Portal>
            </React.Fragment>
        );
    }
}

function EditDialog(props) {
    const [textboxValues, setText] = useState(props.initValues);

    function convertInputToNumber(input) {
        let numeric;
        return numeric;
    }

    return (
        <Dialog visible={props.visible} onDismiss={() => {props.onDismiss();}}>
            <Dialog.Title>{props.title}</Dialog.Title>
            <Dialog.Content>
                {textboxValues.map((text, idx)=>{
                    return (
                        <TextInput 
                            key={idx}
                            label={props.label} 
                            mode="outlined" 
                            value={text === "" || text ? text : props.initValues[idx]} 
                            onChangeText={(newText) => { 
                                let updated = ld.cloneDeep(textboxValues);
                                updated[idx] = newText;
                                setText(updated); 
                            }}
                        />
                    );
                })}
                
            </Dialog.Content>
            <Dialog.Actions>
                <Button 
                    onPress={ () => { 
                        setText(props.initValues);
                        props.onDismiss(); 
                    }}
                >CANCEL</Button>
                <Button 
                    onPress={() => { 
                        props.isNumeric ? 
                            /* convert input value to number and execute callback */ null
                        :
                            props.onSubmit(textboxValues);
                        props.onDismiss();
                    }}
                >DONE</Button>
            </Dialog.Actions>
        </Dialog>
    );
}

const styles = StyleSheet.create({
    image: {
        flexDirection: 'row',
        height: 150
    }
});