import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {getFontSize} from '../../actions/utils';


const DisplayExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        deleteSet: React.PropTypes.func.isRequired,
        _editExercise: React.PropTypes.func.isRequired
    },

    _redirect: function () {
        Keyboard.dismiss();
        if (this.props._editExercise)
            this.props._editExercise(this.props.exercise);
    },

    _onDelete(){
        console.log(this.props.exercise)
        this.props.exercise.sets.forEach((set)=>{
            this.props.deleteSet(set.id);
        });
        // this.props.actions.deleteSet(setId);
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
        });
        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this._redirect}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.simpleTitle}>{this.props.exercise.name}</Text>
                    <Menu style={{}}>
                        <MenuTrigger>
                            <MaterialIcon name="menu" size={25}/>
                        </MenuTrigger>
                        <MenuOptions customStyles={optionsStyles}>
                            <MenuOption onSelect={this._redirect} text='Edit'/>
                            <MenuOption onSelect={this._onDelete} text='Delete'/>
                        </MenuOptions>
                    </Menu>
                </View>
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



const optionsStyles = {
    optionsContainer: {
        // backgroundColor: 'green',
        paddingTop: 5,
    },
    optionsWrapper: {
        // backgroundColor: 'purple',
    },
    optionWrapper: {
        // backgroundColor: 'yellow',
        margin: 5,
        // borderBottomWidth: 1, borderColor: 'grey'
    },
    optionTouchable: {
        // underlayColor: 'gold',
        activeOpacity: 70,
    },
    optionText: {
        // color: 'brown',
    },
};


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
