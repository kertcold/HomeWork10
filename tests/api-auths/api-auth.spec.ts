import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { loginDto } from '../dto/login-dto'

const authURL = 'https://backend.tallinn-learning.ee/login/student'

test('log in with incorrect data', async ({ request }) => {
  const loginData = loginDto.createLoginWithIncorrectData()
  const response = await request.post(authURL, {
    data: loginData,
  })
  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('log in with incorrect method', async ({ request }) => {
  const loginData = loginDto.createLoginWithCorrectData()
  const response = await request.get(authURL, {
    data: loginData,
  })
  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})

test('log in with incorrect body structure', async ({ request }) => {
  const response = await request.post(authURL, {})
  const responseBody = await response.text()
  console.log('Response body: ', responseBody)
  console.log('Response status: ', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('log in with correct login data to receive JWT', async ({ request }) => {
  const loginData = loginDto.createLoginWithCorrectData()
  const response = await request.post(authURL, {
    data: loginData,
  })
  const responseBody = await response.text()
  console.log('Response body:', responseBody)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody).toBeDefined()
  const jwtValue = await response.text()
  const jwtRegex = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
  console.log('Response status:', response.status())
  expect.soft(jwtValue).toBeDefined()
  expect.soft(jwtValue).toMatch(jwtRegex)
})
