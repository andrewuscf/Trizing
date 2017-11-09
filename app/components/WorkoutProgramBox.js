import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Keyboard,
    Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {getFontSize} from '../actions/utils';


const WorkoutProgramBox = CreateClass({
    propTypes: {
        schedule: PropTypes.object.isRequired,
        _redirect: PropTypes.func.isRequired,
        select: PropTypes.func,
        selected: PropTypes.bool,
        deleteSchedule: PropTypes.func.isRequired
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
                'Activate Workout Program',
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
            <TouchableOpacity style={[styles.container]} activeOpacity={0.8} onPress={this._onPress} onLongPress={this._onDelete}>

                <View style={styles.center}>
                    <View style={styles.details}>
                        <Text style={styles.mainText}>{schedule.name}</Text>
                        <Text style={styles.date}>
                            <Icon name="clock-o" size={12} color='#4d4d4e'
                            /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                        </Text>
                    </View>
                    <Switch value={this.props.selected}
                            onValueChange={this._activate} onTintColor='#00AFA3'/>
                </View>
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: '#e1e3df',
        borderWidth: 1,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18,
        flex: 1
    },
    date: {},
    mainText: {
        fontSize: getFontSize(18),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'Heebo-Medium',
        marginBottom: 5,
        flex: .9
    },
});

export default WorkoutProgramBox;
