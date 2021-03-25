import React, {Component} from 'react';
import {Image, View, Avatar} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Chip, Appbar, Dialog, Portal, Button, Paragraph} from "react-native-paper";

// testing
import Elements from '../CustomProperties/Elements.json';
import {getAllRecipes} from '../FileStorage/Database';
import {getAllWorkouts} from '../FileStorage/Database';

const ld = require('lodash');

export default class CalendarListView extends Component {
    constructor(props){
        super(props);
        // colours of chips to select from randomly
        this.colours = ['red', '#66CCFF', '#FFCC00', '#1C9379', '#8A7BA7'];
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
            nReady: 0 
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

        this.showDialog = () => { this.setState({dialogVisible: true}); }
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
            dayMealPlan.lunch = null//selectedLunches[i];
            dayMealPlan.dinner = null//selectedDinners[i];
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

            //console.log(meals);
            nextNDays[i] = {
                day: this.days[(cal.getDay() + i - 1) % 7],
                date: date, 
                date_ext: date_ext,
                selectedRecipes: mealTable[i],
                selectedWorkouts: selectedWorkouts
            }
        }
        return nextNDays;
    }

    randomColour(){
        return this.colours[Math.floor(Math.random() * this.colours.length)];
    }

    render() {
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content title="Calendar"/>
                </Appbar.Header>
                    <ScrollView>
                        {this.state.dynamicCalendar.map((dayOfWeek, idx) =>
                            <Card key={idx}>
                                <Card.Title title={dayOfWeek.day + " " + dayOfWeek.date + dayOfWeek.date_ext}/>
                                <Card.Content>
                                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                                        { dayOfWeek.selectedRecipes ? 
                                            <CustomChip
                                                title={dayOfWeek.selectedRecipes.breakfast.title}
                                                onPress={this.showDialog}
                                                style={{backgroundColor: this.randomColour()}}
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
                                                    style={{backgroundColor: this.randomColour()}}
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
                            <Dialog.Title>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>This is simple dialog</Paragraph>
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
            >
                {props.title}
            </Chip>
        </View>
    );
}