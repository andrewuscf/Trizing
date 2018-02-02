import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ListView,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import {fetchData, API_ENDPOINT, getFontSize, checkStatus, convertSkill} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';


import CustomIcon from '../../components/CustomIcon';
import CreateWorkout from "../sub/CreateWorkout";


const EditSchedule = CreateClass({
    propTypes: {
        scheduleId: PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
        return {
            schedule: schedule,
            createWorkout: false,
            template_workout: null
        }
    },

    componentDidMount() {
        const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
        if (schedule) {
            this.props.navigation.setParams({headerTitle: schedule.name});
            this.setState({schedule: schedule});
        }
    },

    asyncActions(data = {}) {
        if (data.deleted) {
            this.props.navigation.goBack();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules !== prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
            this.props.navigation.setParams({headerTitle: schedule.name});
            this.setState({schedule: schedule});
        }
    },

    // _deleteSchedule() {
    //     Keyboard.dismiss();
    //     Alert.alert(
    //         'Delete Schedule',
    //         `Are you sure you want delete this schedule?`,
    //         [
    //             {text: 'Cancel', style: 'cancel'},
    //             {
    //                 text: 'Delete',
    //                 onPress: () => this.props.actions.deleteSchedule(this.props.scheduleId, this.asyncActions)
    //             },
    //         ]
    //     );
    // },

    _onWorkoutDelete(workout) {
        fetch(`${API_ENDPOINT}training/workout/${workout.id}/`,
            fetchData('DELETE', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.deleted) {
                    this.props.actions.deleteWorkout(this.state.schedule.id, workout.id);
                } else {
                    console.log(responseJson)
                }
            }).catch((error) => {
            console.log(error)
        });
    },

    renderHeader() {
        const schedule = this.state.schedule;
        const created = moment.utc(schedule.created_at).local().format('MMMM DD YYYY');
        let duration = 0;
        schedule.workouts.forEach((workout) => duration += workout.duration);
        return (
            <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                <Text style={styles.smallBold}>Duration:
                    <Text style={styles.notBold}> {duration} {schedule.duration === 1 ? 'week' : 'weeks'}</Text>
                </Text>
                <Text style={styles.smallBold}>Created: <Text style={styles.notBold}>{created}</Text></Text>
                {schedule.description ?
                    <Text style={styles.smallBold}>Description: <Text
                        style={styles.notBold}>{schedule.description}</Text></Text>
                    : null
                }
                {schedule.cost ?
                    <Text style={styles.smallBold}>Cost: <Text
                        style={styles.notBold}>${parseFloat(schedule.cost).toFixed(2)}</Text></Text> :
                    null
                }
                {schedule.skill_level ?
                    <Text style={styles.smallBold}>Skill level: <Text
                        style={styles.notBold}>{convertSkill(schedule.skill_level)}</Text>
                    </Text>
                    : null
                }
            </View>
        )
    },

    onLongPress(workout) {
        Alert.alert(
            `What would you like to do?`,
            ``,
            [
                {
                    text: 'Duplicate',
                    onPress: () => this.duplicate(workout)
                },
                {
                    text: 'Delete',
                    onPress: () => this._onWorkoutDelete(workout),
                    style: 'destructive'
                },
                {text: 'Cancel', style: 'cancel'},
            ]
        );
    },

    renderRow(workout, index) {
        const parseIndex = parseInt(index);
        let start_date = moment.utc(workout.dates.start_date).local();
        const {navigate} = this.props.navigation;
        return (
            <TouchableOpacity key={parseIndex} onPress={() => navigate('EditWorkout', {
                workoutId: workout.id,
            })} onLongPress={this.onLongPress.bind(null, workout)}
                              style={[styles.workoutBox, GlobalStyle.simpleBottomBorder]}>

                <View style={styles.titleView}>
                    <Text style={styles.simpleTitle}>{workout.name}</Text>
                </View>

                <View style={styles.dateSection}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: .3}}>
                        <CustomIcon name="stopwatch" style={styles.day}/>
                        {this.state.schedule.training_plan ?
                            <Text style={styles.day}> {start_date.format("MMM DD")}</Text>
                            :
                            <Text
                                style={styles.day}> {workout.duration} {workout.duration === 1 ? 'week' : 'weeks'}</Text>
                        }
                    </View>
                </View>

            </TouchableOpacity>
        );
    },

    renderFooter(rowCount) {
        if (this.state.createWorkout) {
            return (
                <View style={[styles.workoutBox, GlobalStyle.simpleBottomBorder]}>
                    <CreateWorkout scheduleId={this.props.scheduleId}
                                   _onWorkoutDelete={this._onWorkoutDelete}
                                   template_workout={this.state.template_workout}
                                   resetCreate={this.resetCreate}/>
                </View>
            )
        }
        if (rowCount !== 0) return null;
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <MaterialIcon name="today" style={[styles.notBold, {fontSize: getFontSize(40), paddingBottom: 20}]}/>
                <Text style={[styles.notBold, {fontSize: getFontSize(22)}]}>Get started by</Text>
                <Text style={[styles.notBold, {fontSize: getFontSize(22)}]}>creating workout blocks</Text>
            </View>
        )
    },

    duplicate(workout) {
        this.setState({createWorkout: true, template_workout: workout});
    },

    onCreatePress() {
        if (this.state.createWorkout) {
            this.resetCreate();
        } else {
            this.setState({createWorkout: true, template_workout: null});
        }
    },

    resetCreate() {
        this.setState({createWorkout: false, template_workout: null});
    },


    render: function () {
        if (!this.state.schedule) return null;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(_.orderBy(this.state.schedule.workouts, '-order'));
        return (
            <View style={styles.flexCenter}>
                <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                          style={[styles.flexCenter]}
                          contentContainerStyle={{paddingBottom: 100}}
                          enableEmptySections={true}
                          dataSource={dataSource}
                          renderHeader={this.renderHeader}
                          renderRow={this.renderRow}
                          renderFooter={this.renderFooter.bind(null, dataSource.getRowCount())}
                />
                <ActionButton buttonColor={this.state.createWorkout ? "red" : "rgba(0, 175, 163, 1)"} position="right"
                              offsetX={10} offsetY={20}
                              onPress={this.onCreatePress} icon={
                    this.state.createWorkout ? <FontIcon name="minus" color="white" size={22}/> : null}/>
            </View>
        )
    },
});


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        backgroundColor: '#f1f1f3'
    },
    title: {
        fontSize: getFontSize(28),
        fontFamily: 'Heebo-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    workoutBox: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 0,
        borderRadius: 7,
    },
    notBold: {
        color: 'grey',
        fontFamily: 'Heebo-Medium',
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
        marginLeft: 5
    },
    day: {
        fontSize: getFontSize(12),
        fontFamily: 'Heebo-Medium',
        color: 'grey'
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    smallBold: {
        fontSize: 16,
        fontFamily: 'Heebo-Bold',
        paddingLeft: 10,
        paddingBottom: 5
    },
    closeButton: {
        backgroundColor: 'white',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 4,
        borderTopWidth: .5,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
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
