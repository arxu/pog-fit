import React, {Component, useState} from 'react';
import {Subheading, Paragraph, List, Appbar, Dialog, Portal, TextInput, Headline, Button, DataTable} from 'react-native-paper';
import {Image, StyleSheet, ScrollView, View} from "react-native";
import {TouchableWithoutFeedback as TWF} from 'react-native-gesture-handler';

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

        this.edited = {
            username : ""

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
                                    <DataTable.Cell>{this.state.editing ? (
                                        this.state.profile.username
                                    ) : (
                                        <TextInput type = "text"
                                        value = {this.state.profile.username}
                                        ref={node => {
                                            this.edited.username = node;
                                          }}
                                        />
                                    )}</DataTable.Cell>
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
            </React.Fragment>
        );
    }
}