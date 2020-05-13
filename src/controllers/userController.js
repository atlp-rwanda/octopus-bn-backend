/* eslint-disable require-jsdoc */
import uuid from 'uuid/v4';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, sendNotificationEmail, sendPasswordResetLink } from 'utils/emailHelper';
import { successResponse, errorResponse } from 'utils/responses';
import { encode, decode } from 'utils/jwtTokenizer';
import Models from '../database/models';
import setLanguage from '../utils/international';
import getManagerRandomly from '../utils/autoManagerAssigner';

/**
 * @description This class contains all the methods relating to the user
 * @class userController
 */
class userController {
	/**
     * @description user signUp method
     * @param {object} req
     * @param {object} res
     * @returns {object} newUser
     * @memberof userController
     */
	static async signUp(req, res) {
		const { prefLocale } = req.i18n;
		try {
			const { firstName, lastName, email, password } = req.body;
			const hash = await bcrypt.hash(password, 10);
			const newUser = await Models.Users.create({
				id: uuid(),
				method: 'local',
				firstName,
				lastName,
				email,
				password: hash,
				isVerified: false,
				isUpdated: false
			});
			const data = {
				id: newUser.id,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				email: newUser.email,
				isVerified: newUser.isVerified,
				preferedLang: prefLocale
			};
			const token = encode(data);
			const verificationData = {
				name: newUser.firstName,
				email: newUser.email,
				token
			};

			sendVerificationEmail(verificationData);

			return res.status(201).json({
				status: 201,
				message: setLanguage(prefLocale).__('signUpSuccess'),
				data,
				token
			});
		} catch (error) {
			return errorResponse(res, 500, error.message);
		}
	}

	/**
     * @description account verification
     * @param {object} req
     * @param {object} res
     * @returns {object} json
     * @memberof userController
     */
	static async verifyAccount(req, res) {

		const token = req.params.token;
		const payload = decode(token);
		const { prefLocale } = req.i18n;
		const emailExist = await Models.Users.findOne({ where: { email: payload.email } });

		if (!emailExist) {
			return res.status(404).json({
				status: 404,
				error: setLanguage(prefLocale).__('onVerifyFailure')
			});
		}

		if (emailExist.isVerified !== true) {
		const verifiedUser = await Models.Users.update({ isVerified: true },
			 { where: { email: payload.email }, returning: true, plain: true });
			const {password, ...user} = verifiedUser[1].dataValues;
			return res.redirect(`${process.env.FRONT_END_VERIFY_PROFILE_REDIRECT}/?update=${encode(user)}`);
		}
		const {password, ...user} = emailExist.dataValues;
		return res.redirect(`${process.env.FRONT_END_VERIFY_PROFILE_REDIRECT}/?update=${encode(user)}`);
	}

	/**
     * @description update user roles
     * @param {object} req
     * @param {object} res
     * @returns {object} json
     * @memberof userController
     */
	static async assignRole(req, res) {
		const { role, preferedLang } = req.user;
		const userRole = req.body.role;
		const userExist = await Models.Users.findOne({ where: { email: req.body.email } });

		if (!userExist) {
			return errorResponse(res, 404, setLanguage(preferedLang).__("userDon'tExist"));
		}

		if (role !== 'super_administrator') {
			return errorResponse(res, 401, setLanguage(preferedLang).__('notSuperAdmin'));
		}

		await Models.Users.update(
			{ role: req.body.role },
			{
				where: { email: req.body.email }
			}
		);

		sendNotificationEmail(userExist.firstName, userExist.email, userRole);

		return successResponse(res, 200, `${setLanguage(preferedLang).__('roleUpgrade')} ${req.body.role}`);
	}

