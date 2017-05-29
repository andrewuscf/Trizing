import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import t from 'tcomb-form-native';

import {getFontSize} from '../actions/utils';

const CreateQuestionBox = React.createClass({
    propTypes: {
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
        let options = {
            // stylesheet: stylesheet,
            fields: {
                text: {
                    onSubmitEditing: () => Keyboard.dismiss(),
                    label: `Question ${this.props.number}`,
                    autoCapitalize: 'sentences'
                },
            }
        };
        return (
                <Form
                    ref="form"
                    type={Question}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />
        )
    }
});

const Form = t.form.Form;

const Question = t.struct({
    text: t.String,
});

const styles = StyleSheet.create({
});

export default CreateQuestionBox;
