import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'lodash';
import t from 'tcomb-form-native';
import stripe from 'tipsi-stripe';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {getFontSize, stripeKey, API_ENDPOINT, fetchData, checkStatus} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';
import {STATES} from '../../assets/constants';

import InputAccessory from '../../components/InputAccessory';
import {ModalPicker} from '../../components/ModalPicker';


const Form = t.form.Form;

const state_list = t.enums(STATES);

stripe.init({publishableKey: stripeKey()});

function template(locals) {
    return (
        <View>
            <Text style={styles.inputLabel}>Debit Card (For Payments)</Text>
            {locals.inputs.number}
            {locals.inputs.cvc}
            {locals.inputs.expMonth}
            {locals.inputs.expYear}
            {locals.inputs.first_name || locals.inputs.ssn_last_4 ?
                <Text style={styles.inputLabel}>Fraud Prevention</Text>
                :null
            }
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

function cc_format(value) {
    if (!value) return value;
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    let matches = v.match(/\d{4,19}/g);
    let match = matches && matches[0] || ''
    let parts = []

    for (i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
        return parts.join(' ')
    } else {
        return value
    }
}

const PayoutInfo = React.createClass({
    propTypes: {
        payoutInfo: React.PropTypes.object,
        onPaymentInfoUpdate: React.PropTypes.func.isRequired
    },

    getInitialState() {
        let state = null;
        if (this.props.payoutInfo && this.props.payoutInfo.state && _.has(STATES, this.props.payoutInfo.state.toUpperCase())) {
            state = this.props.payoutInfo.state.toUpperCase()
        }
        return {
            value: this.props.payoutInfo ? {
                first_name: this.props.payoutInfo.first_name,
                last_name: this.props.payoutInfo.last_name,
                address_line_1: this.props.payoutInfo.address_line_1,
                address_line_2: this.props.payoutInfo.address_line_2,
                city: this.props.payoutInfo.city,
                state: state,
                postal_code: this.props.payoutInfo.postal_code,
                phone_number: this.props.payoutInfo.phone_number,
            } : null,
            options: {
                auto: 'none',
                template: template,
                fields: {
                    number: {
                        onSubmitEditing: () => this.refs.form.getComponent('cvc').refs.input.focus(),
                        placeholder: "Card Number",
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "number-pad",
                        maxLength: 19,
                        transformer: {
                            format: (value) => cc_format(value),
                            parse: (value) => {
                                if (value) return value.replace(/ /g, '');
                                return value;
                            }
                        }
                    },
                    cvc: {
                        onSubmitEditing: () => this.refs.form.getComponent('expMonth').refs.input.focus(),
                        maxLength: 4,
                        placeholder: "CVC",
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "number-pad"
                    },
                    expMonth: {
                        placeholder: "Month",
                        placeholderTextColor: '#7f7f7f',
                        onSubmitEditing: () => this.refs.form.getComponent('expYear').refs.input.focus(),
                    },
                    expYear: {
                        onSubmitEditing: () => {
                            if (this.refs.form.getComponent('first_name')) {
                                this.refs.form.getComponent('first_name').refs.input.focus();
                            }
                            if (this.refs.form.getComponent('ssn_last_4')) {
                                this.refs.form.getComponent('ssn_last_4').refs.input.focus();
                            }
                            if (this.refs.form.getComponent('address_line_1')) {
                                this.refs.form.getComponent('address_line_1').refs.input.focus();
                            }
                        },
                        placeholder: "Year",
                        placeholderTextColor: '#7f7f7f'
                    },
                    first_name: {
                        onSubmitEditing: () => this.refs.form.getComponent('last_name').refs.input.focus(),
                        placeholder: 'First Name',
                        placeholderTextColor: '#7f7f7f',
                        autoCapitalize: 'sentences',
                        keyboardType: "ascii-capable",
                    },
                    last_name: {
                        onSubmitEditing: () => this.refs.form.getComponent('ssn_last_4').refs.input.focus(),
                        placeholder: 'Last Name',
                        placeholderTextColor: '#7f7f7f',
                        autoCapitalize: 'sentences',
                        keyboardType: "ascii-capable",
                    },
                    ssn_last_4: {
                        onSubmitEditing: () => this.refs.form.getComponent('address_line_1').refs.input.focus(),
                        placeholder: 'Last 4 digits of SSN',
                        placeholderTextColor: '#7f7f7f',
                        keyboardType: "number-pad",
                        maxLength: 4,
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
            this.props.navigation.setParams({handleSave: this._onSubmit, disabled: true});
        } else {
            this.props.navigation.setParams({handleSave: this._onSubmit, disabled: false});
            if (data) {
                this.props.onPaymentInfoUpdate(data);
                this.back();
            }
        }
    },

    async handCardData(data) {
        try {
            this.setState({
                loading: true,
            });
            const params = {
                ...data,
                name: `${this.props.RequestUser.profile.first_name} ${this.props.RequestUser.profile.last_name}`,
                addressLine1: data.address_line_1,
                addressLine2: data.address_line_2,
                addressCity: data.city,
                addressState: data.state,
                addressZip: data.postal_code.toString(),
                currency: 'usd',
            };
            const token = await stripe.createTokenWithCard(params);
            const API_DATA = JSON.stringify({stripeToken: token.tokenId, ...data});
            fetch(`${API_ENDPOINT}user/payout/info/`, fetchData('PATCH', API_DATA, this.props.UserToken))
                .then(checkStatus)
                .then((responseJson) => {
                    this.asyncActions(false, responseJson);
                }).catch((error) => {
                    this.asyncActions(false);
                });
        } catch (error) {
            console.log('Error:', error);
            Alert.alert(
                error.message,
                '',
                [
                    {text: 'OK'}
                ]
            );
            this.setState({
                loading: false,
            })
        }
    },

    _onSubmit() {
        const formValues = this.refs.form.getValue();
        if (formValues) {
            this.handCardData(formValues);
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
        if (!this.props.payoutInfo || !this.props.payoutInfo.verification_status || this.props.payoutInfo.verification_status !== 'verified') {
            dataStruct = {
                ...dataStruct,
                first_name: t.String,
                last_name: t.String,
            };
        }
        if (!this.props.payoutInfo || !this.props.payoutInfo.ssn_last_4_provided) {
            dataStruct = {
                ...dataStruct,
                ssn_last_4: t.String,
            };
        }

        let PERSON = t.struct(dataStruct);
        return (
            <View style={GlobalStyle.container}>
                <KeyboardAwareScrollView style={GlobalStyle.container} showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 50}}>
                    <View style={styles.content}>
                        <Text style={[styles.title, GlobalStyle.lightBlueText, {textAlign: 'center'}]} onPress={() => console.log('hit')}>
                            By creating a payout account, you agree to our terms and service. <MaterialIcon name="link" size={getFontSize(14)}/>
                        </Text>
                        <Form
                            ref="form"
                            type={PERSON}
                            options={this.state.options}
                            onChange={this.onChange}
                            value={this.state.value}
                        />
                    </View>
                </KeyboardAwareScrollView>
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
        fontFamily: 'Heebo-Medium',
        marginLeft: 15,
        marginTop: 25
    },
    title: {
        fontFamily: 'Heebo-Medium',
        fontSize: getFontSize(18),
        padding: 5
    }
});


const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        UserToken: state.Global.UserToken,
    };
};
const dispatchToProps = (dispatch) => {
    return {}
};

export default connect(stateToProps, dispatchToProps)(PayoutInfo);


