import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';


const EditSchedule = React.createClass({
    propTypes: {
        scheduleId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
        return {
            schedule: schedule
        }
    },

    componentWillMount() {
        const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
        this.props.navigation.setParams({headerTitle: schedule.name});
    },

    asyncActions(data = {}){
        if (data.deleted) {
            this.props.navigation.goBack();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules != prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
            this.props.navigation.setParams({headerTitle: this.state.schedule.name});
            this.setState({schedule: schedule});
        }
    },

    _createWorkoutDay() {
        if (this.state.schedule) {
            this.props.navigation.navigate('CreateWorkout', {scheduleId: this.props.scheduleId});
        }
    },

    _toWorkoutDay(workoutId) {
        this.props.navigation.navigate('EditWorkout', {workoutId: workoutId});
    },

    _deleteSchedule() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Schedule',
            `Are you sure you want delete this schedule?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    onPress: () => this.props.actions.deleteSchedule(this.props.scheduleId, this.asyncActions)
                },
            ]
        );
    },


    render: function () {
        let steps = (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <Text>You have no workout blocks. Create Some!</Text>
            </View>
        );
        if (this.state.schedule && this.state.schedule.workouts.length) {
            steps = _.orderBy(this.state.schedule.workouts, ['order']).map((workout, index) => {
                let start_date = moment.utc(workout.dates.start_date).local();
                return <TouchableOpacity key={index} onPress={this._toWorkoutDay.bind(null, workout.id)}
                                         style={[styles.workoutBox]}>

                    {this.state.schedule.training_plan ?
                        <View style={styles.eventDate}>
                            <Text style={styles.eventDateMonth}>{start_date.format("MMM").toUpperCase()}</Text>
                            <Text style={styles.eventDay}>{start_date.date()}</Text>
                        </View>
                        : <View style={styles.eventDate}>
                            <Text style={styles.eventDateMonth}>Weeks</Text>
                            <Text style={styles.eventDay}>{workout.duration}</Text>
                        </View>
                    }
                    <Text style={styles.eventDateDay}>{workout.name}</Text>
                </TouchableOpacity>
            });
        }
        return (
            <View style={styles.flexCenter}>
                <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.contentContainerStyle}>

                    <View style={{marginBottom: 10}}>
                        {steps}
                    </View>

                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.editBlock, {paddingLeft: 10}]} onPress={this._deleteSchedule}>
                        <Icon name="trash" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBlock, {paddingRight: 10}]} onPress={this._createWorkoutDay}>
                        <Icon name="plus-circle" size={20} color={iconColor}/>
                        <Text style={styles.editItemLabel}>Add Block</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
});

// EditSchedule.navigationOptions = ({navigation}) => {
//     const {state, setParams} = navigation;
//     console.log(state.params)
//     return {
//         headerTitle: state.params && state.params.headerTitle ? state.params.headerTitle : null,
//     };
// };

const iconColor = '#8E8E8E';

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    title: {
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        paddingTop:10,
        paddingBottom:10
    },
    workoutBox: {
        flex: 1,
        margin: 5,
        borderColor: '#e1e3df',
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,

        backgroundColor: 'white',
        marginBottom: 5,
    },
    eventDay: {
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        // paddingBottom: 5
    },
    eventDateDay: {
        flex: .8,
        fontSize: getFontSize(28),
        fontFamily: 'OpenSans-Bold',
        // marginLeft: 20,
        // marginTop: 10,
        // marginBottom: 10,
        textAlign: 'center',
    },
    eventDateMonth: {
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(16),
        backgroundColor: 'transparent',
        color: '#4d4d4e'
    },
    eventDate: {
        flex:.2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#e1e3df',
        alignItems: 'center',
        minHeight: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
    },
    editBlock: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
    },
    editItemLabel: {
        fontFamily: 'OpenSans-Semibold',
        fontSize: getFontSize(14),
        color: iconColor,
        textAlign: 'center',
    },
    editItem: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
    }
});


const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(EditSchedule);
