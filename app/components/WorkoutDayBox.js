import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
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

const MacroBoxDay = CreateClass({
    propTypes: {
        getDayState: PropTypes.func.isRequired,
        selectedDays: PropTypes.array.isRequired,
        planDayIndex: PropTypes.number,
        day_plan: PropTypes.object
    },

    getInitialState() {
        return {
            ...this.props.day_plan,
            days: this.props.day_plan ? this.props.day_plan.days : []
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
                    <TouchableOpacity key={day_of_week.id}
                                      style={[styles.dayOfWeek, (_.includes(day_plan.days, day_of_week.id)
                                          ? styles.selectedDay : null )]}>
                        <Text style={[(_.includes(day_plan.days, day_of_week.id) ? styles.selectedDayText : null)]}>
                            {day_of_week.day}
                        </Text>
                    </TouchableOpacity>
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
            <View>
                <View style={[styles.inputWrap, {height: 50}, styles.row]}>
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
        fontFamily: 'Heebo-Bold',
    },
    row: {
        flexDirection: 'row',
    },
    inputWrap: {
        marginBottom: 12,
        height: 30,
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        color: 'black',
        fontSize: getFontSize(17),
        fontFamily: 'Heebo-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30,
        borderWidth: .5,
        borderColor: '#aaaaaa',
        textAlign: 'center'
    },
    formCalories: {
        fontFamily: 'Heebo-Bold',
        alignSelf: 'center',
        // padding: 10,
        paddingTop: 10,
        fontSize: getFontSize(22),
        // lineHeight: getFontSize(26),
    },
    dayOfWeek: {
        borderWidth: .5,
        borderRadius: 20,
        height: 40,
        width: 40,
        marginLeft: 10,
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
});

export default MacroBoxDay;
