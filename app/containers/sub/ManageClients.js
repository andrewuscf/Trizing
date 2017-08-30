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

import {fetchData, API_ENDPOINT, checkStatus, getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';

import * as HomeActions from '../../actions/homeActions';

import PersonBox from '../../components/PersonBox';
import TrainerBox from '../../components/TrainerBox';


const ManageClients = React.createClass({

    getInitialState() {
        return {
            filterText: null,
            showCancel: false,
            iconColor: '#a7a59f',
            fetchedUsers: []
        }
    },

    componentDidMount() {
        const isTrainer = this.props.RequestUser.type === 1;
        if (!this.props.Clients.length && isTrainer) {
            this.props.actions.getClients();
        }
        if (!this.state.fetchedUsers.length) {
            this.getUsersList();
        }
        this.props.navigation.setParams({headerTitle: isTrainer ? 'Manage Clients' : 'Trainers'});
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
        let url = `${API_ENDPOINT}user/list/`;
        if (text) url += `?search=${text}`;
        fetch(url, fetchData('GET', null, this.props.UserToken), 1)
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
        return clients.concat(this.state.fetchedUsers)
    },

    textChange(text) {
        if (text) {
            this.getUsersList(text);
        } else {
            this.props.actions.getClients(true);
        }
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

    renderSearchBar() {
        return (
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
        )
    },


    renderRow(person) {
        const isTrainer = this.props.RequestUser.type === 1;
        if (isTrainer) {
            return <PersonBox navigate={this.props.navigation.navigate} person={person} RequestUser={this.props.RequestUser}
                              removeClient={this.props.actions.removeClient}
                              sendRequest={this.props.actions.sendRequest}/>;
        }
        return <TrainerBox trainer={person} navigate={this.props.navigation.navigate}/>

    },


    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        const dataSource = ds.cloneWithRows(this.filterPeople());
        return (
            <ListView ref='peoplelist' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this.refresh}/>}
                      renderHeader={this.renderSearchBar}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={this.renderRow}
            />
        );

    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20
    },
    filterInput: {
        flex: 1,
        width: 105,
        color: '#797979',
        fontFamily: 'Heebo-Medium',
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingLeft: 5,
    },
    subNav: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        margin: 10,
        padding:10,
        borderWidth: 1,
        borderColor: '#e1e3df',
        borderRadius: 20,
    },
    sectionTitle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
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