<script>
	import { PHX_HTTP_PROTOCOL, PHX_ENDPOINT } from '$lib/constants';
	import Cookies from 'js-cookie';
	import { session } from '$lib/stores/session';
	import { isToastOpen } from '$lib/stores/toast';
	import { onMount } from 'svelte';
	import {
		Table,
		Badge,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';
	import { buildQueryString, postData } from '$lib/index.js';
	/** @type {import('./$types').PageData} */
	import Chart from 'chart.js/auto';
	export let data;
	let chart;
	import DataForm from '$lib/components/DataForm.svelte';

	let chartData = data.chartData;

	let items = [{ key: 'id', value: 'int' }],
		module = '',
		title = '';
	var url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

	onMount(() => {});
	function refreshPage() {}
	let staff;
	session.subscribe((value) => {
		console.log('subscribed session!');
		console.log(value);
		if (value && value.loggedIn) {
			staff = value.user;
		}
	});

	let showNew = false,
		customCols = [
			{
				title: 'General',
				list: ['id', { label: 'username', expose: true }, { label: 'password', expose: true }]
			}
		],
		selectedData = staff,
		inputs = data.inputs,
		cac_url = url,
		model = 'Staff';
	let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
	let newTodo = '',
		selectedId;

	$: {
		if (todos) {
			localStorage.setItem('todos', JSON.stringify(todos));
		}
	}

	function addTodo() {
		if (newTodo.trim() === '') return;
		const pattern = /\[(.*?)\]/g;
		const matches = newTodo.match(pattern);
		var project;

		if (matches != null) {
			project = matches[0];
		}

		if (selectedId != null) {
			todos = todos.map((item) =>
				item.id === selectedId
					? { ...item, text: newTodo, project: project.replace('[', '').replace(']', '') }
					: item
			);
			selectedId = null;
		} else {
			todos = [
				...todos,
				{
					id: Date.now(),
					text: newTodo,
					done: false,
					project: project.replace('[', '').replace(']', '')
				}
			];
		}

		newTodo = '';
	}

	function removeTodo(todoId) {
		todos = todos.filter((todo) => todo.id !== todoId);
	}

	function toggleDone(todoId) {
		todos = todos.map((todo) => (todo.id === todoId ? { ...todo, done: !todo.done } : todo));
	}

	function handleDragStart(event, todoId) {
		event.dataTransfer.setData('text/plain', todoId);
	}

	function handleDrop(event) {
		event.preventDefault();
		const todoId = event.dataTransfer.getData('text/plain');
		const targetIndex = event.target.closest('li').dataset.index;
		const draggedIndex = todos.findIndex((todo) => todo.id.toString() === todoId);

		if (targetIndex != null && draggedIndex !== -1) {
			const updatedTodos = [...todos];
			const [removed] = updatedTodos.splice(draggedIndex, 1);
			updatedTodos.splice(Number(targetIndex), 0, removed);
			todos = updatedTodos;
		}
	}
	function updateProject(oriTodo, project) {
		todos = todos.map((todo) => (todo.id === oriTodo.id ? { ...todo, project: project } : todo));
	}
	var editTodo = (todo) => {
		selectedId = todo.id;
		newTodo = todo.text;
		console.log('!');
	};
	function matchStr(originalString, oriTodo) {
		const pattern = /\[(.*?)\]/g;
		const matches = originalString.match(pattern);

		console.log(matches);
		if (matches != null) {
			var matched = matches[0];
			return originalString.replaceAll(matched, '');
		} else {
		}
		return originalString;
	}
</script>

<div class="flex sm:grid grid-cols-12 flex-col-reverse">
	<div class=" col-span-8 p-4 mx-4">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Plan, Prioritize!</h3>

		<div class="mb-6">
			<Label for="default-input" class="block mb-2">Todo List</Label>
			<Input id="default-input" bind:value={newTodo} placeholder="Add new todo" />
		</div>
		<button on:click={addTodo}>Add</button>

		<div class="py-4">
			<ul>
				{#each todos as todo, index (todo.id)}
					<li
						class:done={todo.done}
						draggable="true"
						on:dragstart={(e) => handleDragStart(e, todo.id)}
						on:drop={handleDrop}
						on:dragover={(e) => e.preventDefault()}
						data-index={index}
					>
						<div class="flex justify-between items-center gap-3 pt-2">
							<div class="flex justify-start items-center gap-3">
								<input type="checkbox" checked={todo.done} on:change={() => toggleDone(todo.id)} />
								<div>
									{#if todo.project != null}
										<Badge color="purple">{todo.project}</Badge>
									{/if}
									{matchStr(todo.text, todo)}
								</div>
							</div>
							<div>
								<Button color="yellow" size="xs" on:click={() => editTodo(todo)}>Edit</Button>
								<Button size="xs" on:click={() => removeTodo(todo.id)}>Remove</Button>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="col-span-8 p-4 mx-4">
		<DataForm
			style={'show'}
			{showNew}
			{customCols}
			data={selectedData}
			{inputs}
			url={cac_url}
			module={model}
			postFn={refreshPage}
		/>
	</div>
</div>

<style>
	li {
		cursor: pointer;
	}

	li.done {
		text-decoration: line-through;
	}
</style>
