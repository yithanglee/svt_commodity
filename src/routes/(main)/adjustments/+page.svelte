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
	function showCondition2(data) {
		var bool = false;
		if (!data.is_final) {
			bool = true;
		}
		return bool;
	}
	// view the transcations and calculations
	function finalizeAdjustment(data, checkPage, confirmModal) {
		console.log(data);
		console.log('transfer approved!');
		
		var totalPaid = 0,
			list = [];

		data.transactions.forEach((v, i) => {
			totalPaid = totalPaid + v.total_price
			list.push(
				`<tr class="text-gray-500">
				<td  class="border-t text-right">` +
					v.net_weight_kg +
					`</td>
				<td  class="border-t text-right">` +
					v.price_per_tonne +
					`</td>
				<td  class="border-t text-right">` +
					v.total_price.toFixed(2) +
					`</td>
				
				</tr>`
			);
		});

		confirmModal(
			true,
			`	<span class=""></span>
				<label class="	text-right my-4 text-sm font-medium block 
								text-gray-900 dark:text-gray-300 space-y-2">
								Actual amount: MYR ` + (JSON.parse(data.remarks).actual_payout).toFixed(2) +
				
				`
				</label>
					
					<table class="border-collapse border border-gray-200 w-full" style="margin: 48px 0px;">
						<tr>
							<th class="text-right">Net Weight (kg)</th>
							<th class="text-right">Price (MYR) Per MT</th>
							<th class="text-right">Amount (MYR)</th>
						</tr>
						` +
				list.join('') +
				`
					</table>
					<label class="	text-right my-4 text-sm font-medium block 
								text-gray-900 dark:text-gray-300 space-y-2">
								Total paid amount: MYR ` + (totalPaid).toFixed(2) +
				
				`
				</label>
				<label class="	text-right my-4 text-sm font-medium block 
								text-gray-900 dark:text-gray-300 space-y-2">
								Payment amount: MYR ` +
				data.amount.toFixed(2) +
				`<br><br>
								Pay to: ` +
				data.user.username +
				` | ` +
				(data.user.fullname || '') +
				`
				</label>
				<div class="text-sm flex flex-col w-1/3">
					<span style="margin: 16px 0px; right: 0;">Confirm with password</span>  
					<input 	name="password" placeholder="" type="text" 
							class="	block w-75 disabled:cursor-not-allowed disabled:opacity-50 p-2.5 
									focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 
									dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white 
									dark:placeholder-gray-400 border-gray-300 dark:border-gray-500 text-sm rounded-lg"> 
				</div>
				
				`,
			() => {
				var dom = document.querySelector("input[name='password']");

				if (dom.value == '1234') {
					postData(
						{ scope: 'finalize_trx', id: data.id, is_final: true },
						{
							endpoint: url + '/svt_api/webhook',
							successCallback: () => {
								checkPage();
							}
						}
					);
				} else {
					alert('Incorrect confirmation password');
				}
			}
		);
	}
</script>

<div class="flex sm:grid grid-cols-12 flex-col-reverse">
	<div class="col-span-12 mx-4 p-4">
		<Datatable
			data={{
				inputs: inputs,
				search_queries: ['a.username|a.phone'],
				model: 'Adjustment',
				preloads: ['commodity', 'transactions', 'user'],
				buttons: [{ name: 'Finalize', onclickFn: finalizeAdjustment, showCondition: showCondition2 }],
				customCols: [
					{
						title: 'General',
						list: ['id']
					}
				],
				columns: [
					{ label: 'ID', data: 'id' },
					{ label: 'Year', data: 'year' },
					{ label: 'Month', data: 'month' },

					{ label: 'Username', data: 'username', through: ['user'] },
					{ label: 'Amount (MYR) ', data: 'amount' },
					{ label: 'Month end price/MT', data: 'month_end_price_per_tonne' },
					{ label: 'Commodity', data: 'name', through: ['commodity'] },
					{
						label: 'Finalized?',
						data: 'is_final',
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
					{
						label: 'Cost charged?',
						data: 'has_charge',
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
					}
				]
			}}
		/>
	</div>
</div>
