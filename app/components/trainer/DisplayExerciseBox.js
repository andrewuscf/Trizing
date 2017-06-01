import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
} from 'react-native';

import {getFontSize} from '../../actions/utils';


const DisplayExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        _editExercise: React.PropTypes.func
    },

    _redirect: function () {
        Keyboard.dismiss();
        if (this.props._editExercise)
            this.props._editExercise(this.props.exercise);
    },

    onEdit(){

    },


    render: function () {
        const sets = this.props.exercise.sets.map((set, index)=>{
            return (
                <View key={index} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex: .2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>{set.order}</Text>
                    </View>
                    <View style={{flex: .4, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>{set.weight}</Text>
                    </View>
                    <View style={{flex: .4, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>{set.reps}</Text>
                    </View>
                </View>
            )
        })
        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this._redirect}>
                <Text style={styles.simpleTitle}>{this.props.exercise.name}</Text>
                <View style={styles.bottom}>
                    <View style={[styles.title]}>
                        <Text style={[styles.titleSection, {flex:.2}]}>SET</Text>
                        <Text style={[styles.titleSection, {flex:.4}]}>LBS</Text>
                        <Text style={[styles.titleSection, {flex:.4}]}>REPS</Text>
                    </View>
                    {sets}
                </View>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        borderColor: '#e1e3df',
        borderRadius: 5,
        borderWidth: 1,
        margin: 5,
        marginBottom: 0,
        padding:10
    },
    top: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    simpleTitle: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
        margin: 10,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    titleSection: {
        textAlign: 'center',
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-Semibold',
    },
    edit: {
        // marginRight: 20
        // margin: 20,
    },
});


export default DisplayExerciseBox;
