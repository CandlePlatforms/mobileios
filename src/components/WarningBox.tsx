import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import Icon from './Icon'
import Text from './Text'
import { COLOR } from 'consts'

const WarningBox = ({
  message,
}: {
  message: string | ReactElement
}): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={{ width: 25, paddingTop: 4 }}>
        <Icon name={'info'} color={COLOR.red} size={16} />
      </View>

      <View style={{ flex: 1 }}>
        {typeof message === 'string' ? (
          <Text
            style={{ color: COLOR.red, fontSize: 14, lineHeight: 21 }}
          >
            {message}
          </Text>
        ) : (
          message
        )}
      </View>
    </View>
  )
}

export default WarningBox

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: '#ffeff0',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(255, 85, 97, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
})
