import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import DropdownAlert from 'react-native-dropdownalert';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize} from '../../actions/utils';

import DaysOfWeek from '../../components/DaysOfWeek';
import SelectInput from '../../components/SelectInput';


const Form = t.form.Form;
const WorkoutDay = t.struct({
    name: t.String,
});

let options = {
    auto: 'placeholders',
    i18n: {
        optional: '',
        required: '*',
    },
    fields: {
        name: {
            placeholder: `Pull Day, Monday, etc...`,
            autoCapitalize: 'words',
        }
    }
};

const CreateWorkoutDay = React.createClass({
    propTypes: {
        workoutId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
        const workout = _.find(schedule.workouts, {id: this.props.workoutId});
        return {
            value: null,
            days: [],
            workout: workout,
            disabled: false,
            template: null,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.createDay});
    },


    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules !== prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {workouts: [{id: this.props.workoutId}]});
            const workout = _.find(schedule.workouts, {id: this.props.workoutId});
            this.setState({workout: workout});
        }
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this.createDay, disabled: this.state.disabled});
        }
    },

    asyncActions(success, data = {}){
        this.setState({disabled: false});
        if (success && data.props) {
            this.props.navigation.dispatch({
                type: 'ReplaceCurrentScreen',
                routeName: 'WorkoutDayDetail',
                params: data.props,
                key: 'WorkoutDayDetail'
            });
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't create workout day.")
        }
    },

    createDay() {
        let values = this.refs.form.getValue();
        if (values) {
            if (this.state.days.length) {
                this.setState({disabled: true});
                let data = {
                    name: values.name,
                    day: this.state.days[0],
                    workout: this.state.workout.id
                };
                if (this.state.template) {
                    data = {
                        ...data,
                        template: this.state.template
                    };
                }
                this.props.actions.addEditWorkoutDay(data, this.asyncActions)
            } else {

            }
        }
    },

    selectDay(days) {
        if (days.length > 1) {
            this.setState({days: [days[1]]});
        } else {
            this.setState({days: [days[0]]});
        }
    },

    onChange(value) {
        this.setState({value});
    },

    selectTemplate(id) {
        this.setState({
            template: id
        });
    },


    render: function () {

        const workout_days = this.state.workout ? this.state.workout.workout_days : [];
        return (
            <View style={styles.flexCenter}>
                <View style={{padding: 10}}>
                    <Text style={styles.inputLabel}>Name of Day</Text>
                    <Form
                        ref="form"
                        type={WorkoutDay}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <Text style={styles.inputLabel}>Day of the week</Text>
                <DaysOfWeek daySelectedState={this.selectDay} days={this.state.days}/>
                <View style={styles.templateSection}>
                    <Text style={{paddingBottom: 10}}>Copy workout day:</Text>
                    <SelectInput ref='workout_templates' options={[...workout_days, {id: null, name: 'None'}]}
                                 selectedId={this.state.template} submitChange={this.selectTemplate}/>
                </View>
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    save: {
        position: 'absolute',
        top: 20,
        right: 10
    },
    inputLabel: {
        fontSize: getFontSize(30),
        fontFamily: 'Heebo-Medium',
        textAlign: 'center'
    },
    templateSection:{
        padding: 10,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        borderTopWidth: 1,
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

export default connect(stateToProps, dispatchToProps)(CreateWorkoutDay);

