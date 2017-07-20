import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';

import GlobalStyle from '../containers/globalStyle';

const MacroBoxDay = React.createClass({
    propTypes: {
        selectedDays: React.PropTypes.array.isRequired,
        planDayIndex: React.PropTypes.number,
        day_plan: React.PropTypes.object,
        getDayState: React.PropTypes.func,
        active: React.PropTypes.bool
    },

    getInitialState() {
        return {
            ...this.props.day_plan,
            days: this.props.day_plan ? this.props.day_plan.days : []
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state != prevState && this.props.getDayState)
            this.props.getDayState(this.props.planDayIndex, this.state)
    },

    _dayToggle(dayId) {
        let updated = this.state.days.slice();
        const dayIndex = updated.indexOf(dayId);
        if (dayIndex != -1) {
            updated = updated.slice(0, dayIndex).concat(updated.slice(dayIndex + 1))
        } else {
            if (!_.includes(this.props.selectedDays, dayId)) {
                updated = updated.concat(dayId);
            }
        }
        this.setState({days: updated});
    },

    verify() {
        return (this.state.day_plan.days.length > 0 && this.state.fats && this.state.protein && this.state.carbs)

    },


    calculateCalories() {
        const fats = (this.state.fats) ? this.state.fats : 0;
        const protein = (this.state.protein) ? this.state.protein : 0;
        const carbs = (this.state.carbs) ? this.state.carbs : 0;
        return (9 * fats) + (4 * protein) + (4 * carbs)
    },

    render() {
        let days = null;
        const day_plan = this.props.day_plan;
        if (day_plan) {
            days = DAYS_OF_WEEK.map((day_of_week) => {
                return (
                    <View key={day_of_week.id}
                          style={[styles.dayOfWeek, (_.includes(day_plan.days, day_of_week.id)
                              ? styles.selectedDay : null )]}>
                        <Text style={[(_.includes(day_plan.days, day_of_week.id) ? styles.selectedDayText : null)]}>
                            {day_of_week.day}
                        </Text>
                    </View>
                )
            });
        } else {
            days = DAYS_OF_WEEK.map((day_of_week) => {
                return (
                    <TouchableOpacity key={day_of_week.id}
                                      onPress={() => {
                                          this._dayToggle(day_of_week.id)
                                      }}
                                      style={[styles.dayOfWeek, (_.includes(this.state.days, day_of_week.id)
                                          ? styles.selectedDay : null )]}>
                        <Text
                            style={[(_.includes(this.state.days, day_of_week.id) ? styles.selectedDayText : null)]}>
                            {day_of_week.day}
                        </Text>
                    </TouchableOpacity>
                )
            });
        }
        return (
            <View
                style={[GlobalStyle.simpleBottomBorder, GlobalStyle.simpleTopBorder, {
                    marginBottom: 10,
                }, this.props.active ? styles.activeBorder : null]}>
                <View style={[styles.inputWrap, styles.row]}>
                    {days}
                </View>
                {day_plan ?
                    <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center'}]}>
                        <View style={styles.details}>
                            <Text style={styles.sectionTitle}>Protein (g)</Text>
                            <Text style={styles.smallText}>{day_plan.protein}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.sectionTitle}>Carbs (g)</Text>
                            <Text style={styles.smallText}>{day_plan.carbs}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.sectionTitle}>Fats (g)</Text>
                            <Text style={styles.smallText}>{day_plan.protein}</Text>
                        </View>
                    </View>
                    :
                    <View style={[styles.inputWrap, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                        <TextInput ref='protein' style={[styles.textInput]} autoCapitalize='none'
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
                        <TextInput ref='carbs' style={[styles.textInput]} autoCapitalize='none'
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
                        <TextInput ref='fats' style={[styles.textInput]} autoCapitalize='none'
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
                }
                <Text style={styles.formCalories}>
                    Total Calories: {this.calculateCalories() ? this.calculateCalories() : 0}
                </Text>
            </View>)
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: getFontSize(20),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
    },
    row: {
        flexDirection: 'row',
    },
    inputWrap: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        flex: 1,
        color: 'black',
        fontSize: getFontSize(17),
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        minHeight: 50,
        borderWidth: .5,
        borderColor: '#aaaaaa',
        textAlign: 'center'
    },
    formCalories: {
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        fontSize: getFontSize(22),
    },
    dayOfWeek: {
        flex: .1,
        borderRadius: 20,
        height: 40,
        marginLeft: 5,
        marginRight: 5,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedDay: {
        backgroundColor: '#1352e2',
    },
    selectedDayText: {
        color: 'white'
    },
    details: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        borderWidth: .5,
        borderColor: '#aaaaaa',
        alignItems: 'center'
    },
    removeDay: {
        height: 35,
        marginTop: 5,
        marginBottom: 8,
        color: 'red',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        alignSelf: 'center',
        textDecorationLine: 'underline',
        textDecorationColor: '#b1aea5'
    },
    activeBorder: {
        borderWidth: 2,
        borderColor: 'green',
    }
});

export default MacroBoxDay;
