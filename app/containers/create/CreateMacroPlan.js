import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as ProfileActions from '../../actions/profileActions';
import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

const CreateMacroPlan = React.createClass({
    propTypes: {
        training_plan_id: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            protein: null,
            name: null,
            carbs: null,
            fat: null,
            
            calories: null,
            active: false
        }
    },

    verify() {
        return !!(this.state.protein && this.state.carbs && this.state.fat && this.props.name);
        
    },

    _onPress() {
        if (this.verify()) {
            this.props.selectMacroPlan(this.props.questionnaire.id)
        } else {
            console.log('no plan')
        }
    },

    _onEdit() {
        console.log('edit hit')
    },


    render() {
        return (
            <View></View>
        );
    }
});

const styles = StyleSheet.create({
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(ProfileActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateMacroPlan);