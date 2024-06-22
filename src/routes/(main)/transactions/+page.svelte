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
	function viewDO(data, checkPage, confirmModal) {
		goto('/deliveries/' + data.id);
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
		if (data.status == 'pending_delivery') {
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
	function doMarkSent(data, checkPage, confirmModal) {
		console.log(data);
		console.log('transfer approved!');

		confirmModal(
			true,
			`
        <label class="my-4 text-sm font-medium block 
        text-gray-900 dark:text-gray-300 space-y-2">
        <span>Shipping Ref</span>  <input name="shipping_ref" 
        placeholder="" type="text" class="block w-75 disabled:cursor-not-allowed disabled:opacity-50 p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-500 text-sm rounded-lg"> </label>
        <span class="">Are you sure to mark this order as sent?</span>`,
			() => {
				var dom = document.querySelector("input[name='shipping_ref']");
				postData(
					{ scope: 'mark_do', shipping_ref: dom.value, id: data.id, status: 'sent' },
					{
						endpoint: url + '/svt_api/webhook',
						successCallback: () => {
							checkPage();
						}
					}
				);
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
		preloads: ['commodity', 'location', 'payment'],
		buttons: [
			// { name: 'Preview', onclickFn: viewDO },
			// { name: 'Download DO (PDF)', onclickFn: downloadDO },
			// {
			//   name: 'Mark Pending Delivery',
			//   onclickFn: doMarkPendingDelivery,
			//   showCondition: showCondition
			// },
			// { name: 'Mark Sent', onclickFn: doMarkSent, showCondition: showCondition2 }
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
			{ label: 'UUID', data: 'uuid' },
			{ label: 'Nett Weight (Kg)', data: 'net_weight_kg',  className: 'text-right' },
            { label: 'Price/MT  (RM)', data: 'price_per_tonne' , className: 'text-right'},
			{ label: 'Total Price (RM)', data: 'total_price',  className: 'text-right' },
			{ label: 'Commodity', data: 'name', through: ['commodity'] },
			{ label: 'Location', data: 'code', through: ['location'] }
		]
	}}
/>
