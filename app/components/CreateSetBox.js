import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import t from 'tcomb-form-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';
import GlobalStyle from '../containers/globalStyle';


function template(locals, setIndex) {
    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex: .2, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{setIndex}</Text>
            </View>
            <View style={{flex: .4, justifyContent: 'center', alignItems: 'center'}}>
                {locals.inputs.reps}
            </View>
            <View style={{flex: .4, justifyContent: 'center', alignItems: 'center'}}>
                {locals.inputs.weight}
            </View>
        </View>
    );
}

const CreateSetBox = React.createClass({
    propTypes: {
        value: React.PropTypes.object.isRequired,
        setIndex: React.PropTypes.number.isRequired,
        setSetState: React.PropTypes.func.isRequired,
        _deleteSet: React.PropTypes.func
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
            template: (locals)=> template(locals, this.props.setIndex+1),
            auto: 'placeholders',
            stylesheet: stylesheet,
            fields: {
                reps: {
                    onSubmitEditing: () => this.refs.form.getComponent('weight').refs.input.focus()
                },
                weight: {
                    // label: 'Weight (lb)'
                },
                set: {
                    // editable: false,
                    hidden: true
                }
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

{/*<View style={styles.setTitleView}>*/
}
{/*<Text style={styles.setTitle}>Set {this.props.setIndex + 1}</Text>*/
}
{/*{typeof this.props._deleteSet === "function" ?*/
}
{/*<TouchableOpacity style={styles.edit} onPress={this._deleteSet}>*/
}
{/*<Icon name="times" size={20} color="red"/>*/
}
{/*</TouchableOpacity>*/
}
{/*: null*/
}
{/*}*/
}
{/*</View>*/
}


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
        // borderColor: 'black',
        // borderWidth: .5
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
    reps: t.Number,
    weight: t.maybe(t.Number),
});

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        marginRight: 5
    },
    error: {
        ...stylesheet.formGroup.error,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        borderColor: 'red',
        borderBottomWidth: 1,
        marginRight: 5
    }
};

stylesheet.textbox = {
    ...stylesheet.textbox,
    normal: {
        ...stylesheet.textbox.normal,
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

stylesheet.controlLabel = {
    ...stylesheet.controlLabel,
    normal: {
        ...stylesheet.controlLabel.normal,
        flex: 2
    },
    error: {
        ...stylesheet.controlLabel.error,
        flex: 2
    }
};


export default CreateSetBox;
