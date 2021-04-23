import React, {Component} from 'react';
import { ScrollView } from "react-native";
import { Appbar, Menu, Portal, Dialog, TextInput, HelperText, Button } from "react-native-paper";

import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import { getAllWorkouts, addTitle, updateWorkouts, del, searchName } from "../FileStorage/Database";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';


export default class WorkoutListView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      menuVisible: false,
      dialogVisible: false,
      newTitle: "",
      tempTitle: "",
      nameTaken: false,
      detailVis: false,
      reps: "",
      sets: "",
      calBurnt: "",
      display1: true,
      display2: true,
      display3: true,
      display4: true,
      methodVis: false,
      method: ""
    };
    this.getAll = function () {
      getAllWorkouts((error, result) => {
        if (error) {
          console.log(error);
        }
        else {
          this.setState({ workouts: result })
        }
      });
    }
    this.getAll()
  }
  
  render() {
    return (
      <React.Fragment>
        <Appbar.Header>
          <Appbar.Content title="Workouts" />
          
          {/* Menu option */}
          <Menu
            visible={this.state.menuVisible}
            onDismiss={()=> {this.setState({menuVisible: false})}}
            anchor={<Appbar.Action icon={MORE_ICON} color="white" onPress={() => {this.setState({menuVisible: true})}} />}>
            
            {/* Pressing an item will create a pop up and hide the menu */}
            <Menu.Item onPress={() => { this.setState({ dialogVisible: true, menuVisible: false }) }} title="Add Exercise" />
          </Menu>
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

        <Portal>

          {/* Pop up for add exercise */}
          <Dialog visible={this.state.dialogVisible} onDismiss={() => { this.setState({ dialogVisible: false, newTitle: "" }) }}>
            <Dialog.Title>Add Exercise</Dialog.Title>
            <Dialog.Content>
              <TextInput
              label="Exercise Name"
              mode="outlined" 
              value= {this.state.newTitle}
              onChangeText={text => this.setState({ newTitle: text, tempTitle: text },
                searchName(text, "workouts", (result) => {this.setState({ nameTaken: result }) })
              )} />
              
              <HelperText type="error" visible={this.state.nameTaken}>
                Recipe name already taken
              </HelperText>
              
            </Dialog.Content>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={() => { this.setState({ dialogVisible: false, newTitle: "" }) }}>Cancel</Button>
              
              <Button disabled={this.state.newTitle.length < 1 ? true : false} 
                onPress={() => {
                  searchName(this.state.newTitle, "workouts", (result) => { this.setState({ nameTaken: result }) }),
                  this.state.nameTaken ? null : this.setState({ dialogVisible: false, detailVis: true },
                  addTitle(this.state.newTitle, "workouts"))
                }}>Next</Button>
              
            </Dialog.Actions>
          </Dialog>


          {/* Pop up to add details */}
          <Dialog visible={this.state.detailVis} onDismiss={()=> {this.setState({detailVis: false, newTitle:"",  sets: "", reps: "", calBurnt: "", sugar: "", display1: true, display2: true, display3: true}), del("workouts", "title", this.state.tempTitle)}}>
            <Dialog.Title>Details</Dialog.Title>
            <Dialog.Content>

              <TextInput
              keyboardType={'number-pad'}
              label="Sets"
              mode="outlined" 
              value= {this.state.sets}
              placeholder="0"
              onChangeText={text => this.setState({sets: text}, Number(text) ? this.setState({display1: false})  : this.setState({display1: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.sets) && this.state.sets.length > 1 ? true: false}>
                Not a valid number
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Reps"
              mode="outlined" 
              value= {this.state.reps}
              placeholder="0"
              onChangeText={text => this.setState({reps: text}, Number(text) ? this.setState({display2: false})  : this.setState({display2: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.reps) && this.state.reps.length > 1 ? true: false}>
                Not a valid number
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Kcal burnt per set"
              mode="outlined" 
              value= {this.state.calBurnt}
              placeholder="0"
              onChangeText={text => this.setState({calBurnt: text}, Number(text) ? this.setState({display3: false})  : this.setState({display3: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.calBurnt) && this.state.calBurnt.length > 1 ? true: false}>
                Not a valid number
              </HelperText>

            </Dialog.Content>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={() => { this.setState({ detailVis: false, newTitle: "", sets: "", reps: "", calBurnt: "", display1: true, display2: true, display3: true }), del("workouts", "title", this.state.tempTitle) }}>Cancel</Button>
              
              <Button disabled={this.state.display1 || this.state.display2 || this.state.display3 ? true : false}  
              onPress={()=>{this.setState({detailVis: false, methodVis: true})}}>Next</Button>
            </Dialog.Actions>
          </Dialog>



          {/* Pop up to add method */}
          <Dialog visible={this.state.methodVis} onDismiss={() => {
            this.setState({ methodVis: false, newTitle: "", sets: "", reps: "", calBurnt: "", display1: true, display2: true, display3: true, method:"" }), del("workouts", "title", this.state.tempTitle)
          }}>
            <Dialog.Title>Method</Dialog.Title>
            <Dialog.Content>
              <TextInput
              label="Method"
              mode="outlined" 
              value= {this.state.method}
              placeholder="Step by step instructions"
              multiline={true}
              numberOfLines={4}
              onChangeText={text => this.setState({method: text})}
              />
              <HelperText type="info" visible={true}>
                Optional. You can add the method later.
              </HelperText>

            </Dialog.Content>
            
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={() => {
                this.setState({ methodVis: false, newTitle: "", sets: "", reps: "", calBurnt: "", method: "", display1: true, display2: true, display3: true}), del("workouts", "title", this.state.tempTitle)
              }}>Cancel</Button>
              <Button 
                onPress={() => {
                  this.setState({ methodVis: false, newTitle: "", check: "Breakfast", ingrName: "", ingrQuan: "", ingrUnit: "none", fat: "", protein: "", carbs: "", sugar: "", method: "", display1: true, display2: true, display3: true },
                    
                    updateWorkouts(this.state.newTitle, this.state.sets, this.state.reps, this.state.calBurnt, this.state.method), this.getAll())}
                }>Complete</Button>

            </Dialog.Actions>
          </Dialog>


        </Portal>
      </React.Fragment>
    );
    
  }
}