import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    ListView
} from 'react-native';

import {fetchData, API_ENDPOINT} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import Loading from '../../components/Loading';
import SubmitButton from '../../components/SubmitButton';

var {width: deviceWidth} = Dimensions.get('window');


const AddClient = React.createClass({

    getInitialState() {
        return {
            email: null
        }
    },

    componentDidUpdate(prevProps) {
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
        }
    },

    _onSubmit(){
        if (this.checkAllRequired()) {
            console.log('hit')
        }
    },

    _back() {
        this.props.navigator.pop();
    },


    render() {
        const user = this.props.RequestUser;
        console.log(user)
        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // const dataSource = ds.cloneWithRows(this.filterPeople());
        // Hours available options
        return (
            <View style={styles.mainContainer}>
                <BackBar back={this._back}/>

                <SubmitButton buttonStyle={styles.button}
                              textStyle={styles.submitText} onPress={this._onSubmit} ref='postbutton'
                              text='Save'/>
            </View>
        );

    }
});


const styles = StyleSheet.create({});


export default AddClient;
