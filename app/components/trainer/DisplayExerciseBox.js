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

import SetLogBox from '../../components/SetLogBox';


const DisplayExerciseBox = React.createClass({
    propTypes: {
        exercise: React.PropTypes.object.isRequired,
        deleteSet: React.PropTypes.func,
        _editExercise: React.PropTypes.func,
        log: React.PropTypes.bool,
        workout: React.PropTypes.number,
        date: React.PropTypes.string
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
            this.props._editExercise(this.props.exercise);
    },

    _onDelete(){
        this.props.exercise.sets.forEach((set) => {
            this.props.deleteSet(set.id);
        });
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
        if (logs.length !== this.props.exercise.sets.length) {
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

        if (this.props.log) {
            sets = this.props.exercise.sets.map((set, i) => {
                return <SetLogBox ref={(row) => this.state.rows[i] = row} key={i} set={set} index={i}
                                  getStatus={this.getStatus}/>
            })
        }

        return (
            <TouchableOpacity style={styles.displayWorkoutBox} onPress={this.toggleDetails}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.simpleTitle}>{trunc(this.props.exercise.name, 36)}</Text>
                    {this.props.deleteSet && this.props._editExercise ?
                        <Menu >
                            <MenuTrigger>
                                <FontIcon name="ellipsis-h" size={getFontSize(35)}/>
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <MenuOption onSelect={this._redirect} text='Edit'/>
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
        fontSize: 18,
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
        fontFamily: 'Heebo-Medium',
        color: 'grey'
    },
});


export default DisplayExerciseBox;
