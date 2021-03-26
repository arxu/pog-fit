import React, {Component} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Chip, Appbar, Dialog, Portal, Button, Subheading, Paragraph, List, DataTable, Headline} from "react-native-paper";

import {getAllRecipes} from '../FileStorage/Database';
import {getAllWorkouts} from '../FileStorage/Database';
import RecipeDataTable from '../Components/RecipeDataTable';

const ld = require('lodash');

export default class CalendarListView extends Component {
    constructor(props){
        super(props);
        // colours of chips to select from randomly
        this.colours = ['#7a871e', '#104210', '#e55b13', '#f6a21e', '#655010'];
        this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        

        // For testing. This value should be set by the user. Number of days to show on the calendar.
        let nDays = 14;

        this.state = {
            dialogVisible: false,
            nDaysToShow: nDays, // number of days to show on the calendar
            dynamicCalendar: [],
            workouts: [],
            recipes: [],
            nReady: 0,
            dialogData: null
        };
        
        getAllWorkouts((error, result) => {
            if (error) {
              console.log(error);
            }
            else {
              this.setState({workouts: result});
              this.setState({nReady: this.state.nReady + 1});
              this.updateCalendar();
            }
        });

        getAllRecipes((error, result) => {
            if (error) {
              console.log(error);
            }
            else {
              this.setState({recipes: result});
              this.setState({nReady: this.state.nReady + 1});
              this.updateCalendar();
            }
        });

        //this.state.dynamicCalendar = this.setUpDynamicCalendar(nDays);

        this.showDialog = (data) => { 
            this.setState({dialogVisible: true, dialogData: data}); 
        }
        this.hideDialog = () => { this.setState({dialogVisible: false}); }
    }

    // NOTE: as of now this is mainly here to get around the async behaviour getAllRecipes/Workouts returning post constructor execution
    updateCalendar(){
        if (this.state.nReady >= 2){
            this.setState({dynamicCalendar: this.setUpDynamicCalendar(this.state.nDaysToShow)});
        }
    }

    generateMeals(desiredCalPerMeal, nAllowedMealRepeats){
        function selectMealsFromArray(mealArr, desiredCalPerMeal, nDays, nRepeats){
            // Add property: "difference from desired cals per meal", to each meal.
            mealArr = mealArr.map((b) => {
                let cals = b.fat * 9 + b.protein * 4 + b.carbohydrates * 4;
                b.deltaFromDesired = Math.abs((cals - desiredCalPerMeal));
                b.timesRepeated = 0;
                return b;
            });
            
            // sort by lowest difference
            mealArr.sort((a, b) => a.deltaFromDesired - b.deltaFromDesired);
            
            // select lowest delta meals until number of repeats is reached
            let selectedMeals = [];
            let iDay = 0;
            let iMealArr = 0;
            while (iDay < nDays) {
                // NOTE: Could add a progress bar here based off nDays
                if (mealArr[iMealArr].timesRepeated >= nRepeats){
                    iMealArr++;
                }
                if (iMealArr >= mealArr.length) {
                    iMealArr = 0;
                    nRepeats += 2;
                }
                let meal = ld.cloneDeep(mealArr[iMealArr]);
                selectedMeals.push(meal);
                mealArr[iMealArr].timesRepeated++;
                iDay++;
            }

            // shuffle the array
            for (let i = 1; i < selectedMeals.length; i++) {
                let randIndex = Math.floor(Math.random() * i);
                let temp = ld.cloneDeep(selectedMeals[randIndex]);
                selectedMeals[randIndex] = selectedMeals[i];
                selectedMeals[i] = temp;
            }
            return selectedMeals;
        }

        // Separate array into categories: lunch, dinner, breakfast
        let breakfasts = [];
        let lunches = [];
        let dinners = [];
        for (let i = 0; i < this.state.recipes.length; i++) {
            if (this.state.recipes[i].category == "Breakfast"){
                breakfasts.push(this.state.recipes[i]);
            }
            else if (this.state.recipes[i].category == "Lunch"){
                lunches.push(this.state.recipes[i]);
            }
            else {
                dinners.push(this.state.recipes[i]);
            }
        }

        // Generate array of optimal meals for each category, with specified max meal repeats in given time period (nDaysToShow)
        let selectedBreakfasts = [];
        let selectedLunches = [];
        let selectedDinners = [];
        if (breakfasts.length > 0)
            selectedBreakfasts = selectMealsFromArray(breakfasts, desiredCalPerMeal, this.state.nDaysToShow, nAllowedMealRepeats);
        if (lunches.length > 0)
            selectedLunches = selectMealsFromArray(lunches, desiredCalPerMeal, this.state.nDaysToShow, nAllowedMealRepeats);
        if (dinners.length > 0)
            selectedDinners = selectMealsFromArray(dinners, desiredCalPerMeal, this.state.nDaysToShow, nAllowedMealRepeats);

        // Create an array where each element represents a day of meals; an object of one breakfast, one lunch and one dinner
        let mealTable = [];
        for (let i = 0; i < this.state.nDaysToShow; i++){
            let dayMealPlan = {};
            dayMealPlan.breakfast = selectedBreakfasts[i];
            dayMealPlan.lunch = selectedLunches[i];
            dayMealPlan.dinner = selectedDinners[i];
            mealTable.push(dayMealPlan);
        }
        //console.log(mealTable.map((e) => e.breakfast.title + ", " + e.lunch.title + ", " + e.dinner.title));

        return mealTable;
    }

