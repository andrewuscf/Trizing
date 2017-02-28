import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

const MacroBox = React.createClass({
    propTypes: {
        plan: React.PropTypes.object,
        training_plan: React.PropTypes.number.isRequired,
        selectMacroPlan: React.PropTypes.func.isRequired,
        _redirect: React.PropTypes.func.isRequired,
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
            // this.props.selectMacroPlan(this.props.questionnaire.id)
            this.setState({showDetails: !this.state.showDetails})
        } else {
            this.setState({showForm: true})
        }
    },

    _onDelete() {
        console.log('edit hit')
    },

    _onLongPress() {
        console.log('long press')
    },


    render() {
        const plan = this.props.plan;
        let created_at = null;
        if (plan) {
            created_at = moment.utc(plan.created_at)
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

                    <View>
                        <Text>Total Calories: {this.calculateCalories() ? this.calculateCalories() : null}</Text>
                    </View>
                    <TouchableOpacity style={styles.createButton} onPress={this._onCreate}>
                        <Icon name="check-circle" size={30} color='#1352e2'/>
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <TouchableOpacity style={[styles.container, (this.props.selected) ? styles.selectedBox : null]}
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
                        <Icon name="cutlery" size={30} color='#1352e2'/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>{plan.name}</Text>
                            <Text style={styles.date}><Icon name="clock-o" size={12} color='#4d4d4e'/> {created_at.format('MMM DD, YY')}</Text>
                        </View>
                        <TouchableOpacity style={styles.edit}  onPress={this._onDelete}>
                            <Icon name="trash-o" size={20} color='#4d4d4e'/>
                        </TouchableOpacity>
                    </View>
                }
                {plan && this.state.showDetails ?
                    <View style={[styles.center, {borderTopWidth: .5, borderColor: '#e1e3df', paddingTop: 5}]}>
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
                            <Text style={styles.smallText}>{this.calculateCalories() ? this.calculateCalories(): 0}</Text>
                        </View>
                    </View>: null
                }
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderWidth: 1,
        borderColor: '#e1e3df',
        padding: 10
    },
    selectedBox: {
        borderColor: '#1352e2'
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
    }
});

export default MacroBox;
