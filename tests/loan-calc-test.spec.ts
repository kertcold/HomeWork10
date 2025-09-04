import { expect, test } from '@playwright/test'
import { LoanDto } from './dto/loan-dto'
import { StatusCodes } from 'http-status-codes'

const baseURL = 'https://backend.tallinn-learning.ee/api/loan-calc/decision'
const defaultResponseBody = new LoanDto(0, 0, 0, true, 0, 0)
const TEST_INCOME_ZERO = 0
const TEST_INCOME_LOW = 1000
const TEST_INCOME_MED = 2000
const TEST_INCOME_HIGH = 5000
const TEST_DEBT_0 = 0
const TEST_DEBT_LOW = 500
const TEST_DEBT_HIGH = 2000
const TEST_AGE = 30
const EMPLOYED = true
const LOAN_PERIOD_6 = 6
const LOAN_PERIOD_12 = 12
const LOAN_PERIOD_24 = 24
const LOW_RISK = 'Low Risk'
const MED_RISK = 'Medium Risk'
const HIGH_RISK = 'High Risk'
const VERY_HIGH_RISK = 'Very High Risk'

test('no loan data provided, all fields left with default value should receive 400', async ({
  request,
}) => {
  const response = await request.post(baseURL, {
    data: defaultResponseBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  console.log('response status:', response.status())
  console.log('response body:', await response.text())
})

test('high income, no debt, reasonable loan should receive low risk and 200', async ({
  request,
}) => {
  const requestBody = new LoanDto(
    TEST_INCOME_HIGH,
    TEST_DEBT_0,
    TEST_AGE,
    EMPLOYED,
    2000,
    LOAN_PERIOD_12,
  )
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log('response status:', response.status())
  const riskStatus = await response.json()
  console.log('response body:', await response.json())
  expect.soft(riskStatus.riskLevel).toBe(LOW_RISK)
  expect.soft(riskStatus.riskDecision).toBe('positive')
})

test('moderate income, small debt, employed, reasonable loan should receive medium risk and 200', async ({
  request,
}) => {
  const requestBody = new LoanDto(
    TEST_INCOME_MED,
    TEST_DEBT_LOW,
    TEST_AGE,
    EMPLOYED,
    3000,
    LOAN_PERIOD_12,
  )
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log('response status:', response.status())
  const riskStatus = await response.json()
  console.log('response body:', await response.json())
  expect.soft(riskStatus.riskLevel).toBe(MED_RISK)
  expect.soft(riskStatus.riskDecision).toBe('positive')
})

test('high risk, moderate income, high debt, employed, reasonable loan should receive high risk and 200', async ({
  request,
}) => {
  const requestBody = new LoanDto(
    TEST_INCOME_LOW,
    TEST_DEBT_HIGH,
    TEST_AGE,
    EMPLOYED,
    3000,
    LOAN_PERIOD_6,
  )
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log('response status:', response.status())
  const riskStatus = await response.json()
  console.log('response body:', await response.json())
  expect.soft(riskStatus.riskLevel).toBe(HIGH_RISK)
  expect.soft(riskStatus.riskDecision).toBe('positive')
})

test('submitted loan request with no income should receive 400', async ({ request }) => {
  const requestBody = new LoanDto(
    TEST_INCOME_ZERO,
    TEST_DEBT_HIGH,
    TEST_AGE,
    EMPLOYED,
    3000,
    LOAN_PERIOD_6,
  )
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  console.log('response status:', response.status())
  console.log('response body:', await response.text())
})

test('submitted loan request with invalid age should receive 400', async ({ request }) => {
  const requestBody = new LoanDto(
    TEST_INCOME_HIGH,
    TEST_DEBT_HIGH,
    0,
    EMPLOYED,
    3000,
    LOAN_PERIOD_6,
  )
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  console.log('response status:', response.status())
  console.log('response body:', await response.text())
})

test('negative decision, loan-period very high risk ratio should receive high risk and 200', async ({
  request,
}) => {
  const requestBody = new LoanDto(
    TEST_INCOME_MED,
    TEST_DEBT_HIGH,
    TEST_AGE,
    EMPLOYED,
    3000,
    LOAN_PERIOD_24,
  )
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log('response status:', response.status())
  const riskStatus = await response.json()
  console.log('response body:', await response.json())
  expect.soft(riskStatus.riskLevel).toBe(VERY_HIGH_RISK)
  expect.soft(riskStatus.riskDecision).toBe('negative')
})
