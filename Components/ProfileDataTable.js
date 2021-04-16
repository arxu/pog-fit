import React from 'react';
import {DataTable} from 'react-native-paper';

export default function ProfileDataTable(props) {
    let profile = props.profile;
    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>{profile.username}</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Cell>Date of Birth</DataTable.Cell>
                <DataTable.Cell>{profile.date_of_birth}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
                <DataTable.Cell>Weight</DataTable.Cell>
                <DataTable.Cell numeric>{profile.weight}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
                <DataTable.Cell>Height</DataTable.Cell>
                <DataTable.Cell numeric>{profile.height_cm}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
                <DataTable.Cell>Sex</DataTable.Cell>
                <DataTable.Cell>{profile.gender}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
                <DataTable.Cell>Target Weight</DataTable.Cell>
                <DataTable.Cell numeric>{profile.target_weight}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    );
}