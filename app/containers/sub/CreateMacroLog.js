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
    fats: t.Number,
    carbs: t.Number,
    protein: t.Number
});

let myFormatFunction = (format, date) => {
    return moment(date).format(format);
};

const CreateMacroLog = React.createClass({
    propTypes: {
        macro_plan_day: React.PropTypes.object.isRequired,
        date: React.PropTypes.string,
    },

    getInitialState() {
        return {
            value: null,
            date: (this.props.date && moment(this.props.date).isValid()) ?
                moment(this.props.date).format("MMMM DD YYYY") : moment().format("MMMM DD YYYY"),
        }
    },

    componentDidUpdate() {
        if (this.state.value && this.state.value.carbs && this.state.value.fats && this.state.value.protein) {
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
            this.props.navigator.pop();
        }
    },


    _onSubmit() {
        let values = this.refs.form.getValue();
        if (values) {
            values = {
                ...values,
                macro_plan_day: this.props.macro_plan_day.id
            };
            this.props.actions.addEditMacroLog(values, this.asyncActions);
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
            fields: {
                fats: {
                    onSubmitEditing: () => this.refs.form.getComponent('carbs').refs.input.focus()
                },
                carbs: {
                    onSubmitEditing: () => this.refs.form.getComponent('protein').refs.input.focus()
                },
                protein: {
                    onSubmitEditing: () => this._onSubmit()
                },
            }
        };
        // let calories = 0;
        const fats = (this.props.macro_plan_day.fats) ? this.props.macro_plan_day.fats : 0;
        const protein = (this.props.macro_plan_day.protein) ? this.props.macro_plan_day.protein : 0;
        const carbs = (this.props.macro_plan_day.carbs) ? this.props.macro_plan_day.carbs : 0;
        // calories = (9 * fats) + (4 * protein) + (4 * carbs);
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._cancel}>
                    <Text>{this.state.date}</Text>
                </BackBar>
                <Text style={[styles.title]}>Nutrition for the day</Text>
                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center', paddingTop: 10}]}>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Fats</Text>
                        <Text style={styles.smallText}>{`${fats}g`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Carbs</Text>
                        <Text style={styles.smallText}>{`${carbs}g`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Protein</Text>
                        <Text style={styles.smallText}>{`${protein}g`}</Text>
                    </View>
                </View>
                <View style={{margin: 10}}>
                    <Form
                        ref="form"
                        type={MacroLog}
                        options={options}
                        onChange={this.onChange}
                        value={this.state.value}
                    />
                </View>
                <SubmitButton disabled={!(this.state.value && this.state.value.carbs && this.state.value.fats && this.state.value.protein)}
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
    },
    row: {
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: getFontSize(20),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
    },
    details: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        alignItems: 'center'
    },
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
