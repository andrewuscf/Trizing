import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ListView,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import SetLogBox from '../../components/SetLogBox';
import SubmitButton from '../../components/SubmitButton';


const window = Dimensions.get('window');

const WorkoutDaySession = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
    },

    rows: [],

    asyncActions(start){
        if (start) {
            this.postbutton.setState({busy: true});
        } else {
            this.postbutton.setState({busy: false});
            this.props.navigator.pop();
        }
    },

    renderHeader() {
        return (
            <BackBar back={this.props.navigator.pop}>
                <Text style={styles.header}>{this.props.workout_day.name}</Text>
            </BackBar>
        )
    },

    _onSubmit() {
        // console.log(this.state.setRefLimits)
        let completed = true;
        let logs = [];
        for (const row of this.rows) {
            if (row) {
                const formValues = row.refs.form.getValue();
                if (formValues) {
                    logs.push({
                        exercise_set: row.props.set.id,
                        reps: formValues.reps,
                        weight: formValues.weight,
                        workout: this.props.workout_day.workout,
                        date: moment().format("YYYY-MM-DD")
                    })
                } else {
                    completed = false;
                    break;
                }
            }
        }
        if (completed) this.props.actions.logSets(logs, this.asyncActions);
    },

    renderFooter() {
        return (
            <SubmitButton buttonStyle={styles.button} onPress={this._onSubmit}
                          ref={(postbutton) => this.postbutton = postbutton}
                          text='Submit'/>
        )
    },


    render: function () {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.props.workout_day.exercises);
        return (
            <ListView ref='exercise_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      renderHeader={this.renderHeader}
                      renderFooter={this.renderFooter}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(exercise, sectionID, rowID) =>
                          <View style={styles.exerciseBox}>
                              <Text style={styles.exerciseName}>{exercise.name}</Text>
                              <View style={styles.setsHeader}>
                                  <Text style={styles.setColumn}>Set</Text>
                                  <Text style={styles.setColumn}>LBS</Text>
                                  <Text style={styles.setColumn}>REPS</Text>
                              </View>
                              {exercise.sets.map((set, index) => {
                                  return <SetLogBox ref={(row) => this.rows.push(row)} key={index} set={set}/>
                              })}
                          </View>
                      }
            />
        );
    }
});


const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
    },
    header: {
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-bold',
    },
    exerciseBox: {
        marginBottom: 5,
        backgroundColor: 'white',

    },
    exerciseName: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center',
        padding: 5,
    },
    setsHeader: {
        flexDirection: 'row',
    },
    setColumn: {
        width: window.width / 3,
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
        marginLeft: 50,
        marginRight: 50,
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 80
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

export default connect(stateToProps, dispatchToProps)(WorkoutDaySession);

