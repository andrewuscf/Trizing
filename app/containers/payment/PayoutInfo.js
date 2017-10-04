import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'lodash';
import t from 'tcomb-form-native';
// import stripe from 'tipsi-stripe';

import {getFontSize, stripeKey} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';
import {STATES} from '../../assets/constants';

import InputAccessory from '../../components/InputAccessory';
import {ModalPicker} from '../../components/ModalPicker';


const Form = t.form.Form;

const state_list = t.enums(STATES);

// stripe.init({publishableKey: stripeKey()});

function template(locals) {
    // in locals.inputs you find all the rendered fields
    return (
        <View>
            <Text style={styles.inputLabel}>Debit Card (For Payments)</Text>
            {locals.inputs.number}
            {locals.inputs.cvc}
            {locals.inputs.expMonth}
            {locals.inputs.expYear}
            <Text style={styles.inputLabel}>Fraud Prevention</Text>
            {locals.inputs.first_name}
            {locals.inputs.last_name}
            {locals.inputs.ssn_last_4}
            <Text style={styles.inputLabel}>Billing Address</Text>
            {locals.inputs.address_line_1}
            {locals.inputs.address_line_2}
            {locals.inputs.city}
            {locals.inputs.state}
            {locals.inputs.postal_code}
            {locals.inputs.phone_number}
        </View>
    );
}

