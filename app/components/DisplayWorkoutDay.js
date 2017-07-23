import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';
import GlobalStyle from '../containers/globalStyle';


import CustomIcon from '../components/CustomIcon';


const DisplayWorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired,
        _toWorkoutDay: React.PropTypes.func.isRequired,
        active: React.PropTypes.bool,
    },


    render: function () {
        const dayOfWeek = _.find(DAYS_OF_WEEK, {id: this.props.workout_day.day});
        return (
            <TouchableOpacity onPress={this.props._toWorkoutDay.bind(null, this.props.workout_day.id)}
                              style={[styles.displayWorkoutBox, GlobalStyle.simpleBottomBorder, GlobalStyle.simpleTopBorder]}>
                <View style={styles.titleView}>
                    <Text style={styles.simpleTitle}>{this.props.workout_day.name}</Text>
                    {this.props.active ? <FontIcon name="circle" size={20} style={GlobalStyle.lightBlueText}/> : null}
                </View>
                <View style={styles.dateSection}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: .3}}>
                        <Icon name="today" style={styles.day}/><Text style={styles.day}> {dayOfWeek.full_day}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: .7}}>
                        <CustomIcon name="weight" style={styles.day}/>
                        <Text style={[styles.day]}> {this.props.workout_day.exercises.length} {this.props.workout_day.exercises.length === 1 ? 'Exercise' : 'Exercises'}
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
        marginTop: 5,
        borderColor: '#e1e3df',
        borderTopWidth: 1,
        borderBottomWidth: 1,
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
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
    },
    day: {
        fontSize: 12,
        fontFamily: 'OpenSans-Semibold',
        color: 'grey'
    },
});


export default DisplayWorkoutDay;
