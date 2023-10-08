import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Metrics Check-In (E2E)', () => {

	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get the total count of check-in', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: 'Gym Test',
				latitude: -27.2092052,
				longitude: -49.6401091,
			}
		})

		await prisma.checkIn.createMany({
			data: [{
				gym_id: gym.id,
				user_id: user.id,
			}, {
				gym_id: gym.id,
				user_id: user.id,
			}]
		})

		const response = await request(app.server)
			.get('/check-ins/metrics')
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.checkInsCount).toEqual(2)
	})

})