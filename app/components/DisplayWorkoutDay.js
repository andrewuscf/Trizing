import React from 'react';
const CreateClass = require('create-react-class');
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';
import GlobalStyle from '../containers/globalStyle';

import CustomIcon from '../components/CustomIcon';


const DisplayWorkoutDay = CreateClass({
    propTypes: {
        workout_day: PropTypes.object.isRequired,
        dayIndex: PropTypes.number.isRequired,
        _toWorkoutDay: PropTypes.func.isRequired,
        active: PropTypes.bool,
        onLongPress: PropTypes.func
    },

    onLongPress() {
        if (this.props.onLongPress) {
            this.props.onLongPress(this.props.workout_day);
        }
    },


    render: function () {
        const workout_day = this.props.workout_day;
        const dayOfWeek = _.find(DAYS_OF_WEEK, {id: workout_day.day});
        return (
            <TouchableOpacity onPress={this.props._toWorkoutDay.bind(null, workout_day.id)} onLongPress={this.onLongPress}
                              style={[styles.displayWorkoutBox, GlobalStyle.simpleBottomBorder]}>
                <View style={styles.titleView}>
                    <Text style={styles.simpleTitle}>{workout_day.name}</Text>
                    {this.props.active ? <FontIcon name="circle" size={20} style={GlobalStyle.lightBlueText}/> : null}
                </View>
                <View style={styles.dateSection}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: .3}}>
                        <MaterialIcon name="today" style={styles.day}/><Text
                        style={styles.day}> {dayOfWeek.full_day}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: .7}}>
                        <CustomIcon name="weight" style={styles.day}/>
                        <Text
                            style={[styles.day]}> {workout_day.exercises_count ? workout_day.exercises_count : 0} {workout_day.exercises_count === 1 ? 'Exercise' : 'Exercises'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    dateSection: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        paddingTop: 5,
        borderColor: '#e1e3df',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Bold',
    },
    day: {
        fontSize: getFontSize(12),
        fontFamily: 'Heebo-Medium',
        color: 'grey'
    },
});


export default DisplayWorkoutDay;
