import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {getFontSize} from '../actions/utils';


export default React.createClass({
    propTypes: {
        log: React.PropTypes.object.isRequired,
        isLast: React.PropTypes.bool.isRequired
    },

    render() {
        const macroLog = this.props.log;
        console.log(this.props.isLast)
        return (
            <View style={[styles.box, this.props.isLast ? {borderBottomWidth: 1}: null ]}>
                <View>
                    <Text>Fats</Text>
                    <Text>{macroLog.fats}</Text>
                </View>
                <View>
                    <Text>Carbs</Text>
                    <Text>{macroLog.carbs}</Text>
                </View>
                <View>
                    <Text>Protein</Text>
                    <Text>{macroLog.protein}</Text>
                </View>
            </View>
        );
    },
});


const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#e1e3df',
        borderTopWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 10,
        marginLeft: 10
    },
});

