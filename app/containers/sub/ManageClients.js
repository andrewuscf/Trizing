import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
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

import {fetchData, API_ENDPOINT, validateEmail, checkStatus} from '../../actions/utils';

import * as HomeActions from '../../actions/homeActions';

import GlobalStyle from '../globalStyle';

import {EMPTY_AVATAR} from '../../assets/constants';

import BackBar from '../../components/BackBar';
import Loading from '../../components/Loading';
import PersonBox from '../../components/PersonBox';
import SubmitButton from '../../components/SubmitButton';


const ManageClients = React.createClass({

    getInitialState() {
        return {
            filterText: null,
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
            showCancel: true,
            iconColor: '#797979'
        });
    },

    getUsersList(text) {
        fetch(`${API_ENDPOINT}user/list/?search=${text}`, fetchData('GET', null, this.props.UserToken), 1)
            .then(checkStatus)
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
            const first_name = person.profile.first_name.toLowerCase();
            const last_name = person.profile.last_name.toLowerCase();
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
            showCancel: false,
            iconColor: '#a7a59f',
            fetchedUsers: []
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

    _back() {
        this.props.navigation.goBack()
    },

    renderSearchBar(){
        return (
            <View>
                <BackBar back={this._back} navStyle={{height: 40}}/>
                <View style={styles.subNav}>
                    <Icon name="search" size={16} color={this.state.iconColor}/>
                    <TextInput
                        ref="searchinput"
                        style={[styles.filterInput]}
                        underlineColorAndroid='transparent'
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholderTextColor='#a7a59f'
                        onChangeText={this.textChange}
                        onFocus={this.onFocus}
                        value={this.state.filterText}
                        placeholder="Search"
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
                      keyboardShouldPersistTaps="handled"
                      refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this.refresh}/>}
                      renderHeader={this.renderSearchBar}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(person) =>
                          <PersonBox navigate={this.props.navigation.navigate} person={person} RequestUser={user}
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
    },
    filterInput: {
        flex: 1,
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
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
    },
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