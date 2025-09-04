import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { loginDto } from '../dto/login-dto'

const authURL = 'https://backend.tallinn-learning.ee/login/student'

test('log in with incorrect data', async ({ request }) => {
 // const loginData = new loginDto('string123', 'string123')
  const loginData = loginDto.createLoginWithIncorrectData()
  const response = await request.post(authURL, {
    data: loginData,
  })
expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('log in with correct login data to receive JWT', async ({ request }) => {
  const loginData =  loginDto.createLoginWithCorrectData()
  const response = await request.post(authURL, {
    data: loginData,
  })
  const responseBody = await response.text()
  console.log('response body:', responseBody)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody).toBeDefined()
})