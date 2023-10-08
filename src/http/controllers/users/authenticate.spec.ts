import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'

describe('Authenticate (E2E)', () => {

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate', async () => {
		const email = 'johndoe@example.com';
		const password = '12345678';

		await request(app.server)
			.post('/users')
			.send({
				name: 'John Doe',
				email,
				password
			})
		const response = await request(app.server)
			.post('/sessions')
			.send({
				email,
				password
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})

})