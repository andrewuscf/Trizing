import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';

const AnswerQuestionBox = React.createClass({
    propTypes: {
        question: React.PropTypes.object.isRequired,
        number: React.PropTypes.number.isRequired,
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
