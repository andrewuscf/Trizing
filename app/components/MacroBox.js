import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

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
            showForm: false,
            showDetails: false,
            lastPress: 0
        }
    },

    dayChange(index, text, type) {
        console.log(index, text, type)
        let macro_plan_days = this.state.macro_plan_days;
        macro_plan_days[index] = {text: text};
        this.setState({
            macro_plan_days: macro_plan_days
        });
    },

    addDay() {
        this.setState({numberOfDays: this.state.numberOfDays + 1});
    },

    verify() {
        return (this.state.name && this.state.macro_plan_days[0] && this.state.macro_plan_days[0].protein
        && this.state.macro_plan_days[0].carbs && this.state.macro_plan_days[0].fats)

    },

    _onCreate() {
        if (this.verify()) {
            const data = {
                name: this.state.name,
                protein: this.state.protein,
                carbs: this.state.carbs,
                fats: this.state.fats,
                training_plan: this.props.training_plan
            };
            this.props.createMacroPlan(data);
            this.setState(this.getInitialState());
        } else {
            if (!this.state.name) {
                this.refs.name.focus();
            } else if (!this.state.protein) {
                this.refs.protein.focus();
            } else if (!this.state.carbs) {
                this.refs.carbs.focus();
            } else if (!this.state.fats) {
                this.refs.fats.focus();
            }
        }
    },

    calculateCalories() {
        return (9 * this.state.fats) + (4 * this.state.protein) + (4 * this.state.carbs)
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
            this.setState({showForm: true})
        }
    },

    _onDelete() {
        Alert.alert(
            'Delete Macro Plan',
            `Are you sure you want delete ${this.props.plan.name}?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => console.log(this.props.plan.name)},
            ]
        );
    },

    _onLongPress() {
        if (this.props.plan) {
            this.props.selectMacroPlan(this.props.plan.id);
        }
    },


    render() {
        const plan = this.props.plan;
        let created_at = null;
        if (plan) {
            created_at = moment.utc(plan.created_at).local()
        }

        const macro_plan_days = [];
        for (var x = 0; x < this.state.numberOfDays; x++) {
            macro_plan_days.push(
                <View key={x}>
                    <View style={[styles.inputWrap, {flexDirection: 'row', height: 50, justifyContent: 'space-between'}]}>
                        <TouchableOpacity style={styles.dayOfWeek}><Text>Sun</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.dayOfWeek}><Text>Mon</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.dayOfWeek}><Text>Tue</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.dayOfWeek}><Text>Wed</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.dayOfWeek}><Text>Thu</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.dayOfWeek}><Text>Fri</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.dayOfWeek}><Text>Sat</Text></TouchableOpacity>
                    </View>
                    <View style={[styles.inputWrap, {flexDirection: 'row'}]}>
                        <TextInput ref={`protein_${x}`} style={[styles.textInput, {flex: 1}]} autoCapitalize='none'
                                   keyboardType="numeric"
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChange={(text) => this.dayChange(x, text, 'protein')}
                                   value={this.state.macro_plan_days[x]
                                       ? this.state.macro_plan_days[x].protein.toString() : null}
                                   onSubmitEditing={(event) => {
                                       this.refs[`carbs_${x}`].focus();
                                   }}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Protein (g)"/>
                        <TextInput ref={`carbs_${x}`} style={[styles.textInput, {flex: 1}]} autoCapitalize='none'
                                   keyboardType="numeric"
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChange={(text) => this.dayChange(x, text, 'carbs')}
                                   value={this.state.macro_plan_days[x]
                                       ? this.state.macro_plan_days[x].carbs.toString() : null}
                                   onSubmitEditing={(event) => {
                                       this.refs[`fats_${x}`].focus();
                                   }}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Carbs (g)"/>
                        <TextInput ref={`fats_${x}`} style={[styles.textInput, {flex: 1}]} autoCapitalize='none'
                                   keyboardType="numeric"
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChange={(text) => this.dayChange(x, text, 'fats')}
                                   value={this.state.macro_plan_days[x]
                                       ? this.state.macro_plan_days[x].fats.toString() : null}
                                   onSubmitEditing={(event) => {
                                       this.refs[`protein_${x + 1}`].focus();
                                   }}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Fat (g)"/>
                    </View>

                    <Text style={styles.formCalories}>CALORIES: </Text>
                    <TouchableOpacity style={styles.createButton} onPress={this._onCreate}>
                        <Icon name="plus-circle" size={30} color={greenCircle}/>
                    </TouchableOpacity>
                </View>
            )
        }
        if (this.state.showForm) {
            return (
                <View style={styles.container}>
                    <Text>Name</Text>
                    <View style={styles.inputWrap}>
                        <TextInput ref="name" style={styles.textInput} autoCapitalize='none'
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({name: text})}
                                   value={this.state.name}
                                   onSubmitEditing={(event) => {
                                       this.refs.protein.focus();
                                   }}
                                   placeholderTextColor="#4d4d4d"/>
                    </View>
                    {macro_plan_days}
                </View>
            )
        }
        return (
            <TouchableOpacity style={[styles.container]}
                              onLongPress={this._onLongPress}
                              activeOpacity={0.8}
                              onPress={this._onPress}>
                {!plan ?

                    <View style={styles.center}>
                        <Icon name="plus" size={30} color='#1352e2'/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>Create Macro New</Text>
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
                {plan && this.state.showDetails ?
                    <View style={[styles.center, {borderTopWidth: 1, borderColor: '#e1e3df', paddingTop: 10}]}>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.smallText}>Protein (g)</Text>
                            <Text style={styles.smallText}>{plan.protein}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.smallText}>Carbs (g)</Text>
                            <Text style={styles.smallText}>{plan.carbs}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.smallText}>Fats (g)</Text>
                            <Text style={styles.smallText}>{plan.protein}</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.smallText}>Calories</Text>
                            <Text
                                style={styles.smallText}>{this.calculateCalories() ? this.calculateCalories() : 0}</Text>
                        </View>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        paddingTop: 10,
        paddingBottom: 10,
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18,
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
        height: 30
    },
    createButton: {
        position: 'absolute',
        right: 10,
        bottom: 0
    },
    formCalories: {
        fontFamily: 'OpenSans-Bold'
    },
    dayOfWeek: {
        borderWidth: .5,
        borderRadius: 20,
        height: 40,
        width: 40,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedDay: {
        backgroundColor: '#1352e2',
    },
    selectedDayText: {
        color: 'white'
    }
});

export default MacroBox;
