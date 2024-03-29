import type { MutationTree, ActionTree } from 'vuex';

// API
	import { database } from '~/api/database';
	import { storage } from '~/api/storage';
	import { auth, form } from '~/api/auth';

// UTILS
	import { utils } from '~/utils';
	import { currencies, wallet } from '~/utils/currency';

// TYPES
	import type { VuexMap } from '~/types/VuexMap';
	import type { Message } from '~/types/Message';

// NAMESPACES
	import { User } 		from '~/types/User';
	import { Purchase } from '~/types/Services';

// STATE
	export const state = () => ({
		Modal: false
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexMap' {
		interface Auth {
			Register: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		toggleRegisterModal(state, prop?: boolean) {
			state.Modal = prop ?? !state.Modal;
		}
	};

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap> = {

		async Register(vuex, form: form.registration): Promise<auth.error | boolean> {

			const responseResult = await auth.register(form.email, form.password);

			if ( responseResult instanceof Error ) {

				vuex.commit('Auth/Session/setAuthError', responseResult, { root: true });

				return false;

			}

			const { uid, email } = responseResult;

			const userWallet = new wallet.Instance(currencies.DEFAULT);
			
			vuex.commit('Auth/Session/setUserState', { uid, email }, { root: true });
			vuex.commit('Auth/Session/setAuthError', null, { root: true });

			await database.set<User.struct>(`Users/${ uid }/state`, {
				UserID					:	uid,
				UserEmail				:	email,
				UserName				:	form.name,
				UserStatus			:	User.status.User,
				UserWallet			:	userWallet.toJSON,
				UserWorkStatus	: Purchase.status.None,
				UserImageID			:	String(storage.reference('UserIcons/default.webp'))
			});

			await database.set(`User/${ uid }/info`, {
				registrationDate: Date.now()
			});

			// ? Всё ещё стоит под вопросом. Нужно ли хранить данные касательно клиентских настроек вне браузера...
			await database.set(`Users/${ uid  }/preferences`, {
				theme					: 0,
				notifications	: false,
			});

			const Message: Message.struct = {
				ID			: utils.randHashGenerator(),
				date		: Date.now(),
				from		: 'Eccheuma',
				userID	: 'SUPPORT',
				message	: 'Благодарю вас за регистрацию!',
				readed	: false,
			};

			await database.set(`Users/${ uid }/messages/Hash_${ Message.ID }`, Message);

			return true;

		}

	};
