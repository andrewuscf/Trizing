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
        deleteSchedule: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            lastPress: 0,
        }
    },

    _activate() {
        Keyboard.dismiss();
        if (this.props.schedule) {
            Alert.alert(
                'Activate Workout Program Active',
                `Are you sure you want make '${this.props.schedule.name}' active?`,
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Yes', onPress: () => this.props.select(this.props.schedule.id)},
                ]
            );
        }
    },

    _onPress() {
        Keyboard.dismiss();
        this.props._redirect('EditSchedule', {scheduleId: this.props.schedule.id});
    },

    _onDelete() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Workout Program',
            `Are you sure you want delete ${this.props.schedule.name}?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.deleteSchedule(this.props.schedule.id)},
            ]
        );
    },


    render() {
        const schedule = this.props.schedule;
        const created_at = moment.utc(schedule.created_at).local();
        return (
            <TouchableOpacity style={[styles.container]} activeOpacity={0.8} onPress={this._onPress}>

                <View style={styles.center}>
                    {this.props.selected ?
                        <Icon name="check-circle" size={30} color={greenCircle}/> :
                        <TouchableOpacity onPress={this._activate}>
                            <Icon name="circle-thin" size={30} color='#bfbfbf'/>
                        </TouchableOpacity>
                    }
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
        paddingLeft: 18,
        flexWrap: 'wrap',
        flex:1
    },
    date: {
    },
    mainText: {
        fontSize: getFontSize(18),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'Heebo-Medium',
        marginBottom: 5,
        flex:.9
    },
    edit: {
        flex:.05,
        paddingLeft:10,
        paddingRight:10
    },
});

export default WorkoutProgramBox;
