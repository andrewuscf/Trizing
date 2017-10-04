import React from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Platform,
    RefreshControl,
    Text,
    TextInput
} from 'react-native';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';

import GlobalStyle from '../../containers/globalStyle';
import {API_ENDPOINT, checkStatus, getFontSize, setHeaders} from '../../actions/utils';


const Earnings = React.createClass({

    getInitialState() {
        return {
            searchText: null,
            loading: true,
            charges: [],
            refresh: false,
            next: null,
            payoutInfo: null
        }
    },

    componentDidMount() {
        this.getReceipts();
        this.getPaymentInfo();
    },

    getPaymentInfo() {
        RNFetchBlob.fetch('GET', `${API_ENDPOINT}user/payout/info/`,
            setHeaders(this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                this.setState({payoutInfo: responseJson});
            }).catch((errorMessage) => {
            console.log(errorMessage.status)
        });
    },

    getReceipts(refresh = false) {
        let url = `${API_ENDPOINT}user/charges/`;
        if (refresh) {
            this.setState({refresh: true});
        }
        if (this.state.next && !refresh) url = this.state.next;

        this.setState({loading: true});

        RNFetchBlob.fetch('GET', url, setHeaders(this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.results) {
                    this.setState({
                        charges: responseJson.results,
                        refresh: false,
                        next: responseJson.next,
                        loading: false
                    });
                }
            }).catch((errorMessage) => {
            console.log(errorMessage)
            console.log(errorMessage.status)
        });
    },

    back() {
        this.props.navigation.goBack();
    },

    convertToMap() {
        const eventMap = {}; // Create the blank map
        this.state.charges.forEach((charge) => {
            if (!this.state.searchText || _.includes(charge.name.toLowerCase(), this.state.searchText.toLowerCase())) {
                const firstLetter = charge.name[0];
                if (!eventMap[firstLetter]) {
                    eventMap[firstLetter] = [];
                }
                eventMap[firstLetter].push(charge);
            }
        });
        return eventMap;

    },

    onChangeText(text) {
        this.setState({searchText: text});
    },

    onPaymentInfoUpdate(data) {
        this.setState({payoutInfo: data});
    },

    renderHeader() {
        if (!this.state.payoutInfo) return null;
        let charges_total = 0;
        let total_regs = 0;
        this.state.charges.forEach((charge) => {
            if (charge.charges_total) charges_total += charge.charges_total;
            if (charge.charges_count) total_regs += charge.charges_count;
        });
        charges_total = charges_total.toFixed(2);
        let payTo = null;
        if (this.state.payoutInfo) {
            if (this.state.payoutInfo.business_name && this.state.payoutInfo.account_type === 'company') {
                payTo = this.state.payoutInfo.business_name
            } else if (this.state.payoutInfo.bank_account &&
                this.state.payoutInfo.bank_account.account_holder_name &&
                this.state.payoutInfo.account_type === 'individual') {
                payTo = this.state.payoutInfo.bank_account.account_holder_name;
            }
        }
        const {navigate} = this.props.navigation;
        return (
            <View>
                <View style={[styles.topSection, {
                    marginBottom: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }]}>
                    <Text style={[styles.totalText, styles.greenText]}>${charges_total}</Text>
                    <Text style={[styles.totalReg]}>{total_regs} Registrations</Text>
                </View>
                <View style={[styles.topSection, {marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0}]}>
                    <Text style={[styles.totalText, styles.greenText]} onPress={() => {
                        if (this.state.payoutInfo) {
                            navigate('GroupPayouts', {
                                payoutInfo: this.state.payoutInfo,
                                groupId: this.props.groupId,
                                onPaymentInfoUpdate: this.onPaymentInfoUpdate
                            })
                        }
                    }}>
                        {this.state.payoutInfo.payout_total ? `$${this.state.payoutInfo.payout_total}` : '$0.00'}
                    </Text>
                    <Text style={[styles.totalReg]} onPress={() => {
                        if (this.state.payoutInfo) {
                            navigate('Earnings', {
                                payoutInfo: this.state.payoutInfo,
                                onPaymentInfoUpdate: this.onPaymentInfoUpdate
                            })
                        }
                    }}>
                        Paid out to: {payTo}
                    </Text>
                </View>
                <View style={[styles.subNav]}>
                    <MaterialIcon name="search" size={20} color='#797979'/>
                    <TextInput
                        ref="searchinput"
                        style={[styles.filterInput]}
                        underlineColorAndroid='transparent'
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholderTextColor='#a7a59f'
                        onChangeText={this.onChangeText}
                        value={this.state.searchText}
                        placeholder="Search"
                    />
                </View>
            </View>
        )
    },

    renderSectionHeader(sectionData, category) {
        if (!sectionData.length) return null;
        return <Text style={styles.sectionTitle}>{category}</Text>;
    },

    renderRow(charge, sectionId, rowId) {
        return (
            <View style={[styles.connectionBox,
                rowId == this.state.charges.length - 1 ? {
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10
                } : null]}>
                <View style={{flex: .9, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.name}>{charge.name}</Text>
                </View>
                <Text style={[styles.name, styles.greenText]}>
                    {charge.charges_total ? `$${charge.charges_total.toFixed(2)}` : '$0.00'}
                </Text>
            </View>
        )
    },


    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        let dataSource = ds.cloneWithRowsAndSections(this.convertToMap());
        return (
            <View style={GlobalStyle.container}>
                {/*<ListView removeClippedSubviews={(Platform.OS !== 'ios')}*/}
                {/*showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}*/}
                {/*style={[GlobalStyle.container]}*/}
                {/*refreshControl={<RefreshControl refreshing={this.state.refresh}*/}
                {/*onRefresh={() => this.getReceipts(true)}/>}*/}
                {/*enableEmptySections={true}*/}
                {/*renderHeader={this.renderHeader}*/}
                {/*renderSectionHeader={this.renderSectionHeader}*/}
                {/*dataSource={dataSource}*/}
                {/*renderRow={this.renderRow}*/}
                {/*/>*/}
            </View>
        );
    }
});

