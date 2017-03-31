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

import * as CalendarActions from '../../actions/calendarActions';
import {getFontSize} from '../../actions/utils';
// import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import SelectInput from '../../components/SelectInput';
import SubmitButton from '../../components/SubmitButton';


const CreateEvent = React.createClass({
    componentDidMount() {
        this.refs.form.getComponent('title').refs.input.focus()
    },

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            this.props.navigator.pop();
        }
    },


    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            console.log(values)
        }
    },

    _cancel() {
        this.props.navigator.pop();
    },

    render: function () {
        let options = {
            i18n: {
                optional: '',
                required: '*',
            },
            stylesheet: stylesheet,
            fields: {
                title: {
                    label: 'Event title',
                    // onSubmitEditing: () => this._onSubmit()
                },
            }
        };
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._cancel} backText="Cancel">
                    <Text style={{fontSize: getFontSize(24)}}>Create Event</Text>
                </BackBar>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={Event}
                        options={options}
                    />
                </View>
                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                              text='Create'/>
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
const Form = t.form.Form;

const Event = t.struct({
    title: t.String,
});
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
    return {
        RequestUser: state.Global.RequestUser,
        ...state.Calendar
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(CalendarActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateEvent);
