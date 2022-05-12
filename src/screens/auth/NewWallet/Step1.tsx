import React, { useState, ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { useRecoilState } from 'recoil'
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native'

import Body from 'components/layout/Body'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { Button, FormInput, NumberStep, FormLabel } from 'components'

import { useValueValidator } from 'hooks/useValueValidator'
import NewWalletStore from 'stores/NewWalletStore'

const Step1 = (): ReactElement => {
  const { navigate } = useNavigation<
    NavigationProp<{
      NewWalletStep2: undefined
    }>
  >()

  const [name, setName] = useRecoilState(NewWalletStore.name)
  const [inputName, setinputName] = useState('')

  const { valueValidate } = useValueValidator()
  const [nameErrMsg, setNameErrMsg] = useState('')
  const [password, setPassword] = useRecoilState(
    NewWalletStore.password
  )
  const [passwordErrMsg, setPasswordErrMsg] = useState('')

  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordConfirmErrMsg, setPasswordConfirmErrMsg] = useState(
    ''
  )

  const stepConfirmed =
    _.isEmpty(
      nameErrMsg || passwordErrMsg || passwordConfirmErrMsg
    ) && _.some(name && password && passwordConfirm)

  const onChangeName = (text: string): void => {
    setName(text)
    setinputName(text)
    setNameErrMsg(valueValidate.name(text))
  }

  const onChangePassword = (text: string): void => {
    setPassword(text)
    setPasswordErrMsg(valueValidate.password(text))
    setPasswordConfirmErrMsg(
      text === passwordConfirm ? '' : 'Password does not match'
    )
  }

  const onChangePasswordConfirm = (text: string): void => {
    setPasswordConfirm(text)
    setPasswordConfirmErrMsg(
      text === password ? '' : 'Password does not match'
    )
  }

  const onPressNext = (): void => {
    navigate('NewWalletStep2')
  }

  useEffect(() => {
    setName('')
    setPassword('')
  }, [])

  return (
    <>
      <SubHeader theme={'sapphire'} title={'New wallet'} />
      <Body theme={'sky'} containerStyle={styles.container}>
        <View>
          <View style={styles.section}>
            <FormLabel text={'Wallet name'} />
            <FormInput
              underlineColorAndroid="#ccc"
              value={inputName}
              onChangeText={onChangeName}
              placeholder={'Enter 5-20 alphanumeric characters'}
              errorMessage={nameErrMsg}
            />
          </View>
          <View style={styles.section}>
            <FormLabel text={'Password'} />
            <FormInput
              underlineColorAndroid="#ccc"
              value={password}
              secureTextEntry
              onChangeText={onChangePassword}
              placeholder={'Must be at least 10 characters'}
              errorMessage={passwordErrMsg}
            />
          </View>
          <View style={styles.section}>
            <FormLabel text={'Confirm password'} />
            <FormInput
              underlineColorAndroid="#ccc"
              value={passwordConfirm}
              secureTextEntry
              onChangeText={onChangePasswordConfirm}
              placeholder={'Confirm your password'}
              errorMessage={passwordConfirmErrMsg}
            />
          </View>
        </View>

        <Button
          title="Next"
          theme={'sapphire'}
          containerStyle={{ marginBottom: 10 }}
          disabled={!stepConfirmed}
          onPress={onPressNext}
        />
      </Body>
    </>
  )
}

const HeaderRight = (): ReactElement => (
  <NumberStep stepSize={3} nowStep={1} />
)

Step1.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
  headerRight: HeaderRight,
})

export default Step1

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 20,
  },
})
