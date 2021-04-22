import React, {Component, useState} from 'react';
import {Subheading, Paragraph, List, Appbar, Dialog, Portal, TextInput, Headline, Button, Menu, Text} from 'react-native-paper';
import {Image, StyleSheet, ScrollView, View} from "react-native";
import {TouchableWithoutFeedback as TWF} from 'react-native-gesture-handler';

import RecipeDataTable from '../Components/RecipeDataTable';
import { disableExpoCliLogging } from 'expo/build/logs/Logs';
import {delIng, del, updateTitle ,test, updateSingle} from "../FileStorage/Database";


var ld = require('lodash');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default class RecipeView extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            edit: false,
            editCat: false,
            editMethod: false,
            method: "",
            temp: "",
            editMode: false,
            editDialogVisible: false,
            editDialogIsNumeric: true,
            editDialogLabel: null,
            editDialogTitle: null,
            currEditedElements: [],
            recipe: ld.cloneDeep(props.route.params.data),
            editedRecipe: ld.cloneDeep(props.route.params.data),
            menuVisible: false,
            deleteVisible: false,
        }

        this.openEditDialog = (elements, dialogTitle, dialogLabel) => {
            this.setState({
                editDialogIsNumeric: false,
                currEditedElements: elements,
                editDialogTitle: dialogTitle,
                editDialogLabel: dialogLabel,
                // editDialogVisible: true
            }, () => { 
                console.log(this.state.currEditedElements); // Logs array ["title"]
                console.log("11",this.state.editDialogVisible)
                this.setState({ editDialogVisible: true });
            });
        }
    }
    
    render() { 
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content 
                        // title={this.state.editMode ? this.state.editedRecipe.title : this.state.recipe.title}
                        title={this.state.editedRecipe.title}
                        onPress={ ()=> {
                            // this.state.editMode ?
                                this.openEditDialog(["title"], "Recipe Title", "New Recipe Title")
                            // : 
                                // null;
                        }}
                    />

                    <Menu
                        visible={this.state.menuVisible}
                        onDismiss={()=> {this.setState({menuVisible: false})}}
                        anchor={<Appbar.Action icon={MORE_ICON} color="white" onPress={() => {this.setState({menuVisible: true})}} />}>
                        
                        {/* Pressing an item will create a pop up and hide the menu */}
                        {/* <Menu.Item onPress={() => { this.setState({ editMode: !this.state.editMode, editedRecipe: ld.cloneDeep(this.state.recipe), menuVisible: false }), console.log(this.state.editDialogTitle) }} title="Edit title" /> */}

                        <Menu.Item onPress={() => { this.setState({ menuVisible: false, edit: true }) }} title="Edit Recipe" />
                        

                        <Menu.Item onPress={() => { this.setState({ menuVisible: false, deleteVisible: true }), console.log("ok") }} title="Delete" />
                        <Menu.Item onPress={() => { console.log(this.state.editDialogVisible) }} title="Test" />

                    </Menu>

                    {/* <Appbar.Action 
                        icon={MORE_ICON} 
                        onPress={ () => { this.setState({editMode: !this.state.editMode, editedRecipe: ld.cloneDeep(this.state.recipe)}), console.log("yes");}}
                    /> */}
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
                            <Paragraph>{this.state.editedRecipe.method}</Paragraph>
                        </View>
                        
                        <View style={{paddingLeft: 17, paddingRight: 17}}>
                            <RecipeDataTable recipe={this.state.recipe}/>
                        </View>
                    </React.Fragment>
                </ScrollView>
                <Portal>
                    <EditDialog 
                        visible={this.state.editDialogVisible}
                        onDismiss={() => { this.setState({editDialogVisible: false, edit: true}); }}
                        title={this.state.editDialogTitle}
                        label={this.state.editDialogLabel}
                        isNumeric={this.state.editDialogIsNumeric}
                        initValues={() => {
                            console.log("asdljkaw",this.state.currEditedElements); // Logs empty array as soon as this component renders. 
                                                                        // Doesn't update until EditDialog popup is closed
                            return this.state.currEditedElements.map((elm, idx) => this.state.editedRecipe[elm]);
                        }}
                        onSubmit={(newVals) => { 
                            let updated = ld.cloneDeep(this.state.editedRecipe);
                            this.state.currEditedElements.forEach((elm, idx) => { updated[elm] = newVals[idx]; });
                            this.setState({ editedRecipe: updated });
                            // come back here
                            console.log("11", newVals[0], "and", this.state.currEditedElements[0], "and",updated);
                            // updateTitle(this.state.recipe.title,newVals[0])
                            updateSingle(this.state.recipe.title,this.state.currEditedElements[0],newVals[0])
                        }}
                    />

                    <Dialog visible={this.state.edit} onDismiss={()=> {this.setState({edit: false})}}>
                        <Dialog.Title>Edit Recipe</Dialog.Title>

                        <Dialog.Content>
                            <Button onPress={() => { this.openEditDialog(["title"], "Recipe Title", "New Recipe Title"),  this.setState({ editMode: true, editedRecipe: ld.cloneDeep(this.state.recipe), edit: false }) }}>Edit Title</Button>
                            <Button onPress={() => {this.setState({editCat: true, edit: false}) }}>Edit Category</Button>
                            <Button onPress={() => console.log('boink')}>Edit Ingredients</Button>
                            <Button onPress={() => console.log('boink')}>Edit Nutrition</Button>
                            <Button onPress={() => { this.openEditDialog(["method"], "Method", "Method",),this.setState({edit:false, editMode: true, editedRecipe: ld.cloneDeep(this.state.recipe)}) }}>Edit Methods</Button>
                        </Dialog.Content>

                        {/* wip */}
                        <Dialog.Actions>
                            <Button onPress={()=>{this.setState({edit: false, editMode: false})  }}>Close Edit</Button>
                        </Dialog.Actions>
                    </Dialog>

                    
                        {/* Edit Category */}
                    <Dialog visible={this.state.editCat} onDismiss={()=> {this.setState({editCat: false, edit: true})}}>
                        <Dialog.Title>Edit Category</Dialog.Title>

                        <Dialog.Content>
                            

                        </Dialog.Content>

                        
                        <Dialog.Actions>
                            <Button onPress={()=>{this.setState({editCat: false, edit: true}) }}>Cancel</Button>
                            <Button onPress={()=>{this.setState({editCat: false, edit: true}) }}>confirm</Button>
                        </Dialog.Actions>
                    </Dialog>







                    {/* Deletes the recipe */}
                    <Dialog visible={this.state.deleteVisible} onDismiss={()=> {this.setState({deleteVisible: false})}}>
                        <Dialog.Title>Confirmation</Dialog.Title>

                        <Dialog.Content>
                            <Text> Are you sure you want to delete this recipe? </Text>
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button onPress={()=>{this.setState({deleteVisible: false}) }}>Cancel</Button>
                            <Button onPress={()=>{this.setState({deleteVisible: false, editDialogVisible: false}), delIng(this.state.recipe.id), del(this.state.recipe.title) }}>Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
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