import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ListView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import DaysOfWeek from '../../components/DaysOfWeek';
import DisplayExerciseBox from '../../components/DisplayExerciseBox';
import SubmitButton from '../../components/SubmitButton';

const WorkoutDayDetail = React.createClass({
    propTypes: {
        workout_day_id: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        let workout_day = null;
        for (let workout of this.props.Workouts) {
            workout_day = _.find(workout.workout_days, {id: this.props.workout_day_id})
            if (workout_day)
                break;
        }
        return {
            Error: null,
            workout_day: workout_day
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Workouts != prevProps.Workouts) {
            let workout_day = null;
            for (let workout of this.props.Workouts) {
                workout_day = _.find(workout.workout_days, {id: this.props.workout_day_id})
                if (workout_day)
                    break;
            }
            if (workout_day)
                this.setState({workout_day: workout_day})
        }
    },

    renderSearchBar(){
        return (
            <View>
                <BackBar back={this.props.navigator.pop} navStyle={{height: 50}}>
                    <Text style={[styles.dayTitle]}>{this.state.workout_day.name}</Text>
                </BackBar>
                <DaysOfWeek days={this.state.workout_day.days}/>
            </View>
        )

    },

    _addExercise() {
        this.props.navigator.push(getRoute('CreateExercise', {workout_day: this.state.workout_day}))
    },

    renderFooter() {
        return <SubmitButton buttonStyle={styles.button}
                             textStyle={styles.submitText} onPress={this._addExercise} ref='postbutton'
                             text='Add Exercise'/>
    },


    render: function () {
        let exercises = null;
        console.log(this.state.workout_day)
        if (!this.state.workout_day)
            return null;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.workout_day.exercises);
        return (
            <ListView ref='workout_day_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this.refresh}/>}
                      renderHeader={this.renderSearchBar}
                      renderFooter={this.renderFooter}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(exercise, sectionID, rowID) =>
                          <DisplayExerciseBox exercise={exercise} showSets={rowID== 0}/>
                      }
            />
        );
    }
});


const styles = StyleSheet.create({
    dayTitle: {
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
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

export default connect(stateToProps, dispatchToProps)(WorkoutDayDetail);
