import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';

import GlobalStyle from '../containers/globalStyle';

const DaysOfWeek = React.createClass({
    propTypes: {
        daySelectedState: React.PropTypes.func.isRequired,
        days: React.PropTypes.array.isRequired,
        selectedDays: React.PropTypes.array
    },

    getInitialState() {
        return {
            days: this.props.days ? this.props.days : []
        }
    },

    _dayToggle(dayId) {
        let updated = this.props.days.slice();
        const dayIndex = updated.indexOf(dayId);
        if (dayIndex != -1) {
            updated = updated.slice(0, dayIndex).concat(updated.slice(dayIndex + 1))
        } else {
            if (this.props.selectedDays && !_.includes(this.props.selectedDays, dayId)) {
                updated = updated.concat(dayId);
            } else if (!this.props.selectedDays) {
                updated = updated.concat(dayId);
            }
        }
        this.props.daySelectedState(updated)
    },

    render() {
        const days = DAYS_OF_WEEK.map((day_of_week) => {
            return (
                <TouchableOpacity key={day_of_week.id}
                                  onPress={() => {
                                      this._dayToggle(day_of_week.id)
                                  }}
                                  style={[styles.dayOfWeek, (_.includes(this.props.days, day_of_week.id)
                                      ? styles.selectedDay : null )]}>
                    <Text
                        style={[(_.includes(this.props.days, day_of_week.id) ? styles.selectedDayText : null)]}>
                        {day_of_week.day}
                    </Text>
                </TouchableOpacity>
            )
        });
        return (
            <View style={[styles.inputWrap, {height: 50}, styles.row]}>
                {days}
            </View>
        )
    }
});


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    inputWrap: {
        marginBottom: 12,
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center'
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
});

export default DaysOfWeek;