    setUpDynamicCalendar() {

        let cal = new Date();
        let nextNDays = new Array(this.state.nDaysToShow);

        // temporary numbers for testing. this should be based on users needs
        let desiredCalPerMeal = 500; 
        let nAllowedMealRepeats = 2;
        
        let mealTable = this.generateMeals(desiredCalPerMeal, nAllowedMealRepeats);
        let selectedWorkouts = this.state.workouts.slice(0, 3);

        // Append appropriate data to each day
        for (let i = 0; i < nextNDays.length; i++){

            let date = (cal.getDate() + i) % this.daysInMonth[cal.getMonth()];
            if (date < cal.getDate()){
                date +=1;
            }

            let date_ext;
            switch (date) {
                case 1:
                    date_ext = "st";
                    break;
                case 2:
                    date_ext = "nd";
                    break;
                case 3:
                    date_ext = "rd";
                    break;
                default:
                    date_ext = "th";
            }

            let totalCal = 0;
            totalCal += mealTable[i].breakfast.fat * 9 + mealTable[i].breakfast.carbohydrates * 4 + mealTable[i].breakfast.protein * 4;
            totalCal += mealTable[i].lunch.fat * 9 + mealTable[i].lunch.carbohydrates * 4 + mealTable[i].lunch.protein * 4;
            totalCal += mealTable[i].dinner.fat * 9 + mealTable[i].dinner.carbohydrates * 4 + mealTable[i].dinner.protein * 4;

            let fatPercent = Math.round(100 * (mealTable[i].breakfast.fat + mealTable[i].lunch.fat + mealTable[i].dinner.fat) * 9/ totalCal);
            let carbPercent = Math.round(100 * (mealTable[i].breakfast.carbohydrates + mealTable[i].lunch.carbohydrates + mealTable[i].dinner.carbohydrates) * 4 / totalCal);
            let proteinPercent = Math.round(100 * (mealTable[i].breakfast.protein + mealTable[i].lunch.protein + mealTable[i].dinner.protein) * 4 / totalCal);

            
            nextNDays[i] = {
                day: this.days[(cal.getDay() + i - 1) % 7],
                date: date, 
                date_ext: date_ext,
                selectedRecipes: mealTable[i],
                selectedWorkouts: selectedWorkouts,
                totalCal: Math.round(totalCal),
                fatPercent: fatPercent,
                proteinPercent: proteinPercent,
                carbPercent: carbPercent
            }
        }

        console.log(mealTable[1]);

        return nextNDays;
    }

