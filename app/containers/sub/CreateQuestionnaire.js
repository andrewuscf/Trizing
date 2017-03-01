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


var {width: deviceWidth} = Dimensions.get('window');


var CheckInModal = React.createClass({
    propTypes: {
        closeModal: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            Error: null,
            numberOfQuestions: 1,
            questions: [],
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            this.props.closeModal();
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

    },


    _onSubmit() {
        if (this.isValid()) {

        }
    },

    questionChange(index, event) {
        const text = event.nativeEvent.text;
        let questions = this.state.questions;
        questions[index] = {text: text, height: event.nativeEvent.contentSize.height};
        this.setState({
            questions: questions
        });
    },

    addQuestion() {
        this.setState({numberOfQuestions: this.state.numberOfQuestions + 1});
    },


    render: function () {
        const questions = [];
        for (var x = 0; x < this.state.numberOfQuestions; x++) {
            questions.push(
                <View key={x}>
                    <Text style={styles.inputLabel}>Question {x + 1}</Text>
                    <View
                        style={[styles.inputWrap, {height: this.state.questions[x] ? this.state.questions[x].height: 30}]}>
                        <TextInput
                            style={[styles.textInput, {height: this.state.questions[x] ? this.state.questions[x].height: 30}]}
                            multiline={true}
                            underlineColorAndroid='transparent'
                            autoCapitalize='sentences'
                            placeholderTextColor='#4d4d4d'
                            onChange={this.questionChange.bind(null, x)}
                            value={this.state.questions[x] ? this.state.questions[x].text : null}
                            placeholder="Add Question"/>
                    </View>
                </View>
            )
        }
        return (
            <ScrollView style={styles.flexCenter} contentContainerStyle={styles.contentContainerStyle}>
                <BackBar back={this.props.closeModal} backText="Cancel" navStyle={{height: 40}}>
                    <SubmitButton buttonStyle={[styles.submitButton]}
                                  textStyle={[styles.cancel, this.isValid() ? styles.blueText : null]}
                                  onPress={this._onSubmit} ref='postbutton'
                                  text='Submit'/>
                </BackBar>

                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Survey Name</Text>
                    <View style={styles.inputWrap}>
                        <TextInput ref="name" style={styles.textInput} autoCapitalize='sentences'
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text)=>this.setState({name: text})}
                                   value={this.state.name}
                                   onSubmitEditing={(event) => {this.refs.question.focus();}}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="Required"/>
                    </View>
                    {questions}
                    <TouchableHighlight onPress={this.addQuestion} underlayColor='transparent'>
                        <Text style={styles.addQuestion}>Add a Question</Text>
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
    addQuestion: {
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


export default CheckInModal;
