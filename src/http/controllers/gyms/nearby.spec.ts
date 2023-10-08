import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Nearby Gyms (E2E)', () => {

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to search for nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Near Gym',
				description: null,
				phone: null,
				latitude: 46.9959349,
				longitude: 8.603211,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Far Gym',
				description: null,
				phone: null,
				latitude: 47.3710229,
				longitude: 8.5309177,
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: 46.9951007,
				longitude: 8.6003678,
			})
			.set('Authorization', `Bearer ${token}`)
			.send()
			
		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms[0]).toEqual(expect.objectContaining({
			title: 'Near Gym',
		}))
	})

})