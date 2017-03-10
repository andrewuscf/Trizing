import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {getFontSize} from '../actions/utils';

import MacroBoxDay from './MacroBoxDay';
import SubmitButton from './SubmitButton';


var {width: deviceWidth} = Dimensions.get('window');

const MacroBox = React.createClass({
    propTypes: {
        plan: React.PropTypes.object,
        training_plan: React.PropTypes.number.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        selectMacroPlan: React.PropTypes.func,
        selected: React.PropTypes.bool
    },

    getInitialState() {
        return {
            name: this.props.plan ? this.props.plan.name : null,
            protein: this.props.plan ? this.props.plan.protein : null,
            macro_plan_days: this.props.plan ? this.props.plan.macro_plan_days : [],
            numberOfDays: this.props.plan ? this.props.plan.macro_plan_days.length : 1,
            training_plan: this.props.training_plan,
            showForm: false,
            showDetails: false,
            lastPress: 0,
            selectedDays: []
        }
    },

    verify() {
        return !!(this.state.name && this.state.macro_plan_days[0] && this.state.macro_plan_days[0].protein
        && this.state.macro_plan_days[0].carbs && this.state.macro_plan_days[0].fats
        && this.state.macro_plan_days[0].days.length > 0)

    },

    addDay() {
        this.setState({numberOfDays: this.state.numberOfDays + 1})
    },

    _onCreate() {
        if (this.verify()) {
            this.props.createMacroPlan(this.state);
            this.setState(this.getInitialState());
        } else {
            if (!this.state.name) {
                this.refs.name.focus();
            }
        }
    },

    _onPress() {
        if (this.props.plan) {
            var delta = new Date().getTime() - this.state.lastPress;
            if (delta < 200) {
                console.log('Double tap')
            } else {
                this.setState({showDetails: !this.state.showDetails});
            }
            this.setState({
                lastPress: new Date().getTime()
            })
        } else {
            this.setState({showForm: true});
        }
    },

    _onDelete() {
        Alert.alert(
            'Delete Macro Plan',
            `Are you sure you want delete ${this.props.plan.name}?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.deleteMacroPlan(this.props.plan.id)},
            ]
        );
    },

    _onLongPress() {
        if (this.props.plan) {
            this.props.selectMacroPlan(this.props.plan.id);
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


    render() {
        const plan = this.props.plan;
        let created_at = null;
        if (plan) {
            created_at = moment.utc(plan.created_at).local()
        }
        if (this.state.showForm) {
            const macro_plan_days = [];
            for (var x = 0; x < this.state.numberOfDays; x++) {
                macro_plan_days.push(<MacroBoxDay key={x} getDayState={this.getDayState} planDayIndex={x}
                                                  selectedDays={x != 0 ? this.state.selectedDays : []}/>)
            }
            return (
                <View style={styles.container}>
                    <View style={styles.inputWrap}>
                        <TextInput ref="name" style={styles.textInput} autoCapitalize='none'
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({name: text})}
                                   value={this.state.name}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Nutrition Plan Name"/>
                    </View>
                    {macro_plan_days}
                    {this.state.selectedDays.length < 7 ?
                        <TouchableOpacity onPress={this.addDay} style={{position: 'absolute', right: 0, bottom:40}}>
                            <Icon name="plus-circle" size={20} color={greenCircle}/>
                        </TouchableOpacity>
                        : null
                    }
                    <SubmitButton buttonStyle={styles.createButton}
                                  textStyle={styles.submitText} onPress={this._onCreate}  ref='postbutton'
                                  text='Create Nutrition Plan'/>
                </View>
            )
        }
        let planDays = null;
        if (plan)
            planDays = plan.macro_plan_days.map((day_plan, x) => <MacroBoxDay key={x} getDayState={this.getDayState}
                                                                              day_plan={day_plan}
                                                                              selectedDays={day_plan.days}/>);
        return (
            <TouchableOpacity style={[styles.container]}
                              onLongPress={this._onLongPress}
                              activeOpacity={0.8}
                              onPress={this._onPress}>
                {!plan ?

                    <View style={styles.center}>
                        <Icon name="plus" size={30} color='#1352e2'/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>Create New</Text>
                        </View>
                    </View>
                    :
                    <View style={styles.center}>
                        {this.props.selected ? <Icon name="check-circle" size={30} color={greenCircle}/> :
                            <Icon name="circle-thin" size={30} color='#bfbfbf'/>}
                        <View style={styles.details}>
                            <Text style={styles.mainText}>{plan.name}</Text>
                            <Text style={styles.date}>
                                <Icon name="clock-o" size={12} color='#4d4d4e'
                                /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.edit} onPress={this._onDelete}>
                            <Icon name="trash-o" size={20} color='#4d4d4e'/>
                        </TouchableOpacity>
                    </View>
                }
                {this.state.showDetails ? planDays : null}
            </TouchableOpacity>
        );
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        paddingTop: 10,
        // paddingBottom: 10,
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18
    },
    date: {
        fontSize: getFontSize(15),
        lineHeight: getFontSize(26),
    },
    mainText: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold'
    },
    smallText: {
        fontSize: getFontSize(12),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold'
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: 10
    },
    inputWrap: {
        marginBottom: 12,
        height: 30,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        alignItems: 'center'
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        height: 30,
        textAlign: 'center'
    },
    createButton: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        bottom: 0,
    },
});

export default MacroBox;
