import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';

const MacroBoxDay = React.createClass({
    propTypes: {
        getDayState: React.PropTypes.func.isRequired,
        selectedDays: React.PropTypes.array.isRequired,
        day_plan: React.PropTypes.object
    },

    getInitialState() {
        return {
            ...this.props.day_plan,
            days: this.props.day_plan ? this.props.days_plan.days : []
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state != prevState)
            this.props.getDayState(this.props.planDayIndex, this.state)
    },

    _dayToggle(dayId) {
        let updated = this.state.days.slice();
        const dayIndex = updated.indexOf(dayId);
        if (dayIndex != -1) {
            updated = updated.slice(0, dayIndex).concat(updated.slice(dayIndex + 1))
        } else {
            updated = updated.concat(dayId);
        }
        this.setState({days: updated});
    },

    verify() {
        return (this.state.day_plan.days.length > 0 && this.state.fats && this.state.protein && this.state.carbs)

    },


    calculateCalories() {
        return (9 * this.state.fats) + (4 * this.state.protein) + (4 * this.state.carbs)
    },

    render() {
        if (this.props.day_plan && this.state.showDetails) {
            const day_plan = this.props.day_plan;
            return (
                <View style={[styles.center, {borderTopWidth: 1, borderColor: '#e1e3df', paddingTop: 10}]}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.smallText}>Protein (g)</Text>
                        <Text style={styles.smallText}>{day_plan.protein}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.smallText}>Carbs (g)</Text>
                        <Text style={styles.smallText}>{day_plan.carbs}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.smallText}>Fats (g)</Text>
                        <Text style={styles.smallText}>{day_plan.protein}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.smallText}>Calories</Text>
                        <Text
                            style={styles.smallText}>{this.calculateCalories() ? this.calculateCalories() : 0}</Text>
                    </View>
                </View>
            )
        }


        const days = DAYS_OF_WEEK.map((day_of_week) => {
            if (!_.includes(this.props.selectedDays, day_of_week.id)) {
                return (
                    <TouchableOpacity key={day_of_week.id} onPress={() => {this._dayToggle(day_of_week.id)}}
                                      style={[styles.dayOfWeek, (_.includes(this.state.days, day_of_week.id) ? styles.selectedDay: null )]}>
                        <Text style={[(_.includes(this.state.days, day_of_week.id) ? styles.selectedDayText: null)]}>
                            {day_of_week.day}
                        </Text>
                    </TouchableOpacity>
                )
            }
        });
        return (
            <View>
                <View style={[styles.inputWrap, {flexDirection: 'row', height: 50, justifyContent: 'space-between'}]}>
                    {days}
                </View>
                <View style={[styles.inputWrap, {flexDirection: 'row'}]}>
                    <TextInput ref='protein' style={[styles.textInput, {flex: 1}]} autoCapitalize='none'
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text) => this.setState({protein: text})}
                               value={this.state.protein}
                               onSubmitEditing={(event) => {
                                       this.refs.carbs.focus();
                                   }}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Protein (g)"/>
                    <TextInput ref='carbs' style={[styles.textInput, {flex: 1}]} autoCapitalize='none'
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text) => this.setState({carbs: text})}
                               value={this.state.carbs}
                               onSubmitEditing={(event) => {
                                       this.refs.fats.focus();
                                   }}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Carbs (g)"/>
                    <TextInput ref='fats' style={[styles.textInput, {flex: 1}]} autoCapitalize='none'
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text) => this.setState({fats: text})}
                               value={this.state.fats}
                               onSubmitEditing={(event) => {
                                       // this.refs[`protein_${x + 1}`].focus();
                                }}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Fat (g)"/>
                </View>

                <Text style={styles.formCalories}>
                    CALORIES: {this.calculateCalories() ? this.calculateCalories() : 0}
                </Text>
            </View>)
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
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
    formCalories: {
        fontFamily: 'OpenSans-Bold'
    },
    dayOfWeek: {
        borderWidth: .5,
        borderRadius: 20,
        height: 40,
        width: 40,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedDay: {
        backgroundColor: '#1352e2',
    },
    selectedDayText: {
        color: 'white'
    }
});

export default MacroBoxDay;
