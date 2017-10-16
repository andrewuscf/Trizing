import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

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


    render: function () {
        return (
            <View style={[styles.displayWorkoutBox]}>
                <Menu>
                    <MenuTrigger style={[{flexDirection: 'row', alignItems: 'center'}]}>
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
                    </MenuTrigger>
                    <MenuOptions customStyles={optionsStyles}>
                        <MenuOption onSelect={this._redirect} text='Edit'/>
                        {/*<MenuOption onSelect={this.toAddNote} text='Add note'/>*/}
                        <MenuOption onSelect={this._onDelete} text='Delete'/>
                    </MenuOptions>
                </Menu>
            </View>
        )
    }
});


const optionsStyles = {
    optionsContainer: {
        paddingTop: 5,
        // position: 'as'
    },
    optionsWrapper: {
        // alignSelf: 'flex-end'
    },
    optionWrapper: {
        margin: 5,
        // alignSelf: 'flex-end'
    },
    optionTouchable: {
        activeOpacity: 70,
    },
    optionText: {},
};


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: .5,
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
