// import React from 'react';
// import {Headline, Subheading, Paragraph, List, DataTable, Appbar, TextInput, D} from 'react-native-paper';
// import {Image, StyleSheet, ScrollView} from "react-native";

// var ld = require('lodash');
// //var rnfs = require('react-native-fs');

// const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
// //const filePath = rnfs.DocumentDirectoryPath + '/CustomProperties/Elements.json';




import React, {Component, useState} from 'react';
import {Subheading, Paragraph, List, Appbar, Dialog, Portal, TextInput, RadioButton, Button, Menu, Text, HelperText, DataTable} from 'react-native-paper';
import {Image, StyleSheet, ScrollView, View} from "react-native";

import { disableExpoCliLogging } from 'expo/build/logs/Logs';
import {del, updateSingle, test, getCat, getNut} from "../FileStorage/Database";


var ld = require('lodash');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default class WorkoutView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workout: ld.cloneDeep(props.route.params.data),
            title: "",
            id: "",
            sets: "",
            reps: "",
            kcalBurn: "",
            method: "",
            menuVisible: false,
            edit: false,
            deleteVisible: false,
            editReps: false,
            editDes: false,

        }
        console.log(this.state.workout.id)

        this.getDetails = function () {
            var strSets = "";
            var strReps = "";
            var strKcal = "";
            getNut("workouts", this.state.workout.id, (result) => {
                console.log("asdasd",result)
                strSets = JSON.stringify(result[0].sets),
                strReps = JSON.stringify(result[0].repetitions),
                strKcal = JSON.stringify(result[0].cal_per_set),
                this.setState({
                    title: result[0].title,
                    id: result.id,
                    sets: strSets,
                    reps: strReps,
                    kcalBurn: strKcal,
                    method: result[0].description
                })
                
            })
        }

        this.getDetails();

    }
    render() {
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content title={this.state.title} />
                     {/* <Menu
                        visible={this.state.menuVisible}
                        onDismiss={()=> {this.setState({menuVisible: false})}}
                        anchor={<Appbar.Action icon={MORE_ICON} color="white" onPress={() => {this.setState({menuVisible: true})}} />}>
                        
                        <Menu.Item onPress={() => { this.setState({ menuVisible: false, edit: true }),this.getDetails() }} title="Edit Exercise" />
                        <Menu.Item onPress={() => { this.setState({ menuVisible: false, deleteVisible: true }) }} title="Delete" />

                    </Menu> */}

                </Appbar.Header>

                
                <ScrollView>
                    <React.Fragment>
                        <Image source={{ uri: this.state.workout.uri }} style={styles.image} /> 
                        <View style={{paddingLeft: 17, paddingRight: 17}}>
                            <Subheading>Description</Subheading>
                            <Paragraph>{this.state.method}</Paragraph>
                        </View>

                        <DataTable>
                        <DataTable.Row>
                            <DataTable.Title >Reps</DataTable.Title>
                            <DataTable.Title >Sets</DataTable.Title>
                            <DataTable.Title >Calories Burnt</DataTable.Title>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell >{this.state.reps}</DataTable.Cell>
                            <DataTable.Cell >{this.state.sets}</DataTable.Cell>
                            <DataTable.Cell >{this.state.kcalBurn * this.state.sets}</DataTable.Cell>
                        </DataTable.Row>
                            
                        </DataTable>

                    </React.Fragment>
                </ScrollView>

                <Dialog visible={this.state.edit} onDismiss={()=> {this.setState({edit: false})}}>
                    <Dialog.Title>Edit Exercise</Dialog.Title>

                    <Dialog.Content>
                        <Button onPress={() => {
                            this.setState({editReps: true, edit: false })
                        }}>Edit Reps and Sets </Button>
                        
                        <Button onPress={() => {
                            this.setState({ editDes: true, edit: false })
                        }}>Edit Description</Button>
                    </Dialog.Content> 
                    
                    <Dialog.Actions>
                        <Button onPress={()=>{this.setState({edit: false})  }}>Close Edit</Button>
                    </Dialog.Actions>
                </Dialog>
                


                <Dialog visible={this.state.editDes} onDismiss={() => {
            this.setState({ editDes: false})
          }}>
            <Dialog.Title>Method</Dialog.Title>
            <Dialog.Content>
              <TextInput
              label="Method"
              mode="outlined" 
              value= {this.state.method}
              placeholder="Step by step instructions"
              multiline={true}
              numberOfLines={5}
              onChangeText={text => this.setState({method: text})}
              />

                    </Dialog.Content>
                    <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
                        <Button onPress={() => {
                            this.setState({
                                editDes: false
                            })
                        }}>Cancel</Button>
              <Button 
                            onPress={() => {
                                this.setState({ editDes: false },
                                    updateSingle("workouts", this.state.id, "description", this.state.method, "id"))
                    
                }}>Complete</Button>

            </Dialog.Actions>
                </Dialog>


            </React.Fragment>
        
        );
    }
}

const styles = StyleSheet.create({
    image: {
        flexDirection: 'row',
        height: 150
    }
});