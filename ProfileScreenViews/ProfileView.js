/*
import React, {Component} from 'react';
import {Appbar, Dialog, Portal, TextInput, DataTable, HelperText, RadioButton} from 'react-native-paper';
import {ScrollView, View} from "react-native";
import {TouchableWithoutFeedback as TWF} from 'react-native-gesture-handler';
import AdapterDateFns, {DatePicker} from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import {TextField} from '@material-ui/core/TextField';

import { getAllUsers } from "../FileStorage/Database";
import { disableExpoCliLogging } from 'expo/build/logs/Logs';

var ld = require('lodash');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default class ProfileView extends Component {
    constructor(props){
        super(props);

        this.state = {
            profile: [],
            edit: false,
            title: "Profile"
          };

          //get user profile
          getAllUsers((error, result) => {
            if (error) {
              console.log(error);
            }
            else {
              this.setState({profile: result[0]});
            }
          });
    }
    
    render() { 
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content 
                        title = {this.state.title}
                    />
                    <Appbar.Action 
                        icon={MORE_ICON} 
                        onPress={ () => { this.setState({edit: !this.state.edit})}}
                    />
                </Appbar.Header>
                <ScrollView>
                    <React.Fragment>
                        <View style={{paddingLeft: 17, paddingRight: 17}}>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>Name</DataTable.Title>
                                    <DataTable.Cell>{this.state.profile.username}</DataTable.Cell>
                                </DataTable.Header>

                                <DataTable.Row>
                                    <DataTable.Title>Date of Birth</DataTable.Title>
                                    <DataTable.Cell>{this.state.profile.dob}</DataTable.Cell>
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

                <Portal>
                    <Dialog visible={this.state.edit} onDismiss={() => {this.setState({edit: false})}}>
                        <Dialog.Title>Edit Profile</Dialog.Title>
                        <Dialog.Content>

                                    <TextInput
                                    label="Username"
                                    mode="outlined" 
                                    value= {this.state.username}
                                    onChangeText={response => this.setState({username: response})}
                                    />   
                                    <DatePicker
                                        label="Date of Birth"
                                        value={this.state.profile.dob}
                                        onChange={(newValue) => {
                                            this.setState({profile:{dob: newValue}});
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                            
                                    <RadioButton.Group
                                        onValueChange={gender => this.setState({ gender })}
                                        value={this.state.gender}>
                                        <RadioButton.Item label="Male" value="male" color="grey"/>
                                        <RadioButton.Item label="Female" value="female" color="grey"/>
                                    </RadioButton.Group>

                        </Dialog.Content>
                    </Dialog>
                </Portal>
            </React.Fragment>
        );
    }
}
*/