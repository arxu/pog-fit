import React, {Component, useState} from 'react';
import {Subheading, Paragraph, List, Appbar, Dialog, Portal, TextInput, Headline, Button} from 'react-native-paper';
import {Image, StyleSheet, ScrollView, View} from "react-native";
import {TouchableWithoutFeedback as TWF} from 'react-native-gesture-handler';

import { getAllUsers } from "../FileStorage/Database";
import ProfileDataTable from '../Components/ProfileDataTable';
import { disableExpoCliLogging } from 'expo/build/logs/Logs';

var ld = require('lodash');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default class ProfileView extends Component {
    constructor(props){
        super(props);

        this.state = {
            profile: []
          };
          getAllUsers((error, result) => {
            console.log(result[0]);
            if (error) {
              console.log(error);
            }
            else {
              this.setState({profile: result[0]});
            }
          });

        // this.state = {
        //     editMode: false,
        //     editDialogVisible: false,
        //     editDialogIsNumeric: true,
        //     editDialogLabel: null,
        //     editDialogTitle: null,
        //     currEditedElements: [],
        //     profile: ld.cloneDeep(props.route.params.data),
        //     editedProfile: ld.cloneDeep(props.route.params.data)
        // }

        // this.openEditDialog = (elements, dialogTitle, dialogLabel) => {
        //     this.setState({
        //         editDialogIsNumeric: false,
        //         currEditedElements: elements,
        //         editDialogTitle: dialogTitle,
        //         editDialogLabel: dialogLabel  
        //     }, () => { 
        //         console.log(this.state.currEditedElements); // Logs array ["username"]
        //         this.setState({editDialogVisible: true,});
        //     });
        // }
    }
    
    render() { 
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content 
                        title="Profile"
                        // onPress={ ()=> {
                        //     this.state.editMode ?
                        //         this.openEditDialog(["username"], "Profile Name", "Profile Name")
                        //     : 
                        //         null;
                        // }}
                    />
                    {/* <Appbar.Action 
                        icon={MORE_ICON} 
                        onPress={ () => { this.setState({editMode: !this.state.editMode, editedProfile: ld.cloneDeep(this.state.profile)});}}
                    /> */}
                </Appbar.Header>
                <ScrollView>
                    <React.Fragment>
                        <View style={{paddingLeft: 17, paddingRight: 17}}>
                            {/* <ProfileDataTable profile={this.state.profile}/> */}
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>Name</DataTable.Title>
                                    <DataTable.Cell>{this.state.profile.username}</DataTable.Cell>
                                </DataTable.Header>

                                <DataTable.Row>
                                    <DataTable.Title>Date of Birth</DataTable.Title>
                                    <DataTable.Cell>{this.state.profile.date_of_birth}</DataTable.Cell>
                                </DataTable.Row>

                                <DataTable.Row>
                                    <DataTable.Title>Weight</DataTable.Title>
                                    <DataTable.Cell numeric>{this.state.profile.weight}</DataTable.Cell>
                                </DataTable.Row>
                                
                                <DataTable.Row>
                                    <DataTable.Title>Height</DataTable.Title>
                                    <DataTable.Cell numeric>{this.state.profile.height_cm}</DataTable.Cell>
                                </DataTable.Row>
                                
                                <DataTable.Row>
                                    <DataTable.Title>Sex</DataTable.Title>
                                    <DataTable.Cell>{this.state.profile.gender}</DataTable.Cell>
                                </DataTable.Row>
                                
                                <DataTable.Row>
                                    <DataTable.Title>Target Weight</DataTable.Title>
                                    <DataTable.Cell numeric>{this.state.profile.target_weight}</DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        </View>
                    </React.Fragment>
                </ScrollView>
                {/* <Portal>
                    <EditDialog 
                        visible={this.state.editDialogVisible}
                        onDismiss={() => { this.setState({editDialogVisible: false}); }}
                        title={this.state.editDialogTitle}
                        label={this.state.editDialogLabel}
                        isNumeric={this.state.editDialogIsNumeric}
                        initValues={() => {
                            console.log(this.state.currEditedElements); // Logs empty array as soon as this component renders. 
                                                                        // Doesn't update until EditDialog popup is closed
                            return this.state.currEditedElements.map((elm, idx) => this.state.editedProfile[elm]);
                        }}
                        onSubmit={(newVals) => { 
                            let updated = ld.cloneDeep(this.state.editedProfile);
                            this.state.currEditedElements.forEach((elm, idx) => { updated[elm] = newVals[idx]; });
                            this.setState({editedProfile: updated}); 
                        }}
                    />
                </Portal> */}
            </React.Fragment>
        );
    }
}

// function EditDialog(props) {
//     const [textboxValues, setText] = useState(props.initValues);

//     function convertInputToNumber(input) {
//         let numeric;
//         return numeric;
//     }

//     return (
//         <Dialog visible={props.visible} onDismiss={() => {props.onDismiss();}}>
//             <Dialog.Title>{props.username}</Dialog.Title>
//             <Dialog.Content>
//                 {textboxValues.map((text, idx)=>{
//                     return (
//                         <TextInput 
//                             key={idx}
//                             label={props.label} 
//                             mode="outlined" 
//                             value={text === "" || text ? text : props.initValues[idx]} 
//                             onChangeText={(newText) => { 
//                                 let updated = ld.cloneDeep(textboxValues);
//                                 updated[idx] = newText;
//                                 setText(updated); 
//                             }}
//                         />
//                     );
//                 })}
                
//             </Dialog.Content>
//             <Dialog.Actions>
//                 <Button 
//                     onPress={ () => { 
//                         setText(props.initValues);
//                         props.onDismiss(); 
//                     }}
//                 >CANCEL</Button>
//                 <Button 
//                     onPress={() => { 
//                         props.isNumeric ? 
//                             /* convert input value to number and execute callback */ null
//                         :
//                             props.onSubmit(textboxValues);
//                         props.onDismiss();
//                     }}
//                 >SAVE</Button>
//             </Dialog.Actions>
//         </Dialog>
//     );
// }

// const styles = StyleSheet.create({
//     image: {
//         flexDirection: 'row',
//         height: 150
//     }
// });