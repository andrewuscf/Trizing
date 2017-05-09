import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';

const CameraPage = React.createClass({
    propTypes: {
        passData: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            back: true
        }
    },

    _rotate() {
        this.setState({back: !this.state.back})
    },

    takePicture() {
        const options = {};
        this.camera.capture({metadata: options})
            .then((data) => this.props.passData(data))
            .catch(err => console.error(err));
    },

    render() {
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    type={this.state.back ? Camera.constants.Type.back: Camera.constants.Type.front}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}>
                    <TouchableOpacity style={styles.rotateCamera} onPress={this._rotate}>
                        <Icon name="repeat" size={30} color='red'/>
                    </TouchableOpacity>
                    <Text style={styles.capture} onPress={this.takePicture}>
                        <Icon name="camera" size={30} color='red'/>
                    </Text>
                </Camera>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rotateCamera: {
        position: 'absolute',
        right: 20,
        top: 20
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});

export default CameraPage;
