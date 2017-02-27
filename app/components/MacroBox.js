import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

const MacroBox = React.createClass({
    propTypes: {
        plan: React.PropTypes.object,
        training_plan: React.PropTypes.object.isRequired,
        selectMacroPlan: React.PropTypes.func.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool,
    },

    _onPress() {
        if (this.props.plan) {
            this.props.selectMacroPlan(this.props.questionnaire.id)
        } else {
            console.log('no plan')
            this.props._redirect('CreateMacroPlan',{training_plan_id: this.props.training_plan.id})
        }
    },

    _onEdit() {
        console.log('edit hit')
    },


    render() {
        console.log(this.props.training_plan)
        const plan = this.props.plan;
        return (
            <TouchableOpacity style={[styles.container, (this.props.selected) ? styles.selectedBox : null]}
                              onPress={this._onPress}>
                {!plan ?

                    <View style={styles.center}>
                        <Icon name="plus" size={30} color='blue'/>
                        <Text style={styles.mainText}>Create Macro New</Text>
                    </View>
                    :
                    <View style={styles.center}>
                        <Icon name="cutlery" size={30} color='blue'/>
                        <Text style={styles.mainText}>{plan.name}</Text>
                        <TouchableOpacity onPress={this._onEdit}>
                            <Icon style={styles.edit} name="ellipsis-v" size={30} color='#4d4d4e'/>
                        </TouchableOpacity>
                    </View>
                }
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderWidth: .5,
        borderColor: '#e1e3df',
        padding: 10,
    },
    selectedBox: {
        borderColor: 'blue'
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    mainText: {
        paddingLeft: 18,
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold',
    },
    edit: {
        position: 'absolute',
        right: 0,
    }
});

export default MacroBox;
