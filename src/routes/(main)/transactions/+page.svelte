<script>
	import { PHX_HTTP_PROTOCOL, PHX_ENDPOINT } from '$lib/constants';
	import { goto } from '$app/navigation';
	import Datatable from '$lib/components/Datatable.svelte';
	import { buildQueryString, postData } from '$lib/index.js';
	/** @type {import('./$types').PageData} */
	export let data;

	let inputs = data.inputs;
	var url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

	function downloadDO(data, checkPage, confirmModal) {
		window.open(url + '/pdf?type=do&id=' + data.id, '_blank').focus();
	}
	function viewTradeCosts(data, checkPage, confirmModal) {
		goto('/transactions/' + data.id + '/trade_costs/');
	}
	function showCondition(data) {
		var bool = false;
		if (data.status == 'processing') {
			bool = true;
		}
		return bool;
	}
	function showCondition2(data) {
		var bool = false;
		if (!data.is_generated && data.seller_id != 0) {
			bool = true;
		}
		return bool;
	}
	function doMarkPendingDelivery(data, checkPage, confirmModal) {
		console.log(data);
		console.log('transfer approved!');

		confirmModal(true, 'Are you sure to mark this order as pending delivery?', () => {
			postData(
				{ scope: 'mark_do', id: data.id, status: 'pending_delivery' },
				{
					endpoint: url + '/svt_api/webhook',
					successCallback: () => {
						checkPage();
					}
				}
			);
		});
	}
	function issueBOP(data, checkPage, confirmModal) {
		console.log(data);
		console.log('transfer approved!');

		var totalCost = 0,
			list = [];

		data.trade_costs.forEach((v, i) => {
			totalCost = totalCost + v.amount;
			list.push(
				`<tr class="text-gray-500">
				<td  class="border-t text-right">` +
					v.cost_type +
					`</td>
				<td  class="border-t text-right">` +
					v.remarks +
					`</td>
				<td  class="border-t text-right">` +
					v.amount.toFixed(2) +
					`</td>
				
				</tr>`
			);
		});

		confirmModal(
			true,
			`	<span class="">Ensure all trade cost is entered.</span>
				<label class="	text-right my-4 text-sm font-medium block 
								text-gray-900 dark:text-gray-300 space-y-2">
								Transaction amount: MYR ` +
				data.total_price.toFixed(2) +
				`
				</label>
					
					<table class="border-collapse border border-gray-200 w-full" style="margin: 48px 0px;">
						<tr>
							<th class="text-right">Type</th>
							<th class="text-right">Remarks</th>
							<th class="text-right">Amount (MYR)</th>
						</tr>
						` +
				list.join('') +
				`
					</table>
				<label class="	text-right my-4 text-sm font-medium block 
								text-gray-900 dark:text-gray-300 space-y-2">
								Payment amount: MYR ` +
				(data.total_price - totalCost).toFixed(2) +
				`<br><br>
								Pay to: ` +
				data.seller.username +
				` | ` +
				(data.seller.fullname || '') +
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
						{ scope: 'create_payment', id: data.id, is_generated: true },
						{
							endpoint: url + '/svt_api/webhook',
							successCallback: () => {
								checkPage();
							}
						}
					);
				} else {
					alert("Incorrect confirmation password")
				}
			}
		);
	}
</script>

<Datatable
	data={{
		inputs: inputs,
		join_statements: JSON.stringify([{ commodity: 'commodity' }, { location: 'location' }]),
		search_queries: ['a.id|b.name|b.code'],
		model: 'Transaction',
		preloads: ['commodity', 'location', 'payment', 'trade_costs', 'seller'],
		buttons: [
			{ name: 'Costs', onclickFn: viewTradeCosts },
			// { name: 'Download DO (PDF)', onclickFn: downloadDO },
			// {
			//   name: 'Mark Pending Delivery',
			//   onclickFn: doMarkPendingDelivery,
			//   showCondition: showCondition
			// },
			{ name: 'Issue BOP', onclickFn: issueBOP, showCondition: showCondition2 }
		],
		customCols: [
			{
				title: 'General',
				list: ['id']
			}
		],
		columns: [
			{ label: 'ID', data: 'id' },
			{ label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },
			{
				label: 'Issued?',
				data: 'is_generated',
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
			{ label: 'UUID', data: 'uuid' },
			{ label: 'Nett Weight (Kg)', data: 'net_weight_kg', className: 'text-right' },
			{ label: 'Price/MT  (RM)', data: 'price_per_tonne', className: 'text-right' },
			{ label: 'Total Price (RM)', data: 'total_price', className: 'text-right' },
			{ label: 'Commodity', data: 'name', through: ['commodity'] },
			{ label: 'Location', data: 'code', through: ['location'] }
		]
	}}
/>
