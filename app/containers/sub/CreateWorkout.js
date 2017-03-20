import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    TouchableHighlight,
    Keyboard
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';


const CreateWorkout = React.createClass({

    getInitialState() {
        return {
            Error: null,
            name: null,
            template: !!this.props.template
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.Error) {
            Alert.alert(
                this.state.Error,
                this.state.Error,
                [
                    {text: 'OK', onPress: () => this.setState({Error: null})},
                ]
            );
        }
    },

    asyncActions(start, data = {}){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            if (data.routeName) {
                this.props.navigator.replace(getRoute(data.routeName, data.props))
            }
        }
    },

    isValid() {
        return this.state.name
    },


    _onSubmit() {
        if (this.isValid()) {
            this.props.actions.createWorkout(this.state, this.asyncActions);
        }
    },

    _cancel() {
        Alert.alert(
            'Are you sure you want to cancel?',
            'Your current step will not be saved',
            [
                {text: 'No', null, style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.navigator.pop()},
            ]
        );
    },


    render: function () {
        return (
            <View style={styles.flexCenter}>
                <BackBar back={this._cancel} backText="Cancel" navStyle={{height: 40}}/>

                <View style={{margin: 10}}>
                    <Text style={styles.inputLabel}>Program Name</Text>
                    <View style={styles.inputWrap}>
                        <TextInput ref="name" style={styles.textInput} autoCapitalize='sentences'
                                   underlineColorAndroid='transparent'
                                   autoCorrect={false}
                                   onChangeText={(text) => this.setState({name: text})}
                                   value={this.state.name}
                                   placeholderTextColor="#4d4d4d"
                                   placeholder="'Cutting'"/>
                    </View>
                </View>
                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                              text='Create Program'/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
    },
    button: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        right: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    submitText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    cancel: {
        color: '#d4d4d4',
    },
    inputWrap: {
        marginBottom: 12,
        borderBottomWidth: .5,
        borderColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    textInput: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'OpenSans-Light',
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        minHeight: 50,
        textAlign: 'center',
        flex: 1
    },
    inputLabel: {
        fontSize: getFontSize(25),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
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

export default connect(stateToProps, dispatchToProps)(CreateWorkout);
