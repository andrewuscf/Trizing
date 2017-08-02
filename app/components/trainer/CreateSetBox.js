import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import t from 'tcomb-form-native';
import _ from 'lodash';

import {getFontSize} from '../../actions/utils';

const CreateSetBox = React.createClass({
    propTypes: {
        value: React.PropTypes.object.isRequired,
        setIndex: React.PropTypes.number.isRequired,
        setSetState: React.PropTypes.func.isRequired,
        _deleteSet: React.PropTypes.func
    },


    template(locals) {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                {locals.inputs.weight}
                <Text style={{textAlign: 'center'}}>X</Text>
                {locals.inputs.reps}
                {typeof this.props._deleteSet !== 'undefined' ?
                    <TouchableOpacity style={{flex: .1, justifyContent: 'center', alignItems: 'center'}}
                                      onPress={this._deleteSet}>
                        <Icon name="remove-circle" size={20} color="red"/>
                    </TouchableOpacity>
                    : null}

            </View>
        );
    },

    onChange(value) {
        const formValues = this.refs.form.getValue();
        if (formValues) {
            this.props.setSetState(this.props.setIndex, formValues)
        }
    },

    _deleteSet() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Set',
            `Are you sure you want delete this set?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: () => this.props._deleteSet(this.props.setIndex)},
            ]
        );
    },


    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            // template: (locals) => this.template(locals),
            // auto: 'labels',
            stylesheet: stylesheet,
            fields: {
                weight: {
                    onSubmitEditing: () => this.refs.form.getComponent('reps').refs.input.focus(),
                    placeholder: 'lbs'
                },
                reps: {
                    placeholder: '10'
                }
            }
        };
        return (
            <View style={styles.setContainer}>
                <Form
                    ref="form"
                    type={Set}
                    options={options}
                    onChange={this.onChange}
                    value={this.props.value}
                />
                {/*<Text>test</Text>*/}
                {typeof this.props._deleteSet !== 'undefined' ?
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}
                                      onPress={this._deleteSet}>
                        <Icon name="remove-circle" size={20} color="red"/>
                    </TouchableOpacity>
                    : null}
            </View>
        )
    }
});

const styles = StyleSheet.create({
    setContainer: {
        margin: 10,
        borderWidth: 1,
        borderColor: '#e1e3df',
        borderRadius: 10,
        padding:10,
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: -5
    },
});


// T FORM SETUP
const Form = t.form.Form;

const Set = t.struct({
    weight: t.maybe(t.Number),
    reps: t.Number,
});

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
    },
    error: {
        ...stylesheet.formGroup.error,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: 'red',
        borderBottomWidth: 1,
    }
};

stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
        flex: 1,
        borderWidth: 0,
        marginBottom: 0,
        textAlign: 'center'
    },
    error: {
        ...stylesheet.textbox.error,
        borderWidth: 0,
        marginBottom: 0,
        textAlign: 'center'
    }
};

stylesheet.textboxView = {
    ...stylesheet.textboxView,
    normal: {
        ...stylesheet.textboxView.normal,
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0,
        flex: 1,
        backgroundColor: 'transparent',
    },
    error: {
        ...stylesheet.textboxView.error,
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0,
        flex: 1,
        backgroundColor: 'transparent',
    }
};


// stylesheet.pickerTouchable.normal.flex = 1;
// stylesheet.pickerTouchable.normal.justifyContent = 'center';
// stylesheet.pickerTouchable.error.flex = 1;
// stylesheet.pickerTouchable.error.justifyContent = 'center';
//
// stylesheet.pickerContainer.normal.borderWidth = 0;
// stylesheet.pickerContainer.normal.flex = 1;
// stylesheet.pickerContainer.normal.marginBottom = 0;
//
// stylesheet.pickerContainer.error.borderWidth = 0;
// stylesheet.pickerContainer.error.flex = 1;
// stylesheet.pickerContainer.error.marginBottom = 0;
// stylesheet.pickerValue.error.color = '#a94442';
//
// stylesheet.pickerValue.normal.textAlign = 'center';
// stylesheet.pickerValue.error.textAlign = 'center';

stylesheet.controlLabel.normal.flex = 1;
stylesheet.controlLabel.error.flex = 1;
stylesheet.controlLabel.normal.marginLeft = 5;
stylesheet.controlLabel.error.marginLeft = 5;


export default CreateSetBox;
