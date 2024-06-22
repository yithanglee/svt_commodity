<script>
	import { Card, Button, Spinner, Label, Input, Checkbox, Select } from 'flowbite-svelte';

	let positions = [
		{ value: 'left', name: 'Left' },
		{ value: 'right', name: 'Right' }
	];
	import { postData } from '$lib/index.js';
	import Datatable from '$lib/components/Datatable.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
	import { PHX_HTTP_PROTOCOL, PHX_ENDPOINT } from '$lib/constants';

	import { isTableReloaded } from '$lib/stores/reloadTable';
	let fullname,
		isLoading = false,
		password,
		phone,
		email,
		sponsor,
		position,
		username,
		inputs = data.inputs;
	async function fetchData3() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 6000);
		var form = document.getElementById('currentForm3');
		var formData = new FormData(form);
		await postData(formData, {
			isFormData: true,
			endpoint: PHX_HTTP_PROTOCOL + PHX_ENDPOINT + '/svt_api/webhook?scope=admin_modify_referral',
			successCallback: () => {
				isLoading = false;
				// isToastOpen.notify('Member recorded!');
				isTableReloaded.activate();
			}
		});
	}
	async function fetchData2() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 6000);
		var form = document.getElementById('currentForm2');
		var formData = new FormData(form);
		await postData(formData, {
			isFormData: true,
			endpoint: PHX_HTTP_PROTOCOL + PHX_ENDPOINT + '/svt_api/webhook?scope=admin_modify_placement',
			successCallback: () => {
				isLoading = false;
				// isToastOpen.notify('Member recorded!');
				isTableReloaded.activate();
			}
		});
	}
	async function fetchData() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 6000);
		var form = document.getElementById('currentForm');
		var formData = new FormData(form);
		await postData(formData, {
			isFormData: true,
			endpoint: PHX_HTTP_PROTOCOL + PHX_ENDPOINT + '/svt_api/webhook?scope=admin_register_member',
			successCallback: () => {
				isLoading = false;
				// isToastOpen.notify('Member recorded!');
				isTableReloaded.activate();
			}
		});
	}
</script>

<div class="flex sm:grid grid-cols-12 flex-col-reverse">
	<div class="col-span-12  mx-4 p-4">
		<Datatable
			data={{
				inputs: inputs,
				search_queries: ['a.username|a.phone'],
				model: 'User',
				preloads: ['rank'],
				customCols: [
					{
						title: 'General',
						list: [
							'id',
							'username',
							'fullname',

							{
								label: 'rank_id',
								selection: 'Rank',
								customCols: null,
								search_queries: ['a.name'],
								newData: 'name',
								title_key: 'name'
							},
							{ label: 'is_stockist', boolean: true }
						]
					},
					{
						title: 'Personal Info',
						list: [
							'phone',
							'email',
							'rank_name',
							'ic_no',
							{ label: 'password', expose: true },
							'bank_account_holder',
							'bank_account_no',
							'bank_name'
						]
					}
				],
				columns: [
					{ label: 'ID', data: 'id' },
					{
						label: 'Stockist?',
						data: 'is_stockist',
						isBadge: true,
						color: [
							{
								key: false,
								value: 'yellow'
							},

							{
								key: true,
								value: 'green'
							}
						]
					},

					{ label: 'Username', data: 'username' },
					{ label: 'Phone/Email', data: 'phone', subtitle: { data: 'email' } },

					{ label: 'Rank', data: 'name', through: ['rank'] }
				]
			}}
		/>
	</div>
	
</div>
