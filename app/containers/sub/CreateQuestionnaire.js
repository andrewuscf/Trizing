import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';


const CreateQuestionnaire = React.createClass({
    getInitialState() {
        return {
            Error: null,
            name: null,
            questions: [
                {text: null, height: 30}
            ]
        }
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            this._back();
        }
    },

    _back() {
        this.props.navigation.goBack()
    },

    isValid() {
        return this.state.name && this.state.questions[0] && this.state.questions[0].text
    },


    _onSubmit() {
        if (this.isValid()) {
            Keyboard.dismiss();
            const data = {
                name: this.state.name,
                questions: [],
            };
            this.state.questions.forEach((question) => {
                if (question.text) {
                    data.questions.push(question)
                }
            });
            this.props.actions.createQuestionnaire(data, this.asyncActions)
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
        Keyboard.dismiss();
        this.setState({
            questions: [
                ...this.state.questions,
                {text: null, height: 30}
            ]
        });
    },

    removeQuestion(index) {
        Keyboard.dismiss();
        if (this.state.questions.length > 1) {
            this.setState({
                questions: this.state.questions.slice(0, index).concat(this.state.questions.slice(index + 1))
            })
        }
    },


    render: function () {
        const questions = this.state.questions.map((question, x) => {
            return (
                <View key={x}>
                    <Text style={styles.inputLabel}>Question {x + 1}</Text>
                    <View style={[styles.inputWrap, {height: this.state.questions[x].height}]}>
                        <TextInput ref={`question${x}`}
                                   style={[styles.textInput, {height: this.state.questions[x].height}]}
                                   multiline={true}
                                   underlineColorAndroid='transparent'
                                   autoCapitalize='sentences'
                                   placeholderTextColor='#4d4d4d'
                                   onChange={this.questionChange.bind(null, x)}
                                   value={this.state.questions[x].text}
                                   placeholder="Ex: What is your goal?"/>
                    </View>
                    {this.state.questions.length > 1 ?
                        <TouchableOpacity style={styles.removeQuestion}
                                          onPress={this.removeQuestion.bind(null, x)} underlayColor='transparent'>
                            <Icon name="times" size={30} color='red'/>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            )
        });
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.flexCenter} contentContainerStyle={styles.contentContainerStyle}
                            keyboardShouldPersistTaps="handled">
                    <BackBar back={this._back} backText="Cancel" navStyle={{height: 40}}/>
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Survey Name</Text>
                        <View style={styles.inputWrap}>
                            <TextInput ref="name" style={styles.textInput} autoCapitalize='sentences'
                                       underlineColorAndroid='transparent'
                                       autoCorrect={false}
                                       onChangeText={(text) => this.setState({name: text})}
                                       value={this.state.name}
                                       onSubmitEditing={(event) => {
                                           this.refs.question0.focus();
                                       }}/>
                        </View>
                        {questions}
                        <TouchableOpacity onPress={this.addQuestion} underlayColor='transparent'>
                            <Text style={styles.addQuestion}>Add a Question</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <SubmitButton disabled={!this.isValid()} buttonStyle={{margin: 20}} onPress={this._onSubmit}
                              ref='postbutton' text='Submit'/>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1
    },
    formContainer: {
        margin: 10
    },
    inputWrap: {
        flex: 1,
        marginBottom: 12,
        height: 30,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
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
    inputLabel: {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
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
        textDecorationColor: '#b1aea5'
    },
    removeQuestion: {
        right: 0,
        top: 10,
        position: 'absolute'
    }
});

const stateToProps = (state) => {
    return {};
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateQuestionnaire);
