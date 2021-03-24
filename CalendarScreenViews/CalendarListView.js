import React, {Component} from 'react';
import {Image, View, Avatar} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Chip, Appbar} from "react-native-paper";

// testing
import Elements from '../CustomProperties/Elements.json';

export default class CalendarListView extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            
        };
        
        this.colours = ['red', '#66CCFF', '#FFCC00', '#1C9379', '#8A7BA7'];
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
                        <Card>
                            <Card.Content>
                                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                                    {Elements.map((e) => {
                                        return (
                                        <View style={{margin: 1}} key={e.id}>
                                            <Chip 
                                                mode="outlined" 
                                                style={{backgroundColor: this.randomColour()}}
                                                textStyle={{color:'white'}} 
                                            >
                                                {e.title}
                                            </Chip>
                                        </View>);
                                    })}
                                </View>
                            </Card.Content>
                        </Card>
                    </ScrollView>
            </React.Fragment>
        );
    }
}