const PayoutInfo = React.createClass({
    propTypes: {
        paymentInfo: React.PropTypes.object.isRequired,
        onPaymentInfoUpdate: React.PropTypes.func.isRequired
    },

    getInitialState() {
        let state = null;
        if (this.props.paymentInfo && this.props.paymentInfo.state && _.has(STATES, this.props.paymentInfo.state.toUpperCase())) {
            state = this.props.paymentInfo.state.toUpperCase()
        }
        return {
            value: {
                first_name: this.props.paymentInfo.first_name,
                last_name: this.props.paymentInfo.last_name,
                address_line_1: this.props.paymentInfo.address_line_1,
                address_line_2: this.props.paymentInfo.address_line_2,
                city: this.props.paymentInfo.city,
                state: state,
                postal_code: this.props.paymentInfo.postal_code,
                phone_number: this.props.paymentInfo.phone_number,
            },
            options: {
                auto: 'none',
                template: template,
                fields: {
                    first_name: {
                        onSubmitEditing: () => this.refs.form.getComponent('last_name').refs.input.focus(),
                        placeholder: 'First Name',
                        placeholderTextColor: '#7f7f7f',
                        autoCapitalize: 'sentences',
                        keyboardType: "ascii-capable",
                    },
                    last_name: {
                        onSubmitEditing: () => this.refs.form.getComponent('account_number').refs.input.focus(),
                        placeholder: 'Last Name',
                        placeholderTextColor: '#7f7f7f',
                        autoCapitalize: 'sentences',
                        keyboardType: "ascii-capable",
                    },
                    account_number: {
                        onSubmitEditing: () => this.refs.form.getComponent('routing_number').refs.input.focus(),
                        placeholder: this.props.paymentInfo.bank_account ? `.......${this.props.paymentInfo.bank_account.last4}` : 'Bank Account Number',
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "number-pad"
                    },
                    routing_number: {
                        onSubmitEditing: () => this.refs.form.getComponent('ssn_last_4') ?
                            this.refs.form.getComponent('ssn_last_4').refs.input.focus() :
                            this.refs.form.getComponent('address_line_1').refs.input.focus(),
                        placeholder: this.props.paymentInfo.bank_account ? `${this.props.paymentInfo.bank_account.routing_number}` : 'Bank Routing Number',
                        placeholderTextColor: '#7f7f7f',
                        maxLength: 9,
                        keyboardType: "number-pad"
                    },
                    ssn_last_4: {
                        onSubmitEditing: () => this.refs.form.getComponent('address_line_1').refs.input.focus(),
                        placeholder: 'Last 4 digits of SSN',
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "number-pad",
                    },
                    address_line_1: {
                        onSubmitEditing: () => this.refs.form.getComponent('address_line_2').refs.input.focus(),
                        placeholder: 'Address Line 1',
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "ascii-capable",
                    },
                    address_line_2: {
                        onSubmitEditing: () => this.refs.form.getComponent('city').refs.input.focus(),
                        placeholder: 'Address Line 2',
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "ascii-capable",
                    },
                    city: {
                        placeholder: 'City',
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "ascii-capable",
                    },
                    state: {
                        nullOption: {value: '', text: 'State'},
                        factory: Platform.OS === 'ios' ? ModalPicker : null
                    },
                    postal_code: {
                        onSubmitEditing: () => this.refs.form.getComponent('phone_number').refs.input.focus(),
                        placeholder: 'Zip',
                        placeholderTextColor: '#7f7f7f',
                    },
                    phone_number: {
                        placeholder: 'Phone Number',
                        placeholderTextColor: '#7f7f7f',
                    },
                }
            }
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit});
    },


    asyncActions(start, data) {
        if (start) {
            this.refs.post_button.setState({busy: true});
        } else {
            this.refs.post_button.setState({busy: false});
            if (data) {
                this.props.onPaymentInfoUpdate(data);
                this.back();
            }
        }
    },
    async handleBankData(data) {
        // try {
        //     // this.asyncActions(true);
        //     const token = await stripe.createTokenWithBankAccount({
        //         countryCode: 'US',
        //         currency: 'usd',
        //         accountNumber: data.account_number.toString(),
        //         routingNumber: data.routing_number.toString(),
        //         accountHolderType: 'individual',
        //         accountHolderName: `${data.first_name} ${data.last_name}`
        //     });
        //     const JSONDATA = {
        //         stripeToken: token.tokenId,
        //         ...data,
        //         account_number: data.account_number.substr(data.account_number.length - 4),
        //         routing_number: null
        //     };
        //     // this.props.actions.updatePaymentInfo(JSONDATA, this.asyncActions);
        // } catch (error) {
        //     console.log('Error:', error);
        //     Alert.alert(
        //         error.message,
        //         '',
        //         [
        //             {text: 'OK'}
        //         ]
        //     );
        //     this.setState({
        //         loading: false,
        //     })
        // }
    },

    _onSubmit() {
        const formValues = this.refs.form.getValue();
        if (formValues) {
            let values = {
                ...formValues,
                group: this.props.paymentInfo.group
            };
            if (formValues.account_number && formValues.routing_number) {
                this.handleBankData(values)
            } else {
                // this.props.actions.updatePaymentInfo(values, this.asyncActions);
            }

        }
    },

    onChange(value) {
        this.setState({value: value});
    },


    back() {
        this.props.navigation.goBack();
    },


    render() {
        let dataStruct = {
            number: t.String,
            cvc: t.String,
            expMonth: t.Number,
            expYear: t.Number,
            address_line_1: t.String,
            address_line_2: t.maybe(t.String),
            city: t.String,
            state: state_list,
            postal_code: t.Number,
            phone_number: t.Number,
        };
        if (!this.props.paymentInfo.verification_status || this.props.paymentInfo.verification_status !== 'verified') {
            dataStruct = {
                ...dataStruct,
                first_name: t.String,
                last_name: t.String,
            };
        }
        if (!this.props.paymentInfo.ssn_last_4_provided) {
            dataStruct = {
                ...dataStruct,
                ssn_last_4: t.String,
            };
        }

        let GROUP = t.struct(dataStruct);
        return (
            <View style={GlobalStyle.container}>
                <ScrollView style={GlobalStyle.container} showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <Form
                            ref="form"
                            type={GROUP}
                            options={this.state.options}
                            onChange={this.onChange}
                            value={this.state.value}
                        />
                    </View>
                </ScrollView>
                <InputAccessory/>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {},
    inputLabel: {
        fontFamily: 'Gotham-Medium',
        fontSize: 13,
        color: '#999999',
        marginBottom: 8,
        marginLeft: 38,
        marginTop: 25
    }
});


const stateToProps = (state) => {
    return {};
};
const dispatchToProps = (dispatch) => {
    return {}
};

export default connect(stateToProps, dispatchToProps)(PayoutInfo);


