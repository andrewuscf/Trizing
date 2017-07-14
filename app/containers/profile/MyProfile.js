import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';

import * as ProfileActions from '../../actions/profileActions';
import {getUser} from '../../actions/globalActions';

import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';


import AvatarImage from '../../components/AvatarImage';
import CustomBack from '../../components/CustomBack';
import CustomIcon from '../../components/CustomIcon';
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
            duration: 'month',
            macro_response: null,
            refreshing: false,
        }
    },

    componentDidMount() {
        // this.getMacroLogs()
    },


    getMacroLogs() {
        // macros/logs/
        fetch(`${API_ENDPOINT}training/macros/logs/?duration=${this.state.duration}`,
            fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
            console.log(responseJson)
                this.setState({
                    macro_response: responseJson,
                    refreshing: false
                })
            });
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
                <ScrollView style={GlobalStyle.noHeaderContainer} ref="profile_list"
                            showsVerticalScrollIndicator={false}>
                    <View style={[styles.userDetail, GlobalStyle.simpleBottomBorder]}>
                        <CustomBack back={this.props.close} right={<TouchableOpacity style={styles.topRightNav}
                                                                                     onPress={this._redirect.bind(null, 'EditProfile', null)}>
                            <CustomIcon name="settings" size={getFontSize(30)} color='#333333'/>
                        </TouchableOpacity>}/>
                        <AvatarImage style={styles.avatar} image={userImage} cache={true}/>
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
        marginTop: -30,
    },
    userDetail: {
        paddingBottom: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    topRightNav: {
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
