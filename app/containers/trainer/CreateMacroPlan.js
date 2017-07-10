import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as GlobalActions from '../../actions/globalActions';


const CreateNote = React.createClass({
    propTypes: {
        training_planId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        return {
            disabled: false,
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._save, disabled: this.state.disabled});
    },

    componentDidUpdate(prevProps, prevState){
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this._save, disabled: this.state.disabled});
        }
    },

    goBack() {
        this.setState({disabled:false});
        this.props.navigation.goBack();
    },

    createMacroPlan(data) {
        let jsondata = JSON.stringify(data);
        fetch(`${API_ENDPOINT}training/macros/`,
            fetchData('POST', jsondata, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                if (responseJson.id) {
                    this.setState({
                        macro_plans: [
                            responseJson,
                            ...this.state.macro_plans
                        ]
                    });
                }
            });
    },

    _save() {

    },


    render: function () {
        return (
            <View style={{flex: 1}}>
            </View>
        )
    }
});

const iconColor = '#8E8E8E';

const styles = StyleSheet.create({
    flexCenter: {
        flex: .9,
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#e1e3df',
        alignItems: 'center',
        minHeight: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: .1
    }
});


const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateNote);
