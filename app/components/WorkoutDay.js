import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';


var WorkoutDay = React.createClass({
    propTypes: {
        // closeWorkoutModal: React.PropTypes.func.isRequired,
        // createWorkout: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            name: null,
            numberOfExercises: 1,
            exercises: []
        }
    },

    // _onDayChange(index, event) {
    //     const text = event.nativeEvent.text;
    //     let days = this.state.days;
    //     days[index] = {text: text};
    //     this.setState({
    //         days: days
    //     });
    // },


    render: function () {
        return (
            <View>
                <Text style={styles.inputLabel}>Name of Day</Text>
                <View
                    style={[styles.inputWrap]}>
                    <TextInput ref={`day`}
                               style={[styles.textInput]}
                               multiline={true}
                               underlineColorAndroid='transparent'
                               autoCapitalize='sentences'
                               placeholderTextColor='#4d4d4d'
                               onChangeText={(text) =>this.setState({last_name: text})}
                               value={this.state.name}
                               placeholder="'Pull day, 'Monday' or 'Day One'"/>
                </View>
            </View>
        )
    }
});


var styles = StyleSheet.create({
    inputWrap: {
        marginBottom: 12,
        height: 30,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        alignItems: 'center'
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30
    },
    inputLabel: {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold'
    }
});


export default WorkoutDay;
