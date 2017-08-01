import React from 'react';
import {
    ScrollView,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'lodash';
import t from 'tcomb-form-native';

import {API_ENDPOINT, fetchData, getFontSize, checkStatus} from '../../actions/utils';


import InputAccessory from '../../components/InputAccessory';
import MacroBoxDay from '../../components/MacroBoxDay';


const Form = t.form.Form;

let MacroPlan = t.struct({
    name: t.String,
});

const CreateMacroPlan = React.createClass({
    propTypes: {
        training_plan: React.PropTypes.number.isRequired,
        addMacroPlan: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            disabled: false,
            value: null,
            macro_plan_days: [{weight: null, fats: null, carbs: null, days: []}],
            selectedDays: [],
            options: {
                auto: 'placeholder',
                fields: {
                    name: {
                        placeholder: 'Nutrition Plan Name',
                        maxLength: 35,
                        autoCapitalize: 'sentences'
                    },
                }
            }
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._save, disabled: this.state.disabled});
    },

    componentDidUpdate(prevProps, prevState){
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this._save, disabled: this.state.disabled});
        }
    },

    goBack() {
        this.setState({disabled: false});
        this.props.navigation.goBack();
    },

    createMacroPlan(data) {
        let jsondata = JSON.stringify(data);
        fetch(`${API_ENDPOINT}training/macros/`,
            fetchData('POST', jsondata, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    this.props.addMacroPlan(responseJson);
                    this.goBack();
                }
            }).catch(error => console.log(error))
    },

    _save() {
        Keyboard.dismiss();
        let values = this.refs.form.getValue();
        if (this.verify() && values) {
            // const data = this.state
            const validPlanDays = _.filter(this.state.macro_plan_days, (day) => {
                if (day.protein && day.carbs && day.fats && day.days.length > 0)
                    return day
            });
            this.createMacroPlan({
                ...this.state,
                name: values.name,
                macro_plan_days: validPlanDays,
                training_plan: this.props.training_plan
            });
        }
    },

    getDayState(planDayIndex, state) {
        let macro_plan_days = this.state.macro_plan_days;
        macro_plan_days[planDayIndex] = state;

        let selectedDays = [];
        this.state.macro_plan_days.forEach((macro_plan_day) => {
            selectedDays = selectedDays.concat(macro_plan_day.days);
        });
        this.setState({
            macro_plan_days: macro_plan_days,
            selectedDays: selectedDays
        });
    },

    verify() {
        return !!(this.state.macro_plan_days[0] && this.state.macro_plan_days[0].protein
        && this.state.macro_plan_days[0].carbs && this.state.macro_plan_days[0].fats
        && this.state.macro_plan_days[0].days.length > 0)

    },

    addDay() {
        Keyboard.dismiss();
        this.setState({
            macro_plan_days: [
                ...this.state.macro_plan_days,
                {weight: null, fats: null, carbs: null, days: []}
            ]
        });
    },

    _removeDay(index) {
        Keyboard.dismiss();
        if (this.state.macro_plan_days.length > 1) {
            this.setState({
                macro_plan_days: this.state.macro_plan_days.slice(0, index).concat(this.state.macro_plan_days.slice(index + 1))
            })
        }
    },

    onChange(value) {
        this.setState({value});
    },

    render: function () {
        const macro_plan_days = this.state.macro_plan_days.map((question, x) => {
            return <MacroBoxDay key={x} getDayState={this.getDayState} planDayIndex={x}
                                canDelete={this.state.macro_plan_days.length > 1}
                                _removeDay={this._removeDay}
                                selectedDays={x !== 0 ? this.state.selectedDays : []}/>;
        });

        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={{margin: 10}}>
                        <Form
                            ref="form"
                            type={MacroPlan}
                            options={this.state.options}
                            onChange={this.onChange}
                            value={this.state.value}
                        />
                    </View>
                    {macro_plan_days}
                    {this.state.selectedDays.length < 7 ?
                        <TouchableOpacity onPress={this.addDay} style={styles.addButton}>
                            <Text style={styles.addAnotherDay}>Add Days</Text>
                        </TouchableOpacity>
                        : null
                    }

                </ScrollView>
                <InputAccessory/>
            </View>
        )
    }
});


CreateMacroPlan.navigationOptions = {
    title: 'New Nutrition Plan',
};


const styles = StyleSheet.create({
    inputWrap: {
        marginBottom: 12,
        height: 30,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        flex: 1
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'Heebo-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30,
        textAlign: 'center',
    },
    addAnotherDay: {
        color: '#b1aea5',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'Heebo-Medium',
        textDecorationLine: 'underline',
        textDecorationColor: '#b1aea5'
    },
    addButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 50
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken,
    };
};

export default connect(stateToProps, null)(CreateMacroPlan);