import React from 'react';
import {Headline, Subheading, Paragraph, List, DataTable, Appbar, TextInput} from 'react-native-paper';
import {Image, StyleSheet, ScrollView} from "react-native";

var ld = require('lodash');
//var rnfs = require('react-native-fs');

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
//const filePath = rnfs.DocumentDirectoryPath + '/CustomProperties/Elements.json';

export default function WorkoutView(props) {
    let workout = props.route.params.data;
    let editing = false;
    let newWorkout = undefined;
    
    function enterEditMode(){
        editing = true;
        newRecipe = ld.cloneDeep(workout);
    }  
    
    return (
        <React.Fragment>
            <Appbar.Header>
                <Appbar.Content title={workout.title}/>
                <Appbar.Action icon={MORE_ICON} onPress={ () => enterEditMode()}/>
            </Appbar.Header>
            <ScrollView>
                <React.Fragment>
                    <Image source={{ uri: workout.uri }} style={styles.image}/>                                
                        
                    <Subheading>Description</Subheading>
                    <Paragraph>{workout.method}</Paragraph>

                    <DataTable>
                        <DataTable.Title numeric>Reps</DataTable.Title>
                        <DataTable.Title numeric>Sets</DataTable.Title>
                        <DataTable.Title numeric>Calories Burnt</DataTable.Title>

                        <DataTable.Cell numeric>{workout.reps}</DataTable.Cell>
                        <DataTable.Cell numeric>{workout.sets}</DataTable.Cell>
                        <DataTable.Cell numeric>{workout.calPerSet * workout.sets}</DataTable.Cell>
                    </DataTable>

                </React.Fragment>
            </ScrollView>
        </React.Fragment>
        
    );
}

const styles = StyleSheet.create({
    image: {
        flexDirection: 'row',
        height: 150
    }
});