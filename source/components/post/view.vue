<template>
	<intesection-component :rootMargin="15" @isIntersecting="animateIntersection">
		<section
			:id="`PostID-${ payload.ID }`" 
			ref="post"
			class="post-container"
			@keydown.ctrl.enter="sendComment"
			> 

			<div class="post-header" ref="ImageHolder">

				<picture class="post-header-image">
					<source :srcset="Thumbnail.avif" type="image/avif">
					<img ref="image" :src="Thumbnail.webp" :alt="payload.description">
				</picture>

				<section v-once class="post-header-tags">

					<tag v-for="(item, i) in payload.tags" :key="i" theme="transparent">
						#{{ item }}
					</tag>

				</section>

				<section v-once class="post-header-title">
					<h4>{{ payload.title }}</h4>
					<h6>{{ payload.description }}</h6>
				</section>

				<section class="post-header-time">
					<tag theme="transparent">
						{{ postDate.Day }} в {{ postDate.Time }}
					</tag>
				</section>

			</div>

			<div class="post-footer" :class="[
				{ 'utils::cooled-sections': Cooled && !$isMobile },
				{ 'rounded-bottom': !ContentSection && !CommentSection },
				]">

				<section class="post-footer-social">

					<button 
						:id="`LikePopOver-${ payload.ID }`"
						:class="[
							{ active: userLiked }, 
							{ disabled: !LoginStatus }
						]"
						@click="sendLike"
						>

						<icon name="Fire" />

						<client-only>
							
							<template v-if="Object.keys(likes || {}).length">
								<span>{{ Object.keys(likes || {}).length }}</span>
							</template>

							<span slot="placeholder" />

						</client-only>

						<popover :target="`LikePopOver-${ payload.ID }`" position="top">
							{{ LoginStatus ? 'Поставить лайк' : 'Авторизируйтесь для оценки' }}
						</popover>

					</button>

					<button 
						:id="`CommentPopOver-${ payload.ID }`" 
						:class="{ active: CommentSection }"
						@click="toggleSection(!CommentSection, 'CommentSection')"
						>

						<icon name="Comment" />

						<client-only>

							<template v-if="sortedComments.length">
								<span>{{ sortedComments.length }}</span>
							</template>

							<span slot="placeholder" />

						</client-only>

						<popover :target="`CommentPopOver-${ payload.ID }`" position="top">
							Открыть комметарий
						</popover>

					</button>

				</section>

				<section class="post-footer-collapse">

					<common-button 
						:scheme="UI"
						:sound="false"
						@mouseenter.native.once="prepareContent = true" 
						@click.native="toggleSection(!ContentSection, 'ContentSection')"
						>
						{{ !ContentSection ? 'Развернуть пост' : 'Свернуть пост' }}
					</common-button>

				</section>				

				<section class="post-footer-author">

					<template v-if="author">
						<tag>
							{{ author.UserName }}
						</tag>
						<i :style="`background-image: url(${ author.UserImageID })`" />
					</template>

				</section>

			</div>

			<hardware-acceleration-decorator>
				<collapse :active="ContentSection">

					<article 
						class="post-content" 
						:class="[
							{ 'rounded': !ContentSection && !CommentSection },
							{ 'rounded-bottom': ContentSection && !CommentSection }
						]"
					>

						<header class="post-content-header">
							<h4>{{ payload.title }}</h4>
							<h6>{{ payload.description }}</h6>
							<span>{{ author ? author.UserName : '' }} | {{ postDate.Day }} в {{ postDate.Time }}</span>
						</header>

						<template v-if="editContent">
							<slot />
						</template>

						<template v-else>
							<content-component :source="content" />
						</template>

						<section v-once class="post-content-tags">
							<h6>Теги: </h6>
							<tag v-for="(item, i) in payload.tags" :key="i" :transparent="false" theme="grey">
								#{{ item }}
							</tag>
						</section>

						<hr v-once>

						<section class="post-content-comments">
							<common-button class="interface-dark" :scheme="UI" :sound="false" @click.native="toggleSection(!CommentSection, 'CommentSection')">
								Открыть комментарии
							</common-button>
						</section>

					</article>
					
				</collapse>
			</hardware-acceleration-decorator>

			<hardware-acceleration-decorator>
				<collapse :active="CommentSection">	

					<div 
						class="post-comments" 
						:class="[
							{ 'rounded': !CommentSection },
							{ 'rounded-bottom': CommentSection }
						]"
					>

						<section class="post-comments-header">
							<span>Комментарии</span>
							<hr>
						</section>

						<template v-if="!sortedComments.length"> 
							<section class="post-comments-first">
								<span>" Тут ещё нет комментариев, но это пока... "</span>
							</section>
						</template>

						<section class="post-comments-content">
							<transition-group name="opacity-transition">
								<comment-component 
									v-for="item in sortedComments" 
									:key="item.date" 
									:userID="item.userID"
									:postID="payload.ID" 
									:commentID="item.ID"
									@picked-user="pickAddressee"
								/>
							</transition-group>
						</section>

						<section class="post-comments-answer">

							<template v-if="LoginStatus">

								<h5>Оставьте свой комментарий</h5>
								<p>Не длинее {{ CHAR_LIMIT }} символов и не менее 6. <strong>Лимит: {{ charLimit }}</strong></p>

								<textarea 
									v-model="Message" 
									name="comment_section" 
									:maxlength="CHAR_LIMIT" 
									placeholder="Напишите тут что-то в ответ." 
								/>
		
								<button :class="{ disabled: validation === false }" type="button" @click="sendComment" class="post-comments-answer-button">
									Ответить <span>( Ctrl + Enter )</span>
								</button>

							</template>

							<template v-else>

								<icon v-once name="Info" />
								<h5>Для комментирования необходима авторизация</h5>
								<p>Это не так уж и сложно, да и получите сверху ещё больше функионала.</p>

								<common-button v-once @click.native="() => toggleRegisterModal()" style="margin: 1vh auto">
									Зарегистрироваться
								</common-button>

							</template>

						</section>

					</div>

				</collapse>
			</hardware-acceleration-decorator>

		</section>
	</intesection-component>
