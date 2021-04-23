import React, {Component} from 'react';
import { ScrollView, View} from "react-native";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Appbar, Card, Menu, Dialog, Portal, Button, TextInput, RadioButton, HelperText, Snackbar, DataTable, ProgressBar } from "react-native-paper";


import CustomCard from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import {getAllRecipes, addTitle, updateRecipe, del, searchName, searchId, addIngr} from "../FileStorage/Database";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';


export default class RecipeListView extends Component{
  constructor(props) {
    super(props);
    this.state = {
      breakfasts: [],
      lunches: [],
      dinners: [],
      snacks: [],
      progress: 0.2,
      dialogVisible: false,
      newTitle: "",
      tempTitle: "",
      nameTaken: false,
      moveOn: true,
      categoryVis: false,
      check: "Breakfast",
      ingrVis: false,
      ingrName: "",
      ingrQuan: "",
      ingrUnit: "none",
      ingrQLock: true,
      ingrTitleVis: false,
      ingrQuantVis: false,
      ingrUnitVis: false,
      ingrMoveOn1: false,
      ingrMoveOn2: false,
      unitPrev: "none",
      unitTemp: "none",
      searchID: 0,
      snackVis: false,
      nutVis: false,
      fat: "",
      protein: "",
      carbs: "",
      sugar: "",
      dis1: true,
      dis2: true,
      dis3: true,
      dis4: true,
      methodVis: false,
      method:""
    };

    this.getAll = function () {
      getAllRecipes((error, result) => {
        if (error) {
          console.log(error);
        }
        else {
          let breakfasts = [], lunches = [], dinners = [], snacks = [];
          for (let i = 0; i < result.length; i++) {
            switch (result[i].category) {
              case "Breakfast":
                breakfasts.push(result[i]);
                break;
              case "Lunch":
                lunches.push(result[i]);
                break;
              case "Dinner":
                dinners.push(result[i]);
                break;
              case "Snack":
                snacks.push(result[i]);
                break;
            }
          }
          this.setState({
            breakfasts: breakfasts,
            lunches: lunches,
            dinners: dinners,
            snacks: snacks
          });
        }
      })
    };

    this.getAll();

  }
  
  render() {
    return (
      <React.Fragment>
        <Appbar.Header>
          <Appbar.Content title="Recipes"/>

          {/* Menu option */}
          <Menu
            visible={this.state.menuVisible}
            onDismiss={()=> {this.setState({menuVisible: false})}}
            anchor={<Appbar.Action icon={MORE_ICON} color="white" onPress={() => {this.setState({menuVisible: true})}} />}>
            
            {/* Pressing an item will create a pop up and hide the menu */}
            <Menu.Item onPress={() => { this.setState({ dialogVisible: true, menuVisible: false }) }} title="Add Recipe" />
          </Menu>

        </Appbar.Header>
        <SearchBar />
        <ScrollView>
          <CardCategory 
            meals={this.state.breakfasts} 
            navigation={this.props.navigation}
            title="Breakfasts"
          />
          <CardCategory
            meals={this.state.lunches}
            navigation={this.props.navigation}
            title="Lunches"
          />
          <CardCategory
            meals={this.state.dinners}
            navigation={this.props.navigation}
            title="Dinners"
          />
          <CardCategory
            meals={this.state.snacks}
            navigation={this.props.navigation}
            title="Snacks"
          />
        </ScrollView>

        <Portal>

          {/* Pop up for add recipe */}
          <Dialog visible={this.state.dialogVisible} onDismiss={() => { this.setState({ dialogVisible: false, newTitle: "" }) }}>
            <Dialog.Title>Add</Dialog.Title>
            <ProgressBar progress={this.state.progress} color={"blue"}></ProgressBar>
            <Dialog.Content>
              <TextInput
              label="Recipe Name"
              mode="outlined" 
              value= {this.state.newTitle}
                onChangeText={
                  text => this.setState({ newTitle: text, tempTitle: text },
                  searchName(text, "recipes", (result) => { this.setState({ nameTaken: result }) })
                )} />
              
              <HelperText type="error" visible={this.state.nameTaken}>
                Recipe name already taken
              </HelperText>
              
            </Dialog.Content>
            <Dialog.Actions>
              {/*Cancel button to reset field and Next button to go to next page.
              Next button is disabled if the recipe name is already exist in the database or 
              if the length or recipe name is less than 1 
              Next button will also add the recipe to the recipes table*/}
              <Button onPress={() => { this.setState({ dialogVisible: false, newTitle: "", }) }}> Cancel </Button>
              
              <Button disabled={this.state.nameTaken || this.state.newTitle.length < 1 ? true : false} 
                onPress={() => {
                  searchName(this.state.newTitle, "recipes", (result) => { this.setState({ nameTaken: result }) }),
                  this.state.nameTaken ? null : this.setState({ dialogVisible: false, categoryVis: true, progress: 0.4 },
                  addTitle(this.state.newTitle, "recipes")) }} >Next </Button>
            </Dialog.Actions>
          </Dialog>


          {/* Pop up to select category */}
          <Dialog visible={this.state.categoryVis} onDismiss={() => { this.setState({ categoryVis: false, progress: 0.2, newTitle: "" }), del("recipes", "title", this.state.tempTitle) }}>
            <Dialog.Title>Category</Dialog.Title>
            <ProgressBar progress={this.state.progress} color={"blue"}></ProgressBar>
            <RadioButton.Group
            onValueChange={check => this.setState({ check })}
            value={this.state.check}>
              <RadioButton.Item label="Breakfast" value="Breakfast" color="blue"/>
              <RadioButton.Item label="Lunch" value="Lunch" color="blue"/> 
              <RadioButton.Item label="Dinner" value="Dinner" color="blue"/>
              <RadioButton.Item label="Snack" value="Snack" color="blue"/>
            </RadioButton.Group>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({categoryVis: false, progress: 0.2, newTitle:"", check:"Breakfast"}), del("recipes", "title", this.state.tempTitle)}}>Cancel</Button>
              <Button onPress={()=>{this.setState({categoryVis: false, ingrVis: true, progress: 0.6}), searchId(this.state.newTitle, (result)=>{this.setState({searchID:result}) })}}>Next</Button>
            </Dialog.Actions>
          </Dialog>


