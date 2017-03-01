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
            carbs: this.props.plan ? this.props.plan.carbs : null,
            fats: this.props.plan ? this.props.plan.fats : null,
            calories: null,
            showForm: false,
            showDetails: false,
            lastPress: 0
        }
    },

    verify() {
        return (this.state.protein && this.state.carbs && this.state.fats && this.state.name);

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
                                   onSubmitEditing={(event) => {this.refs.protein.focus();}}
                                   placeholderTextColor="#4d4d4d"/>
                    </View>
                    <View style={[styles.inputWrap, {flexDirection: 'row'}]}>
                        <TextInput ref="protein" style={[styles.textInput, {flex:1}]} autoCapitalize='none'
                                   keyboardType="numeric"
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({protein: text})}
                                   value={this.state.protein}
                                   onSubmitEditing={(event) => {this.refs.carbs.focus();}}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Protein (g)"/>
                        <TextInput ref="carbs" style={[styles.textInput, {flex:1}]} autoCapitalize='none'
                                   keyboardType="numeric"
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({carbs: text})}
                                   value={this.state.carbs}
                                   onSubmitEditing={(event) => {this.refs.fats.focus();}}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Carbs (g)"/>
                        <TextInput ref="fats" style={[styles.textInput, {flex:1}]} autoCapitalize='none'
                                   keyboardType="numeric"
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({fats: text})}
                                   value={this.state.fats}
                                   onSubmitEditing={(event) => {this._onCreate();}}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Fat (g)"/>
                    </View>

                    <Text style={styles.formCalories}>CALORIES: {this.calculateCalories() ? this.calculateCalories() : null}</Text>
                    <TouchableOpacity style={styles.createButton} onPress={this._onCreate}>
                        <Icon name="plus-circle" size={30} color={greenCircle}/>
                    </TouchableOpacity>
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
        top: 10
    },
    formCalories: {
        fontFamily: 'OpenSans-Bold'
    }
});

export default MacroBox;