const styles = StyleSheet.create({
    filterInput: {
        flex: 1,
        width: 105,
        color: '#797979',
        fontSize: 14,
        fontFamily: 'Gotham-Medium',
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingLeft: 5,
        height: 50
    },
    subNav: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingLeft: 10
    },
    topSection: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 20,
        backgroundColor: 'white',
    },
    sectionTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Gotham-Medium',
        color: '#00BD89',
        paddingLeft: 10,
        paddingTop: 10,
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 10,
    },
    connectionBox: {
        flex: 1,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 10
    },
    name: {
        fontFamily: 'Gotham-Medium',
        fontSize: getFontSize(20),
    },
    greenText: {
        color: '#00BD89',
    },
    innerModal: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
        backgroundColor: 'white',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderTopWidth: .5,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalDetail: {
        fontSize: getFontSize(22),
        fontFamily: 'Gotham-Medium',
        color: 'grey',
        paddingTop: 20,
        paddingBottom: 20
    },
    chargeDescription: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    chargeText: {
        fontSize: getFontSize(18),
        fontFamily: 'Gotham-Medium',
    },
    totalText: {
        fontSize: getFontSize(72),
        fontFamily: 'Gotham-Medium',
    },
    totalReg: {
        fontSize: getFontSize(20),
        fontFamily: 'Gotham-Medium',
        color: 'grey'
    },
    buttonSection: {
        flexDirection: 'row'
    },
    modalButton: {
        flex: .5,
        marginTop: 0,
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        backgroundColor: 'transparent',
        borderColor: '#00BD89',
        borderWidth: 1,
        marginBottom: 30,
        borderRadius: 20
    },
    modalButtonText: {
        color: '#00BD89',
        fontSize: getFontSize(12),
        fontFamily: 'Gotham-Medium'
    },
    modalButtonGreen: {
        marginTop: 0,
        height: 40,
        width: getFontSize(250),
        marginBottom: 30,
        borderRadius: 20
    },
    clearButton: {
        backgroundColor: 'transparent',
        borderColor: '#00BD89',
        borderWidth: 1,
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken
    }
};

export default connect(stateToProps, null)(Earnings);


