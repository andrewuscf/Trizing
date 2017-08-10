import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    Platform,
    ListView,
    Alert,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import {trunc, fetchData, API_ENDPOINT, checkStatus, getFontSize} from '../../actions/utils';
import {DAYS_OF_WEEK} from '../../assets/constants';

import CustomIcon from '../../components/CustomIcon';
import DisplayExerciseBox from '../../components/trainer/DisplayExerciseBox';
import Loading from '../../components/Loading';

const EditWorkoutDay = React.createClass({
    propTypes: {
        _onDayDelete: React.PropTypes.func.isRequired,
        workout_day_id: React.PropTypes.number,
        workout_day: React.PropTypes.object
    },

    getInitialState() {
        return {
            Error: null,
            workout_day: this.props.workout_day,
            refreshing: false,
        }
    },

    componentDidMount() {
        if (!this.props.workout_day) {
            this.getWorkoutDay();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.workout_day !== prevState.workout_day) {
            const dayOfWeek = _.find(DAYS_OF_WEEK, {id: this.state.workout_day.day});
            this.props.navigation.setParams({headerTitle: `${trunc(this.state.workout_day.name, 14)} (${dayOfWeek.day})`})
        }
    },

    getWorkoutDay(refresh) {
        if (refresh) this.setState({refreshing: true});

        fetch(`${API_ENDPOINT}training/workout/day/${this.props.workout_day_id}/`,
            fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                let newState = {refreshing: false};
                if (responseJson.id) {
                    newState = {
                        ...newState,
                        workout_day: responseJson
                    }
                }
                this.setState(newState);
            }).catch((error) => {
            console.log(error)
        })
    },

    _delete() {
        Alert.alert(
            `Delete ${this.state.workout_day ? this.state.workout_day.name : 'workout'}`,
            `Are you sure you want delete this workout day?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    onPress: () => {
                        fetch(`${API_ENDPOINT}training/workout/day/${this.state.workout_day.id}/`,
                            fetchData('DELETE', null, this.props.UserToken))
                            .then(checkStatus)
                            .then((responseJson) => {
                                if (responseJson.deleted) {
                                    this.props._onDayDelete(this.state.workout_day.id);
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

    newDay(workout_day) {
        this.setState({workout_day});
    },

    _addExercise() {
        this.props.navigation.navigate('CreateExercise', {workout_day: this.state.workout_day, newDay: this.newDay});
    },

    _editExercise(exercise) {
        this.props.navigation.navigate('CreateExercise', {
            workout_day: this.state.workout_day,
            exercise: exercise,
            newDay: this.newDay
        });
    },


    renderHeader() {
        return (
            <Text style={[styles.header]}>Exercises</Text>
        )
    },

    deleteSetActions(success, data) {
        if (success) {
            this.newDay(data);
        }
    },

    deleteSet(setId) {
        this.props.actions.deleteSet(setId, this.deleteSetActions)
    },


    render: function () {
        if (!this.state.workout_day) return <Loading/>;

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.workout_day.exercises);

        return (
            <View style={styles.container}>

                {!this.state.workout_day.exercises.length ?
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                        <Text>Create Exercises!</Text>
                    </View> :

                    <ListView ref='workout_day_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                              keyboardShouldPersistTaps="handled"
                              refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                              onRefresh={() => this.getWorkoutDay(true)}/>}
                              enableEmptySections={true}
                              dataSource={dataSource}
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={{paddingBottom: 20}}
                              renderRow={(exercise, sectionID, rowID) =>
                                  <DisplayExerciseBox exercise={exercise}
                                                      _editExercise={this._editExercise}
                                                      deleteSet={this.deleteSet}/>
                              }
                    />
                }

                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right" offsetX={10} offsetY={20}>
                    <ActionButton.Item buttonColor='#F22525' title="Delete"
                                       onPress={this._delete}>
                        <MaterialIcon name="delete-forever" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Add Note" onPress={() => console.log('add note')}>
                        <MaterialIcon name="note-add" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Add Exercise"
                                       onPress={this._addExercise}>
                        <CustomIcon name="weight" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>
                </ActionButton>

            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f3'
    },
    header: {
        fontSize: 26,
        fontFamily: 'Heebo-Medium',
        textAlign: 'center',
        borderBottomWidth: .5,
        borderColor: '#e1e3df',
    },
    day: {
        fontSize: 28,
        fontFamily: 'Heebo-Bold',
        paddingLeft: 20
    },
    dayTop: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,

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

export default connect(stateToProps, dispatchToProps)(EditWorkoutDay);
