import React, {Component} from 'react';
import {Image, View, Avatar} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Chip, Appbar, Dialog, Portal, Button, Paragraph} from "react-native-paper";

// testing
import Elements from '../CustomProperties/Elements.json';

export default class CalendarListView extends Component {
    constructor(props){
        super(props);
        // colours of chips to select from randomly
        this.colours = ['red', '#66CCFF', '#FFCC00', '#1C9379', '#8A7BA7'];
        this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        // For testing. This value should be set by the user. Number of days to show on the calendar.
        let nDays = 7;

        let nextNDays = this.setUpDynamicCalendar(nDays);

        this.state = {
            dialogVisible: false,
            nDaysToShow: nDays, // number of days to show on the calendar
            dynamicCalendar: nextNDays
        };

        console.log(this.state.dynamicCalendar);
        
        this.showDialog = () => { this.setState({dialogVisible: true}); }
        this.hideDialog = () => { this.setState({dialogVisible: false}); }
    }

    setUpDynamicCalendar(nDays) {
        let cal = new Date();
        let nextNDays = new Array(nDays);
        
        for (let i = 0; i < nextNDays.length; i++){

            let date_ext;
            switch (cal.getDate() + i) {
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

            nextNDays[i] = {
                day: this.days[(cal.getDay() + i - 1) % 7],
                date: (cal.getDate() + i) % this.daysInMonth[cal.getMonth()], 
                date_ext: date_ext
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
                                        {Elements.map((e) => {
                                            return (
                                            <View style={{margin: 1}} key={e.id}>
                                                <Chip 
                                                    mode="outlined" 
                                                    style={{backgroundColor: this.randomColour()}}
                                                    textStyle={{color:'white'}}
                                                    onPress={this.showDialog}
                                                >
                                                    {e.title}
                                                </Chip>
                                            </View>);
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