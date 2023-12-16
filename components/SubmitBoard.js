import React, { Component } from 'react'
import {View, TouchableOpacity,Text} from 'react-native'
import Errors from "./Errors"
import { Alert } from 'react-native';

export default class SubmitBoard extends Component {
    state = {
        error:""
    }
    showWinningMessage = (message) => {
        Alert.alert(message);
    }
    checkSolve = () =>{
        if(this.props.valid()){
            console.log("valid")
            this.props.solve()
            this.showWinningMessage("You good to go")
        }else{
            console.log("Not Valid")
            this.showWinningMessage("Board Is Not Valid")
        }
    }

    render() {
        return (
            <View>
                <View style={buttonGroupStyle}>
                    <TouchableOpacity onPress={this.checkSolve} style={buttonStyle}> 
                        <Text style={buttonText}>Check</Text>
                    </TouchableOpacity>

                    <View style={paddingStyle}>
                    <TouchableOpacity style={buttonStyle} onPress={this.props.clearUserInputs}>
                        <Text style={buttonText}>Clear</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>    
        )
    }
}
const buttonGroupStyle = {
    flexDirection:'row',
}
const paddingStyle = {
    paddingLeft:5
}
const buttonText = {
    color: 'white',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
}
const buttonStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#4EABF4',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
}

