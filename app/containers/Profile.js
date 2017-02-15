import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ProfileActions from '../actions/profileActions';
import {getUser} from '../actions/globalActions';

import {fetchData, API_ENDPOINT} from '../actions/utils';
import {getRoute} from '../routes';
import GlobalStyle from './globalStyle';


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


    render() {
        const user = this.state.user;
        console.log(user)
        return (
            <View style={GlobalStyle.container}>
                {user ?
                    <Text style={styles.welcomeMessage}>Hello, {user.profile.first_name}</Text> :
                    null
                }
            </View>
        )
    }
});


const styles = StyleSheet.create({});

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
