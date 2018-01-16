import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize} from '../../actions/utils';

import DaysOfWeek from '../../components/DaysOfWeek';


const Form = t.form.Form;
const WorkoutDay = t.struct({
    name: t.String,
});

let options = {
    auto: 'placeholders',
    fields: {
        name: {
            placeholder: `Name: Pull Day, Monday, etc...`,
            autoCapitalize: 'words',
        }
    }
};

const CreateWorkoutDay = CreateClass({
    propTypes: {
        workoutId: PropTypes.number.isRequired,
        newDay: PropTypes.func.isRequired,
        navigation: PropTypes.object.isRequired,
        template_day: PropTypes.object
    },

    getInitialState() {
        return {
            value: this.props.template_day ? {name: `${this.props.template_day.name} - Copy`} : null,
            days: [],
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.createDay});
    },


    componentDidUpdate(prevProps, prevState) {
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this.createDay, disabled: this.state.disabled});
        }
    },

    asyncActions(success, data = {}) {
        this.setState({disabled: false});
        if (success && data.props) {
            this.props.actions.appMessage("Created", null, "green");
            this.props.newDay(data.newTrainingDay);
            this.props.navigation.goBack();
        } else {
            this.props.actions.appMessage("Couldn't create workout day.", null, "red");
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
                    workout: this.props.workoutId
                };
                if (this.props.template_day) {
                    data = {
                        ...data,
                        template: this.props.template_day.id
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


    render: function () {
        return (
            <View style={styles.flexCenter}>
                <View style={{padding: 10}}>
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
    templateSection: {
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

