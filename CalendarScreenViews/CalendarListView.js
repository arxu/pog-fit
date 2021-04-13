import React, {Component} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { 
    Card, Chip, Appbar, Dialog, Portal, Button, Subheading, Paragraph, 
    List, Headline, DataTable, ProgressBar, Menu, Checkbox, Switch, TextInput
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {getAllRecipes} from '../FileStorage/Database';
import {getAllWorkouts} from '../FileStorage/Database';
import RecipeDataTable from '../Components/RecipeDataTable';
import Units from '../Components/Units.json';

const ld = require('lodash');

const MORE_ICON = Platform.OS === "ios" ? 'dots-horizontal' : 'dots-vertical';

export default class CalendarListView extends Component {
    constructor(props){
        super(props);
        // colours of chips to select from randomly
        this.colours = ['#7a871e', '#104210', '#e55b13', '#f6a21e', '#655010'];
        this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        
        // For testing. This value should be set by the user. Number of days to show on the calendar.

        this.state = {
            // Recipe dialog
            recipeDialogVisible: false,
            recipeDialogData: null,
            // Shopping list dialog
            shoppingListDialogVisible: false, 
            // Dunamic calendar
            desiredCalPerMeal: 400,
            dynamicCalendar: [],
            workouts: [],
            recipes: [],
            nReady: 0,
            // Shopping list
            selectedCards: [],
            shoppingList: null,
            // Loading screen (not implemented)
            isLoadingCalendar: true,
            calendarLoadProgress: 0,
            // Preferences
            menuVisible: false,
            preferencesDialogVisible: false,
            usingBreakfast: true,
            usingLunch: true,
            usingDinner: true,
            usingSnack1: true,
            usingSnack2: true,
            usingSnack3: true,
            nAllowedMealRepeats: 2,
            mealRepeatMenuVisible: false,
            nDaysToShow: 7,
            daysToShowMenuVisible: false
        };

        this.showDialog = (data) => { 
            this.setState({recipeDialogVisible: true, recipeDialogData: data}); 
        }

        this.hideDialog = () => { 
            this.setState({recipeDialogVisible: false}); 
        }

        this.showShoppingListDialog = () => {
            this.setState({shoppingListDialogVisible: true});
        }

        this.hideShoppingListDialog = () => {
            this.setState({shoppingListDialogVisible: false});
        }

        this.updateCalendar = (createNew, desiredCalPerMeal, nAllowedMealRepeats) => {
            if (this.state.nReady >= 2) {
                this.setState({isLoadingCalendar: true});
                // load calendar from database
                if (!createNew) {
                    AsyncStorage.getItem("dynamicCalendarDetails", (error, result) => {
                        if (error) {
                            // generate new calendar
                        }
                        // Calculate how many days have passed since calendar was last opened
                        let dynamicCalendarDetails = JSON.parse(result);
                        let cal = new Date();
                        let nPastDays = cal.getDate() < dynamicCalendarDetails.saveDate ? 
                            cal.getDate() + this.daysInMonth[cal.getMonth() + 1] - dynamicCalendarDetails.saveDate
                            :
                            cal.getDate() - dynamicCalendarDetails.saveDate;
                        nPastDays = Math.min(nPastDays, this.state.nDaysToShow);

                        // Get the calendar
                        let dynamicCalendar = dynamicCalendarDetails.calendar;

                        // Adjust the calendar, removing passed days and adding new ones
                        dynamicCalendar.splice(0, nPastDays);
                        let newDays = this.setUpDynamicCalendar(nPastDays, nAllowedMealRepeats, desiredCalPerMeal, dynamicCalendar);
                        newDays.forEach((day) => {dynamicCalendar.push(day);});

                        // Adjust the dates for each day
                        for (let i = 0; i < dynamicCalendar.length; i++) {
                            let date = (cal.getDate() + i) % this.daysInMonth[cal.getMonth()];
                            if (date < cal.getDate()){
                                date +=1;
                            }

                            let date_ext;
                            switch (date % 10) {
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
                            if (date === 12 || date === 11 || date === 13) 
                                date_ext = "th";

                            dynamicCalendar[i].day = this.days[(cal.getDay() + i - 1) % 7];
                            dynamicCalendar[i].date_ext = date_ext;
                            dynamicCalendar[i].date = date;
                        }

                        // Save to Database
                        this.setState({dynamicCalendar: dynamicCalendar});
                        AsyncStorage.setItem(
                            "dynamicCalendarDetails", 
                            JSON.stringify({saveDate: cal.getDate(), calendar: dynamicCalendar}), 
                            (error, result) => {this.setState({isLoadingCalendar: false})}
                        );
                       
                    });
                }
                else {
                    // Generate a new calendar and save to database
                    let cal = new Date();
                    let dynamicCalendar = this.setUpDynamicCalendar(this.state.nDaysToShow, nAllowedMealRepeats, desiredCalPerMeal);
                    this.setState({dynamicCalendar: dynamicCalendar});
                    AsyncStorage.setItem(
                        "dynamicCalendarDetails", 
                        JSON.stringify({saveDate: cal.getDate(), calendar: dynamicCalendar}), 
                        (error, result) => {this.setState({isLoadingCalendar: false})}
                    );
                }
                
            }
        }

        this.highlightSelectedCard = (idx) => {
            let cal = this.state.dynamicCalendar; 
            let selected = this.state.selectedCards;
            if (cal[idx].colour === 'white'){
                cal[idx].colour = '#e7d2cc';
                selected.push(cal[idx]);
                
            }
            else {
                cal[idx].colour = 'white';
                selected.splice(idx, 1);
            }
            this.setState({dynamicCalendar: cal, selectedCards: selected});
        }

        this.savePreferences = () => {
            this.setState({preferencesDialogVisible: false});
            let preferences = {
                nAllowedMealRepeats: this.state.nAllowedMealRepeats,
                nDaysToShow: this.state.nDaysToShow,
                usingBreakfast: this.state.usingBreakfast,
                usingLunch: this.state.usingLunch,
                usingDinner: this.state.usingDinner,
                usingSnack1: this.state.usingSnack1,
                usingSnack2: this.state.usingSnack2,
                usingSnack3: this.state.usingSnack3
            }
            AsyncStorage.setItem("calendarPreferences", JSON.stringify(preferences), error => {if (error) throw error;});
            this.updateCalendar(true, this.state.desiredCalPerMeal, this.state.nAllowedMealRepeats, null);
        }

        this.loadPreferences = () => {
            AsyncStorage.getItem("calendarPreferences", (error, result) => {
                if (error) {
                    throw error;
                }
                let preferences = JSON.parse(result);
                this.setState({
                    preferencesDialogVisible: false,
                    nAllowedMealRepeats: preferences.nAllowedMealRepeats,
                    nDaysToShow: preferences.nDaysToShow,
                    usingBreakfast: preferences.usingBreakfast,
                    usingLunch: preferences.usingLunch,
                    usingDinner: preferences.usingDinner,
                    usingSnack1: preferences.usingSnack1,
                    usingSnack2: preferences.usingSnack2,
                    usingSnack3: preferences.usingSnack3
                });
            });
        }

        // TODO: need to save preferences the first time the app is opened
        this.loadPreferences();

        getAllWorkouts((error, result) => {
            if (error) {
              console.log(error);
            }
            else {
              this.setState({workouts: result});
              this.setState({nReady: this.state.nReady + 1});
              this.updateCalendar(false, this.state.desiredCalPerMeal, this.state.nAllowedMealRepeats);
            }
        });

        getAllRecipes((error, result) => {
            if (error) {
              console.log(error);
            }
            else {
              this.setState({recipes: result});
              this.setState({nReady: this.state.nReady + 1});
              this.updateCalendar(false, this.state.desiredCalPerMeal, this.state.nAllowedMealRepeats);
            }
        });
    }

    generateMeals(desiredCalPerMeal, nAllowedMealRepeats, savedCalendar){
        function selectMealsFromArray(mealArr, desiredCalPerMeal, nDays, nRepeats, savedMeals){
            // Add property: "difference from desired cals per meal", to each meal.
            mealArr = mealArr.map((b) => {
                let cals = b.fat * 9 + b.protein * 4 + b.carbohydrates * 4;
                b.deltaFromDesired = Math.abs((cals - desiredCalPerMeal));
                b.timesRepeated = 0;
                savedMeals.forEach((meal) => {
                    if (meal != undefined && meal.title === b.title) {
                        b.timesRepeated++;
                    }
                });
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
        let snacks1 = [];
        let snacks2 = [];
        let snacks3 = [];

        // Sort each recipe from the database into the categories by adding to appropriate array
        for (let i = 0; i < this.state.recipes.length; i++) {
            if (this.state.usingBreakfast && this.state.recipes[i].category == "Breakfast"){
                breakfasts.push(this.state.recipes[i]);
            }
            else if (this.state.usingLunch && this.state.recipes[i].category == "Lunch"){
                lunches.push(this.state.recipes[i]);
            }
            else if (this.state.usingDinner && this.state.recipes[i].category === "Dinner") {
                dinners.push(this.state.recipes[i]);
            }
            else if (this.state.usingSnack1 && this.state.recipes[i].category === "Snack1") {
                snacks1.push(this.state.recipes[i]);
            }
            else if (this.state.usingSnack2 && this.state.recipes[i].category === "Snack2") {
                snacks2.push(this.state.recipes[i]);
            }
            else if (this.state.usingSnack3) {
                snacks3.push(this.state.recipes[i]);
            }
        }

        // Get the number of meals per day
        let nMeals = 0;
        if (breakfasts.length > 0) nMeals += 1;
        if (lunches.length > 0) nMeals += 1;
        if (dinners.length > 0) nMeals += 1;
        if (snacks1.length > 0) nMeals += 1;
        if (snacks2.length > 0) nMeals += 1; 
        if (snacks3.length > 0) nMeals += 1;

        // Generate array of optimal meals for each category, with specified max meal repeats in given time period (nDaysToShow)
        let selectedBreakfasts = [];
        let selectedLunches = [];
        let selectedDinners = [];
        let selectedSnacks1 = [];
        let selectedSnacks2 = [];
        let selectedSnacks3 = [];
        if (breakfasts.length > 0){
            selectedBreakfasts = selectMealsFromArray(
                breakfasts, 
                desiredCalPerMeal, 
                this.state.nDaysToShow, 
                nAllowedMealRepeats,
                savedCalendar != null && this.state.usingBreakfast ? savedCalendar.map((day) => day.selectedRecipes.breakfast) : []
            );
        }
        if (lunches.length > 0) {
            selectedLunches = selectMealsFromArray(
                lunches, 
                desiredCalPerMeal, 
                this.state.nDaysToShow, 
                nAllowedMealRepeats,
                savedCalendar != null && this.state.usingLunch ? savedCalendar.map((day) => day.selectedRecipes.lunch) : []
            );
        }
        if (dinners.length > 0) {
            selectedDinners = selectMealsFromArray(
                dinners, 
                desiredCalPerMeal, 
                this.state.nDaysToShow, 
                nAllowedMealRepeats,
                savedCalendar != null && this.state.usingDinner ? savedCalendar.map((day) => day.selectedRecipes.dinner) : []
            );
        }
        if (snacks1.length  > 0) {
            selectedSnacks1 = selectMealsFromArray(
                snacks1, 
                desiredCalPerMeal, 
                this.state.nDaysToShow, 
                nAllowedMealRepeats,
                savedCalendar != null && this.state.usingSnack1 ? savedCalendar.map((day) => day.selectedRecipes.snack1) : []
            );
        }
        if (snacks2.length  > 0) {
            selectedSnacks2 = selectMealsFromArray(
                snacks2, 
                desiredCalPerMeal, 
                this.state.nDaysToShow, 
                nAllowedMealRepeats,
                savedCalendar != null && this.state.usingSnack2 ? savedCalendar.map((day) => day.selectedRecipes.snack2) : []
            );
        }
        if (snacks3.length  > 0) {
            selectedSnacks3 = selectMealsFromArray(
                snacks3, 
                desiredCalPerMeal, 
                this.state.nDaysToShow, 
                nAllowedMealRepeats,
                savedCalendar != null && this.state.usingSnack3 ? savedCalendar.map((day) => day.selectedRecipes.snack3) : []
            );
        }
        
        // Create an array where each element represents a day of meals; an object of one breakfast, one lunch and one dinner
        let mealTable = [];
        for (let i = 0; i < this.state.nDaysToShow; i++){
            let dayMealPlan = {};
            if (selectedBreakfasts.length > 0) dayMealPlan.breakfast = selectedBreakfasts[i];
            if (selectedLunches.length > 0) dayMealPlan.lunch = selectedLunches[i];
            if (selectedDinners.length > 0) dayMealPlan.dinner = selectedDinners[i];
            if (selectedSnacks1.length > 0) dayMealPlan.snack1 = selectedSnacks1[i];
            if (selectedSnacks2.length > 0) dayMealPlan.snack2 = selectedSnacks2[i];
            if (selectedSnacks3.length > 0) dayMealPlan.snack3 = selectedSnacks3[i];
            mealTable.push(dayMealPlan);
        }

        return mealTable;
    }

    setUpDynamicCalendar(nDays, nAllowedMealRepeats, desiredCalPerMeal, savedCalendar) {
        function sumCal(meal){
            return meal.fat * 9 + meal.protein * 4 + meal.carbohydrates * 4;
        }

        let cal = new Date();
        let nextNDays = new Array(nDays);
        
        let mealTable = this.generateMeals(desiredCalPerMeal, nAllowedMealRepeats, savedCalendar);
        let selectedWorkouts = this.state.workouts.slice(0, 3);

        // Append appropriate data to each day
        for (let i = 0; i < nextNDays.length; i++){

            let date = (cal.getDate() + i) % this.daysInMonth[cal.getMonth()];
            if (date < cal.getDate()){
                date +=1;
            }

            let date_ext;
            switch (date % 10) {
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
            if (date === 12 || date === 11 || date === 13) 
                date_ext = "th";

            // Get total calories from each meal for the day
            let totalCal = 0;
            if (mealTable[i].breakfast != undefined) totalCal += sumCal(mealTable[i].breakfast);
            if (mealTable[i].lunch != undefined) totalCal += sumCal(mealTable[i].lunch);
            if (mealTable[i].dinner != undefined) totalCal += sumCal(mealTable[i].dinner);
            if (mealTable[i].snack1 != undefined) totalCal += sumCal(mealTable[i].snack1);
            if (mealTable[i].snack2 != undefined) totalCal += sumCal(mealTable[i].snack2);
            if (mealTable[i].snack3 != undefined) totalCal += sumCal(mealTable[i].snack3);

            // Calculate percentages of fat, protein, carbs
            let totalFat = 0, totalCarbs = 0, totalProtein = 0;
            if (mealTable[i].breakfast != undefined) { 
                totalFat += mealTable[i].breakfast.fat;
                totalCarbs += mealTable[i].breakfast.carbohydrates;
                totalProtein += mealTable[i].breakfast.protein; 
            }
            if (mealTable[i].lunch != undefined) {
                totalFat += mealTable[i].lunch.fat;
                totalCarbs += mealTable[i].lunch.carbohydrates;
                totalProtein += mealTable[i].lunch.protein; 
            }
            if (mealTable[i].dinner != undefined) { 
                totalFat += mealTable[i].dinner.fat; 
                totalCarbs += mealTable[i].dinner.carbohydrates;
                totalProtein += mealTable[i].dinner.protein; 
            }
            if (mealTable[i].snack1 != undefined) {
                totalFat += mealTable[i].snack1.fat;
                totalCarbs += mealTable[i].snack1.carbohydrates;
                totalProtein += mealTable[i].snack1.protein; 
            }
            if (mealTable[i].snack2 != undefined) {
                totalFat += mealTable[i].snack2.fat;
                totalCarbs += mealTable[i].snack2.carbohydrates;
                totalProtein += mealTable[i].snack2.protein; 
            }
            if (mealTable[i].snack3 != undefined) { 
                totalCal += mealTable[i].snack3.fat;
                totalCarbs += mealTable[i].snack3.carbohydrates;
                totalProtein += mealTable[i].snack3.protein; 
            }

            let fatPercent = Math.round(100 * totalFat * 9 / totalCal);
            let carbPercent = Math.round(100 * totalProtein * 4 / totalCal);
            let proteinPercent = Math.round(100 * totalCarbs * 4 / totalCal);

            nextNDays[i] = {
                day: this.days[(cal.getDay() + i - 1) % 7],
                date: date, 
                date_ext: date_ext,
                selectedRecipes: mealTable[i],
                selectedWorkouts: selectedWorkouts,
                totalCal: Math.round(totalCal),
                fatPercent: fatPercent,
                proteinPercent: proteinPercent,
                carbPercent: carbPercent,
                colour: 'white'
            }
        }
        
        return nextNDays;
    }

    generateShoppingList(days){
        function strHash(str, m) {
            let charArr = Array.from(str);
            let intLength = charArr.length/2;
            let sum = 0;
            for (let i = 0; i < intLength; i++) {
                let c = Array.from(charArr.splice(i+2, (i*2) + 2));
                let mult = 1;
                for (let j = 0; j < c.length; j++) {
                    sum += c[j].charCodeAt(0) * mult;
                    mult *= 256;
                }
            }
            return Math.abs(sum) % m;
        }

        function getIngredients(recipe, outResult){
            // loop through all ingredients in the recipe
            let ingredients = [];
            for (let k = 0; k < recipe.ingredients.length; k++){
                // get ingredient and its title's hash value
                let ingredient = recipe.ingredients[k];
                ingredients.push(ingredient);
            }
            return ingredients;
        }

        function addToHashTable(ingredient, ingredientHashTable, modulus) {
            let hashVal = strHash(ingredient.item, modulus);
            // insert ingredients into a hash table. Stack ingredients that have the same name. Move other ingredients into new spaces.
            while(hashVal < ingredientHashTable.length 
                && ingredientHashTable[hashVal] != undefined 
                && ingredientHashTable[hashVal].item != ingredient.item)
            {
                hashVal++;
            }
            if (hashVal >= ingredientHashTable.length){
                let stack = {item: ingredient.item, stack: []};
                stack.stack.push(ingredient);
                ingredientHashTable.push(stack);
            }
            else if (ingredientHashTable[hashVal] === undefined){
                let stack = {item: ingredient.item, stack: []};
                stack.stack.push(ingredient);
                ingredientHashTable[hashVal] = stack;
            }
            else {
                ingredientHashTable[hashVal].stack.push(ingredient);
            }
        }

        function getGroup(u) {
            let grp;
            switch (u) {
                case Units.ml: 
                    grp = "vol";
                    break;
                case Units.l: 
                    grp = "vol";
                    break;
                case Units.cup: 
                    grp = "vol";
                    break; 
                case Units.tsp: 
                    grp = "vol";
                    break;
                case Units.tbsp: 
                    grp = "vol";
                    break;
                case Units.mg: 
                    grp = "weight";
                    break;
                case Units.g: 
                    grp = "weight";
                    break;
                case Units.kg: 
                    grp = "weight";
                    break;
                case Units.none: 
                    grp = Units.none;
                    break;
                case Units.pinch:
                    grp = Units.pinch;
                    break;
                case Units.slice:
                    grp = Units.slice;
                    break;
                case Units.can:
                    grp = Units.can;
                    break;
                default:
                    grp = Units.none;
                    break;
            }
            return grp;
        }

        function convertMeasurementToLowest(value, unit){
            let converted;
            switch (unit) {
                case Units.ml: 
                    converted = value;
                    break;
                case Units.l: 
                    converted = value * 1000
                    break;
                case Units.cup: 
                    converted = value * 284.1306
                    break; 
                case Units.tsp: 
                    converted = value * 5.919388
                    break;
                case Units.tbsp: 
                    converted = value * 17.75816
                    break;
                case Units.mg: 
                    converted = value;
                    break;
                case Units.g: 
                    converted = value * 1000;
                    break;
                case Units.kg: 
                    converted = value * 1000000;
                    break;
                default:
                    converted = value;
                    break;
            }
            return converted;
        }

        function convertLowestToBestUnit(value, unit) {
            let converted = null;
            let newUnit = null;
            switch (unit) {
                case Units.mg:
                    let weightDivisors = [1, 1000, 1000000]; // [mg, g, kg]
                    for (let i = 0; i < weightDivisors.length; i++){
                        let higherUnitVal = value/weightDivisors[i];
                        if (higherUnitVal >= 0.1 && higherUnitVal < 100){
                            converted = higherUnitVal;
                            switch (i){
                                case 0: newUnit = Units.mg; break;
                                case 1: newUnit = Units.g; break;
                                case 2: newUnit = Units.kg; break;
                            }
                            break;
                        }
                    }
                    if (converted == null ) {
                        converted = value / weightDivisors[weightDivisors.length -1];
                        newUnit = Units.kg;
                    }
                    break;
                case Units.ml:
                    let volumeDivisors = [1, 5.919388, 17.75816, 284.1306, 1000]; // [ml, tsp, tbsp, cup, l]
                    for (let i = 0; i < volumeDivisors.length; i++){
                        let higherUnitVal = value/volumeDivisors[i];
                        if (higherUnitVal >= 0.1 && higherUnitVal < 10){
                            converted = higherUnitVal;
                            switch (i){
                                case 0: newUnit = Units.ml; break;
                                case 1: newUnit = Units.tsp; break;
                                case 2: newUnit = Units.tbsp; break;
                                case 3: newUnit = Units.cup; break;
                                case 4: newUnit = Units.l; break;
                            }
                            break;
                        }
                    }
                    if (converted == null ) {
                        converted = value / volumeDivisors[volumeDivisors.length -1];
                        newUnit = Units.l;
                    }
                    break;
                default:
                    converted = value;
                    newUnit = unit;
            }
            return {value: converted, unit: newUnit};
        }

        // Extract all ingredients from the selected days
        let ingredients = [];
        for (let i = 0; i < days.length; i++){
            let breakfasts = getIngredients(days[i].selectedRecipes.breakfast);
            let lunches = getIngredients(days[i].selectedRecipes.lunch);
            let dinners = getIngredients(days[i].selectedRecipes.dinner);
            ingredients = ingredients.concat(breakfasts);
            ingredients = ingredients.concat(lunches);
            ingredients = ingredients.concat(dinners);
        }

        // Build an array of stacks. Ingredients with the same name are put on the same stack.
        // Array is treated like a hash table and insertion is in the form of hashing.
        let modulus = days.length * 3 + 1; // NOTE: 3 is the number of meals/snacks per day. This may change so this value should be substituted.
        let ingredientHashTable = new Array(modulus); 
        for (let i = 0; i < ingredients.length; i++) {
            addToHashTable(ingredients[i], ingredientHashTable, modulus);
        }

        // Sum quantities of items and add them to the shopping list.
        let shoppingList = [];
        let startIdx = 0, endIdx = 1;
        // Loop through array of stacks
        for (let i = 0; i < ingredientHashTable.length; i++) {
            if (ingredientHashTable[i] === undefined){
                continue;
            }
            let ingredientSum = {item: ingredientHashTable[i].item};
            // Pop ingredients from stack until empty. Add ingredient quantities appropriately.
            while (ingredientHashTable[i].stack.length != 0){
                let ingredient = ingredientHashTable[i].stack.pop();
                // Check through already added ingredients for unit compatibility
                // If compatible sum their quantities, otherwise add the new ingredient as a new entry in the shopping list
                for (let j = startIdx; j <= shoppingList.length; j++){
                    if (j >= shoppingList.length) {
                        // convert the ingredient quantity to smallest possible unit
                        let convertedQtty = convertMeasurementToLowest(ingredient.quantity, ingredient.measurement);
                        // add the quantity and (smallest) unit as the {quantity: x, measurement: y} of the ingredient to be added to shopping list.
                        let ingSumCopy = ld.cloneDeep(ingredientSum);
                        ingSumCopy.quantity = convertedQtty;
                        let measurementGroup = getGroup(ingredient.measurement);
                        switch (measurementGroup){
                            case "vol":
                                ingSumCopy.measurement = Units.ml;
                                break;
                            case "weight":
                                ingSumCopy.measurement = Units.mg;
                                break;
                            default:
                                ingSumCopy.measurement = ingredient.measurement; // use whatever the ingredient is being measured in
                                break;
                        }
                        // add the ingredient as a new entry to the shopping list
                        shoppingList.push(ingSumCopy);
                        break;
                    }
                    else if (getGroup(ingredient.measurement) === getGroup(shoppingList[j].measurement)) {
                        // Simply add the quantity of the ingredient to the sum in the shopping list
                        let convertedQtty = convertMeasurementToLowest(ingredient.quantity, ingredient.measurement);
                        shoppingList[j].quantity += convertedQtty;
                        break;
                    }                    
                }
            }
            startIdx = shoppingList.length;
        }
        
        // Convert all ingredient quantities in the shopping list to most appropriate units (e.g. 0.5kg rather than 500g)
        shoppingList.forEach((ingredient)=>{
            let betterValAndUnit = convertLowestToBestUnit(ingredient.quantity, ingredient.measurement);
            ingredient.quantity = betterValAndUnit.value;
            ingredient.measurement = betterValAndUnit.unit;
        });

        return shoppingList;
    }

    render() {
        return (
            <React.Fragment>
                <Appbar.Header>
                    <Appbar.Content title="Calendar"/>
                    <Menu
                        visible={this.state.menuVisible}
                        onDismiss={() => { this.setState({menuVisible: false}); }}
                        anchor={<Appbar.Action icon={MORE_ICON} color="white" onPress={() => { this.setState({menuVisible: true}); }}/>}
                    >
                        <Menu.Item title="Preferences" onPress={() => { this.setState({menuVisible: false, preferencesDialogVisible: true}); }}/>

                    </Menu>
                </Appbar.Header>
                    <View style={{height: '80%', marginLeft: 5, marginRight: 5}}>
                        <ProgressBar progress={this.state.calendarLoadProgress} />
                        <ScrollView>
                            {this.state.dynamicCalendar.map((dayOfWeek, idx) =>
                                <Card key={idx} style={{margin: 3, backgroundColor: dayOfWeek.colour}} onLongPress={() =>{this.highlightSelectedCard(idx)}}>
                                    <Card.Title 
                                        title={dayOfWeek.day + " " + dayOfWeek.date + dayOfWeek.date_ext} 
                                        subtitle={
                                            dayOfWeek.totalCal + " Calories: " 
                                            + dayOfWeek.fatPercent + "% fat, " 
                                            + dayOfWeek.proteinPercent + "% protein, "
                                            + dayOfWeek.carbPercent + "% carbohydrates"}/>
                                    <Card.Content>
                                        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                                            { dayOfWeek.selectedRecipes && dayOfWeek.selectedRecipes.breakfast ? 
                                                <CustomChip
                                                    title={dayOfWeek.selectedRecipes.breakfast.title}
                                                    onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.breakfast})}}
                                                    icon='food-croissant'
                                                    style={{backgroundColor: '#f6a21e'}}
                                                />
                                                :
                                                null
                                            }
                                            { dayOfWeek.selectedRecipes && dayOfWeek.selectedRecipes.lunch ? 
                                                <CustomChip
                                                    title={dayOfWeek.selectedRecipes.lunch.title}
                                                    onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.lunch})}}
                                                    icon='food-apple'
                                                    style={{backgroundColor: '#7a871e'}}
                                                />
                                                :
                                                null
                                            }        
                                            { dayOfWeek.selectedRecipes && dayOfWeek.selectedRecipes.dinner ? 
                                                <CustomChip
                                                    title={dayOfWeek.selectedRecipes.dinner.title}
                                                    onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.dinner})}}
                                                    icon='food-steak'
                                                    style={{backgroundColor: '#655010'}}
                                                />
                                                :
                                                null
                                            }       
                                            { dayOfWeek.selectedRecipes && dayOfWeek.selectedRecipes.snack1 ? 
                                                <CustomChip
                                                    title={dayOfWeek.selectedRecipes.snack1.title}
                                                    onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.snack1})}}
                                                    icon='food-steak'
                                                    style={{backgroundColor: '#f6a21e'}}
                                                />
                                                :
                                                null
                                            }   
                                            { dayOfWeek.selectedRecipes && dayOfWeek.selectedRecipes.snack2 ? 
                                                <CustomChip
                                                    title={dayOfWeek.selectedRecipes.snack2.title}
                                                    onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.snack2})}}
                                                    icon='food-steak'
                                                    style={{backgroundColor: '#7a871e'}}
                                                />
                                                :
                                                null
                                            }   
                                            { dayOfWeek.selectedRecipes && dayOfWeek.selectedRecipes.snack3 ?   
                                                <CustomChip
                                                    title={dayOfWeek.selectedRecipes.snack3.title}
                                                    onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.snack3})}}
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
                    </View>
                    <View style={{margin: 5, flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', height: '20%'}}>
                        <Button 
                            mode="contained" 
                            onPress={() => {this.updateCalendar(true, this.state.desiredCalPerMeal, this.state.nAllowedMealRepeats, null);}} 
                            style={{margin: 2}}
                        >
                            NEW PLAN
                        </Button>
                        <Button 
                            mode="contained" 
                            onPress={()=>{
                                let shoppingList = this.generateShoppingList(this.state.selectedCards);
                                let cal = this.state.dynamicCalendar;
                                cal.forEach((card) => {card.colour = 'white'});
                                this.setState({
                                    dynamicCalendar: cal, 
                                    selectedCards: [],
                                    shoppingList: shoppingList,
                                    shoppingListDialogVisible: true
                                });
                            }} 
                            style={{margin: 2}}
                            disabled={this.state.selectedCards.length === 0 ? true : false}
                        >
                            GENERATE SHOPPING LIST
                        </Button>
                    </View>
                    <Portal>
                        <Dialog visible={this.state.recipeDialogVisible} onDismiss={this.hideDialog}>
                            <Dialog.Content>
                                {this.state.recipeDialogData ?
                                    <RecipeDialogContent recipe={this.state.recipeDialogData.data}/>
                                    :
                                    null
                                }
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={this.hideDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog visible={this.state.shoppingListDialogVisible} onDismiss={this.hideShoppingListDialog}>
                            <Dialog.Content style={{height: "90%"}}>
                                <ScrollView>
                                    {this.state.shoppingList ?
                                        <DataTable>
                                            <DataTable.Header>
                                                <DataTable.Title>Item</DataTable.Title>
                                                <DataTable.Title numeric>Amount</DataTable.Title>
                                                <DataTable.Title></DataTable.Title>
                                            </DataTable.Header>
                                
                                            {this.state.shoppingList.map((ingredient, i)=>{
                                                return (
                                                    <DataTable.Row key={i}>
                                                        <DataTable.Cell>{ingredient.item}</DataTable.Cell>
                                                        <DataTable.Cell numeric>{ Math.abs(ingredient.quantity.toFixed(2) - Math.round(ingredient.quantity)) <=0.01 ? 
                                                            Math.round(ingredient.quantity) 
                                                            : 
                                                            ingredient.quantity.toFixed(2)
                                                        }</DataTable.Cell>
                                                        <DataTable.Cell>{ingredient.measurement === "none" ? "" : " " + ingredient.measurement }</DataTable.Cell>
                                                    </DataTable.Row>
                                                );
                                            })}
                                        </DataTable>
                                        :
                                        null
                                    }
                                </ScrollView>
                            </Dialog.Content>
                            <Dialog.Actions style={{height: "10%"}}>
                                <Button onPress={this.hideShoppingListDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog visible={this.state.preferencesDialogVisible} onDismiss={() => { this.setState({preferencesDialogVisible: false}); }}>
                            <Dialog.Title>Preferences</Dialog.Title>
                            <Dialog.Content  >
                                <ScrollView>
                                    <TitledCheckbox 
                                        status={this.state.usingBreakfast ? "checked" : "unchecked"} 
                                        onPress={() => { this.setState({usingBreakfast: !this.state.usingBreakfast}); }}
                                        title="Use Breakfasts"
                                    />
                                    <TitledCheckbox 
                                        status={this.state.usingLunch ? "checked" : "unchecked"}
                                        onPress={() => { this.setState({usingLunch: !this.state.usingLunch}); }}
                                        title="Use Lunches"
                                    />
                                    <TitledCheckbox 
                                        status={this.state.usingDinner ? "checked" : "unchecked"}
                                        onPress={() => { this.setState({usingDinner: !this.state.usingDinner}); }}
                                        title="Use Dinners"
                                    />
                                    <TitledCheckbox 
                                        status={this.state.usingSnack1 ? "checked" : "unchecked"}
                                        onPress={() => { this.setState({usingSnack1: !this.state.usingSnack1}); }}
                                        title="Use Snack 1"
                                    />
                                    <TitledCheckbox 
                                        status={this.state.usingSnack2 ? "checked" : "unchecked"}
                                        onPress={() => { this.setState({usingSnack2: !this.state.usingSnack2}); }}
                                        title="Use Snack 2"
                                    />
                                    <TitledCheckbox 
                                        status={this.state.usingSnack3 ? "checked" : "unchecked"}
                                        onPress={() => { this.setState({usingSnack3: !this.state.usingSnack3}); }}
                                        title="Use Snack 3"
                                    />
                                    <View style={{  flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'center'}}>
                                        <Subheading>Allowed Meal Repeats</Subheading>
                                        <Menu 
                                            visible={this.state.mealRepeatMenuVisible} 
                                            onDismiss={() => { this.setState({mealRepeatMenuVisible: false}); }} 
                                            anchor={
                                                <TouchableHighlight onPress={() => { this.setState({mealRepeatMenuVisible: true}); }}>
                                                    <Subheading style={{paddingRight: 12}}>{this.state.nAllowedMealRepeats}</Subheading>
                                                </TouchableHighlight>
                                            }
                                        >
                                            <MenuItemList 
                                                startIdx={0} 
                                                endIdx={this.state.nDaysToShow} 
                                                onValSelected={(value) => { 
                                                    this.setState({nAllowedMealRepeats: value, mealRepeatMenuVisible: false});
                                                }}
                                            />
                                        </Menu>
                                    </View>
                                    <View style={{  flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'center'}}>
                                        <Subheading>Length of Meal Plan</Subheading>
                                        <Menu 
                                            visible={this.state.daysToShowMenuVisible} 
                                            onDismiss={() => { this.setState({daysToShowMenuVisible: false}); }} 
                                            anchor={
                                                <TouchableHighlight onPress={() => { this.setState({daysToShowMenuVisible: true}); }}>
                                                    <Subheading style={{paddingRight: 12}}>{this.state.nDaysToShow}</Subheading>
                                                </TouchableHighlight>
                                            }
                                        >
                                            <MenuItemList 
                                                startIdx={1} 
                                                endIdx={14} 
                                                onValSelected={(value) => { 
                                                    this.setState({nDaysToShow: value, daysToShowMenuVisible: false});
                                                }}
                                            />
                                        </Menu>
                                    </View>
                                </ScrollView>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button 
                                    onPress={this.loadPreferences}
                                >
                                CANCEL
                                </Button>
                                <Button 
                                    onPress={this.savePreferences}
                                >
                                DONE
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
            </React.Fragment>
        );
    }
}

function MenuItemList(props) {
    let menuItems = [];
    for (let i = props.startIdx; i <= props.endIdx; i++) {
        menuItems.push(<Menu.Item title={i} key={i} onPress={() => { props.onValSelected(i); }}/>);
    }
    return menuItems;
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

function TitledCheckbox(props) {
    return (
        <View style={{  flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'center'}}>
            <Subheading>{props.title}</Subheading>
            <Checkbox status={props.status} onPress={props.onPress}/>
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
                        {recipe.ingredients.map((ingredient, index) => <List.Item key={index} title={ingredient.item}/>)}
                    </List.Accordion>
                </List.Section>                                    

                <List.Section>
                    <List.Accordion title="Method" description="Tap to see the preparation method">
                        <Paragraph>{recipe.method}</Paragraph>
                    </List.Accordion>
                </List.Section> 

                <List.Section>
                    <List.Accordion title="Nutritional Information" description="Tab to see a table of nutritional information">
                        <RecipeDataTable recipe={recipe}/>
                    </List.Accordion>
                </List.Section>
            </React.Fragment>
        </ScrollView>
    );
}

