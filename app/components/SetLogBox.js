import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import t from 'tcomb-form-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';


const window = Dimensions.get('window');

const SetLogBox = React.createClass({
    propTypes: {
        set: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            value: null
        }
    },

    onChange(value) {
        this.setState({value: value});
    },


    render: function () {
        const set = this.props.set;
        let options = {
            stylesheet: stylesheet,
            auto: 'placeholders',
            fields: {
                weight: {
                    placeholder: set.weight ? set.weight.toString() : null,
                    onSubmitEditing: () => this.refs.form.getComponent('reps').refs.input.focus()
                },
                reps: {
                    placeholder: set.reps.toString(),
                }
            }
        };
        console.log(set)
        return (
            <View style={styles.setsHeader}>
                <Text style={styles.setColumn}>{set.order}</Text>
                <Form
                    ref="form"
                    type={Set}
                    options={options}
                    onChange={this.onChange}
                    value={this.state.value}
                />
            </View>
        )
    }
});

const Form = t.form.Form;

const Set = t.struct({
    weight: t.Number,
    reps: t.Number,
});

const styles = StyleSheet.create({
    setsHeader: {
        flexDirection: 'row',
    },
    setColumn: {
        width: window.width / 3,
        borderWidth: .5,
        borderColor: '#e1e3df',
        textAlign: 'center'
    }
});

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.fieldset = {
    flexDirection: 'row',
};

stylesheet.formGroup.normal.marginBottom = 0;
stylesheet.formGroup.error.marginBottom = 0;
stylesheet.textbox.normal.borderWidth = .5;
stylesheet.textbox.error.borderWidth = .5;
stylesheet.textbox.normal.borderColor = '#e1e3df';
stylesheet.textbox.normal.borderRadius = 0;
stylesheet.textbox.error.borderRadius = 0;
stylesheet.textbox.normal.textAlign = 'center';
stylesheet.textbox.error.textAlign = 'center';
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;
stylesheet.textbox.normal.justifyContent = 'center';
stylesheet.textbox.error.justifyContent = 'center';
stylesheet.textbox.normal.width = window.width / 3;
stylesheet.textbox.error.width = window.width / 3;

export default SetLogBox;
