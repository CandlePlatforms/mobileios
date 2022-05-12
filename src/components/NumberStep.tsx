import React, { Fragment, ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'

import { COLOR } from 'consts'

import Text from './Text'

const NumberStep = ({
  stepSize,
  nowStep,
}: {
  stepSize: number
  nowStep: number
}): ReactElement => {
  return (
    <View style={styles.container}>
      {_.times(stepSize, (index) => {
        return (
          <Fragment key={index}>
            <View
              style={[
                styles.defaultStepIcon,
                nowStep === index + 1 && styles.nowStepIcon,
              ]}
            >
              <Text
                style={{
                  color: COLOR.primary._02,
                  fontVariant: ['tabular-nums'],
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </Text>
            </View>
            {stepSize > index + 1 && <View style={styles.line} />}
          </Fragment>
        )
      })}
    </View>
  )
}

export default NumberStep

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  defaultStepIcon: {
    borderRadius: 50,
    width: 17,
    height: 17,
    backgroundColor: '#8fa1da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nowStepIcon: {
    backgroundColor: 'white',
  },
  line: {
    width: 15,
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    marginBottom: 8,
  },
})
