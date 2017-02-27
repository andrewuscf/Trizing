import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as ProfileActions from '../actions/profileActions';
import {getUser, removeToken} from '../actions/globalActions';

import {fetchData, API_ENDPOINT, trunc} from '../actions/utils';
import {getRoute} from '../routes';
import GlobalStyle from './globalStyle';


import AvatarImage from '../components/AvatarImage';
import BackBar from '../components/BackBar';
import Loading from '../components/Loading';

import TrainingPlan from './sub/TrainingPlan';


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
        id: React.PropTypes.number.isRequired
    },

    getInitialState() {
        return {
            user: null,
            refreshing: false
        }
    },


    componentDidMount() {
        this.getUser();
    },

    _refresh() {
        this.getUser(true);
    },

    getUser(refresh = false) {
        if (this.props.id == this.props.RequestUser.id) {
            if (refresh)
                this.props.getUser();
            else
                this.setState({user: this.props.RequestUser});
        } else {
            fetch(`${API_ENDPOINT}user/${this.props.id}/`, fetchData('GET', null, this.props.UserToken))
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        user: responseJson
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },

    onEndReached() {
        console.log('End reach')
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },

    _back() {
        this.props.navigator.pop();
    },

    _logOut() {
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.removeToken()},
            ]
        );
    },


    render() {
        const user = this.state.user;
        if (user) {
            const isRequestUser = user.id == this.props.RequestUser.id;
            let userImage = user.profile.avatar;
            if (user.profile.thumbnail)
                userImage = user.profile.thumbnail;
            return (
                <View style={GlobalStyle.container}>
                    <BackBar back={this._back}>
                        <Text style={styles.userNameTop}>{trunc(user.username, 26)}</Text>
                        {isRequestUser ?
                            <TouchableOpacity style={styles.logOut} onPress={this._logOut}>
                                <Icon name="power-off" size={20} color='red'/>
                            </TouchableOpacity>
                            : null
                        }
                    </BackBar>
                    <ScrollView ref='scrollView' keyboardDismissMode='interactive'
                                style={styles.mainContainer} contentContainerStyle={styles.contentContainerStyle}>
                        <View style={[styles.userDetail, GlobalStyle.simpleBottomBorder]}>
                            <AvatarImage style={styles.avatar} image={userImage}/>
                            <View style={styles.userInfo}>
                                <Text
                                    style={styles.name}>{trunc(`${user.profile.first_name} ${user.profile.last_name}`, 26)}</Text>
                                <Text>Last Active:
                                    <Text> {moment(user.checked_notifications).fromNow(false)}</Text>
                                </Text>
                            </View>
                            {isRequestUser ?
                                <TouchableOpacity onPress={this._redirect.bind(null, 'EditProfile', null)}>
                                    <Icon name="pencil" size={20} color='red'/>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                        {this.props.RequestUser.id == user.profile.trainer ?
                            <TrainingPlan clientId={user.id} UserToken={this.props.UserToken}
                                          training_plan={user.training_plan}
                                          _redirect={this._redirect}/>
                            : null
                        }
                    </ScrollView>
                </View>
            )
        }
        return <Loading />
    }
});


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    userNameTop: {
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    userDetail: {
        padding: 20,
        flexDirection: 'row'
    },
    userInfo: {
        paddingLeft: 20
    },
    name: {
        fontFamily: 'OpenSans-Bold',
    },
    logOut: {
        position: 'absolute',
        top: 10,
        right: 10
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
        removeToken: bindActionCreators(removeToken, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Profile);
