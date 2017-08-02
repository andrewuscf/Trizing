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
                <Text style={{textAlign:'center'}}>X</Text>
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
            template: (locals) => this.template(locals),
            auto: 'placeholders',
            stylesheet: stylesheet,
            fields: {
                weight: {
                    onSubmitEditing: () => this.refs.form.getComponent('reps').refs.input.focus(),
                    // label: 'Weight (lb)'
                },
            }
        };
        return (
            <Form
                ref="form"
                type={Set}
                options={options}
                onChange={this.onChange}
                value={this.props.value}
            />
        )
    }
});

const styles = StyleSheet.create({
    setContainer: {
        flex: 1,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    titleSection: {
        textAlign: 'center',
    },
    setTitleView: {
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setTitle: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        flex: 1 / 3
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

stylesheet.formGroup.normal.flex = .4;
stylesheet.formGroup.error.flex = .4;

stylesheet.formGroup.normal.alignSelf = 'center';
stylesheet.formGroup.error.alignSelf = 'center';

stylesheet.formGroup.normal.height = 36;
stylesheet.formGroup.error.height = 36;

stylesheet.textboxView.normal.flex = 1;
stylesheet.textboxView.error.flex = 1;
stylesheet.textbox.normal.flex = 1;
stylesheet.textbox.error.flex = 1;


export default CreateSetBox;
