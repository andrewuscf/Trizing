import React from 'react';
import {
    View,
    Text,
    StyleSheet,
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

    getInitialState() {
        return {
            showDetails: false,
        }
    },

    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails})
    },

    _redirect: function () {
        Keyboard.dismiss();
        if (this.props._editExercise)
            this.props._editExercise(this.props.exercise);
    },

    _onDelete(){
        this.props.exercise.sets.forEach((set) => {
            this.props.deleteSet(set.id);
        });
    },


    render: function () {
        const sets = this.props.exercise.sets.map((set, index) => {
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
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this.toggleDetails}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.simpleTitle}>{this.props.exercise.name}</Text>
                    <Menu style={{}}>
                        <MenuTrigger>
                            <MaterialIcon name="linear-scale" size={25}/>
                        </MenuTrigger>
                        <MenuOptions customStyles={optionsStyles}>
                            <MenuOption onSelect={this._redirect} text='Edit'/>
                            <MenuOption onSelect={this._onDelete} text='Delete'/>
                        </MenuOptions>
                    </Menu>
                </View>
                <View style={styles.dateSection}>
                    {!this.state.showDetails ?
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.day}>{sets.length} {sets.length === 1 ? 'set': 'sets'}</Text>
                        </View>
                        : null
                    }
                </View>
                {this.state.showDetails ?
                    <View style={styles.bottom}>
                        <View style={[styles.title]}>
                            <Text style={[styles.titleSection, {flex: .2}]}>SET</Text>
                            <Text style={[styles.titleSection, {flex: .4}]}>LBS</Text>
                            <Text style={[styles.titleSection, {flex: .4}]}>REPS</Text>
                        </View>
                        {sets}
                    </View> : null}
            </TouchableOpacity>
        )
    }
});


const optionsStyles = {
    optionsContainer: {
        paddingTop: 5,
    },
    optionsWrapper: {},
    optionWrapper: {
        margin: 5,
    },
    optionTouchable: {
        activeOpacity: 70,
    },
    optionText: {},
};


const styles = StyleSheet.create({
    displayWorkoutBox: {
        flex: 1,
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    top: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    simpleTitle: {
        fontSize: getFontSize(28),
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
    dateSection: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        paddingTop: 5,
        borderColor: '#e1e3df',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    day: {
        fontSize: getFontSize(18),
        fontFamily: 'OpenSans-Semibold',
        color: 'grey'
    },
});


export default DisplayExerciseBox;
