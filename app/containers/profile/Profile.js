import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import * as ProfileActions from '../../actions/profileActions';
import {getUser} from '../../actions/globalActions';

import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';


import AvatarImage from '../../components/AvatarImage';
import Loading from '../../components/Loading';

import TrainingPlan from '../sub/TrainingPlan';


moment.updateLocale('en', {
    relativeTime: {
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        s: "%ds",
        d: "1d",
        dd: "%dd",
    }
});


const Profile = React.createClass({
    propTypes: {
        id: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            user: null,
            refreshing: false,
            request: this.props.request
        }
    },

    scrollToTopEvent(args) {
        if (args.routeName == 'Profile') {
            const isTrue = true;
            this.refs.profile_list.scrollTo({y: 0, isTrue});
        }
    },


    componentDidMount() {
        this.getUser();
    },

    _refresh() {
        this.getUser(true);
    },

    getUser(refresh = false) {
        this.setState({refreshing: true});
        fetch(`${API_ENDPOINT}user/${this.props.id}/`, fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                this.setState({
                    user: responseJson,
                    refreshing: false
                })
            });
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    _respond(respond) {
        if (this.state.request) {
            let data = {accepted_at: moment().toISOString()};
            if (!respond) data = {rejected_at: moment().toISOString()};

            fetch(`${API_ENDPOINT}request/${this.state.request.id}/`,
                fetchData('PATCH', JSON.stringify(data), this.props.UserToken))
                .then(checkStatus)
                .then((responseJson) => {
                    this.setState({request: null});
                    this.getUser(true);
                });
        }
    },

    createQuestionnaire() {
        this.props.navigation.navigate('CreateQuestionnaire');
    },

    reportUser() {
        if (this.state.user) {
            fetch(`${API_ENDPOINT}user/reports/`,
                fetchData('POST', JSON.stringify({to_user: this.state.user.id}), this.props.UserToken))
            Alert.alert(
                'Report sent',
                '',
                [
                    {text: 'OK'},
                ],
            )
        }
    },

    _back() {
        this.props.navigation.goBack()
    },

    render() {
        const user = this.state.user;
        if (user) {
            let userImage = user.profile.avatar;
            if (user.profile.thumbnail)
                userImage = user.profile.thumbnail;
            return (
                <ScrollView style={GlobalStyle.noHeaderContainer} ref="profile_list">
                    <View style={[styles.userDetail, GlobalStyle.simpleBottomBorder]}>
                        <AvatarImage style={styles.avatar} image={userImage}/>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>
                                {trunc(`${user.profile.first_name} ${user.profile.last_name}`, 26)}
                            </Text>
                        </View>
                        <Menu style={{right: 0, position: 'absolute'}}>
                            <MenuTrigger style={styles.topRightNav}>
                                <Icon name="ellipsis-v" size={20} color='#333333'/>
                            </MenuTrigger>
                            <MenuOptions optionsContainerStyle={{alignSelf: 'center', width: 200, marginTop: 50}}>
                                <MenuOption onSelect={() => this.reportUser()} text='Report user'/>
                            </MenuOptions>
                        </Menu>

                        {(this.state.request && this.state.request.to_user == this.props.RequestUser.id) ?
                            <View style={styles.requestSection}>
                                {this.state.request.from_user.type == 1 ?
                                    <Text style={styles.requestText}>Wants to be your trainer</Text> :
                                    <Text style={styles.requestText}>Wants to be your client</Text>
                                }
                                <View style={styles.requestButtonSection}>
                                    <TouchableOpacity style={[styles.requestButtons, styles.accept]}
                                                      onPress={this._respond.bind(null, true)}>
                                        <Icon name="check" size={20} color='white'/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.requestButtons, styles.deny]}
                                                      onPress={this._respond.bind(null, false)}>
                                        <Icon name="times" size={20} color='red'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                        }
                    </View>
                    {this.props.RequestUser.id == user.profile.trainer ?
                        <TrainingPlan client={user} UserToken={this.props.UserToken}
                                      openModal={this.createQuestionnaire}
                                      training_plan={user.training_plan}
                                      _redirect={this._redirect}/>
                        : null
                    }
                </ScrollView>
            )
        }
        return <Loading />
    }
});


const styles = StyleSheet.create({
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },
    userDetail: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userInfo: {
        marginTop: 10
    },
    name: {
        paddingTop: 5,
        fontFamily: 'OpenSans-Bold',
        fontSize: getFontSize(22)
    },
    topRightNav: {
        right: 0,
        position: 'absolute',
        padding: 15,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    requestSection: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    requestText: {
        fontSize: getFontSize(18),
        fontFamily: 'OpenSans-SemiBold',
    },
    requestButtonSection: {
        marginTop: 10,
        flexDirection: 'row'
    },
    requestButtons: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        bottom: 0,
        borderRadius: 20
    },
    accept: {
        backgroundColor: 'green',
        marginRight: 5
    },
    deny: {
        borderColor: 'red',
        borderWidth: .5
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        UserToken: state.Global.UserToken,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ProfileActions, dispatch),
        getUser: bindActionCreators(getUser, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(Profile);
