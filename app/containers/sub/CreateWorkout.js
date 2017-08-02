import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import * as GlobalActions from '../../actions/globalActions';

import SelectInput from '../../components/SelectInput';

const CreateWorkout = React.createClass({
    propTypes: {
        scheduleId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            template: null,
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this._onSubmit, disabled: this.state.disabled});
        }
    },

    asyncActions(success, data = {}){
        this.setState({disabled: false});
        if (success && data.routeName) {
            this.props.navigation.dispatch({
                type: 'ReplaceCurrentScreen',
                routeName: data.routeName,
                params: data.props,
                key: data.routeName
            });
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't create workout block.")
        }
    },

    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            this.setState({disabled: true});
            if (this.state.template)
                values = {
                    ...values,
                    template: this.state.template
                };
            if (this.props.training_plan) {
                values = {
                    ...values,
                    training_plan: this.props.training_plan
                }
            }
            values = {
                ...values,
                program: this.props.scheduleId
            };
            this.props.actions.createWorkout(values, this.asyncActions);
        }
    },

    selectTemplate(id) {
        this.setState({
            template: id
        });
    },


    onChange(value) {
        this.setState({value});
    },


    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            // stylesheet: stylesheet,
            fields: {
                name: {
                    label: 'Workout Block Name',
                    onSubmitEditing: () => this.refs.form.getComponent('duration').refs.input.focus(),
                    placeholder: `'Block 1 of program xy'.`,
                    autoCapitalize: 'sentences'
                },
                duration: {
                    label: 'Duration',
                    onSubmitEditing: () => this._onSubmit(),
                    placeholder: `Number of weeks for this block`
                }
            }
        };
        const scheduleWorkouts = _.find(this.props.Schedules, {id: this.props.scheduleId}).workouts;
        return (
            <View style={styles.flexCenter}>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={Workout}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                    <View style={styles.templateSection}>
                        <Text style={{paddingBottom: 10}}>Copy workout block:</Text>
                        <SelectInput ref='workout_templates' options={[
                            ..._.filter(scheduleWorkouts, function (o) {
                                return !o.training_plan;
                            }),
                            {id: null, name: 'None'}
                        ]} selectedId={this.state.template} submitChange={this.selectTemplate}/>
                    </View>
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
    button: {
        margin: 20,
    },
    templateSection:{
        padding: 10,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    }
});

// T FORM SETUP
const Form = t.form.Form;

const Positive = t.refinement(t.Number, function (n) {
    return n >= 0;
});

const Workout = t.struct({
    name: t.String,
    duration: Positive,
});

const stateToProps = (state) => {
    return {
        Schedules: state.Global.Schedules
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateWorkout);
