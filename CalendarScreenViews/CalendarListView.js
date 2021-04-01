import React, {Component} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Chip, Appbar, Dialog, Portal, Button, Subheading, Paragraph, List, Headline, DataTable} from "react-native-paper";

import {getAllRecipes} from '../FileStorage/Database';
import {getAllWorkouts} from '../FileStorage/Database';
import RecipeDataTable from '../Components/RecipeDataTable';
import Units from '../Components/Units.json';

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
            recipeDialogVisible: false,
            nDaysToShow: nDays, // number of days to show on the calendar
            dynamicCalendar: [],
            workouts: [],
            recipes: [],
            nReady: 0,
            recipeDialogData: null,
            selectedCards: [],
            shoppingListDialogVisible: false,
            shoppingList: null
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

        this.updateCalendar = () => {
            if (this.state.nReady >= 2){
                
                this.setState({dynamicCalendar: this.setUpDynamicCalendar(this.state.nDaysToShow)});
                
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
            //console.log(this.state.selectedCards.map((c) => c.selectedRecipes.breakfast.title));
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

        //console.log(ingredientHashTable);

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
                </Appbar.Header>
                    <View style={{height: '80%', marginLeft: 5, marginRight: 5}}>
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
                                            { dayOfWeek.selectedRecipes ? 
                                                <CustomChip
                                                    title={dayOfWeek.selectedRecipes.breakfast.title}
                                                    onPress={() => {this.showDialog({type: "recipe", data: dayOfWeek.selectedRecipes.breakfast})}}
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
                    </View>
                    <View style={{margin: 5, flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', height: '20%'}}>
                        <Button 
                            mode="contained" 
                            onPress={this.updateCalendar} 
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
                        {recipe.ingredients.map((ingredient, index) => <List.Item key={index} title={ingredient.item}/>)}
                    </List.Accordion>
                </List.Section>                                    

                <List.Section>
                    <List.Accordion>
                        <Subheading>Method</Subheading>
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

