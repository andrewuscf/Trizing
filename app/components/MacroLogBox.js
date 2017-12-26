import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {getFontSize} from '../actions/utils';
import GlobalStyle from "../containers/globalStyle";


export default CreateClass({
    propTypes: {
        log: PropTypes.object.isRequired,
        quickAdd: PropTypes.func,
        deleteLog: PropTypes.func
    },

    render() {
        const macroLog = this.props.log;
        let calories = (9 * macroLog.fats) + (4 * macroLog.protein) + (4 * macroLog.carbs);
        return (
            <View style={styles.macroLogBox}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.name}>
                        {macroLog.name}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {this.props.quickAdd ?
                            <TouchableOpacity onPress={() => this.props.quickAdd(macroLog)}
                                              style={{paddingRight: '2%'}}>
                                <MaterialIcon name="add" size={20} style={GlobalStyle.lightBlueText}/>
                            </TouchableOpacity>
                            : null}
                        {this.props.deleteLog ?
                            <TouchableOpacity onPress={() => this.props.deleteLog(macroLog)}>
                                <MaterialIcon name="remove" size={20} style={{color: 'red'}}/>
                            </TouchableOpacity>
                            : null}
                    </View>
                </View>
                <View style={[styles.box]}>
                    <Text style={[styles.detailText, {paddingLeft: 0}]}>
                        {macroLog.fats} {macroLog.fats === 1 ? 'fat' : 'fats'}
                    </Text>
                    <FontIcon size={getFontSize(10)} name="circle"/>
                    <Text style={styles.detailText}>{macroLog.carbs} {macroLog.carbs === 1 ? 'carb' : 'carbs'}</Text>
                    <FontIcon size={getFontSize(10)} name="circle"/>
                    <Text style={styles.detailText}>{macroLog.protein} protein</Text>
                    <FontIcon size={getFontSize(10)} name="circle"/>
                    <Text style={styles.detailText}>{calories} Calories</Text>
                </View>
            </View>
        );
    },
});


const styles = StyleSheet.create({
    macroLogBox: {
        borderColor: '#e1e3df',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    box: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    name: {
        fontFamily: 'Heebo-Bold',
        fontSize: getFontSize(20),
        color: 'black'
    },
    detailText: {
        paddingLeft: 5,
        paddingRight: 5,
        // fontSize: getFontSize(16)
    }
});

