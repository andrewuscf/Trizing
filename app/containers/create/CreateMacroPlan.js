import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Dimensions
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Pie} from 'react-native-pathjs-charts';

import GlobalStyle from '../globalStyle';

import * as ProfileActions from '../../actions/profileActions';
import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';


var {height, width} = Dimensions.get('window');


let options = {
    margin: {
        top: 5,
        left: 0,
        right: 0,
        bottom: 0
    },
    width: 250,
    height: 250,
    animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
    },
    legendPosition: 'topLeft',
    r: 50,
    label: {
        fontSize: 8,
        fontWeight: true,
        color: '#ECF0F1'
    }
};

const CreateMacroPlan = React.createClass({
    propTypes: {
        training_plan_id: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            name: null,
            protein: null,
            carbs: null,
            fats: null,

            calories: null,
            active: false
        }
    },

    verify() {
        return !!(this.state.protein && this.state.carbs && this.state.fat && this.props.name);

    },

    _onCreate() {
        if (this.verify()) {
            this.props.selectMacroPlan(this.props.questionnaire.id)
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

    _onBack() {
        this.props.navigator.pop();
    },


    render() {
        let data = [];
        if (this.state.protein)
            data.push({
                "name": `Protein (${this.state.protein}g)`,
                "amount": this.state.protein * 10,
                "color": {'r': 25, 'g': 99, 'b': 201}
            });
        if (this.state.carbs)
            data.push({
                "name": `Carbs (${this.state.carbs}g)`,
                "amount": this.state.carbs * 10,
                "color": {'r': 24, 'g': 175, 'b': 35}
            });
        if (this.state.fats)
            data.push({
                "name": `Fats (${this.state.fats}g)`,
                "amount": this.state.fats * 10,
                "color": {'r': 198, 'g': 84, 'b': 45}
            });
        console.log(data);
        return (
            <View style={GlobalStyle.container}>
                <BackBar back={this._onBack}>
                    <Text style={styles.titleText}>
                        CREATE MACRO PLAN
                    </Text>
                </BackBar>
                <View style={styles.inputWrap}>
                    <TextInput ref="name" style={styles.textInput} autoCapitalize='none'
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text)=>this.setState({name: text})}
                               value={this.state.name}
                               onSubmitEditing={(event) => {this.refs.protein.focus();}}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Macro Plan Name"/>
                </View>
                <View style={styles.inputWrap}>
                    <TextInput ref="protein" style={styles.textInput} autoCapitalize='none'
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text)=>this.setState({protein: text})}
                               value={this.state.protein}
                               onSubmitEditing={(event) => {this.refs.carbs.focus();}}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Protein (g)"/>
                </View>
                <View style={styles.inputWrap}>
                    <TextInput ref="carbs" style={styles.textInput} autoCapitalize='none'
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text)=>this.setState({carbs: text})}
                               value={this.state.carbs}
                               onSubmitEditing={(event) => {this.refs.fats.focus();}}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Carbs (g)"/>
                </View>
                <View style={styles.inputWrap}>
                    <TextInput ref="fats" style={styles.textInput} autoCapitalize='none'
                               keyboardType="numeric"
                               underlineColorAndroid='transparent'
                               autoCorrect={false}
                               onChangeText={(text)=>this.setState({fats: text})}
                               value={this.state.fats}
                               onSubmitEditing={(event) => {this._onCreate();}}
                               placeholderTextColor="#4d4d4d"
                               placeholder="Fat (g)"/>
                </View>

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Total Calories:</Text>
                    <Text>{this.calculateCalories() ? this.calculateCalories() : null}</Text>
                </View>
                <View style={{alignSelf: 'center', marginLeft: 0}}>
                    <Pie data={data}
                         options={options}
                         accessorKey="amount"
                    />
                </View>
                <TouchableOpacity style={[styles.button]} onPress={this._onCreate}>
                    <Text style={styles.buttonText}>CREATE</Text>
                </TouchableOpacity>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    inputWrap: {
        marginBottom: 12,
        height: 40,
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
        height: 40
    },
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#1352e2',
        paddingTop: 10,
        paddingBottom: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: '#1352e2',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold'
    },
    titleText: {
        fontSize: 15,
        fontFamily: 'OpenSans-Bold'
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ProfileActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateMacroPlan);