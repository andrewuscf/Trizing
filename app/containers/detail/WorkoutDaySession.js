import React from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {logSets} from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../../containers/globalStyle';

const window = Dimensions.get('window');

const WorkoutDaySession = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
        date: React.PropTypes.string
    },

    getInitialState() {
        return {
            set_groups: this.props.workout_day.exercises,
            disabled: false,
            logs: []
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this._onSubmit, disabled: this.state.disabled});
    },

    componentDidUpdate(prevProps, prevState){
        if (prevState.disabled !== this.state.disabled) {
            this.props.navigation.setParams({handleSave: this._onSubmit, disabled: this.state.disabled});
        }
    },

    asyncActions(success) {
        this.setState({disabled: false});
        if (success) {
            this.dropdown.alertWithType('success', 'Success', 'You have logged your workout session.');
            setTimeout(() => {
                this.setState({value: null});
                this.props.navigation.goBack();
            }, 1000);
        } else {
            this.dropdown.alertWithType('error', 'Error', "Couldn't log workout session.")
        }
    },


    _onSubmit() {
        let completed = true;
        let totalLogs = [];
        for (const set_group of this.state.set_groups) {
            if (set_group.logs && set_group.logs.length === set_group.sets.length) {
                totalLogs = totalLogs.concat(set_group.logs);
            } else {
                completed = false;
            }
        }
        if (completed) {
            this.setState({disabled: true});
            this.props.logSets(totalLogs, this.asyncActions);
        }
    },

    saveLogs(setGroupId, logs) {
        this.setState({
            set_groups: this.state.set_groups.map((set_group) => set_group.id === setGroupId ?
                {
                    ...set_group,
                    logs: logs
                }
                : set_group
            )
        });
    },

    _toDetail(props) {
        this.props.navigation.navigate('SetGroupDetail', {
            ...props,
            saveLogs: this.saveLogs,
            date: this.props.date,
            workout: this.props.workout_day.workout
        });
    },

    _renderItem(object){
        let isComplete = false;
        const set_group = object.item;
        if (set_group.logs && set_group.logs.length === set_group.sets.length) {
            isComplete = true;
        }
        return (
            <TouchableOpacity style={[styles.displayWorkoutBox, {flexDirection: 'row', alignItems: 'center'}]}
                              onPress={this._toDetail.bind(null, {set_group: set_group})}>
                <View style={{flexDirection: 'column', flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.simpleTitle}>{set_group.exercise.name}</Text>
                    </View>
                </View>
                <View style={[styles.setCircle, isComplete ? {borderColor: 'green'} : {borderColor: '#ff473d'}]}>
                    {isComplete ?
                        <MaterialIcon name="check" size={getFontSize(20)} style={{color: 'green'}}/> :
                        <Text style={[{fontSize: getFontSize(12)}, {color: '#ff473d'}]}>
                            {set_group.sets.length}
                        </Text>
                    }
                    {!isComplete ?
                        <Text style={[{fontSize: getFontSize(10)}, {color: '#ff473d'}]}>
                            {set_group.sets.length === 1 ? 'SET' : 'SETS'}
                        </Text>
                        : null
                    }
                </View>
            </TouchableOpacity>
        )
    },

    _renderHeader() {
        if (!this.props.workout_day.notes || !this.props.workout_day.notes.length) return null;
        return (
            <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                <Text style={styles.smallBold}>Notes:</Text>
                {this.props.workout_day.notes.map((note, i) =>
                    <Text key={i} style={[{
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingBottom: 10
                    }, styles.notBold]}>{i + 1}. {note.text}</Text>)
                }
            </View>
        )
    },

    render() {
        console.log(this.props.workout_day)
        return (
            <View style={{flex: 1}}>
                <FlatList removeClippedSubviews={false} ListHeaderComponent={this._renderHeader}
                          showsVerticalScrollIndicator={false} data={this.state.set_groups}
                          renderItem={this._renderItem} extraData={this.state} keyExtractor={(item, index) => index}/>
                <DropdownAlert ref={(ref) => this.dropdown = ref}/>
            </View>
        )

    }
});

WorkoutDaySession.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        headerTitle: state.params && state.params.workout_day ?
            state.params.workout_day.name
            : null,
    };
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
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    smallBold: {
        fontSize: getFontSize(16),
        fontFamily: 'Heebo-Bold',
        paddingLeft: 10,
        paddingBottom: 5
    },
    notBold: {
        color: 'grey',
        fontFamily: 'Heebo-Medium',
    }
});

const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        logSets: bindActionCreators(logSets, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(WorkoutDaySession);

