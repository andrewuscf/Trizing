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
import FontIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {getFontSize, trunc} from '../../actions/utils';


import AvatarImage from '../../components/AvatarImage';
import SetLogBox from '../../components/SetLogBox';
import GlobalStyle from "../../containers/globalStyle";


const DisplayExerciseBox = React.createClass({
    propTypes: {
        set_group: React.PropTypes.object.isRequired,
        deleteSetGroup: React.PropTypes.func,
        _editExercise: React.PropTypes.func,
        log: React.PropTypes.bool,
        workout: React.PropTypes.number,
        date: React.PropTypes.string,
        addNote: React.PropTypes.func
    },

    getInitialState() {
        return {
            showDetails: false,
            rows: [],
            isComplete: false,
        }
    },

    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails})
    },

    _redirect: function () {
        Keyboard.dismiss();
        if (this.props._editExercise)
            this.props._editExercise(this.props.set_group);
    },

    _onDelete() {
        this.props.deleteSetGroup(this.props.set_group.id);
    },

    setData() {
        const logs = [];
        for (const row of this.state.rows) {
            if (row && row.refs.form) {
                const formValues = row.refs.form.getValue();
                if (formValues) {
                    logs.push({
                        exercise_set: row.props.set.id,
                        reps: formValues.reps,
                        weight: formValues.weight,
                        workout: this.props.workout,
                        date: this.props.date ? this.props.date : moment().format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (logs.length !== this.props.set_group.sets.length) {
            this.setState({showDetails: true});
            return null;
        } else {
            this.setState({showDetails: false});
        }
        return logs;
    },

    getStatus() {
        let isComplete = true;
        for (const row of this.state.rows) {
            if (!row.isCompleted()) {
                isComplete = false;
                break;
            }
        }
        if (this.state.isComplete !== isComplete) {
            this.setState({isComplete: isComplete});
        }

    },

    toAddNote() {
        this.props.addNote(this.props.set_group)
    },


    render: function () {
        let sets = null;
        let notes = this.props.set_group.exercise.notes.map((note, i) => {
            return (
                <View key={i} style={{}}>
                    <Text>{i + 1}. {note.text}</Text>
                </View>
            )
        });

        if (this.props.log) {
            sets = this.props.set_group.sets.map((set, i) => {
                return <SetLogBox ref={(row) => this.state.rows[i] = row} key={i} set={set} index={i}
                                  getStatus={this.getStatus}/>
            })
        } else {
            sets = this.props.set_group.sets.map((set, index) => {
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
        }

        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this.toggleDetails}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {this.props.set_group.exercise.image ?
                            <AvatarImage image={this.props.set_group.exercise.image} style={styles.exerciseImage} cache={true}/>
                            : null
                        }
                        <Text style={styles.simpleTitle}>{trunc(this.props.set_group.exercise.name, 30)}</Text>
                    </View>
                    {this.props.deleteSetGroup && this.props._editExercise ?
                        <Menu>
                            <MenuTrigger>
                                <FontIcon name="ellipsis-h" size={getFontSize(35)}/>
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption onSelect={this._redirect} text='Edit'/>
                                {typeof this.props.addNote !== 'undefined' ?
                                    <MenuOption onSelect={this.toAddNote} text='Add note'/>
                                    : null
                                }
                                <MenuOption onSelect={this._onDelete} text='Delete'/>
                            </MenuOptions>
                        </Menu>
                        : this.state.isComplete ?
                            <MaterialIcon name="check-circle" size={20} color="green"/> :
                            <MaterialIcon name="check" size={20}/>

                    }
                </View>
                {!this.state.showDetails ?
                    <View style={styles.dateSection}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.day}>{sets.length} {sets.length === 1 ? 'set' : 'sets'}</Text>
                        </View>
                    </View>
                    : null
                }
                <View style={[this.state.showDetails ? {flex: 1, opacity: 1} : {width: 0, height: 0, opacity: 0}]}>
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
                        {this.props.log ?
                            <View style={styles.topSection}>
                                {this.state.isComplete ?
                                    <MaterialIcon name="check-circle" size={20} color="green"/> :
                                    <MaterialIcon name="check" size={20}/>
                                }
                            </View>
                            : null
                        }
                    </View>
                    {sets}
                    {notes.length ?
                        <View style={[styles.noteSection]}>
                            <Text style={styles.smallBold}>Notes:</Text>
                            <View style={GlobalStyle.simpleTopBorder}/>
                            {notes}
                        </View>
                        : null
                    }
                </View>
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
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Bold',
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
        fontFamily: 'Heebo-Medium',
        color: 'grey'
    },
    noteSection: {
        margin: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    smallBold: {
        fontSize: getFontSize(16),
        fontFamily: 'Heebo-Bold',
        // paddingLeft: 10,
        // paddingBottom: 5
    },
    exerciseImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 5
    }
});


export default DisplayExerciseBox;
