import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';

import * as ProfileActions from '../actions/profileActions';
import {getUser} from '../actions/globalActions';

import {fetchData, API_ENDPOINT, trunc} from '../actions/utils';
import {getRoute} from '../routes';
import GlobalStyle from './globalStyle';

import AvatarImage from '../components/AvatarImage';
import BackBar from '../components/BackBar';
import Loading from '../components/Loading';

import TrainingPlan from './create/TrainingPlan';


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


    render() {
        const user = this.state.user;
        if (user) {
            console.log(JSON.stringify(user));
            let userImage = user.profile.avatar;
            if (user.profile.thumbnail)
                userImage = user.profile.thumbnail;
            return (
                <View style={GlobalStyle.container}>
                    <BackBar back={this._back}>
                        <Text style={styles.userNameTop}>{trunc(user.username, 26)}</Text>
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
                        </View>
                        {this.props.RequestUser.id == user.profile.trainer ?
                            <TrainingPlan trainerId={this.props.RequestUser.id} clientId={user.id} />
                            : null}
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
        flex: 3,
        alignSelf: 'center',
        textAlign: 'center',
        paddingLeft: -30,
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
        getUser: bindActionCreators(getUser, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Profile);
