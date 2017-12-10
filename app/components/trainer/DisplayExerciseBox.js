import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';

import {getFontSize, trunc} from '../../actions/utils';

import GlobalStyle from "../../containers/globalStyle";


const DisplayExerciseBox = CreateClass({
    propTypes: {
        set_group: PropTypes.object.isRequired,
        deleteSetGroup: PropTypes.func.isRequired,
        _editExercise: PropTypes.func.isRequired,
        addNote: PropTypes.func.isRequired
    },

    _redirect: function () {
        this.props._editExercise(this.props.set_group);
    },

    _onDelete() {
        this.props.deleteSetGroup(this.props.set_group.id);
    },

    toAddNote() {
        this.props.addNote(this.props.set_group)
    },

    onLongPress() {
        Alert.alert(
            `What would you like to do?`,
            ``,
            [
                // {
                //     text: 'Add Note',
                //     onPress: this.toAddNote
                // },
                {
                    text: 'Delete',
                    onPress: this._onDelete,
                    style: 'destructive'
                },
                {text: 'Cancel', style: 'cancel'},
            ]
        );
    },


    render: function () {
        return (
            <TouchableOpacity style={[styles.displayWorkoutBox]} onPress={this._redirect} onLongPress={this.onLongPress}>
                <View style={{flexDirection: 'column', flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.simpleTitle}>{this.props.set_group.exercise.name}</Text>
                    </View>
                </View>
                <View style={[styles.setCircle, {borderColor: 'green'}]}>
                    <Text style={[{fontSize: getFontSize(12)}, {color: 'green'}]}>
                        {this.props.set_group.sets.length}
                    </Text>
                    <Text style={[{fontSize: getFontSize(10)}, {color: 'green'}]}>
                        {this.props.set_group.sets.length === 1 ? 'SET' : 'SETS'}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
});



const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        padding: 10,
        margin: 10,
        marginBottom: 0,
        borderRadius: 7,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    setCircle: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 25,
        width: 50,
        height: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Bold',
        marginBottom: 5,
    },
});


export default DisplayExerciseBox;
