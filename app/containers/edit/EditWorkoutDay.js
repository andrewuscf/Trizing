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
import GlobalStyle from '../../containers/globalStyle';

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

    _editExercise(set_group) {
        this.props.navigation.navigate('CreateExercise', {
            workout_day: this.state.workout_day,
            set_group: set_group,
            newDay: this.newDay
        });
    },


    renderHeader() {
        if (!this.state.workout_day.notes.length) {
            return null;
        }
        return (
            <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                <Text style={styles.smallBold}>Notes:</Text>
                {this.state.workout_day.notes.map((note, i) =>
                    <Text key={i} style={[{
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingBottom: 10
                    }, styles.notBold]}>{i + 1}. {note.text}</Text>)
                }
            </View>
        )
    },

    deleteSetActions(success, data) {
        if (success) {
            this.newDay(data);
        }
    },

    deleteSetGroup(setId) {
        this.props.actions.deleteSetGroup(setId, this.deleteSetActions)
    },

    _onNoteAdded(newNote) {
        this.setState({
            ...this.state.workout_day,
            notes: this.state.workout_day.notes ? [
                ...this.state.workout_day.notes,
                newNote
            ] : [newNote]
        });
    },

    addNote(exercise) {
        if (exercise) {
            this.props.navigation.navigate('CreateNote', {
                type: 'training day',
                object_id: this.state.workout_day.id,
                title: exercise.name,
                exerciseId: exercise.id,
                noteAdded: this._onNoteAdded
            });
        } else {
            this.props.navigation.navigate('CreateNote', {
                type: 'training day',
                object_id: this.state.workout_day.id,
                title: this.state.workout_day.name,
                noteAdded: this._onNoteAdded
            });
        }
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
                              renderHeader={this.renderHeader}
                              showsVerticalScrollIndicator={false}
                              contentContainerStyle={{paddingBottom: 20}}
                              renderRow={(set_group, sectionID, rowID) =>
                                  <DisplayExerciseBox set_group={set_group}
                                                      addNote={this.addNote}
                                                      _editExercise={this._editExercise}
                                                      deleteSetGroup={this.deleteSetGroup}/>
                              }
                    />
                }

                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right" offsetX={10} offsetY={20}>
                    <ActionButton.Item buttonColor='#F22525' title="Delete"
                                       onPress={this._delete}>
                        <MaterialIcon name="delete-forever" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Add Note" onPress={this.addNote}>
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
        fontSize: getFontSize(26),
        fontFamily: 'Heebo-Medium',
        textAlign: 'center',
        borderBottomWidth: .5,
        borderColor: '#e1e3df',
    },
    day: {
        fontSize: getFontSize(28),
        fontFamily: 'Heebo-Bold',
        paddingLeft: 20
    },
    dayTop: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    smallBold: {
        fontSize: getFontSize(16),
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
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(EditWorkoutDay);