    render() {
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content title="Calendar"/>
                </Appbar.Header>
                    <ScrollView>
                        {this.state.dynamicCalendar.map((dayOfWeek, idx) =>
                            <Card key={idx} style={{margin: 3}}>
                                <Card.Title 
                                    title={dayOfWeek.day + " " + dayOfWeek.date + dayOfWeek.date_ext} 
                                    subtitle={
                                        dayOfWeek.totalCal + " Calories: " 
                                        + dayOfWeek.fatPercent + "% fat, " 
                                        + dayOfWeek.proteinPercent + "% protein, "
                                        + dayOfWeek.carbPercent + "% carbohydrates"}/>
                                <Card.Content>
                                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                                        { dayOfWeek.selectedRecipes ? 
                                            <CustomChip
                                                title={dayOfWeek.selectedRecipes.breakfast.title}
                                                onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.dinner})}}
                                                icon='food-croissant'
                                                style={{backgroundColor: '#f6a21e'}}
                                            />
                                            :
                                            null
                                        }
                                        { dayOfWeek.selectedRecipes ? 
                                            <CustomChip
                                                title={dayOfWeek.selectedRecipes.lunch.title}
                                                onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.lunch})}}
                                                icon='food-apple'
                                                style={{backgroundColor: '#7a871e'}}
                                            />
                                            :
                                            null
                                        }        
                                        { dayOfWeek.selectedRecipes ? 
                                            <CustomChip
                                                title={dayOfWeek.selectedRecipes.dinner.title}
                                                onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.dinner})}}
                                                icon='food-steak'
                                                style={{backgroundColor: '#655010'}}
                                            />
                                            :
                                            null
                                        }             
                                        {dayOfWeek.selectedWorkouts.map((e) => {
                                            return (
                                                <CustomChip 
                                                    title={e.title} 
                                                    onPress={this.showDialog} 
                                                    key={e.id}
                                                    style={{backgroundColor: '#e55b13'}}
                                                    icon='dumbbell'
                                                />
                                            );
                                        })}
                                    </View>
                                </Card.Content>
                            </Card>
                        )}
                    </ScrollView>
                    <Portal>
                        <Dialog visible={this.state.dialogVisible} onDismiss={this.hideDialog}>
                            {/*<Dialog.Title>Alert</Dialog.Title>*/}
                            <Dialog.Content>
                                {/* {<Paragraph>This is simple dialog</Paragraph>} */}
                                {this.state.dialogData ?
                                    <RecipeDialogContent recipe={this.state.dialogData.data}/>
                                    :
                                    null
                                }
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={this.hideDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
            </React.Fragment>
        );
    }
}

function CustomChip(props) {
    return (
        <View style={{margin: 1}}>
            <Chip 
                mode="flat" 
                style={props.style}
                textStyle={{color:'white'}}
                onPress={props.onPress}
                icon={props.icon}
            >
                {props.title}
            </Chip>
        </View>
    );
}

function RecipeDialogContent(props) {
    let recipe = props.recipe;
    return (
        <ScrollView>
            <Headline>{recipe.title}</Headline>
            <React.Fragment>
                <Image source={{ uri: recipe.uri }} style={{flexDirection: 'row', height: 150}}/>
                
                {/* Ingredient list */}
                <List.Section>
                    <List.Accordion title="Ingredients" description="Tap to see the list of ingredients">
                        {recipe.ingredients.map((ingredient, index) => <List.Item key={index} title={ingredient.title}/>)}
                    </List.Accordion>
                </List.Section>                                    
                    
                <Subheading>Method</Subheading>
                <Paragraph>{recipe.method}</Paragraph>

                <List.Section>
                    <List.Accordion title="Nutritional Information" description="Tab to see a table of nutritional information">
                        <RecipeDataTable recipe={recipe}/>
                    </List.Accordion>
                </List.Section>
            </React.Fragment>
        </ScrollView>
    );
}

