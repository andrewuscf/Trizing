import React from 'react';
import {
    View,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import * as GlobalActions from '../../actions/globalActions';

import InputAccessory from '../../components/InputAccessory';
import DisplayExerciseBox from '../../components/trainer/DisplayExerciseBox';


const window = Dimensions.get('window');

const WorkoutDaySession = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            disabled: false,
            rows: []
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
        let totalLogs = [];
        for (const row of this.state.rows) {
            const logs = row.setData();
            if (logs) {
                totalLogs = totalLogs.concat(logs);
            } else {
                completed = false;
            }
        }
        if (completed) {
            this.setState({disabled: true});
            this.props.actions.logSets(totalLogs, this.asyncActions);
        }
    },


    render: function () {
        const exercises = this.props.workout_day.exercises.map((exercise, i) => {
            return (<DisplayExerciseBox ref={(row) => this.state.rows[i] = row}
                                        workout={this.props.workout_day.workout}
                                        exercise={exercise} key={i} log={true}/>)
        });
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView extraHeight={130} showsVerticalScrollIndicator={false}
                contentContainerStyle={{backgroundColor: '#f1f1f3'}}>
                    {exercises}
                </KeyboardAwareScrollView>
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


// const styles = StyleSheet.create({
//
// });

const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(WorkoutDaySession);

