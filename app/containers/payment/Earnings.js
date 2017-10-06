import React from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Platform,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';

import AvatarImage from '../../components/AvatarImage';
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
            this.setState({loading: false});
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
            if (!this.state.searchText || _.includes(charge.customer.name.toLowerCase(), this.state.searchText.toLowerCase())) {
                const firstLetter = charge.customer.name[0];
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
        let content = (
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
        )
        if (!this.state.payoutInfo && !this.state.loading) {
            content = (
                <View style={{flexWrap: 'wrap'}}>
                    <Text style={[styles.totalReg, {textAlign: 'center'}]}>
                        In order to get paid you must setup your payout method here:
                    </Text>
                    <TouchableOpacity style={styles.cardBox}
                                      onPress={() => this.props.navigation.navigate('PayoutInfo', {onPaymentInfoUpdate: this.onPaymentInfoUpdate})}>
                        <Text style={[styles.totalReg, GlobalStyle.lightBlueText]}>Setup payout</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <View>
                {this.state.payoutInfo ?
                    <View style={[styles.topSection, {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        marginBottom: 0,
                        flexWrap: 'wrap'
                    }]}>
                        <Text style={[styles.totalText, GlobalStyle.lightBlueText]}>{this.state.payoutInfo.payout_total ? `$${this.state.payoutInfo.payout_total}` : '$0.00'}</Text>
                        <Text style={[styles.totalReg]} onPress={() => this.props.navigation.navigate('PayoutInfo', {
                            onPaymentInfoUpdate: this.onPaymentInfoUpdate,
                            payoutInfo: this.state.payoutInfo
                        })}>
                            Paid out to: {this.state.payoutInfo.first_name} {this.state.payoutInfo.last_name}
                        </Text>
                    </View>
                    : null
                }
                {content}
            </View>
        )
    },

    renderSectionHeader(sectionData, category) {
        if (!sectionData.length) return null;
        return <Text style={styles.sectionTitle}>{category}</Text>;
    },

    renderRow(charge, sectionId, rowId) {
        let refunded = charge.refunded || charge.disputed;
        return (
            <View activeOpacity={1} style={[styles.connectionBox,
                rowId == this.state.charges.length - 1 ? {
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10
                } : null]}>
                <View style={[{flex: .9, flexDirection: 'row', alignItems: 'center'}, refunded ? {opacity: .4} : null]}>
                    <AvatarImage image={charge.customer.image} style={styles.avatar} cache={true}/>
                    <Text style={styles.name}>{charge.customer.name}</Text>
                </View>
                {refunded ?
                    <Text style={[styles.name, {color: 'red'}]}>
                        -{charge.amount_refunded ? `$${parseFloat(charge.amount_refunded).toFixed(2)}` : '$0.00'}
                    </Text> :
                    <Text style={[styles.name, GlobalStyle.lightBlueText]}>
                        {charge.amount ? `$${parseFloat(charge.amount).toFixed(2)}` : '$0.00'}
                    </Text>
                }
            </View>
        )
    },

    refresh() {
        this.getReceipts(true);
        this.getPaymentInfo();
    },


    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        let dataSource = ds.cloneWithRowsAndSections(this.convertToMap());
        return (
            <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                      showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                      style={[GlobalStyle.container]}
                      refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                      onRefresh={this.refresh}/>}
                      enableEmptySections={true}
                      renderHeader={this.renderHeader}
                      renderSectionHeader={this.renderSectionHeader}
                      dataSource={dataSource}
                      renderRow={this.renderRow}
            />
        );
    }
});

const styles = StyleSheet.create({
    filterInput: {
        flex: 1,
        width: 105,
        color: '#797979',
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Medium',
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
        fontFamily: 'Heebo-Medium',
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
        fontFamily: 'Heebo-Medium',
        fontSize: getFontSize(20),
    },
    totalText: {
        fontSize: getFontSize(72),
        fontFamily: 'Heebo-Medium',
    },
    totalReg: {
        fontSize: getFontSize(20),
        fontFamily: 'Heebo-Medium',
        color: 'grey'
    },
    cardBox: {
        borderColor: '#e1e3df',
        borderWidth: 1,
        margin: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken
    }
};

export default connect(stateToProps, null)(Earnings);


