import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    Platform,
    RefreshControl,
    TouchableOpacity,
    ListView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import fetch from 'react-native-cancelable-fetch';

import {fetchData, API_ENDPOINT, validateEmail} from '../../actions/utils';

import * as HomeActions from '../../actions/homeActions';

import GlobalStyle from '../globalStyle';

import {EMPTY_AVATAR} from '../../assets/constants';

import BackBar from '../../components/BackBar';
import Loading from '../../components/Loading';
import PersonBox from '../../components/PersonBox';
import SubmitButton from '../../components/SubmitButton';

var {width: deviceWidth} = Dimensions.get('window');


const ManageClients = React.createClass({

    getInitialState() {
        return {
            filterText: null,
            flex: null,
            showCancel: false,
            iconColor: '#a7a59f',
            fetchedUsers: []
        }
    },

    componentWillMount() {
        if (!this.props.Clients.length) {
            this.props.actions.getClients();
        }
    },

    refresh() {
        this.props.actions.getClients(true);
    },

    onFocus() {
        this.setState({
            flex: 1,
            showCancel: true,
            iconColor: '#797979'
        });
    },

    _back() {
        this.props.navigator.pop();
    },

    getUsersList(text) {
        fetch(`${API_ENDPOINT}user/list/?search=${text}`, fetchData('GET', null, this.props.UserToken), 1)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    fetchedUsers: data.results
                });
            });
    },

    filterPeople() {
        let clients = this.props.Clients.filter((person) => {
            if (!this.state.filterText) {
                return person
            }
            var first_name = person.first_name.toLowerCase();
            var last_name = person.last_name.toLowerCase();
            if (_.includes(first_name, this.state.filterText.toLowerCase())
                || _.includes(last_name, this.state.filterText.toLowerCase())) {
                return person;
            }
        });
        clients = clients.concat(this.state.fetchedUsers);
        return clients
    },

    textChange(text) {
        this.getUsersList(text);
        this.setState({filterText: text});
    },

    clickCancel: function () {
        this.setState({
            filterText: null,
            flex: null,
            showCancel: false,
            iconColor: '#a7a59f'
        });
    },

    _renderCancel: function () {
        if (this.state.showCancel) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={this.clickCancel}>
                    <Icon name="times-circle" size={18} color="#4d4d4d"/>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    },

    renderSearchBar(){
        return (
            <View>
                <BackBar back={this._back}/>
                <View style={styles.subNav}>
                    <Icon name="search" size={16} color={this.state.iconColor}/>
                    <TextInput
                        ref="searchinput"
                        style={[styles.filterInput, {flex: this.state.flex}]}
                        underlineColorAndroid='transparent'
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholderTextColor='#a7a59f'
                        onChangeText={this.textChange}
                        onFocus={this.onFocus}
                        value={this.state.filterText}
                        placeholder="Search Clients or Send Invite with username"
                    />
                    {this._renderCancel()}
                </View>
            </View>
        )
    },


    render() {
        const user = this.props.RequestUser;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.filterPeople());
        return (
            <ListView ref='peoplelist' removeClippedSubviews={(Platform.OS !== 'ios')}
                      refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this.refresh}/>}
                      renderHeader={this.renderSearchBar}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(person) =>
                          <PersonBox navigator={this.props.navigator} person={person} RequestUser={user}
                                     removeClient={this.props.actions.removeClient}
                                     sendRequest={this.props.actions.sendRequest}/>
                      }
            />
        );

    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#edebe6'
    },
    filterInput: {
        width: 105,
        color: '#797979',
        fontSize: 14,
        fontFamily: 'OpenSans-Semibold',
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingLeft: 5
    },
    subNav: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: 40,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderColor: '#e1e3df',
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        width: deviceWidth,
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold'
    }
});


const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Refreshing: state.Global.Refreshing,
        UserToken: state.Global.UserToken,
        ...state.Home
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(HomeActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(ManageClients);