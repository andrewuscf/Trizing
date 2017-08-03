import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import {getFontSize} from '../actions/utils';
import {DAYS_OF_WEEK} from '../assets/constants';
import GlobalStyle from '../containers/globalStyle';


import CustomIcon from '../components/CustomIcon';


const DisplayWorkoutDay = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        dayIndex: React.PropTypes.number.isRequired,
        _toWorkoutDay: React.PropTypes.func.isRequired,
        _onDuplicate: React.PropTypes.func,
        active: React.PropTypes.bool,
    },


    render: function () {
        const workout_day = this.props.workout_day;
        const dayOfWeek = _.find(DAYS_OF_WEEK, {id: workout_day.day});
        return (
            <TouchableOpacity onPress={this.props._toWorkoutDay.bind(null, workout_day.id)}
                              style={[styles.displayWorkoutBox, GlobalStyle.simpleBottomBorder, GlobalStyle.simpleTopBorder]}>
                <View style={styles.titleView}>
                    <Text style={styles.simpleTitle}>{workout_day.name}</Text>
                    {typeof this.props._onDuplicate !== 'undefined' ?
                        <Menu >
                            <MenuTrigger>
                                <FontIcon name="ellipsis-h" size={getFontSize(35)}/>
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption onSelect={this.props._onDuplicate.bind(null, this.props.workout_day)} text='Duplicate'/>
                            </MenuOptions>
                        </Menu>
                        : null
                    }
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

const optionsStyles = {
    optionsContainer: {
        paddingTop: 5,
    },
    optionsWrapper: {},
    optionWrapper: {
        margin: 5,
    },
    optionTouchable: {
        activeOpacity: 70,
    },
    optionText: {},
};


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        borderColor: '#e1e3df',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
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
