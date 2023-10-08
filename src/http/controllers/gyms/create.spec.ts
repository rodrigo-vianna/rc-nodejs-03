import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Create Gym (E2E)', () => {

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a gym', async () => {
		const { token } = await createAndAuthenticateUser(app, 'ADMIN')

		const response = await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Gym Test',
				description: 'Gym Test Description',
				phone: '27988884444',
				latitude: -27.2092052,
				longitude: -49.6401091,
			})
			
		expect(response.statusCode).toEqual(201)
	})

})