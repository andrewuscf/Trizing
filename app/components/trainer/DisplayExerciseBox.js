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

import {getFontSize, trunc} from '../../actions/utils';

import SetLogBox from '../../components/SetLogBox';


const DisplayExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        deleteSet: React.PropTypes.func.isRequired,
        _editExercise: React.PropTypes.func.isRequired,
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
        let sets = this.props.exercise.sets.map((set, index) => {
            return (
                <View key={index} style={styles.rowSection}>
                    <View style={styles.topSection}>
                        <Text>{set.order}</Text>
                    </View>
                    <View style={styles.topSection}>
                        <Text>{set.weight}</Text>
                    </View>
                    <View style={styles.topSection}>
                        <Text>{set.reps}</Text>
                    </View>
                </View>
            )
        });
        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this.toggleDetails}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.simpleTitle}>{trunc(this.props.exercise.name, 36)}</Text>
                    <Menu >
                        <MenuTrigger>
                            <MaterialIcon name="linear-scale" size={30}/>
                        </MenuTrigger>
                        <MenuOptions customStyles={optionsStyles}>
                            <MenuOption onSelect={this._redirect} text='Edit'/>
                            <MenuOption onSelect={this._onDelete} text='Delete'/>
                        </MenuOptions>
                    </Menu>
                </View>
                {!this.state.showDetails ?
                    <View style={styles.dateSection}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.day}>{sets.length} {sets.length === 1 ? 'set' : 'sets'}</Text>
                        </View>
                    </View>
                    : null
                }
                {this.state.showDetails ?
                    <View>
                        <View style={styles.rowSection}>
                            <View style={styles.topSection}>
                                <Text>#</Text>
                            </View>
                            <View style={styles.topSection}>
                                <Text>LBS</Text>
                            </View>
                            <View style={styles.topSection}>
                                <Text>REPS</Text>
                            </View>
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
    simpleTitle: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
        marginBottom: 5,
    },
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#e1e3df',
        borderWidth: .5,
    },
    topSection: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: '#e1e3df',
        // borderWidth: .5,
        paddingTop: 5,
        paddingBottom: 5,
        flex: 1
    },
    dateSection: {
        marginLeft: 5,
        marginRight: 5,
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
