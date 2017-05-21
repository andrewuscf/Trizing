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
import BackBar from '../../components/BackBar';
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


const MyProfile = React.createClass({

    getInitialState() {
        return {
            user: null,
        }
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

    createQuestionnaire() {
        this.props.navigation.navigate('CreateQuestionnaire');
    },


    _back() {
        this.props.navigation.goBack()
    },

    render() {
        const user = this.props.RequestUser;
        if (user) {
            let userImage = user.profile.avatar;
            if (user.profile.thumbnail)
                userImage = user.profile.thumbnail;
            return (
                <ScrollView style={GlobalStyle.noHeaderContainer} ref="profile_list"
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={this._refresh}/>}>
                    <View style={[styles.userDetail, GlobalStyle.simpleBottomBorder]}>
                        <AvatarImage style={styles.avatar} image={userImage}/>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>
                                {trunc(`${user.profile.first_name} ${user.profile.last_name}`, 26)}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.topRightNav}
                                          onPress={this._redirect.bind(null, 'EditProfile', null)}>
                            <Icon name="gear" size={20} color='#333333'/>
                        </TouchableOpacity>
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
        padding: 15,
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
