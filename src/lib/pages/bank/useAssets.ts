import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AssetsPage,
  AssetsUI,
  BankData,
  DisplayCoin,
  Schedule,
  TokenBalance,
  User,
} from '../../types'
import { format } from '../../utils'
import { percent, gte } from '../../utils/math'
import useBank from '../../api/useBank'
import useTokenBalance from '../../cw20/useTokenBalance'
import { UTIL } from 'consts'

const SMALL = '1000000'

interface Config {
  hideSmall?: boolean
}

export default (user: User, config?: Config): AssetsPage => {
  const { t } = useTranslation()
  const bank = useBank(user)
  const tokenBalances = useTokenBalance(user.address)
  const [hideSmall, setHideSmall] = useState<boolean>(
    config?.hideSmall !== undefined ? config.hideSmall : false
  )

  const load = (): void => {
    bank.execute()
    tokenBalances.refetch()
  }

  const render = (
    { balance, vesting }: BankData,
    tokenList?: TokenBalance[]
  ): AssetsUI => ({
    card:
      !balance.length && !tokenList?.length && !vesting.length
        ? {
            title: t('Page:Bank:Wallet empty'),
            content: t(
              "Page:Bank:This wallet doesn't hold any coins yet"
            ),
          }
        : !balance.length && !vesting.length && tokenList?.length
        ? {
            title: t('Page:Bank:Wallet empty'),
            content:
              'This wallet does not hold any native tokens, so the transaction could not be processed.',
          }
        : undefined,
    available: !balance.length
      ? undefined
      : {
          title: 'Terra Native',
          list: balance
            .filter(
              ({ available }) => !hideSmall || gte(available, SMALL)
            )
            .filter(({ denom }) => !UTIL.isIbcDenom(denom))
            .map(({ available, denom }) => ({
              denom,
              display: format.display({ amount: available, denom }),
            })),
          hideSmall: {
            label: t('Page:Bank:Hide small balances'),
            checked: hideSmall,
            toggle: (): void => setHideSmall((v) => !v),
          },
          send: t('Post:Send:Send'),
        },
    ibc: !balance.filter(({ denom }) => UTIL.isIbcDenom(denom)).length
      ? undefined
      : {
          title: 'IBC Tokens',
          list: balance
            .filter(({ denom }) => UTIL.isIbcDenom(denom))
            .map(({ available, denom }) => {
              return {
                denom,
                display: {
                  value: format.amount(available),
                  unit: denom,
                },
              }
            }),
          send: t('Post:Send:Send'),
        },
    tokens: {
      title: 'CW20 Tokens',
      list:
        tokenList?.map(
          ({ token, symbol, icon, balance, decimals }) => {
            const display = {
              value: format.amount(balance, decimals),
              unit: symbol,
            }

            return { icon, token, display }
          }
        ) ?? [],
      send: t('Post:Send:Send'),
    },
    vesting: !vesting.length
      ? undefined
      : {
          title: t('Page:Bank:Vesting schedule'),
          desc: t(
            'Page:Bank:This displays your investment with Terra. Vested Luna can be delegated in the meantime.'
          ),
          list: vesting.map(({ total, denom, schedules }) => ({
            display: format.display({ amount: total, denom }),
            schedule: schedules.map((item) =>
              getSchedule(item, denom)
            ),
          })),
        },
  })

  const getSchedule = (
    schedule: Schedule,
    denom: string
  ): {
    released: boolean
    releasing: boolean
    percent: string
    display: DisplayCoin
    status: string
    duration: string
    width: string
  } => {
    const { amount, startTime, endTime, ratio, freedRate } = schedule
    const now = new Date().getTime()
    const released = endTime < now
    const releasing = startTime < now && now < endTime

    return {
      released,
      releasing,
      percent: percent(ratio),
      display: format.display({ amount, denom }),
      status: released
        ? t('Page:Bank:Released')
        : releasing
        ? t('Page:Bank:Releasing')
        : t('Page:Bank:Release on'),
      duration: [startTime, endTime]
        .map((t) => `${toISO(t)}`)
        .join(' ~ '),
      width: percent(freedRate, 0),
    }
  }

  return Object.assign(
    { setHideSmall, load },
    bank,
    { loading: bank.loading || tokenBalances.isLoading },
    bank.data && { ui: render(bank.data, tokenBalances.list) }
  )
}

/* helper */
const toISO = (date: number): string =>
  format.date(new Date(date).toISOString())
