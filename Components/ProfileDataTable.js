import React from 'react';
import {DataTable} from 'react-native-paper';

export default function ProfileDataTable(profile) {
    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Cell>{profile.username}</DataTable.Cell>
            </DataTable.Header>

            <DataTable.Row>
                <DataTable.Title>Date of Birth</DataTable.Title>
                <DataTable.Cell>{profile.date_of_birth}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
                <DataTable.Title>Weight</DataTable.Title>
                <DataTable.Cell numeric>{profile.weight}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
                <DataTable.Title>Height</DataTable.Title>
                <DataTable.Cell numeric>{profile.height_cm}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
                <DataTable.Title>Sex</DataTable.Title>
                <DataTable.Cell>{profile.gender}</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
                <DataTable.Title>Target Weight</DataTable.Title>
                <DataTable.Cell numeric>{profile.target_weight}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    );
}