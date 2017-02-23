import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ProfileActions from '../../actions/profileActions';
import GlobalStyle from '../globalStyle';


import Loading from '../../components/Loading';


const TrainingPlan = React.createClass({
    propTypes: {
        clientId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            user: null,
            loading: true
        }
    },

    _createProgram() {
        console.log('fdslajf')
    },

    render() {
        if (this.state.loading)
            return <Loading />;
        return (
            <View style={GlobalStyle.container}>
                <Text>Training Plan</Text>
            </View>
        )
    }
});


const styles = StyleSheet.create({
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
    }
};

export default connect(stateToProps, dispatchToProps)(TrainingPlan);

