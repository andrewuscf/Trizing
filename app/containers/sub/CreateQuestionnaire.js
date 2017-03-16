import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    TouchableHighlight,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';


const CheckInModal = React.createClass({
    propTypes: {
        closeQuestionnaireModal: React.PropTypes.func.isRequired,
        createQuestionnaire: React.PropTypes.func.isRequired
    },

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
            this.props.closeQuestionnaireModal();
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
        return this.state.name && this.state.questions[0] && this.state.questions[0].text
    },


    _onSubmit() {
        if (this.isValid()) {
            Keyboard.dismiss();
            var data = {
                name: this.state.name,
                questions: this.state.questions,

            };
            this.props.createQuestionnaire(data, this.asyncActions)
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
        const questions = this.state.questions.map((question, x)=> {
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
                        < TouchableHighlight style={styles.removeQuestion}
                                             onPress={this.removeQuestion.bind(null, x)} underlayColor='transparent'>
                            <Icon name="times" size={30} color='red'/>
                        </TouchableHighlight>
                        : null
                    }
                </View>
            )
        });
        return (
            <ScrollView style={styles.flexCenter} contentContainerStyle={styles.contentContainerStyle}
                        keyboardShouldPersistTaps="handled">
                <BackBar back={this.props.closeQuestionnaireModal} backText="Cancel" navStyle={{height: 40}}>
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
                                   onSubmitEditing={(event) => {
                                       this.refs.question0.focus();
                                   }}/>
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


const styles = StyleSheet.create({
    flexCenter: {
        flex: 1
    },
    submitButton: {
        zIndex: 999,
        position: 'absolute',
        right: 10,
        top: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    cancel: {
        color: '#d4d4d4'
    },
    blueText: {
        color: '#00BFFF'
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


export default CheckInModal;
