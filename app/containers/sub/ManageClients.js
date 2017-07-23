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


const ManageClients = React.createClass({

    getInitialState() {
        return {
            filterText: null,
            showCancel: false,
            iconColor: '#a7a59f',
            fetchedUsers: []
        }
    },

    componentDidMount(){
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
        const isTrainer = this.props.RequestUser.type === 1;

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

        if (isTrainer) {
            return {'Clients': clients, 'Users': this.state.fetchedUsers};
        }
        return {'Trainers': this.state.fetchedUsers};


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

    renderSearchBar(){
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

    renderSectionHeader: function (sectionData, category) {
        if (!sectionData.length) return null;
        return <View style={[GlobalStyle.simpleBottomBorder]}><Text
            style={styles.sectionTitle}>{category}</Text></View>;
    },


    render() {
        const user = this.props.RequestUser;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        const dataSource = ds.cloneWithRowsAndSections(this.filterPeople());
        return (
            <ListView ref='peoplelist' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      refreshControl={<RefreshControl refreshing={this.props.Refreshing} onRefresh={this.refresh}/>}
                      renderHeader={this.renderSearchBar}
                      renderSectionHeader={this.renderSectionHeader}
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
        paddingBottom: 20
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
        height: 60,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
    },
    sectionTitle: {
        paddingTop:5,
        paddingBottom: 5,
        paddingLeft: 10,
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-Bold',
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