import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ScrollView,
    RefreshControl
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as ProfileActions from '../../actions/profileActions';
import {getUser} from '../../actions/globalActions';

import {trunc, getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';


import AvatarImage from '../../components/AvatarImage';
import Loading from '../../components/Loading';

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


const MyProfile = React.createClass({
    propTypes: {
        navigation: React.PropTypes.object.isRequired,
        close: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            user: null,
        }
    },

    componentDidMount() {
        console.log('MY profile mounted')
    },

    scrollToTopEvent(args) {
        if (args.routeName == 'MyProfile') {
            const isTrue = true;
            this.refs.profile_list.scrollTo({y: 0, isTrue});
        }
    },


    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    _refresh() {
        this.props.getUser(refresh = true);
    },

    render() {
        const user = this.props.RequestUser;
        if (user) {
            let userImage = user.profile.avatar;
            if (user.profile.thumbnail)
                userImage = user.profile.thumbnail;
            return (
                <ScrollView style={GlobalStyle.noHeaderContainer} ref="profile_list">
                    <View style={[styles.userDetail, GlobalStyle.simpleBottomBorder]}>
                        <TouchableOpacity onPress={this.props.close} style={styles.back}>
                            <Icon name="keyboard-arrow-left" size={35} color='#333333'/>
                        </TouchableOpacity>
                        <AvatarImage style={styles.avatar} image={userImage}/>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>
                                {trunc(`${user.profile.first_name} ${user.profile.last_name}`, 26)}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.topRightNav}
                                          onPress={this._redirect.bind(null, 'EditProfile', null)}>
                            <Icon name="settings" size={30} color='#333333'/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )
        }
        return <Loading />;
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
        padding: 10,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    back: {
        left: 0,
        position: 'absolute',
        padding: 10,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        UserToken: state.Global.UserToken,
        Refreshing: state.Global.Refreshing
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ProfileActions, dispatch),
        getUser: bindActionCreators(getUser, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(MyProfile);
