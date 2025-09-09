import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './dto/order-dto'
import { loginDto } from './dto/login-dto'

const baseURL = 'https://backend.tallinn-learning.ee/test-orders'
const STATUS_OPEN = 'OPEN'
const TEST_CUSTOMER_NAME = 'Name'
const TEST_CUSTOMER_PHONE = '5234512'
const COMMENT = 'test-comment'

const loginURL = 'https://backend.tallinn-learning.ee/login/student'
const orderUrl = 'https://backend.tallinn-learning.ee/orders/'

// Homework12
test('student receive token and then create the order', async ({ request }) => {
  const LoginDto = new loginDto('kert', 'whs4s5qbYbfT2n')
  const apiResponse = await request.post(loginURL, {
    data: LoginDto,
  })

  const jwt = await apiResponse.text()
  console.log(jwt)

  const orderDto = new OrderDto(STATUS_OPEN, 0, TEST_CUSTOMER_NAME, TEST_CUSTOMER_PHONE, COMMENT, 0)
  const orderResponse = await request.post(orderUrl, {
    data: orderDto,
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })
  const orderJsonResponse = await orderResponse.json()
  console.log(orderJsonResponse)
  expect.soft(orderJsonResponse.status).toBe('OPEN')
  expect.soft(orderJsonResponse.customerName).toBe(TEST_CUSTOMER_NAME)
  expect.soft(orderJsonResponse.customerPhone).toBe(TEST_CUSTOMER_PHONE)

  const orderId = orderJsonResponse.id
  const getOrderResponse = await request.get(orderUrl + orderId, {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })

  const getOrderJson = await getOrderResponse.json()
  console.log('Created order ID number: ' + getOrderJson.id)
})

test('student receive token and check that the order is created', async ({ request }) => {
  const LoginDto = new loginDto('kert', 'whs4s5qbYbfT2n')
  const apiResponse = await request.post(loginURL, {
    data: LoginDto,
  })

  const jwt = await apiResponse.text()

  const orderDto = new OrderDto(STATUS_OPEN, 0, TEST_CUSTOMER_NAME, TEST_CUSTOMER_PHONE, COMMENT, 0)
  const orderResponse = await request.post(orderUrl, {
    data: orderDto,
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })
  const orderJsonResponse = await orderResponse.json()
  expect.soft(orderJsonResponse.id).toBeDefined()

  const orderId = orderJsonResponse.id
  const getOrderResponse = await request.get(orderUrl + orderId, {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })

  const getOrderJson = await getOrderResponse.json()
  console.log(getOrderJson)
  console.log('Created order ID number: ' + getOrderJson.id)
})

test('create an order and then delete the created order', async ({ request }) => {
  const LoginDto = new loginDto('kert', 'whs4s5qbYbfT2n')
  const apiResponse = await request.post(loginURL, {
    data: LoginDto,
  })

  const jwt = await apiResponse.text()

  const orderDto = new OrderDto(STATUS_OPEN, 0, TEST_CUSTOMER_NAME, TEST_CUSTOMER_PHONE, COMMENT, 0)
  const orderResponse = await request.post(orderUrl, {
    data: orderDto,
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })
  const orderJsonResponse = await orderResponse.json()
  expect.soft(orderJsonResponse.id).toBeDefined()

  const orderId = orderJsonResponse.id
  const getOrderResponse = await request.get(orderUrl + orderId, {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })

  const getOrderJson = await getOrderResponse.json()
  console.log(getOrderJson)
  console.log('Created order ID number: ' + getOrderJson.id)
  const deleteOrder = await request.delete(orderUrl + orderId, {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  })
  const deletedOrderResponse = await deleteOrder.json()
  console.log('Deleted order status: ', deletedOrderResponse)
  expect.soft(deleteOrder.status()).toBe(StatusCodes.OK)
})

test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get(baseURL + '/1')
  // Log the response status, body and headers
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  expect(response.status()).toBe(200)
})

test('post order with correct data should receive code 200', async ({ request }) => {
  // prepare request body
  const requestBody = new OrderDto(
    STATUS_OPEN,
    0,
    TEST_CUSTOMER_NAME,
    TEST_CUSTOMER_PHONE,
    COMMENT,
    77,
  )

  // Send a POST request to the server
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  const responseBody = await response.json()
  expect.soft(responseBody.status).toBe(STATUS_OPEN)
  expect.soft(responseBody.customerName).toBe(TEST_CUSTOMER_NAME)
  console.log('response headers:', response.headers())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.customerPhone).toBe(TEST_CUSTOMER_PHONE)
})

test('post order with incorrect status should receive code 400', async ({ request }) => {
  // prepare request body
  const requestBody = new OrderDto(
    'BLOCKED',
    0,
    TEST_CUSTOMER_NAME,
    TEST_CUSTOMER_PHONE,
    COMMENT,
    77,
  )

  // Send a POST request to the server
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.text())
  console.log('response headers:', response.headers())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