          {/* Pop up to add ingredients */}
          <Dialog visible={this.state.ingrVis} onDismiss={() => { this.setState({ ingrVis: false, progress: 0.2, newTitle: "", check: "Breakfast", ingrName: "", ingrQuan: "", ingrUnit: "none" }), del("recipes", "title", this.state.tempTitle) }}>
            <Dialog.Title>Ingredients</Dialog.Title>
            <ProgressBar progress={this.state.progress} color={"blue"}></ProgressBar>
            <Dialog.Content>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell onPress={() => { this.setState({ ingrTitleVis: true, ingrVis: false }) }} >Ingredient</DataTable.Cell>
                  <DataTable.Cell numeric onPress={() => { this.setState({ ingrTitleVis: true, ingrVis: false }) }} >{this.state.ingrName}</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell onPress={() => { this.setState({ ingrQuantVis: true, ingrVis: false }) }} >Quantity</DataTable.Cell>
                  <DataTable.Cell numeric onPress={() => { this.setState({ ingrQuantVis: true, ingrVis: false }) }} >{this.state.ingrQuan}</DataTable.Cell>
                </DataTable.Row>
                
                <DataTable.Row>
                  <DataTable.Cell onPress={() => { this.setState({ ingrUnitVis: true, ingrVis: false }) }} >Unit</DataTable.Cell>
                  <DataTable.Cell numeric onPress={() => { this.setState({ ingrUnitVis: true, ingrVis: false }) }} >{this.state.ingrUnit}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>

              <HelperText type="info" visible={true}>
                Optional. If you there are too many ingreidents to add, these can be added later.
              </HelperText>

              <Button disabled={ this.state.ingrName.length < 1 || this.state.ingrQLock}
                onPress={() => {
                  addIngr({ "item": this.state.ingrName, "quantity": this.state.ingrQuan, "measurement": this.state.ingrUnit }, this.state.searchID),
                this.setState({ ingrName: "", ingrQuan: "", ingrUnit: "none", snackVis: true })
              }}>Save</Button>
              
