import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {CachedImage} from "react-native-img-cache";

const AvatarImage = CreateClass({
    propTypes: {
        image: PropTypes.string,
        redirect: PropTypes.func,
        cache: PropTypes.bool,
    },

    onPress(userId) {
        if (this.props.redirect) {
            this.props.redirect();
        }
    },


    render() {
        if (this.props.redirect) {
            return (
                <TouchableOpacity onPress={this.onPress}>
                    {this.props.cache ?
                        <CachedImage style={[styles.avatar, this.props.style]} source={{uri: this.props.image}}/> :
                        <Image style={[styles.avatar, this.props.style]} source={{uri: this.props.image}}/>
                    }
                </TouchableOpacity>
            );
        }
        // Deal with no image inside component rather than parent.
        if (this.props.image) {
            if (this.props.cache) {
                return (
                    <CachedImage style={[styles.avatar, this.props.style]} source={{uri: this.props.image}}/>
                )
            }
            return (
                <Image style={[styles.avatar, this.props.style]} source={{uri: this.props.image}}/>
            );
        }
        return null;
    }
});

var styles = StyleSheet.create({
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25
    }
});

export default AvatarImage;
