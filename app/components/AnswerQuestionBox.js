import React from 'react';
const CreateClass = require('create-react-class');
import {
    View,
    Text,
    StyleSheet,
    Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';

import {getFontSize} from '../actions/utils';

const AnswerQuestionBox = CreateClass({
    propTypes: {
        question: PropTypes.object.isRequired,
        number: PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            value: null,
        }
    },

    onChange(value) {
        this.setState({value: value});
    },


    render: function () {
        const question = this.props.question;
        let options = {
            // stylesheet: stylesheet,
            auto: 'placeholders',
            fields: {
                text: {
                    placeholder: '',
                    onSubmitEditing: () => Keyboard.dismiss()
                },
            }
        };
        return (
            <View style={styles.setsHeader}>
                <Text style={styles.setColumn}>
                    {`${this.props.number}. ${question.text}`}
                </Text>
                <Form
                    ref="form"
                    type={ExtraField}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />
            </View>
        )
    }
});

const Form = t.form.Form;

const ExtraField = t.struct({
    text: t.String,
});

const styles = StyleSheet.create({
    setsHeader: {
        flex: 1,
    },
    setColumn: {
        fontSize: getFontSize(22),
        color: 'grey',
        paddingBottom: 10
    }
});

export default AnswerQuestionBox;
