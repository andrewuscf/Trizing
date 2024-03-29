import React from 'react';
const CreateClass = require('create-react-class');
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';


const DaysOfWeek = CreateClass({
    propTypes: {
        daySelectedState: PropTypes.func,
        days: PropTypes.array.isRequired,
        selectedDays: PropTypes.array,
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
            if (!this.props.daySelectedState) {
                return (
                    <View key={day_of_week.id}
                          style={[styles.dayOfWeek, (_.includes(this.props.days, day_of_week.id)
                              ? styles.selectedDay : null )]}>
                        <Text style={[(_.includes(this.props.days, day_of_week.id) ? styles.selectedDayText : null)]}>
                            {day_of_week.day}
                        </Text>
                    </View>
                )
            }
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
            <View style={[styles.wrap, styles.row]}>
                {days}
            </View>
        )
    }
});


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    wrap: {
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    dayOfWeek: {
        width: '13%',
        padding: '3%',
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
