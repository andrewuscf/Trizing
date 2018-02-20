import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    RefreshControl,
    View,
    Text,
    StyleSheet,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

import {fetchData, API_ENDPOINT, getFontSize, checkStatus} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';

import DisplayWorkoutDay from '../../components/DisplayWorkoutDay';
import Loading from '../../components/Loading';

import CreateWorkoutDay from '../sub/CreateWorkoutDay';


const EditWorkout = CreateClass({
    propTypes: {
        workoutId: PropTypes.number,
        workout: PropTypes.object,
    },

    getInitialState() {
        return {
            workout: this.props.workout ? this.props.workout : null,
            refreshing: false,
            create: false,
            template_day: null,
        }
    },

    componentDidMount() {
        if (!this.props.workout) {
            this.getWorkout();
        }
    },


    getWorkout(refresh) {
        if (refresh) this.setState({refreshing: true});

        fetch(`${API_ENDPOINT}training/workout/${this.props.workoutId}/`,
            fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {

                let newState = {refreshing: false};
                if (responseJson.id) {
                    newState = {
                        ...newState,
                        workout: responseJson
                    }
                }
                this.setState(newState);
            }).catch((error) => {
            console.log(error)
        });
    },


    componentDidUpdate(prevProps, prevState) {
        if (this.state.workout !== prevState.workout) {
            this.props.navigation.setParams({headerTitle: this.state.workout.name});
        }
        if (this.state.create && this.state.create !== prevState.create) {
            this.flatList.scrollToEnd();
        }
    },

    newDay(training_day) {
        this.setState({
            workout: {
                ...this.state.workout,
                workout_days: [
                    ...this.state.workout.workout_days,
                    training_day
                ]
            }
        });
    },

    _toWorkoutDay(workout_day_id) {
        this.props.navigation.navigate('EditWorkoutDay', {
            workout_day_id: workout_day_id,
        });
    },

    onLongPress(day) {
        Alert.alert(
            `What would you like to do?`,
            ``,
            [
                {
                    text: 'Duplicate',
                    onPress: () => this._onDuplicate(day)
                },
                {
                    text: 'Delete',
                    onPress: () => this._onDayDelete(day),
                    style: 'destructive'
                },
                {text: 'Cancel', style: 'cancel'},
            ]
        );
    },

    _onDayDelete(day) {
        fetch(`${API_ENDPOINT}training/workout/day/${day.id}/`,
            fetchData('DELETE', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.deleted) {
                    const workoutIndex = _.findIndex(this.state.workout.workout_days, {id: day.id});
                    if (workoutIndex !== -1) {
                        this.setState({
                            workout: {
                                ...this.state.workout,
                                workout_days: this.state.workout.workout_days.slice(0, workoutIndex)
                                    .concat(this.state.workout.workout_days.slice(workoutIndex + 1))
                            }
                        })
                    }
                } else {
                    console.log(responseJson)
                }
            }).catch((error) => {
            console.log(error)
        });
    },


    renderHeader() {
        const workout = this.state.workout;
        const created = moment.utc(workout.created_at).local().format('MMMM DD YYYY');
        return (
            <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                <Text style={styles.smallBold}>Duration:
                    <Text style={styles.notBold}> {workout.duration} {workout.duration === 1 ? 'week' : 'weeks'}</Text>
                </Text>
                <Text style={styles.smallBold}>Created: <Text style={styles.notBold}>{created}</Text></Text>
            </View>
        )
    },

    renderRow(object) {
        const workout_day = object.item;
        const index = object.index;
        return <DisplayWorkoutDay key={index} _toWorkoutDay={this._toWorkoutDay} workout_day={workout_day}
                                  onLongPress={this.onLongPress}
                                  dayIndex={index}/>
    },

    renderFooter(rowCount) {
        if (this.state.create) {
            return (
                <CreateWorkoutDay workoutId={this.state.workout.id}
                                  template_day={this.state.template_day}
                                  resetCreate={this.resetCreate}
                                  newDay={this.newDay}/>
            )
        } else if (rowCount !== 0) return null;
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <MaterialIcon name="today" style={[styles.notBold, {fontSize: getFontSize(40), paddingBottom: 20}]}/>
                <Text style={[styles.notBold, {fontSize: getFontSize(20)}]}>Get started by</Text>
                <Text style={[styles.notBold, {fontSize: getFontSize(20)}]}>creating workout days</Text>
            </View>
        )
    },

    _onDuplicate(template_day) {
        this.setState({create: true, template_day: template_day});
    },

    _onCreatePress() {
        if (this.state.create) {
            this.resetCreate();
        } else {
            this.setState({create: true, template_day: null});
        }
    },

    resetCreate() {
        this.setState({create: false, template_day: null});
    },

    render: function () {
        if (!this.state.workout) return <Loading/>;
        let workout_days = [];
        if (this.state.workout.workout_days) {
            workout_days = _.orderBy(this.state.workout.workout_days, (workout_day) => {
                return workout_day.day
            });
        }
        return (
            <View style={{flex: 1, backgroundColor: '#f1f1f3'}}>
                <KeyboardAwareFlatList removeClippedSubviews={false}
                                       style={{flex:1}}
                                       ref={ref => this.flatList = ref}
                                       keyboardDismissMode='interactive'
                                       keyboardShouldPersistTaps='always'
                                       showsVerticalScrollIndicator={false}
                                       ListHeaderComponent={this.renderHeader}
                                       ListFooterComponent={this.renderFooter}
                                       contentContainerStyle={styles.contentContainerStyle}
                                       data={workout_days}
                                       refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                                       onRefresh={() => this.getWorkout(true)}/>}
                                       renderItem={this.renderRow} extraData={this.state}
                                       keyExtractor={(item, index) => index}/>
                <ActionButton buttonColor={this.state.create ? "red" : "rgba(0, 175, 163, 1)"}
                              position="right" offsetX={10} offsetY={20}
                              onPress={this._onCreatePress}
                              icon={this.state.create ? <FontIcon name="minus" color="white" size={22}/> : null}/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    contentContainerStyle: {
        paddingBottom: 100
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
    notBold: {
        color: 'grey',
        fontFamily: 'Heebo-Medium',
    }
});


const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken,
    };
};


export default connect(stateToProps, null)(EditWorkout);
