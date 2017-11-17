import React from 'react';
const CreateClass = require('create-react-class');
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
import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';

import GlobalStyle from '../globalStyle';
import {API_ENDPOINT, checkStatus, stripeKey, getFontSize, setHeaders} from '../../actions/utils';

import CustomStatus from '../../components/CustomStatus';


stripe.init({publishableKey: stripeKey()});

const Payment = CreateClass({
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

    getCards(refresh = false) {
        if (refresh) this.setState({refresh: true});

        RNFetchBlob.fetch('GET', `${API_ENDPOINT}user/cards/`,
            setHeaders(this.props.UserToken)).then(checkStatus).then((responseJson) => {
            this.setState({cards: responseJson, value: null, loading: false, refresh: false});
        }).catch(() => {});
    },

    async handleCardPayPress() {
        try {
            this.setState({
                loading: true,
            });
            const token = await stripe.paymentRequestWithCardForm({
                requiredBillingAddressFields: 'full',
                smsAutofillDisabled: true
            });
            const API_DATA = JSON.stringify({stripeToken: token.tokenId});

            RNFetchBlob.fetch('POST', `${API_ENDPOINT}user/cards/`,
                setHeaders(this.props.UserToken), API_DATA).then(checkStatus).then((responseJson) => {
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

    deleteCard(card) {
        Alert.alert(
            `Delete card ending in ${card.last4}`,
            `Are you sure you want delete this card?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    onPress: () => {
                        RNFetchBlob.fetch('DELETE', `${API_ENDPOINT}user/card/${card.stripe_id}/`,
                            setHeaders(this.props.UserToken)).then(checkStatus)
                            .then((responseJson) => {
                                const index = _.findIndex(this.state.cards, {stripe_id: card.stripe_id});
                                if (responseJson.deleted) {
                                    this.setState({
                                        cards: this.state.cards.slice(0, index).concat(this.state.cards.slice(index + 1)),
                                        loading: false
                                    })
                                }
                            });
                    }
                },
            ]
        );
    },

    back() {
        this.props.navigation.goBack();
    },

    renderFooter() {
        return (
            <TouchableOpacity style={[styles.cardBox, {borderBottomWidth: 1}]} onPress={this.handleCardPayPress}>
                <Text style={GlobalStyle.lightBlueText}>ADD CARD</Text>
            </TouchableOpacity>
        )
    },

    renderRow(card) {
        return (
            <TouchableOpacity style={styles.cardBox} onPress={this.deleteCard.bind(null, card)}>
                <FontIcon name={`cc-${card.brand.toLowerCase()}`} size={getFontSize(17)}
                          style={GlobalStyle.lightBlueText}/>
                <Text style={styles.cardBoxLabel}>*****{card.last4}</Text>
            </TouchableOpacity>
        )
    },

    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.cards);
        return (
            <View style={GlobalStyle.container}>
                <CustomStatus/>
                <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                          onRefresh={() => this.getCards(true)}/>}
                          contentContainerStyle={{paddingTop: 10}}
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


