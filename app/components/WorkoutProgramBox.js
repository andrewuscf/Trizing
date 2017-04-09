import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';

import {getFontSize} from '../actions/utils';


const WorkoutProgramBox = React.createClass({
    propTypes: {
        schedule: React.PropTypes.object.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        select: React.PropTypes.func,
        selected: React.PropTypes.bool,
        deleteWorkout: React.PropTypes.func
    },

    getInitialState() {
        return {
            lastPress: 0,
        }
    },

    _onLongPress() {
        Keyboard.dismiss();
        this.props.select(this.props.schedule.id);
    },

    _onPress() {
        Keyboard.dismiss();
        // this.props._redirect('WorkoutDayDetail')
    },

    _onDelete() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Macro Plan',
            `Are you sure you want delete ${this.props.schedule.name}?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.deleteWorkout(this.props.schedule.id)},
            ]
        );
    },


    render() {
        const schedule = this.props.schedule;
        const created_at = moment.utc(schedule.created_at).local();
        return (
            <TouchableOpacity style={[styles.container]}
                              onLongPress={this._onLongPress}
                              activeOpacity={0.8}
                              onPress={this._onPress}>

                <View style={styles.center}>
                    {this.props.selected ? <Icon name="check-circle" size={30} color={greenCircle}/> :
                        <Icon name="circle-thin" size={30} color='#bfbfbf'/>}
                    <View style={styles.details}>
                        <Text style={styles.mainText}>{schedule.name}</Text>
                        <Text style={styles.date}>
                            <Icon name="clock-o" size={12} color='#4d4d4e'
                            /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.edit} onPress={this._onDelete}>
                        <Icon name="times" size={20} color="red"/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        marginTop: 10,
        backgroundColor: 'white'
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18
    },
    date: {
        fontSize: getFontSize(15),
        lineHeight: getFontSize(26),
    },
    mainText: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold'
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: 10
    },
});

export default WorkoutProgramBox;
