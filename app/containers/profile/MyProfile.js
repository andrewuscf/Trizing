import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text
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
        const {navigate} = this.props.navigation;
        if (user) {
            let userImage = user.profile.avatar;
            if (user.profile.thumbnail)
                userImage = user.profile.thumbnail;

            return (
                <ScrollView style={GlobalStyle.container} ref="profile_list"
                            showsVerticalScrollIndicator={false}>
                    <View style={[styles.userDetail, GlobalStyle.simpleBottomBorder]}>
                        <AvatarImage style={styles.avatar} image={userImage}/>
                        <View>
                            <Text style={styles.name}>
                                {trunc(`${user.profile.first_name} ${user.profile.last_name}`, 26)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={1} style={styles.link} onPress={()=> navigate('Payment')}>
                        <Text style={styles.basicText}>Payment</Text>
                        <MaterialIcon name="keyboard-arrow-right" size={getFontSize(26)} color="#7f7f7f"/>
                    </TouchableOpacity>
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
        marginLeft: 20,
        marginRight: 20
    },
    userDetail: {
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    name: {
        paddingTop: 5,
        fontFamily: 'Heebo-Bold',
        fontSize: getFontSize(22)
    },
    basicText: {
        // fontSize: 13,
        // fontFamily: 'Gotham-Medium',
        color: '#3D3C3A'
    },
    link: {
        height: 38,
        borderTopWidth: 1,
        borderColor: '#F5F5F5',
        paddingLeft: 20,
        paddingRight: 12,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
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
