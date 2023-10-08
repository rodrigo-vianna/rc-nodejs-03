import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'

describe('Refresh (E2E)', () => {

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to refresh a token', async () => {
		const email = 'johndoe@example.com';
		const password = '12345678';

		await request(app.server)
			.post('/users')
			.send({
				name: 'John Doe',
				email,
				password
			})

		const authResponse = await request(app.server)
			.post('/sessions')
			.send({
				email,
				password
			})

			const cookies = authResponse.get('Set-Cookie')

		const response = await request(app.server)
		.patch('/token/refresh')
		.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken='),
		])
	})

})