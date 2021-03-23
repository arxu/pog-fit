import React, {Component} from 'react';
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";

import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {getAllWorkouts} from "../FileStorage/Database";

export default class WorkoutListView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      workouts: []
    };
    getAllWorkouts((error, result) => {
      if (error) {
        console.log(error);
      }
      else {
        this.setState({workouts: result})
      }
    });
  }
  
  render() {
    return (
      <React.Fragment>
        <Appbar.Header>
          <Appbar.Content title="Workouts"/>
        </Appbar.Header>
        <SearchBar />
        <ScrollView>
          {this.state.workouts.map((workout) => {
            return <CustomCard
              navigation = {this.props.navigation}
              pushViewTitle = 'Workout'
              data = {workout}
              key={workout.id}
              title={workout.title}
              uri={workout.uri}
            />
          })}
        </ScrollView>
      </React.Fragment>
    );
    
  }
}