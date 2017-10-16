import React from 'react';
const CreateClass = require('create-react-class');
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';

import CreateQuestionBox from '../../components/CreateQuestionBox';


const Form = t.form.Form;

const CreateQuestionnaire = CreateClass({
    getInitialState() {
        return {
            Error: null,
            value: null,
            questions: [
                {text: null, height: 30}
            ]
        }
    },

    rows: [],

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
    },

    asyncActions(start){
        if (start) {
            // failed
        } else {
            this.props.navigation.goBack();
        }
    },

    _onSubmit() {
        const thisFormValues = this.refs.form.getValue();

        if (thisFormValues) {
            let completed = true;
            const data = {
                name: thisFormValues.name,
                questions: [],
            };
            const rows = _.uniqBy(this.rows, function (e) {
                if (e && e.props.number) return e.props.number;
            });
            for (const row of rows) {
                if (row && row.refs.form) {
                    const formValues = row.refs.form.getValue();
                    if (formValues) {
                        data.questions.push({...formValues})
                    } else {
                        completed = false;
                        // break;
                    }
                }
            }
            if (completed) {
                this.props.actions.createQuestionnaire(data, this.asyncActions);
            }
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

    removeQuestion() {
        Keyboard.dismiss();
        if (this.state.questions.length > 1) {
            this.setState({questions: this.state.questions.filter((question, i)=> {
                return i !== this.state.questions.length - 1
            })});
        }
    },

    onChange(value) {
        this.setState({value});
    },


    render: function () {
        let Survey = t.struct({
            name: t.String,
        });

        let options = {
            fields: {
                name: {
                    onSubmitEditing: () => Keyboard.dismiss(),
                    autoCapitalize: 'words',
                    label: 'Survey Name'
                }
            }
        };


        const questions = this.state.questions.map((question, x) => {
            return <CreateQuestionBox key={x} number={x + 1} ref={(row) => this.rows.push(row)}/>
        });
        return (
            <ScrollView style={styles.flexCenter} contentContainerStyle={styles.contentContainerStyle}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                <View style={styles.formContainer}>
                    <Form
                        ref="form"
                        type={Survey}
                        options={options}
                        value={this.state.value}
                        onChange={this.onChange}
                    />
                    {questions}
                    {this.state.questions.length > 1 ?
                        <TouchableOpacity style={styles.removeQuestion}
                                          onPress={this.removeQuestion} underlayColor='transparent'>
                            <Text style={styles.addQuestion}>Delete last</Text>
                        </TouchableOpacity>
                        : null
                    }
                    <TouchableOpacity onPress={this.addQuestion} underlayColor='transparent'>
                        <Text style={styles.addQuestion}>Add a Question</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        )
    }
});

CreateQuestionnaire.navigationOptions = {
    title: 'Create Survey',
};


const styles = StyleSheet.create({
    flexCenter: {
        // flex: 1
    },
    formContainer: {
        margin: 10
    },
    addQuestion: {
        height: 35,
        marginTop: 5,
        marginBottom: 8,
        color: '#b1aea5',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'Heebo-Medium',
        alignSelf: 'center',
        textDecorationLine: 'underline',
        textDecorationColor: '#b1aea5'
    },
    removeQuestion: {
        // right: 0,
        // top: 10,
        // position: 'absolute'
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