	static async signin(req, res) {
		try {
			const { email, password } = req.body,
				{ Users } = Models,
				registered = await Users.findOne({
					where: {
						email
					}
				});

			if (!registered) {
				return res.status(401).json({
					status: 401,
					error: req.i18n.__('IncorrectEmailPassword')
				});
			}
			if (!registered.isUpdated) {
				return res.status(403).json({
					status: 403,
					error: 'Please update your profile information to continue'
				});
			}

			const { method } = registered;
			if (method !== 'local') {
				return res.status(422).json({
					status: 422,
					error: `Please use ${registered.method} to sign in`
				});
			}

			const truePassword = await bcrypt.compareSync(password, registered.password);

			if (!truePassword) {
				return res.status(401).json({
					status: 401,
					error: req.i18n.__('IncorrectEmailPassword')
				});
			}
			const token = encode({
				email,
				preferedLang: registered.preferedLang
			});
			const data = {
				id: registered.id,
				method: registered.method,
				firstName: registered.firstName,
				lastName: registered.lastName,
				email: registered.email,
				isVerified: registered.isVerified,
				isUpdated: registered.isUpdated,
				gender: registered.gender,
				birthDate: registered.birthDate,
				preferedLang: registered.preferedLang,
				preferedCurrency: registered.preferedCurrency,
				residence: registered.residence,
				department: registered.department,
				managerEmail: registered.managerEmail,
				imageUrl: registered.imageUrl,
				bio: registered.bio,
				passportNumber: registered.passportNumber,
				role: registered.role,
				notifyByEmail: registered.notifyByEmail,
				createdAt: registered.createdAt,
				updatedAt: registered.updatedAt
			};
			return res.status(200).json({
				status: 200,
				message: setLanguage(registered.preferedLang).__('loginSuccessfully'),
				data,
				token
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				error: req.i18n.__('internalServerError')
			});
		}
	}

	/**
       * @description forgot password
       * @param {object} req
       * @param {object} res
       * @returns {object} json
       * @memberof userController
       */

	static async forgotPassword(req, res) {
		try {
			const { email } = req.body,
				{ Users } = Models,
				registered = await Users.findOne({
					where: {
						email
					}
				});

			if (!registered) {
				return res.status(404).json({
					status: 404,
					error: req.i18n.__('onVerifyFailure')
				});
			}

			const token = encode({ email });
			const user = {
				name: registered.firstName,
				email: registered.email,
				token,
				preferedLang: registered.preferedLang
			};

			sendPasswordResetLink(user);
			return res.status(200).json({
				status: 200,
				message: req.i18n.__('emailSent')
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				error: req.i18n.__('internalServerError')
			});
		}
	}

	static async resetPassword(req, res) {
		try {
			const { password, confirmPassword } = req.body,
				{ token } = req.params,
				payload = decode(token),
				registered = await Models.Users.findOne({ where: { email: payload.email } });

			if (!registered) {
				return res.status(404).json({
					status: 404,
					error: req.i18n.__('onVerifyFailure')
				});
			}

			if (password !== confirmPassword) {
				return res.status(422).json({
					status: 422,
					error: req.i18n.__('passwordsDontMatch')
				});
			}
			const hash = await bcrypt.hash(password, 10);

			await Models.Users.update({ password: hash }, { where: { email: payload.email } });

			return res.status(200).json({
				status: 200,
				message: req.i18n.__('passwordReset')
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				error: req.i18n.__('internalServerError')
			});
		}
	}

	/**
     * @description profile settings method
     * @param {object} req
     * @param {object} res
     * @returns {object} updated record
     * @memberof userController
     */
	static async updateProfile(req, res) {
		const {
			body: {
				firstName,
				lastName,
				gender,
				birthDate,
				preferedLang,
				preferedCurrency,
				residence,
				department,
				imageUrl,
				bio,
				passportNumber
			},
			user: { id }
		} = req;
		
		try {
			const {isUpdated, managerEmail} = await Models.Users.findOne({ where: { id } });
			const automatedEmail = isUpdated?managerEmail
			:getManagerRandomly(await Models.Users.findAll({ where: { role: 'manager' } })).email;
			const updateUser = await Models.Users.update(
				{
					firstName,
					lastName,
					gender,
					birthDate,
					preferedLang,
					preferedCurrency,
					residence,
					department,
					managerEmail: automatedEmail,
					imageUrl,
					bio,
					passportNumber,
					isUpdated: true
				},
				{
					where: { id },
					returning: true, 
					plain: true
				}
			);
            const {password, ...user} = updateUser[1].dataValues;
			return res.status(200).json({
				status: 200,
				message: setLanguage(preferedLang).__('ProfileUpdated'),
				data: user,
				token: encode(user)
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				error: setLanguage(preferedLang).__('internalServerError'),
			});
		}
	}
}

export default userController;
