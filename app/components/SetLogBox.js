import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const window = Dimensions.get('window');

const SetLogBox = CreateClass({
    propTypes: {
        set: PropTypes.object.isRequired,
        getStatus: PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            value: this.props.value,
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (prevState.value !== this.state.value) {
            this.props.getStatus();
        }
    },

    isCompleted() {
        let isComplete = false;
        const value = this.state.value;
        if (value) {
            const set = this.props.set;

            if (set.weight && set.reps) {
                isComplete = !!value.reps && !!value.weight
            } else if (set.reps) {
                isComplete = !!value.reps
            }

        }
        return isComplete;
    },

    onChange(value) {
        this.setState({value: value});
    },

    template(locals) {
        let isComplete = this.isCompleted();

        return (
            <View style={styles.rowSection}>
                <View style={[styles.topSection, {paddingTop: 10, paddingBottom: 10}]}>
                    <Text>{this.props.set.order}</Text>
                </View>
                <View style={[styles.topSection]}>
                    {locals.inputs.weight}
                </View>
                <View style={[styles.topSection]}>
                    {locals.inputs.reps}
                </View>
                <TouchableOpacity style={[styles.topSection, {paddingTop: 10, paddingBottom: 10}]}
                                  onPress={this.completeSet}>
                    {isComplete ?
                        <MaterialIcon name="check-circle" size={20} color="green"/> :
                        <MaterialIcon name="check" size={20}/>
                    }
                </TouchableOpacity>
            </View>
        )
    },

    completeSet() {
        const value = this.state.value;
        if (value) {
            this.setState({value: null})
        } else {
            const set = this.props.set;

            this.setState({
                value: {
                    weight: set.weight ? set.weight : null,
                    reps: set.reps ? set.reps : null,
                }
            })
        }
    },


    render: function () {
        const set = this.props.set;
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            stylesheet: stylesheet,
            template: this.template,
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

        const Set = t.struct({
            weight: set.weight ? t.Number : t.maybe(t.Number),
            reps: t.Number,
        });

        return (
            <Form
                ref="form"
                type={Set}
                options={options}
                onChange={this.onChange}
                value={this.state.value}
            />
        )
    }
});

const Form = t.form.Form;

const styles = StyleSheet.create({
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topSection: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#e1e3df',
        borderWidth: .5,
        flex: 1,
        borderTopWidth: 0,
    },
});

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
stylesheet.formGroup.normal.marginBottom = 0;
stylesheet.formGroup.error.marginBottom = 0;

stylesheet.formGroup.normal.flex = 1;
stylesheet.formGroup.error.flex = 1;

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;

stylesheet.textbox.error.borderWidth = .5;
//
stylesheet.textbox.normal.textAlign = 'center';
stylesheet.textbox.error.textAlign = 'center';
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;
stylesheet.textbox.normal.width = ( window.width / 4 ) - 10;
stylesheet.textbox.error.width = (window.width / 4) - 10;

export default SetLogBox;
