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
            success: false
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
    },

    asyncActions(start) {
        if (start) {
            // Need to setup some type of failure
        } else {
            this.setState({success: true});
            setTimeout(() => {
                this.setState({success: false});
                this._back();
            }, 2000);
        }
    },

    _back() {
        this.props.navigation.goBack()
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
        this._back();
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
                {this.state.success ?
                    <View style={{flex: .1, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: getFontSize(24)}}>
                            Success
                        </Text>
                    </View>
                    :
                    null
                }
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
            </View>
        )
    }
});

CreateMacroLog.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    const date = (state.params.date && moment(state.params.date).isValid()) ?
        moment(state.params.date).format("MMMM DD, YYYY") : moment().format("MMMM DD, YYYY");
    return {
        headerTitle: date
    }
};

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
