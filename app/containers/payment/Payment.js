import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import stripe from 'tipsi-stripe';
import FontIcon from 'react-native-vector-icons/FontAwesome';

import GlobalStyle from '../globalStyle';
import {fetchData, API_ENDPOINT, checkStatus, stripeKey, getFontSize} from '../../actions/utils';

import CustomStatus from '../../components/CustomStatus';
import SubmitButton from '../../components/SubmitButton';


stripe.init({publishableKey: stripeKey()});

const Payment = React.createClass({
    propTypes: {
        addCard: React.PropTypes.func,
    },

    getInitialState() {
        return {
            loading: true,
            cards: [],
            refresh: false,
        }
    },

    componentWillMount() {
        this.getCards();
    },

    getCards() {
        fetch(`${API_ENDPOINT}user/cards/`, fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                this.setState({cards: responseJson, value: null, loading: false});
            }).catch((error) => console.log(error))
    },

    async handleCardPayPress(data) {
        try {
            this.setState({
                loading: true,
            });
            const params = {
                ...data,
                name: `${this.props.RequestUser.profile.first_name} ${this.props.RequestUser.profile.last_name}`,
            };
            const token = await stripe.paymentRequestWithCardForm({
                requiredBillingAddressFields: 'full',
                smsAutofillDisabled: true
            });
            const API_DATA = JSON.stringify({stripeToken: token.tokenId});
            fetch(`${API_ENDPOINT}user/cards/`, fetchData('POST', API_DATA, this.props.UserToken))
                .then(checkStatus)
                .then((responseJson) => {
                    if (responseJson.last4) {
                        this.setState({cards: [responseJson, ...this.state.cards], value: null, loading: false});
                        if (this.props.addCard) {
                            this.props.addCard(responseJson);
                        }
                    }
                })
        } catch (error) {
            console.log('Error:', error.message);
            this.setState({
                loading: false,
            })
        }
    },

    deleteCard() {
        this.setState({loadiPaymentng: true});
        if (this.state.cards[0]) {
            fetch(`${API_ENDPOINT}user/card/${this.state.cards[0].stripe_id}/`, fetchData('DELETE', null, this.props.UserToken))
                .then(checkStatus)
                .then((responseJson) => {
                    // if (responseJson.deleted) {
                    //     this.setState({cards: [], loading: false})
                    // }
                })
        }
    },

    back() {
        this.props.navigation.goBack();
    },

    renderFooter() {
        return (
            <TouchableOpacity style={[styles.cardBox,{borderBottomWidth: 1}]} onPress={this.handleCardPayPress}>
                <Text style={GlobalStyle.lightBlueText}>ADD CARD</Text>
            </TouchableOpacity>
        )
    },

    renderRow(card) {
        console.log(card)
        return (
            <View style={styles.cardBox}>
                <FontIcon name={`cc-${card.brand.toLowerCase()}`} size={getFontSize(17)}
                          style={GlobalStyle.lightBlueText}/>
                <Text style={styles.cardBoxLabel}>*****{card.last4}</Text>
            </View>
        )
    },

    _refresh() {

    },


    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.cards);
        return (
            <View style={GlobalStyle.container}>
                <CustomStatus/>
                <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true}
                          dataSource={dataSource}
                          showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                          renderFooter={this.renderFooter}
                />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    token: {
        height: 20,
    },
    cardBox: {
        borderColor: '#e1e3df',
        borderWidth: 1,
        borderBottomWidth: 0,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardBoxLabel: {
        color: '#7f7f7f'
    },
});


const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken,
        RequestUser: state.Global.RequestUser
    }
};

export default connect(stateToProps, null)(Payment);


