import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Alert } from 'react-native'
import { Container, Content, Label, Item, Input, Button } from 'native-base'
import { PRIMARY_COLOR, WHITE_COLOR, BUTTON_COLOR } from '../Colors';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native'
import { getUniqueId } from 'react-native-device-info';

export default class Login extends Component {
    state = {
        employeid: '',
        password: '',
        isSubmitted: false,
        devide_id: ''
    }

    componentDidMount() {
        this.setState({ devide_id: getUniqueId() })
    }

    render() {
        const { container, inputbox, labelStyle } = styles;
        const ImagePath = require('../../assets/images/logo.png')
        const { employeid, password, isSubmitted, devide_id } = this.state

        const Validate = () => {
            if (employeid.length && password.length) {
                return true
            } else {
                return false
            }
        }

        const submit = () => {
            if (Validate()) {
                const data = { password, employeid, devide_id }
                fetch('http://venus.joinvenus.in/api/venus/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }).then((e) => e.json())
                    .then(async (eJson) => {
                        console.log(eJson);
                        if (eJson.message == "done") {
                            await AsyncStorage.setItem('isLoggedIn', '1');
                            await AsyncStorage.setItem('employeID', eJson.data.employeid.toString());
                            await AsyncStorage.setItem('user_id', eJson.data.id.toString());
                            await AsyncStorage.setItem('name', eJson.data.name.toString());
                            console.log(eJson.data.id.toString());
                            this.props.navigation.dispatch(
                                StackActions.replace('Home', { catagory: this.props.route.params.catagory })
                            )
                        } else {
                            Alert.alert('Error', eJson.error);
                        }
                    })
            } else {
                Alert.alert('Required', 'Please fill the required fields')
            }
        }
        return (
            <Container>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: '2%' }}>
                    <Image source={ImagePath} style={{ width: 300, height: 150 }} />
                </View>
                <Content padder style={container}>
                    <View>
                        <Label style={labelStyle}>Enter Your Employe Id</Label>
                        <Item style={inputbox} bordered >
                            <Input
                                placeholder='Please enter your Employe id'
                                placeholderTextColor="#0003"
                                onChangeText={(employeid) => this.setState({ employeid })}
                                value={employeid}
                                editable={!isSubmitted}
                            />
                        </Item>
                    </View>
                    <View>
                        <Label style={labelStyle}>Enter Password</Label>
                        <Item style={inputbox} bordered >
                            <Input
                                placeholder='Please enter your password'
                                placeholderTextColor="#0003"
                                onChangeText={(password) => this.setState({ password })}
                                secureTextEntry={true}
                                value={password}
                                editable={!isSubmitted}
                            />
                        </Item>
                    </View>
                    <Button
                        disabled={isSubmitted}
                        style={{ backgroundColor: BUTTON_COLOR, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '5%' }}
                        onPress={() => submit()}

                    >
                        <Text style={{ textAlign: 'center', alignSelf: 'center', color: '#fff' }}>SUBMIT</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: PRIMARY_COLOR,
        marginVertical: '2%'
    },
    inputbox: {
        backgroundColor: WHITE_COLOR,
        marginVertical: '2%'
    },
    labelStyle: {
        textTransform: 'uppercase',
        fontSize: 14,
        letterSpacing: 2
    }
})
