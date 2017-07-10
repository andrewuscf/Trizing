import React, {Component} from 'react';
import {Modal, ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';

const SelectInput = React.createClass({

    getInitialState: function () {
        let index = -1;
        if (this.props.selectedId) {
            index = _.findIndex(this.props.options, {id: this.props.selectedId});
        }
        return {
            showOverlay: false, // show overlay for selecting value
            value: index != -1 ? this.props.options[index].id : null,
            selected: index != -1 ? this.props.options[index].name : null
        };
    },

    toggleOverlay: function () {
        this.setState({
            showOverlay: !this.state.showOverlay
        });
    },

    selectOption(id, label) {
        this.setState({
            value: id,
            selected: label
        });
        if (this.props.submitChange) {
            this.props.submitChange(id)
        }
        this.toggleOverlay();
    },

    _renderOverlay: function () {
        if (this.state.showOverlay) {

            // build list of items
            const optionslist = [];
            for (var i = 0; i < this.props.options.length; i++) {
                let id = this.props.options[i].id,
                    label = this.props.options[i].name;
                optionslist.push(
                    <TouchableOpacity activeOpacity={1} key={i} style={styles.itemView}
                                      onPress={this.selectOption.bind(this, id, label)}>
                        <Text style={styles.itemText}>{label}</Text>
                    </TouchableOpacity>
                );
            }

            return (
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    onRequestClose={() => {
                    }}
                    visible={this.state.showOverlay}>
                    <View style={styles.popup}>
                        <ScrollView  contentContainerStyle={styles.popupContainer} showsVerticalScrollIndicator={false}>
                            {optionslist}
                        </ScrollView>
                        <TouchableOpacity activeOpacity={1} style={[styles.itemView, {marginTop: 10, marginBottom: 10, borderRadius: 10}]}
                                          onPress={this.toggleOverlay}>
                            <Text style={styles.itemText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            );
        } else {
            return null;
        }
    },

    render() {
        return (
            <View style={this.props.style}>
                <TouchableOpacity activeOpacity={1} onPress={this.toggleOverlay}>
                    <View style={styles.selectView}>
                        <Text
                            style={styles.selectText}>{this.state.selected ? this.state.selected : 'Select One'}</Text>
                    </View>
                </TouchableOpacity>
                {this._renderOverlay()}
            </View>
        );
    }
});

var styles = StyleSheet.create({
    popup: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)'
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    closeableArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    itemView: {
        borderBottomWidth: 1,
        borderBottomColor: '#e1e3df',
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        padding: 15,
    },
    itemText: {
        textAlign: 'center',
        color: '#4d4d4e',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold'
    },
    selectView: {},
    selectText: {
        color: '#4d4d4e',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        textDecorationLine: 'underline'
    }
});

export default SelectInput;
