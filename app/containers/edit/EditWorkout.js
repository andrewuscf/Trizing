import React from 'react';
import {
    RefreshControl,
    View,
    Text,
    StyleSheet,
    ListView,
    Platform,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import moment from 'moment';

import {fetchData, API_ENDPOINT, getFontSize, checkStatus} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';

import DisplayWorkoutDay from '../../components/DisplayWorkoutDay';
import Loading from '../../components/Loading';

import CreateWorkoutDay from '../sub/CreateWorkoutDay';


const EditWorkout = React.createClass({
    propTypes: {
        workoutId: React.PropTypes.number,
        workout: React.PropTypes.object,
        _onWorkoutDelete: React.PropTypes.func
    },

    getInitialState() {
        return {
            workout: this.props.workout ? this.props.workout : null,
            refreshing: false
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
        if (this.state.workout != prevState.workout) {
            this.props.navigation.setParams({headerTitle: this.state.workout.name});
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

    _createWorkoutDay() {
        this.props.navigation.navigate('CreateWorkoutDay', {
            workoutId: this.state.workout.id,
            newDay: this.newDay,
            _onDayDelete: this._onDayDelete
        });
    },

    _toWorkoutDay(workout_day_id) {
        this.props.navigation.navigate('EditWorkoutDay', {
            workout_day_id: workout_day_id,
            _onDayDelete: this._onDayDelete
        });
    },

    _onDuplicate(template_day) {
        this.props.navigation.navigate('CreateWorkoutDay', {
            workoutId: this.state.workout.id,
            newDay: this.newDay,
            template_day: template_day,
            _onDayDelete: this._onDayDelete
        });
    },

    _delete() {
        Alert.alert(
            `Delete ${this.state.workout ? this.state.workout.name : 'workout'}`,
            `Are you sure you want delete this workout?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    onPress: () => {

                        fetch(`${API_ENDPOINT}training/workout/${this.state.workout.id}/`,
                            fetchData('DELETE', null, this.props.UserToken))
                            .then(checkStatus)
                            .then((responseJson) => {
                                if (responseJson.deleted) {
                                    this.props._onWorkoutDelete(this.state.workout.id);
                                    this.props.navigation.goBack();
                                } else {
                                    console.log(responseJson)
                                }
                            }).catch((error) => {
                            console.log(error)
                        });
                    }
                },
            ]
        );
    },

    _onDayDelete(dayId) {
        const workoutIndex = _.findIndex(this.state.workout.workout_days, {id: dayId});
        if (workoutIndex !== -1) {
            this.setState({
                workout: {
                    ...this.state.workout,
                    workout_days: this.state.workout.workout_days.slice(0, workoutIndex)
                        .concat(this.state.workout.workout_days.slice(workoutIndex + 1))
                }
            })
        }
    },


    renderHeader() {
        const workout = this.state.workout;
        const created = moment.utc(workout.created_at).local().format('MMMM DD YYYY');
        return (
            <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                <Text style={styles.smallBold}>Duration:
                    <Text style={styles.notBold}> {workout.duration} {workout.duration == 1 ? 'week' : 'weeks'}</Text>
                </Text>
                <Text style={styles.smallBold}>Created: <Text style={styles.notBold}>{created}</Text></Text>
            </View>
        )
    },

    renderRow(workout_day, index) {
        const intIndex = parseInt(index);
        return <DisplayWorkoutDay key={intIndex} _toWorkoutDay={this._toWorkoutDay} workout_day={workout_day}
                                  _onDuplicate={this._onDuplicate}
                                  dayIndex={intIndex}/>
    },

    renderFooter(rowCount) {
        if (rowCount !== 0) return null;
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <MaterialIcon name="today" style={[styles.notBold, {fontSize: getFontSize(40), paddingBottom: 20}]}/>
                <Text style={[styles.notBold, {fontSize: getFontSize(20)}]}>Get started by</Text>
                <Text style={[styles.notBold, {fontSize: getFontSize(20)}]}>creating workout days</Text>
            </View>
        )
    },


    render: function () {
        if (!this.state.workout) return <Loading/>;
        let workout_days = [];
        if (this.state.workout.workout_days) {
            workout_days = _.orderBy(this.state.workout.workout_days, (workout_day) => {
                return workout_day.day
            });
        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(workout_days);
        return (
            <View style={{flex: 1, backgroundColor: '#f1f1f3'}}>
                <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                          style={[styles.flexCenter]}
                          contentContainerStyle={styles.contentContainerStyle}
                          enableEmptySections={true}
                          dataSource={dataSource}
                          renderHeader={this.renderHeader}
                          renderRow={this.renderRow}
                          renderFooter={this.renderFooter.bind(null, dataSource.getRowCount())}
                          refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                          onRefresh={() => this.getWorkout(true)}/>}
                />
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                    <ActionButton.Item buttonColor='#F22525' title="Delete"
                                       onPress={this._delete}>
                        <MaterialIcon name="delete-forever" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Add Note" onPress={() => console.log('add note')}>
                        <MaterialIcon name="note-add" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Add Training Day"
                                       onPress={this._createWorkoutDay}>
                        <MaterialIcon name="add" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    contentContainerStyle: {
        paddingBottom: 50
    },
    title: {
        fontSize: 24,
        fontFamily: 'Heebo-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
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
