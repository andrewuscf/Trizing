import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {API_ENDPOINT, fetchData, getFontSize, checkStatus} from '../../actions/utils';

import MacroBoxDay from '../../components/MacroBoxDay';
import SubmitButton from '../../components/SubmitButton';


const CreateMacroPlan = React.createClass({
    propTypes: {
        training_plan: React.PropTypes.number.isRequired,
        addMacroPlan: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            disabled: false,
            name: null,
            protein: null,
            macro_plan_days: [{weight: null, fats: null, carbs: null, days: []}],
            selectedDays: []
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
            }).catch(error=>console.log(error))
    },

    _save() {
        Keyboard.dismiss();
        if (this.verify()) {
            // const data = this.state
            const validPlanDays = _.filter(this.state.macro_plan_days, (day) => {
                if (day.protein && day.carbs && day.fats && day.days.length > 0)
                    return day
            });
            this.createMacroPlan({
                ...this.state,
                macro_plan_days: validPlanDays,
                training_plan: this.props.training_plan
            });
        } else {
            if (!this.state.name) {
                this.refs.name.focus();
            }
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
        return !!(this.state.name && this.state.macro_plan_days[0] && this.state.macro_plan_days[0].protein
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


    render: function () {
        const macro_plan_days = this.state.macro_plan_days.map((question, x) => {
            return <MacroBoxDay key={x} getDayState={this.getDayState} planDayIndex={x}
                                canDelete={this.state.macro_plan_days.length > 1}
                                _removeDay={this._removeDay}
                                selectedDays={x !== 0 ? this.state.selectedDays : []}/>;
        });

        return (
            <ScrollView style={styles.container}>
                <View style={styles.inputWrap}>
                    <TextInput ref="name" style={styles.textInput} autoCapitalize='sentences'
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text) => this.setState({name: text})}
                               maxLength={35}
                               value={this.state.name}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Nutrition Plan Name"/>
                </View>
                {macro_plan_days}
                {this.state.selectedDays.length < 7 ?
                    <TouchableOpacity onPress={this.addDay} style={styles.addButton}>
                        <Text style={styles.addAnotherDay}>Add Days</Text>
                    </TouchableOpacity>
                    : null
                }

            </ScrollView>
        )
    }
});

const iconColor = '#8E8E8E';

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
        fontFamily: 'OpenSans-Light',
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
        fontFamily: 'OpenSans-Semibold',
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