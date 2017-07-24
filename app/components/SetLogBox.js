import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';

function template(locals, order) {
    return (
        <View style={styles.rowSection}>
            <View style={[styles.topSection, {paddingTop: 10, paddingBottom: 10}]}>
                <Text>{order}</Text>
            </View>
            <View style={[styles.topSection, locals.hasError? {borderColor: '#a94442'}: null]}>
                {locals.inputs.weight}
            </View>
            <View style={[styles.topSection, ]}>
                {locals.inputs.reps}
            </View>
        </View>
    )
}



const window = Dimensions.get('window');

const SetLogBox = React.createClass({
    propTypes: {
        set: React.PropTypes.object.isRequired,
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
        const set = this.props.set;
        let options = {
            stylesheet: stylesheet,
            template: (locals)=>template(locals, set.order),
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

const Set = t.struct({
    weight: t.Number,
    reps: t.Number,
});

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
        flex:1
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

stylesheet.textbox.normal.textAlign = 'center';
stylesheet.textbox.error.textAlign = 'center';
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;
stylesheet.textbox.normal.width =( window.width / 3 )- 10;
stylesheet.textbox.error.width = (window.width / 3)-10;

export default SetLogBox;
