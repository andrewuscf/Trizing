import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const Loading = React.createClass({
    render() {
        return (
            <View style={[styles.page, this.props.style]}>
                <ActivityIndicator animating={true} size='large'/>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Loading;
