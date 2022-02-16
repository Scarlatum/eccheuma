	import { ActionTree, MutationTree } from 'vuex'

// API
	import { database } from '~/api/database'

// UTILS
	import { utils } from '~/utils';

// INTERFACES AND TYPES 

	import { VuexMap } from '~/typescript/VuexMap'

	import { Purchase } 	from '~/typescript/Services'
	import { Message } from '~/typescript/Message'

	import type { Notification } from '~/typescript/Notification'
	
// STATE
	export const state = () => ({

		ActiveOrders: new Array<Purchase.order<any>>(0),

		RequestQuantity: 0,
		Orders: new Array<Purchase.order<any>>(0),
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface User {
			WorkRequest: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_WorkQuantity(state, prop) {
			state.RequestQuantity = prop;
		},
		setOrders(state, prop) {
			state.Orders = prop
		},
		Change_ActiveRequests(state, prop) {
			state.ActiveOrders = prop
		}
	}

	// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap> = {

		async sendWorkRequest(vuex, order: Purchase.order<any>) {

			const { UserID } = vuex.rootState.User.State.State

			const Message: Message.struct = {
				ID: utils.hashGenerator(),
				userID: 'SUPPORT',
				from: 'Eccheuma Informer',
				message: 
				`Благодарю за оформление заявки на заказ: "${ order.name }".
				
				В скором времени вам напишут, и тогда можно будет обсудить условия заказа, правок, оплаты.
				В среднем ответа можно ждать в диапозоне до 1 дня. Но время может меняться в зависимости от загруженности.
				
				Текущие заказы можно посмотреть в разделе "запросы".`,
				readed: false,
				date: Date.now(),
			}

			const newNotification: Notification.struct = {
				message: 'Ваша заявка пошла на рассмотрение',
				description: 'Информацию о стаусе заказа, вы можете посмотреть в личном кабинете, что находиться вверху приложения.',
			}

			try {

				await vuex.dispatch('setRequestQuantity');

				const requestHash = utils.hashGenerator();

				await database.set(`Users/${ UserID }/work_requests/WorkID-${ requestHash }`, order);
				await database.set(`Users/${ UserID }/messages/Hash_${ requestHash }`, Message);

				vuex.commit('Notification/Notification_Status', true, { root: true })
				vuex.commit('Notification/setNotification', newNotification, { root: true })

			} catch (e) {
				console.log(e) 
			}

		},
		
		async setRequestContent(vuex) {

			const { UserID } = vuex.rootState.User.State.State

			vuex.commit('Change_Requests', await database.get(`Users/${ UserID }/work_requests`)) 
		},

		async setRequestQuantity(vuex) {

			const { UserID } = vuex.rootState.User.State.State

			vuex.commit('Change_WorkQuantity', await database.getLength(`Users/${ UserID }/work_requests`)) 
		},

		setActiveRequest(vuex) {

			if ( !vuex.state.Orders.length ) return;

			vuex.commit('Change_ActiveRequests', vuex.state.Orders.filter((order) => {
				return order.status === Purchase.status.Process
			}))

		},

	}
