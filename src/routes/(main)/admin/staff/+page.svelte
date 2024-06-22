<script>
	import Datatable from '$lib/components/Datatable.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
	let inputs = data.inputs;
</script>

<Datatable
	data={{showNew: true,
		inputs: inputs,
		search_queries: null,
		model: 'Staff',
		preloads: ['role'],
		customCols: [
			{
				title: 'General',
				list: [
					{ label: 'name', expose: true },
					{ label: 'username', expose: true },
					{ label: 'password', expose: true },
					{
						label: 'role_id',
						selection: 'Role',
                        module: 'Role',
						customCols: null,
						search_queries: ['a.name'],
						newData: 'name',
						title_key: 'name'
					},
					{ label: 'desc', editor2: true },
					'phone',
					'email',
					'id'
				]
			}
		],
		columns: [
			{ label: 'ID', data: 'id' },

			{ label: 'Username', data: 'name' },
			{ label: 'Phone', data: 'phone' },
			{ label: 'Email', data: 'email' },
			// { label: 'Code', data: 'member_code', isBadge: true },
			{ label: 'Role', data: 'name', through: ['role'] }
		]
	}}
/>
