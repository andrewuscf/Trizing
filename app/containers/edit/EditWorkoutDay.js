import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    FlatList,
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

const EditWorkoutDay = CreateClass({
    propTypes: {
        workout_day_id: PropTypes.number,
        workout_day: PropTypes.object
    },

    getInitialState() {
        return {
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


    _renderHeader() {
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
            workout_day: {
                ...this.state.workout_day,
                notes: this.state.workout_day.notes ? [...this.state.workout_day.notes, newNote] : [newNote]
            }
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

    _renderItem(object) {
        const set_group = object.item;
        return <DisplayExerciseBox set_group={set_group}
                                   addNote={this.addNote}
                                   _editExercise={this._editExercise}
                                   deleteSetGroup={this.deleteSetGroup}/>
    },


    render: function () {
        if (!this.state.workout_day) return <Loading/>;

        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // let dataSource = ds.cloneWithRows(this.state.workout_day.exercises);

        return (
            <View style={styles.container}>

                {!this.state.workout_day.exercises.length ?
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                        <Text>Create Exercises!</Text>
                    </View> :

                    <FlatList removeClippedSubviews={false} ListHeaderComponent={this._renderHeader}
                              showsVerticalScrollIndicator={false} data={this.state.workout_day.exercises}
                              keyboardShouldPersistTaps="handled"
                              contentContainerStyle={{paddingBottom: 100}}
                              refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                              onRefresh={() => this.getWorkoutDay(true)}/>}
                              renderItem={this._renderItem} extraData={this.state}
                              keyExtractor={(item, index) => index}/>
                }

                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right" offsetX={10} offsetY={20}>
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