            </Dialog.Content>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({ingrVis: false, progress: 0.2, newTitle:"", check:"Breakfast", ingrName: "", ingrQuan: "", ingrUnit: "none"}), del("recipe_ingredients", "recipe_id", this.state.searchID), del("recipes", "title", this.state.tempTitle)}}>Cancel</Button>
              <Button disabled={(this.state.ingrMoveOn1? !this.state.ingrMoveOn2 : this.state.ingrMoveOn2) }onPress={()=>{this.setState({ingrVis: false, nutVis: true, progress: 0.8})}}>Next</Button>
            </Dialog.Actions>
          </Dialog>


          {/* pop up to add name of ingredients */}
          <Dialog visible={this.state.ingrTitleVis} onDismiss={()=> {}}>
            <Dialog.Title>Ingredients</Dialog.Title>
            <Dialog.Content>
            <TextInput
              label="Ingredients"
              mode="outlined" 
              value= {this.state.ingrName}
              onChangeText={text => this.setState({ingrName: text})}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>{this.setState({ingrTitleVis: false, ingrVis: true})}}>Cancel</Button>
              <Button onPress={()=>{this.setState({ingrTitleVis: false, ingrVis: true, ingrMoveOn1: true})}}>Select</Button>
            </Dialog.Actions>
          </Dialog>

          
          {/* pop up to add the quantity of the ingredient */}
          <Dialog visible={this.state.ingrQuantVis} >
            <Dialog.Title>Quantity</Dialog.Title>
            <Dialog.Content>
            <TextInput
              keyboardType={'number-pad'}
              label="Quantity"
              mode="outlined" 
              value= {this.state.ingrQuan}
              placeholder="0"
              onChangeText={text => this.setState({ingrQuan: text}, Number(text) ? this.setState({ingrQLock: false})  : this.setState({ingrQLock: true}))}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>{this.setState({ingrQuantVis: false, ingrVis: true})}}>Cancel</Button>
              <Button disabled={this.state.ingrQLock} onPress={()=>{this.setState({ingrQuantVis: false, ingrVis: true, ingrMoveOn2: true})}}>Select</Button>
            </Dialog.Actions>
          </Dialog>


          {/* pop up to select the unit of the ingredient */}
          <Dialog visible={this.state.ingrUnitVis} onDismiss={()=> {this.setState({ingrUnitVis: false, ingrUnit: "none"})}}>
            <Dialog.Title>Units</Dialog.Title>
            <Dialog.ScrollArea style={{height: '48%'}}> 
              <ScrollView>
                <Dialog.Content>
                  <RadioButton.Group
                    onValueChange={ingrUnit => this.setState({ ingrUnit })}
                    value={this.state.ingrUnit}>
                    <RadioButton.Item label="none" value="none" color="blue"/>
                    <RadioButton.Item label="tsp" value="tsp" color="blue"/>
                    <RadioButton.Item label="tbsp" value="tbsp" color="blue"/> 
                    <RadioButton.Item label="cup" value="cup" color="blue"/>
                    <RadioButton.Item label="ml" value="ml" color="blue"/>
                    <RadioButton.Item label="l" value="l" color="blue"/>
                    <RadioButton.Item label="mg" value="mg" color="blue"/>
                    <RadioButton.Item label="g" value="g" color="blue"/>
                    <RadioButton.Item label="kg" value="kg" color="blue"/>
                    <RadioButton.Item label="slice" value="slice" color="blue"/>
                    <RadioButton.Item label="can" value="can" color="blue"/>
                    <RadioButton.Item label="pinch" value="pinch" color="blue"/>
                  </RadioButton.Group>
                </Dialog.Content>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              {/* Cancel button doesn't work yet & look of this*/}
              <Button onPress={()=>{this.setState({ingrUnitVis: false, ingrVis: true})}}>Cancel</Button>
              <Button onPress={()=>{this.setState({ingrUnitVis: false, ingrVis: true})}}>Select</Button>
            </Dialog.Actions>
          </Dialog>


          {/* Pop up to add nutrition */}
          <Dialog visible={this.state.nutVis} onDismiss={()=> {this.setState({nutVis: false, progress: 0.2, newTitle:"", check:"Breakfast", ingrName:"", ingrQuan: "", ingrUnit: "none", fat: "", protein: "", carbs: "", sugar: "", dis1: true, dis2: true, dis3: true, dis4: true}), del("recipe_ingredients", "recipe_id", this.state.searchID), del("recipes", "title", this.state.tempTitle)}}>
            <Dialog.Title>Nutrition</Dialog.Title>
            <ProgressBar progress={this.state.progress} color={"blue"}></ProgressBar>
            <Dialog.Content>

              <TextInput
              keyboardType={'number-pad'}
              label="Fat"
              mode="outlined" 
              value= {this.state.fat}
              placeholder="0"
              onChangeText={text => this.setState({fat: text}, Number(text) ? this.setState({dis1: false})  : this.setState({dis1: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.fat) && this.state.fat.length > 1 ? true: false}>
                Not a valid number
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Protein"
              mode="outlined" 
              value= {this.state.protein}
              placeholder="0"
              onChangeText={text => this.setState({protein: text}, Number(text) ? this.setState({dis2: false})  : this.setState({dis2: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.protein) && this.state.protein.length > 1 ? true: false}>
                Not a valid number
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Carbohydrates"
              mode="outlined" 
              value= {this.state.carbs}
              placeholder="0"
              onChangeText={text => this.setState({carbs: text}, Number(text) ? this.setState({dis3: false})  : this.setState({dis3: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.carbs) && this.state.carbs.length > 1 ? true: false}>
                Not a valid number
              </HelperText>

              <TextInput
              keyboardType={'number-pad'}
              label="Sugar"
              mode="outlined" 
              value= {this.state.sugar}
              placeholder="0"
              onChangeText={text => this.setState({sugar: text}, Number(text) ? this.setState({dis4: false})  : this.setState({dis4: true}))}
              />
              <HelperText type="error" visible={!Number(this.state.sugar) && this.state.sugar.length > 1 ? true: false}>
                Not a valid number
              </HelperText>

            </Dialog.Content>
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({nutVis: false, progress: 0.2, newTitle:"", check:"Breakfast", ingrName: "", ingrQuan: "", ingrUnit: "none", fat: "", protein: "", carbs: "", sugar: "", dis1: true, dis2: true, dis3: true, dis4: true}), del("recipe_ingredients", "recipe_id", this.state.searchID), del("recipes", "title", this.state.tempTitle)}}>Cancel</Button>
              <Button disabled={this.state.dis1 || this.state.dis2 || this.state.dis3 || this.state.dis4  ? true : false}  
              onPress={()=>{this.setState({nutVis: false, methodVis: true, progress: 1})}}>Next</Button>
            </Dialog.Actions>
          </Dialog>


          {/* Pop up to add method */}
          <Dialog visible={this.state.methodVis} onDismiss={() => { this.setState({ methodVis: false, newTitle: "", check: "Breakfast", ingrName: "", ingrQuan: "", ingrUnit: "none", fat: "", protein: "", carbs: "", sugar: "", method: "", dis1: true, dis2: true, dis3: true, dis4: true }), del("recipe_ingredients", "recipe_id", this.state.searchID), del("recipes", "title", this.state.tempTitle) }}>
            <Dialog.Title>Method</Dialog.Title>
            <ProgressBar progress={this.state.progress} color={"blue"}></ProgressBar>
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
              <HelperText type="info" visible={true}>
                Optional. You can add the method later.
              </HelperText>

            </Dialog.Content>
            
            <Dialog.Actions>
              {/* Cancel button to reset field and Next button to go to next page */}
              <Button onPress={()=>{this.setState({methodVis: false, progress: 0.2, newTitle:"", check:"Breakfast", ingrName: "", ingrQuan: "", ingrUnit: "none", fat: "", protein: "", carbs: "", sugar: "", method: "", dis1: true, dis2: true, dis3: true, dis4: true}), del("recipe_ingredients", "recipe_id", this.state.searchID), del("recipes", "title", this.state.tempTitle)}}>Cancel</Button>
              <Button 
                onPress={() => {
                  this.setState({ methodVis: false, newTitle: "", check: "Breakfast", ingrName: "", ingrQuan: "", ingrUnit: "none", fat: "", protein: "", carbs: "", sugar: "", method: "", dis1: true, dis2: true, dis3: true, dis4: true, progress: 0.2 },
                    updateRecipe(this.state.newTitle, this.state.check, this.state.fat, this.state.protein, this.state.carbs, this.state.sugar, this.state.method), this.getAll())}
                }>Complete</Button>

            </Dialog.Actions>
          </Dialog>

        </Portal>

        {/* Displays a message when an ingredient is added
        Currently displayed behind the dialog, making it look darker
        Looking to add an undo button? */}
        <Snackbar
          visible={this.state.snackVis}
          onDismiss={()=> this.setState({snackVis: false})}
          >
          Ingredient added
        </Snackbar>

      </React.Fragment>
    );
    
  }
}

class CardCategory extends Component {
  constructor(props){
    super(props);
    this.state = {
      unveiled: false
    }
  }

  render() {
    return (
        <Card>
          <TouchableWithoutFeedback onPress={() => {this.setState({unveiled: !this.state.unveiled});}}>
            <Card.Title title={this.props.title}></Card.Title>
          </TouchableWithoutFeedback>
            {this.state.unveiled ? 
              this.props.meals.map((recipe) => {
                return <CustomCard
                  navigation = {this.props.navigation}
                  data = {recipe}
                  pushViewTitle = 'Recipe'
                  key={recipe.id}
                  title={recipe.title}
                  uri={recipe.uri}
                />
              })
              :
              null
            }
        </Card>
    );
  }
}
