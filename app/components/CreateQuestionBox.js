import React from 'react';
const CreateClass = require('create-react-class');
import {
    StyleSheet,
    Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';

import {getFontSize} from '../actions/utils';

const CreateQuestionBox = CreateClass({
    propTypes: {
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
