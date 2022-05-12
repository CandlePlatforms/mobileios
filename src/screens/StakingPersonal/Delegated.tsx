import React, { ReactElement } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import _ from 'lodash'

import { StakingPersonal, ValidatorUI } from 'lib'

import { Number, Text } from 'components'
import { COLOR } from 'consts'
import images from 'assets/images'

const Rewards = ({
  personal,
  findMoniker,
}: {
  personal: StakingPersonal
  findMoniker: ({ name }: { name: string }) => ValidatorUI | undefined
}): ReactElement => {
  const { delegated, myDelegations } = personal

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} fontType={'medium'}>
          {'Delegated'}
        </Text>
        <Number
          numberFontStyle={{ fontSize: 20, textAlign: 'left' }}
          decimalFontStyle={{ fontSize: 15 }}
          {...delegated.display}
          fontType={'medium'}
        />
      </View>
      <View
        style={{
          marginBottom: 5,
          paddingTop: 20,
          borderTopColor: '#edf1f7',
          borderTopWidth: 1,
        }}
      >
        {_.map(myDelegations?.table?.contents, (content, i) => {
          const moniker = findMoniker({ name: content.name })
          return (
            <View
              key={`delegated.table.contents-${i}`}
              style={styles.itemBox}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 20,
                }}
              >
                <Image
                  source={
                    moniker?.profile
                      ? { uri: moniker.profile }
                      : images.terra
                  }
                  style={styles.profileImage}
                />
                <Text>{content.name}</Text>
              </View>

              <Number
                numberFontStyle={{ fontSize: 14 }}
                decimalFontStyle={{ fontSize: 10.5 }}
                {...content.delegated}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default Rewards

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingTop: 20,
    backgroundColor: COLOR.white,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 35,
    shadowOpacity: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  profileImage: {
    borderRadius: 12,
    width: 24,
    height: 24,
    marginRight: 5,
  },
})
