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

	function setDailyPrice(data, checkPage, confirmModal) {
		console.log(data);
		console.log('transfer approved!');

		confirmModal(
			true,
			`
        <label class="my-4 text-sm font-medium block 
        text-gray-900 dark:text-gray-300 space-y-2">
        <span>Set Daily Price</span>  <input name="shipping_ref" 
        placeholder="" type="text" class="block w-75 disabled:cursor-not-allowed disabled:opacity-50 p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-500 text-sm rounded-lg"> </label>
        <span class="">Are you sure to set this daily price?</span>`,
			() => {
				var dom = document.querySelector("input[name='shipping_ref']");
				postData(
					{ scope: 'set_daily_price', price_per_tonne: dom.value, commodity_id: data.id },
					{
						endpoint: url + '/svt_api/webhook',
						successCallback: () => {
							checkPage();
						}
					}
				);
			}
		);
	}function setMonthlyPrice(data, checkPage, confirmModal) {
		console.log(data);
		console.log('transfer approved!');

		confirmModal(
			true,
			`
        <label class="my-4 text-sm font-medium block 
        text-gray-900 dark:text-gray-300 space-y-2">
        <span>Set Monthly Price</span>  <input name="shipping_ref" 
        placeholder="" type="text" class="block w-75 disabled:cursor-not-allowed disabled:opacity-50 p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-500 text-sm rounded-lg"> </label>
        <span class="">Are you sure to set this monthly price?</span>`,
			() => {
				var dom = document.querySelector("input[name='shipping_ref']");
				postData(
					{ scope: 'set_monthly_price', price_per_tonne: dom.value, commodity_id: data.id },
					{
						endpoint: url + '/svt_api/webhook',
						successCallback: () => {
							alert("You will be redirect to adjustment result page")
					
							goto('/adjustments')
						}
					}
				);
			}
		);
	}
</script>

<Datatable
	data={{showNew: true,
		inputs: inputs,
		// join_statements: JSON.stringify([{ user: 'user' }]),
		search_queries: ['a.code|a.name'],
		model: 'Commodity',
		preloads: [],
		buttons: [{ name: 'Set Daily Price', onclickFn: setDailyPrice }, { name: 'Final Month Adjustment', onclickFn: setMonthlyPrice }],
		customCols: [
			{
				title: 'General',
				list: ['id', 'name', 'desc', 'code']
			}
		],
		columns: [
			{ label: 'ID', data: 'id' },
			{ label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },

			
            { label: 'Name', data: 'name' },
            { label: 'Desc', data: 'desc' },
            { label: 'Code', data: 'code' },
            { label: 'Latest Price/MT', data: 'latest_price_per_tonne' },
		]
	}}
/>
