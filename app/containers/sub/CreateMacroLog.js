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
    // date: t.Date,
    carbs: t.Number,
    fats: t.Number,
    protein: t.Number
});

let myFormatFunction = (format, date) => {
    return moment(date).format(format);
};

const CreateMacroLog = React.createClass({
    propTypes: {
        macro_plan_day: React.PropTypes.number.isRequired,
        date: React.PropTypes.string,
    },

    getInitialState() {
        let value = null;
        if (this.props.date && moment(this.props.date).isValid()) {
            value = {
                // date: this.props.date? this.props.date: moment().format("MMMM DD YYYY"),
                carbs: null,
                fats: null,
                protein: null
            }
        }
        return {
            value: null,
            date: this.props.date? this.props.date: moment().format("MMMM DD YYYY"),
        }
    },

    componentDidUpdate() {
        if (this.state.value && this.state.value.carbs&& this.state.value.fats && this.state.value.protein) {
            this.refs.postbutton.setState({disabled: false});
        } else {
            this.refs.postbutton.setState({disabled: true});
        }
    },

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            if (data.routeName) {
                this.props.navigator.replace(getRoute(data.routeName, data.props))
            }
        }
    },


    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            values = {
                ...values,
                macro_plan_day: this.props.macro_plan_day
            };
            this.props.actions.addEditMacroLog(values);
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
            // i18n: {
                // optional: '',
                // required: '*',
            // },
            // stylesheet: t.form.Form.stylesheet,
            fields: {
                // date: {
                //     mode: 'date',
                //     config: {
                //         format: (date) => myFormatFunction("MMMM DD YYYY", date),
                //     }
                // }
            }
        };
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._cancel}>
                    <Text>{this.state.date}</Text>
                </BackBar>
                <Text style={[styles.title]}>Nutrition for the day</Text>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={MacroLog}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <SubmitButton buttonStyle={styles.button} disabled={true}
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
        margin: 50,
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 80
    },
    submitText: {
        color: 'white',
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-Bold',
    },
    title: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
        textAlign: 'center',
        marginTop: 20
    }
});



const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateMacroLog);
