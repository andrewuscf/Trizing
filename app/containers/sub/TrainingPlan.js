import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';


import GlobalStyle from '../globalStyle';


const TrainingPlan = React.createClass({
    propTypes: {
        trainerId: React.PropTypes.number.isRequired,
        clientId: React.PropTypes.number.isRequired,
        id: React.PropTypes.number,
    },

    getInitialState() {
        return {
            user: null,
            refreshing: false
        }
    },

    _createProgram() {
        console.log('fdslajf')
    },

    render() {
        if (this.props.id) {
            return (
                <View><Text>has training plan</Text></View>
            )
        }
        return (
            <TouchableOpacity onPress={this._createProgram} style={[styles.noTrainingPlan, GlobalStyle.simpleBottomBorder]}>
                <Text style={[styles.noTrainingPlanText,]}>Create a Training Program</Text>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    noTrainingPlan: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTrainingPlanText: {
        fontSize: 15,
        // color: '#C7C7CD'
        // fontFamily: 'OpenSans-Bold',
    }
});

export default TrainingPlan;
