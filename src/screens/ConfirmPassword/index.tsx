import React, { ReactElement, useEffect } from 'react'
import { Keyboard, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useRecoilValue } from 'recoil'
import _ from 'lodash'
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native'

import { ConfirmProps, User } from 'lib'

import Body from 'components/layout/Body'
import WithAuth from 'components/layout/WithAuth'
import { navigationHeaderOptions } from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import { UseStationForm, Button, Loading } from 'components'

import { RootStackParams } from 'types/navigation'

import ConfirmStore from 'stores/ConfirmStore'
import { useConfirm } from 'hooks/useConfirm'
import { useLoading } from 'hooks/useLoading'

type Props = StackScreenProps<RootStackParams, 'ConfirmPassword'>

const Render = ({
  confirm,
  user,
  route,
  navigation,
}: {
  user: User
  confirm: ConfirmProps
} & Props): ReactElement => {
  const feeSelectValue = route.params.feeSelectValue
  const { getComfirmData, initConfirm } = useConfirm()
  const { showLoading, hideLoading } = useLoading({ navigation })
  const { result, form, fee, txhash } = getComfirmData({
    confirm,
    user,
  })

  const { navigate, dispatch } = useNavigation<
    NavigationProp<RootStackParams>
  >()

  // during form is submitting, show loading
  useEffect(() => {
    txhash && showLoading({ txhash })
  }, [txhash])

  // result will set after form.onSubmit or error
  useEffect(() => {
    if (result) {
      hideLoading().then(() => {
        dispatch(StackActions.popToTop())
        navigate('Complete', { result })
        initConfirm()
      })
    }
  }, [result?.title])

  useEffect(() => {
    if (_.some(fee.select.options)) {
      fee.select.setValue(feeSelectValue)
    }
  }, [fee.select.options])

  return (
    <>
      <SubHeader theme={'sapphire'} title={form.title} />
      <Body
        theme={'sky'}
        containerStyle={{
          justifyContent: 'space-between',
          marginBottom: 40,
        }}
      >
        {_.some(fee.status) ? (
          <Loading style={{ marginTop: 20 }} size={24} />
        ) : (
          <UseStationForm form={form} />
        )}

        <View>
          <Button
            theme={'sapphire'}
            disabled={form.disabled}
            title={form.submitLabel}
            onPress={(): void => {
              Keyboard.dismiss()
              form.onSubmit && form.onSubmit()
            }}
          />
        </View>
      </Body>
    </>
  )
}

const ConfirmPassword = (props: Props): ReactElement => {
  const confirm = useRecoilValue(ConfirmStore.confirm)

  return (
    <WithAuth>
      {(user): ReactElement => (
        <>
          {confirm ? (
            <Render {...{ ...props, confirm, user }} />
          ) : null}
        </>
      )}
    </WithAuth>
  )
}

ConfirmPassword.navigationOptions = navigationHeaderOptions({
  theme: 'sapphire',
})

export default ConfirmPassword
