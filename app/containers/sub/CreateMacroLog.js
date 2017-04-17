import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import _ from 'lodash';
import moment from 'moment';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';


const Form = t.form.Form;

let MacroLog = t.struct({
    date: t.Date,
    carbs: t.Number,
    fats: t.Number,
    Protein: t.Number
});

let myFormatFunction = (format, date) => {
    return moment(date).format(format);
};

const CreateMacroLog = React.createClass({
    propTypes: {
        date: React.PropTypes.string,
    },

    getInitialState() {
        let value = null;
        if (this.props.date && moment(this.props.date).isValid()) {
            value = {
                date: this.props.date,
                carbs: null,
                fats: null,
                Protein: null
            }
        }
        return {
            value: null
        }
    },

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            // this.refs.postbutton.setState({busy: false});
            if (data.routeName) {
                this.props.navigator.replace(getRoute(data.routeName, data.props))
            }
        }
    },


    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            console.log(values);
        }
    },

    _cancel() {
        this.props.navigator.pop();
    },

    onChange(value) {
        this.setState({value});
    },

    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            stylesheet: stylesheet,
            fields: {
                date: {
                    mode: 'date',
                    config: {
                        format: (date) => myFormatFunction("MMMM DD YYYY", date),
                    }
                }
            }
        };
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._cancel} backText="Cancel" navStyle={{height: 40}}/>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={MacroLog}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                              text='Submit'/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    }
});

// T FORM SETUP
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup = {
    ...stylesheet.formGroup,
    normal: {
        ...stylesheet.formGroup.normal,
        marginBottom: 12,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    error: {
        ...stylesheet.formGroup.error,
        marginBottom: 12,
        borderBottomWidth: .5,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'stretch'
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
stylesheet.controlLabel = {
    ...stylesheet.controlLabel,
    normal: {
        ...stylesheet.controlLabel.normal,
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    },
    error: {
        ...stylesheet.controlLabel.error,
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    }
};


const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateMacroLog);
