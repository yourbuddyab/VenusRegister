import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Alert } from 'react-native'
import { Container, Content, Label, Item, Input, Button } from 'native-base'
import { PRIMARY_COLOR, WHITE_COLOR, BUTTON_COLOR } from '../Colors';

export default class OTP extends Component {
    state = {
        otp: '',
        isSubmitted: false
    }
    render() {
        const { container, inputbox, labelStyle } = styles;
        const ImagePath = require('../../assets/images/logo.png')
        const { otp, isSubmitted } = this.state

        const Validate = () => {
            if(otp.length){
               return true
            }else
            {
                return false
            }
        }

        const submit = () => {
            if (Validate()) {
                const data ={
                    ...this.props.route.params.data,
                    otp
                }
                console.log(data);
                fetch('http://192.168.29.250:8080/api/venus/otpverfiy', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }).then((e) => e.json())
                    .then(eJson => {
                        if (eJson) {
                            Alert.alert('Your Registration done!!')
                            this.props.navigation.navigate('Home')
                        } else {
                           Alert.alert('Error','you enter wrong OTP.');
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
                        <Label style={labelStyle}>Enter OTP</Label>
                        <Item style={inputbox} bordered >
                            <Input
                                placeholder='Please enter your OTP'
                                placeholderTextColor="#0003"
                                onChangeText={(otp) => this.setState({ otp })}
                                value={otp}
                                editable={!isSubmitted}
                            />
                        </Item>
                    </View>
                    <Button
                        disabled={isSubmitted}
                        style={{ backgroundColor: BUTTON_COLOR, width: '100%', justifyContent: 'center', alignItems: 'center' }}
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
