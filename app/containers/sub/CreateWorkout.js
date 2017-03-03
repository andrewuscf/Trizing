import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
    TextInput,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';

import WorkoutDay from '../../components/WorkoutDay';


var {width: deviceWidth} = Dimensions.get('window');


var CreateWorkout = React.createClass({
    propTypes: {
        closeWorkoutModal: React.PropTypes.func.isRequired,
        createWorkout: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            Error: null,
            name: null,
            numberofDays: 1,
            days: [],
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            this.props.closeWorkoutModal();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.Error) {
            Alert.alert(
                this.state.Error,
                this.state.Error,
                [
                    {text: 'OK', onPress: () => this.setState({Error: null})},
                ]
            );
        }
    },

    isValid() {
        return this.state.name && this.state.days[0] && this.state.days[0].name
    },


    _onSubmit() {
        if (this.isValid()) {
            var data = {
                name: this.state.name,
                questions: this.state.questions,

            };
            this.props.createQuestionnaire(data, this.asyncActions)
        }
    },

    addDay() {
        this.setState({numberofDays: this.state.numberofDays + 1});
    },


    render: function () {
        const days = [];
        for (var x = 0; x < this.state.numberofDays; x++) {
            days.push(<WorkoutDay key={x} />)
        }
        return (
            <ScrollView style={styles.flexCenter} contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.closeWorkoutModal} backText="Cancel" navStyle={{height: 40}}>
                    <SubmitButton buttonStyle={[styles.submitButton]}
                                  textStyle={[styles.cancel, this.isValid() ? styles.blueText : null]}
                                  onPress={this._onSubmit} ref='postbutton'
                                  text='Submit'/>
                </BackBar>

                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Workout Name</Text>
                    <View style={styles.inputWrap}>
                        <TextInput ref="name" style={styles.textInput} autoCapitalize='sentences'
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({name: text})}
                                   value={this.state.name}
                                   onSubmitEditing={(event) => {
                                       this.refs.question0.focus();
                                   }}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Required"/>
                    </View>
                    {days}
                    <TouchableHighlight onPress={this.addDay} underlayColor='transparent'>
                        <Text style={styles.addDay}>Add Workout Day</Text>
                    </TouchableHighlight>
                </View>

            </ScrollView>
        )
    }
});


var styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: deviceWidth
    },
    submitButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    cancel: {
        color: '#d4d4d4',
    },
    blueText: {
        color: '#00BFFF'
    },
    formContainer: {
        margin: 10,
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
    inputLabel: {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
    },
    addDay: {
        height: 35,
        marginTop: 5,
        marginBottom: 8,
        color: '#b1aea5',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        alignSelf: 'center',
        textDecorationLine: 'underline',
        textDecorationColor: '#b1aea5',
    }
});


export default CreateWorkout;
