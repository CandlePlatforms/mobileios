import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import { COLOR } from 'consts'

import Icon from 'components/Icon'
import Body from 'components/layout/Body'
import { Text } from 'components'
import Button from 'components/Button'
import { RecoverWalletStackParams } from 'types'
import { useAuth } from 'lib'
import { getIsUseBioAuth, settings } from 'utils/storage'
import { useBioAuth } from 'hooks/useBioAuth'
import { isSupportedBiometricAuthentication } from 'utils/bio'

type Props = StackScreenProps<
  RecoverWalletStackParams,
  'WalletRecovered'
>

const WalletRecovered = ({ route }: Props): ReactElement => {
  const wallet = route.params?.wallet

  const { signIn } = useAuth()
  const { openIsUseBioAuth } = useBioAuth()

  const onPressButton = (): void => {
    signIn(wallet)
    settings.set({ walletName: wallet.name })
  }

  const checkIfUseBioAuth = async (): Promise<void> => {
    if (
      false === (await getIsUseBioAuth()) &&
      (await isSupportedBiometricAuthentication())
    ) {
      openIsUseBioAuth()
    }
  }

  useEffect(() => {
    checkIfUseBioAuth()
  }, [])

  return (
    <Body containerStyle={styles.container}>
      <View style={styles.infoSection}>
        <Icon
          name={'account-balance-wallet'}
          size={60}
          color={COLOR.primary._02}
        />
        <Text style={styles.infoTitle} fontType={'bold'}>
          Wallet recovered!
        </Text>
        <Text
          style={{ color: COLOR.primary._02, textAlign: 'center' }}
        >
          Welcome back to Terra Station
        </Text>
      </View>
      <Button
        theme={'sapphire'}
        title={'Explore the Terra network'}
        onPress={onPressButton}
      />
    </Body>
  )
}

export default WalletRecovered

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLOR.primary._02,
    marginVertical: 5,
  },
})
