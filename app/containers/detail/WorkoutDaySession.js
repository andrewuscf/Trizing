import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ListView,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';

import InputAccessory from '../../components/InputAccessory';
import SetLogBox from '../../components/SetLogBox';


const window = Dimensions.get('window');

const WorkoutDaySession = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit, disabled: this.state.disabled});
    },

    componentDidUpdate(prevProps, prevState){
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this._onSubmit, disabled: this.state.disabled});
        }
    },

    rows: [],

    asyncActions(success) {
        this.setState({disabled: false});
        if (success) {
            this.dropdown.alertWithType('success', 'Success', 'You have logged your workout session.');
            setTimeout(() => {
                this.setState({value: null});
                this.props.navigation.goBack();
            }, 2000);
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't log workout session.")
        }
    },


    _onSubmit() {
        let completed = true;
        let logs = [];
        const rows = _.uniqBy(this.rows, function (e) {
            if (e && e.props.set) return e.props.set.id;
        });
        for (const row of rows) {
            if (row && row.refs.form) {
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
        if (completed) {
            this.setState({disabled: true});
            this.props.actions.logSets(logs, this.asyncActions);
        }
    },


    render: function () {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.props.workout_day.exercises);
        return (
            <View style={{flex: 1}}>
                <ListView ref='exercise_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          showsVerticalScrollIndicator={false}
                          keyboardShouldPersistTaps="handled"
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
                <InputAccessory/>
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
            </View>
        );
    }
});

WorkoutDaySession.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        headerTitle: state.params && state.params.workout_day ?
            state.params.workout_day.name
            : null,
    };
};


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

