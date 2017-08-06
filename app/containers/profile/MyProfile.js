import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import * as ProfileActions from '../../actions/profileActions';
import {getUser} from '../../actions/globalActions';

import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';


import AvatarImage from '../../components/AvatarImage';
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
    },

    getInitialState() {
        return {
            user: null,
            duration: 'month',
            macro_response: null,
            refreshing: false,
        }
    },

    componentWillMount() {
        this.props.navigation.setParams({
            handleSave: this._toEditProfile,
            saveText: <MaterialIcon name="settings" size={getFontSize(24)} color='#00AFA3'/>
        });
    },

    _toEditProfile() {
        this.props.navigation.navigate('EditProfile');
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

    _refresh() {
        this.props.getUser(true);
    },

    render() {
        const user = this.props.RequestUser;
        if (user) {
            let userImage = user.profile.avatar;
            if (user.profile.thumbnail)
                userImage = user.profile.thumbnail;

            return (
                <ScrollView style={GlobalStyle.container} ref="profile_list"
                            showsVerticalScrollIndicator={false}>
                    <View style={[styles.userDetail, GlobalStyle.simpleBottomBorder]}>
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
        // marginTop: -30,
    },
    userDetail: {
        paddingTop: 20,
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
