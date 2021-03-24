import React, {Component} from 'react';
import {Image, View, Avatar} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Chip, Appbar, Dialog, Portal, Button, Paragraph} from "react-native-paper";

// testing
import Elements from '../CustomProperties/Elements.json';

export default class CalendarListView extends Component {
    constructor(props){
        super(props);
        this.state = {
            dialogVisible: false
        };
        // colours of chips to select from randomly
        this.colours = ['red', '#66CCFF', '#FFCC00', '#1C9379', '#8A7BA7'];
        this.showDialog = () => { this.setState({dialogVisible: true}); }
        this.hideDialog = () => { this.setState({dialogVisible: false}); }
    }

    // showDialog(){
    //     this.setState({dialogVisible: true});
    // }
    // hideDialog(){
    //     this.setState({dialogVisible: false});
    // }

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
                            <Card.Title title="Monday"/>
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