</template>

<style lang="scss">

	.post {
		&-container {

			@include gradient_border(block);
			@include component-shadow;

			border-radius: var(--border-radius);

			.rounded {

				border-radius: var(--border-radius);

				&-top {
					border-radius: 0 0 .7rem .7rem !important;
				}
				&-bottom {
					border-radius: 0 0 .7rem .7rem !important;
				}
			}

		}
		&-header {

			display: grid;
			position: relative;

			background-color: rgb(var(--color-mono-300));

			border-radius: .7rem .7rem 0 0;
			overflow: hidden;

			background: {
				size: cover;
				position: center;
				repeat: no-repeat;
			}

			grid-template: {
				columns: 1fr;
				rows: 10vh 20vh 10vh;
			}

			&:before {

				content: "";

				position: absolute; 
				z-index: 1;
				
				top: 0; 
				left: 0; 

				width: 100%; 
				height: 100%;

				opacity: .75;

				// Desktop
				@media screen and ( min-width: $mobile-breakpoint ) {
					background-image: url(~assets/images/Stripes.png?size=15);
				}

			}

			&:after {
				content: "";
				position: absolute; top: 0; left: 0; z-index: 2;
				width: 100%; 
				height: 100%;

				// Desktop
				@media screen and ( min-width: $mobile-breakpoint ) {
					background: linear-gradient(180deg, rgb(var(--mono-200),.5) 80%, rgb(var(--mono-200)) 100%);
				}

				// Mobile
				@media screen and ( max-width: $mobile-breakpoint ) {
					background: linear-gradient(180deg, rgb(var(--mono-200),.5) 50%, rgb(var(--mono-200)) 100%);
				}
			}

			&-image {
				position: absolute;
				display: block;
				width: 100%;
				height: 100%;
				img {
					position: relative;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			&-tags {

				z-index: 3;

				position: relative;
				display: inline-flex;

				width: 100%;
				height: 100%;

				align-items: center;
				justify-content: center;

				column-gap: calc(min(5px, .5vw));

			}

			&-title {

				z-index: 3;

				align-self: center;

				padding: 0 40px;
				color: rgb(var(--mono-800));

				@media screen and ( max-width: $mobile-breakpoint ) {
					text-align: center;
				}

				h4 {
					font-weight: 900;
					font-size: var(--font-size-42);
					width: clamp(min-content, 25ch, 100%);

					@media screen and ( max-width: $mobile-breakpoint ) {
						font-size: var(--font-size-28);
					}

				}
				h6 {
					font-weight: 600;
					font-size: var(--font-size-20);
					width: clamp(min-content, 65ch, 100%);
				}

			}

			&-time {

				z-index: 3;

				position: relative;
				display: grid;

				width: 100%;
				height: 100%;

				align-content: center;
				justify-content: center;

			}

		}
		&-footer {

			transition: border-radius 250ms ease-in-out;

			background-color: rgb(var(--color-mono-200));
			border-top: 1px solid var(--color-accent-edges-100);

			display: grid;

			padding: 0 2vw;

			grid-template: {
				columns: 2fr min-content 2fr;
				rows: 10vh;
				areas: 'social collapse author'
			}

			// border-bottom: 1px solid rgba(var(--color-mono-900), .25);

			@media screen and ( max-width: $mobile-breakpoint ) {

				padding: 2vh 0;
				row-gap: 2vh;

				justify-content: center;
				grid-template: {
					columns: 1fr;
					rows: auto;
					areas: 	'author'
									'social'
									'collapse'
				}

			}

			.active {

				background-color: rgb(var(--color-mono-900));
				color: rgb(var(--color-mono-300));

				i {
					fill: rgb(var(--color-mono-300));
				}

			}

			.disabled {
				pointer-events: none;
				opacity: .25;
			}

			&-social {

				position: relative;

				@media screen and ( max-width: $mobile-breakpoint ) {
					place-self: center;
				}

				justify-self: start;
				align-self: center;
				
				grid: { 
					row: 		social; 
					column: social; 
				}

				column-gap: 2px;

				button {

					* {
						pointer-events: none;
					}

					display: inline-flex;
					column-gap: 4px;

					@include push-button {

						background-color: transparent;
						color: rgb(var(--color-mono-900));

						transition-duration: 250ms;

						i {
							fill: rgb(var(--color-mono-900));
						}

						span {
							line-height: 21px;
							padding: 0 4px;
						}

					}
				}

			}
			
			&-collapse {

				@media screen and ( max-width: $mobile-breakpoint ) {
					place-self: center;
				}

				justify-self: center;
				align-self: center;
				
				grid: { 
					row: 		collapse; 
					column: collapse; 
				}

			}

			&-author {

				$iconSize: 100px;

				@media screen and ( max-width: $mobile-breakpoint ) {
					transform: unset;
					place-self: center;
				}

				z-index: 3;

				display: inline-grid;
				row-gap: 2vh;

				transform: translateY(calc((#{ $iconSize } - 10vh) - (#{ $iconSize } / 2)));

				justify: {
					self: end;
					items: center;
				}

				align: {
					self: flex-end;
				}
				
				grid: { 
					row: 		author; 
					column: author; 
				}

				i {

					display: block;

					background: {
						size: cover;
						position: center;
						color: rgb(var(--color-mono-300));
					}

					border: 4px solid var(--color-accent-edges-100);
					border-radius: 100%;

					height: $iconSize; 
					width: $iconSize;

					box-shadow: 0px 1vh 0px 0px rgba(var(--color-mono-000), .25);

				}

			}
		}
		&-content {

			transition: border-radius 250ms ease-in-out;

			background-color: rgb(var(--color-mono-200));
			color: rgb(var(--color-mono-900));
			min-height: 50vh;
			padding: 5vh 3vw;

			display: grid;
			row-gap: 2vh;

			hr {
				width: 100%;
				background-color: rgb(var(--color-mono-400))
			}

			&-header {

				color: rgb(var(--color-mono-900));

				h4 {	
					font: {
						size: var(--font-size-36);
						weight: 900;
					}
				}

				h6 {
					font: {
						size: var(--font-size-18);
						weight: 800;
					}
				}

				span {

					font: {
						size: var(--font-size-14);
						weight: 700;
					}

					color: rgb(var(--color-mono-500));

				}

			}

			&-tags {

				h6 {
					margin-right: 1vw;
					font-weight: 800;
					font-size: var(--font-size-20);
				}

				display: inline-flex;
				align-items: baseline;
				column-gap: calc(min(5px, .5vw));
			}

			&-comments {
				place-self: center;
			}

		}
		&-comments {

			transition: border-radius 250ms ease-in-out;

			background-color: rgb(var(--color-mono-200));
			color: rgb(var(--color-mono-900));

			&-header {

				display: grid;
				margin: 2vh 0;

				span {
					font-size: var(--font-size-56);
					font-family: var(--decor-font);
					font-weight: 500;
					text-align: center;
				}

				hr {
					width: 75%;
					margin: 1.75vh auto;
					height: .5px;
					background: var(--color-accent-edges-100);
				}

			}

			&-first {

				text-align: center;
				padding-block: 5vh 6vh;

				color: rgb(var(--color-mono-900));
				font: {
					size: var(--font-size-36);
					family: var(--decor-font);
					weight: 500;
				}

				border-bottom: 1px solid rgb(var(--color-mono-300));
				border-top: 1px solid rgb(var(--color-mono-300));

			}

			&-content {
				display: inline-grid;
				width: 100%;
				padding-inline: 2vh;
			}

			&-answer {
				border-top: 1px solid rgb(var(--color-mono-200));
				padding: 2vh 3vw 5vh;

				i {
					@include icon-size(10vh);
					margin-bottom: 1vh;
					fill: rgb(var(--color-mono-400))
				}

				h5 {
					color: rgb(var(--color-mono-900));
					font-size: var(--font-size-24);
					text-align: center;
					font-weight: 800;
				}
				p {
					white-space: pre-wrap;
					text-align: center;
					font-weight: 500;
					font-size: var(--font-size-16);
				}
				textarea {
					resize: none;
					display: block;
					width: 100%;
					height: 20vh;

					color: rgb(var(--color-mono-900));
					background-color: rgb(var(--color-mono-200));

					border: {
						style: solid;
						width: 2px;
						color: var(--color-accent-edges-100);
						radius: var(--border-radius);
					}

					padding: 15px 20px;
					font-size: 12px;
					transition-duration: 500ms;

					&:focus {
						outline: none;
						border: {
							color: var(--color-accent-edges-300);
						}
					}

				}

				&-button {
					@include push-button {
						background-color: transparent;
					};

					margin: {
						top: 3vh !important;
					}
				}
				
			}
		}
	}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// VUEX
	import { mapState, mapMutations } from 'vuex';

	// API
	import { database } from '~/api/database';

	// UTILS
	import { utils } from '~/utils';
	import { validate } from '~/utils/validate';

	// MIXINS
	import EmitSound 						from '~/assets/mixins/EmitSound';
	import IntersectionCooler 	from '~/assets/mixins/IntersectionCooler';

	// Model 
	import { PostModel } from './post.model';

	// Helpers
	import { helpers } from './post.helpers';

	// COMPONETS
	import Collapse 						from '~/components/common/Collapse.vue';
	import Popover 							from '~/components/common/Popover.vue';
	import Tag 									from '~/components/common/Tag.vue';
	import Icon									from '~/components/common/Icon.vue';
	import CommonButton 				from '~/components/buttons/CommonButton.vue';

	// FUNCTIONAL COMPONENTS
	import HardwareAccelerationDecorator 	from '~/components/functional/HardwareAcceleration.vue';
	import IntesectionComponent 					from '~/components/functional/intersectionComponent.vue';

	// ? С фильтрами происходит что-то не совсем ясное. 
	// ? Нормально работают в хроме, но лиса отказывается с ними адекватно дружить.

	// FILTERS
	// import DisplacementFilter		from '~/components/filters/displacement.vue'
	// import NoiseFilter					from '~/components/filters/noise.vue'

	// VUEX MODULE TYPE MAP
	import type { VuexMap } from '~/types/VuexMap';

	// NAMESPACES
	import { Post } from '~/types/Post';
	import { User } from '~/types/User';

	// TYPES & INTERFACES
	import type { Image } from '~/types/Image';

	// Helpers
	import { getOptimalImage } from '../image/image.helpers';

	type SECTIONS = 'likes' | 'comments' | 'content'

	// IMAGE PLACEHOLDER
	const IMAGE_PLACEHOLDER: Pick<Image.formatsStruct, 'avif' | 'webp'> = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=avif').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src
	};

	const CHAR_LIMIT = 600;

	const PostInstance = new PostModel();

	// MODULE
	export default Vue.extend({

		components: {
			HardwareAccelerationDecorator,
			IntesectionComponent,
			Collapse,
			CommonButton,
			Popover,
			Tag,
			Icon,
			// DisplacementFilter,
			// NoiseFilter,
			CommentComponent: () => import('~/components/post/submodules/Comment.vue'),
			ContentComponent: () => import('~/components/post/submodules/Content.vue'),
		},

		mixins: [ 
			EmitSound, 
			IntersectionCooler 
		],
		
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<Post.struct>,
			editContent: {
				type: Boolean,
				default: false
			},
			opened: {
				type: Boolean,
				default: false,
			}
		},

		data() {
			return {

				CHAR_LIMIT,

				Thumbnail: IMAGE_PLACEHOLDER,

				Message: String(),
				PrevMessage: String(),

				ContentSection: false,
				CommentSection: false,
				prepareContent: false,

				Addressee: Array<User.struct['UserID']>(),

				IntersectionAnimation: undefined as Animation | undefined,
				Cooled: undefined as undefined | boolean,

				...PostInstance.objectRepresentation(),

			};
		},

		async fetch() {

			this.postDate = utils.getLocalTime(this.payload.date);

			if ( process.server ) {
				await this.getAuthor();
			}

			if ( this.opened ) {
				this.content = await database.get(`Posts/PostID-${ this.payload.ID }/content`);
			}

		},

		computed: {

			...mapState({
				UI					:	state => (state as VuexMap).App.UI,
				LoginStatus	: state => (state as VuexMap).Auth.Session.LoginStatus,
				StoreUser		:	state => (state as VuexMap).User.State.State,
			}),

			charLimit(): number {
				return CHAR_LIMIT - this.Message.length;
			},

			userLiked(): boolean {

				return this.likes 
					? Reflect.has(this.likes, this.StoreUser.UserID)
					: false;

			},

			sortedComments(): Array<Post.comment> {
				return Object.values(this.comments || {}).sort((a, b) => a.date - b.date);
			},

			validation(): boolean {
				return validate.sentence(this.Message, ['something'], { minLength: 6 });
			}
			
		},

		watch: {
			'payload.image': {
				handler() {
					this.$nextTick().then(() => this.updateImage());
				},
			},
			Message: {
				handler(n: string, o: string) {
					this.playSound(this.Sounds.get(n.length > o.length ? 'Input::Increment' : 'Input::Decrement'));
				}
			},
			userLiked: {
				handler(value: boolean) {
					this.playSound(this.Sounds.get(value ? 'Switch::On' : 'Switch::Off'));
				}
			},
		},

		created() {

			if ( process.browser ) {
				
				const watchCooledStatus 	= this.$watch('Cooled', async (status) => {
					if ( !status ) {

						this.listenDataSnapshots('comments');
						this.listenDataSnapshots('likes');

						this.updateImage(); 						
						this.getAuthor();
						
						watchCooledStatus(); console.debug('[Post]: watchCooledStatus | init');

					}
				}); 
	
				const watchCommentSection = this.$watch('CommentSection', () => {

					this.setSounds([
						{ file: 'Off', name: 'Input::Increment', settings: { rate: 0.65, volume: .25 } },
						{ file: 'Off', name: 'Input::Decrement', settings: { rate: 0.50, volume: .25 } },
					]);
	
					watchCommentSection();

				});
	
				const watchPrepareContent = this.$watch('prepareContent', () => {
					this.listenDataSnapshots('content'); watchPrepareContent();
				});

				const watchIntersection 	= this.$watch('IntersectionAnimation', () => {
					if ( this.IntersectionAnimation ) {
						this.IntersectionAnimation.reverse(); watchIntersection();
					}
				});

			}

			if ( this.opened ) {
				this.prepareContent = true;
				this.ContentSection = this.opened;
			}

		},

		mounted() {

			if ( process.browser ) {

				this.initCooler(this.$el, (cooled: boolean) => {
					this.Cooled = cooled;
				});

				this.IntersectionAnimation = (this.$refs.post as HTMLElement).animate([
					{ opacity: 0 },
					{ opacity: 1 }
				], {
					easing: 'ease-in-out',
					duration: 1000,
					fill: 'both',
				});

				this.setSounds([
					{ file: 'Off', 	name: 'Element::Action', settings: { rate: 0.50 } },
				]);
		
				this.setSounds([
					{ file: 'Tap', 	name: 'Switch::On',		settings: { rate: 1.00, volume: 0.25 } },
					{ file: 'Tap', 	name: 'Switch::Off',	settings: { rate: 0.50, volume: 0.25 } },
				]);

			}

		},

		methods: {

			pickAddressee(user: User.struct) {
				this.Message = helpers.asAnswer({
					user		: user,
					message	: this.Message
				});
			},

			...mapMutations({
				toggleRegisterModal: 'Auth/Register/toggleRegisterModal',
			}),
			
			async getAuthor() {

				const result = await PostModel.getAuthor(this.payload.authorID);

				this.author = result instanceof Error
					? User.DEFAULT
					: result;

			},

			async listenDataSnapshots(section: SECTIONS) {

				console.debug(`[Post]: listenDataSnapshots | ${ section }`);

				const PATH = `Posts/PostID-${ this.payload.ID }/${ section.toLowerCase() }`;

				database.listen(PATH, data => { this[section] = data as any; });

			}, 

			toggleSection(status: boolean, section: 'ContentSection' | 'CommentSection'): void {

				this[section] = status;

				this.playSound(this.Sounds.get(status ? 'Switch::On' : 'Switch::Off'));

			},

			async updateImage(): Promise<void> {

				const IMAGE_CONTAINER = this.$refs.ImageHolder as HTMLElement;

				getOptimalImage(IMAGE_CONTAINER, this.payload.image).then(url => {
					if ( this.application.context.browser && this.application.gpu.available() ) {
						this.prepareAnimations(IMAGE_CONTAINER, url);
					} else {
						this.Thumbnail = url;
					}
				});

			},

			animateIntersection(intersection: boolean) {
				if ( this.IntersectionAnimation ) {

					this.IntersectionAnimation.cancel(); 
					this.IntersectionAnimation.updatePlaybackRate(intersection ? 1 : -1); 
					this.IntersectionAnimation.play();

				}
			},

			prepareAnimations(el: Element, url: Image.formatsStruct) {

				const animation = el.animate([
					{ opacity: 1 },
					{ opacity: 0 }
				], {
					duration: 250,
					fill: 'both',
				});

				animation.onfinish = () => {
					
					animation.onfinish = null;

					(this.$refs.image as HTMLImageElement).onload = () => animation.reverse();

					this.Thumbnail = url;

				};

			},

			async sendComment() {

				if ( this.validation && this.LoginStatus && this.PrevMessage !== this.Message ) {

					const sendResult = await PostModel.sendComment({ 
						message		: this.Message,
						postID		: this.payload.ID,
						userID		: this.StoreUser.UserID,
						addressee : await helpers.getAddresseeID(this.Message),
					});

					if ( sendResult instanceof Error ) {

						// TODO: Make error handling for UI

					} else {
						this.PrevMessage 	= this.Message;
						this.Message 			= String();
					}

				}

			},

			async sendLike() {

				if ( !this.LoginStatus ) return;

				await PostModel.sendLike({
					postID	: this.payload.ID,
					userID	: this.StoreUser.UserID,
				}, this.userLiked);

			},

		},

	});

</script>
