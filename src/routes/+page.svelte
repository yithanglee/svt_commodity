<script>
	import { goto } from '$app/navigation';
	import { postData } from '$lib/index.js';
	import { PHX_HTTP_PROTOCOL, PHX_ENDPOINT, PHX_COOKIE } from '$lib/constants';
	import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';
	import { session } from '$lib/stores/session';
	import Cookies from 'js-cookie';
	let username = '', cookieName = '_commerce_front_key',
		email = '',
		password = '';

  
	async function handleLogin() {
		var url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
		const map = { id: 0, username: username, password: password, scope: 'sign_in' };
		var res = await postData(map, {
			endpoint: url + '/svt_api/webhook'
		});
		console.log(res);
	
		if (res.status == 'ok') {
			// Set user session/token/cookie
			// await Cookies.set('_commerce_front_key', res.res );
		await Cookies.set(PHX_COOKIE, res.res , { sameSite: 'Lax' });

			// Redirect to dashboard
			console.log('login user');
			session.login({
				username: username,
				token: JSON.stringify(res.res),
				role_app_routes: res.role_app_routes,
				id: res.user_id
			});
			let cookieToken = await Cookies.get(PHX_COOKIE);
			console.log("check cookite js")
			console.log(cookieToken);
			goto('/dashboard');
		} else if (res.status == 'error') {
			session.logout();
			// loggedIn = 'false';
			Cookies.remove('user');
			Cookies.remove(PHX_COOKIE);
			await Cookies.remove(PHX_COOKIE)
			goto('/');
		}
	}
</script>

<main>
	<form on:submit|preventDefault={handleLogin} class="flex justify-center">
		<Card class="w-full max-w-md">
			<div class="flex flex-col space-y-6">
				<h3 class="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
				<Label class="space-y-2">
					<span>Username</span>
					<Input
						type="text"
						bind:value={username}
						name="username"
						placeholder="administrator"
						required
					/>
				</Label>
			
				<Label class="space-y-2">
					<span>Your password</span>
					<Input
						type="password"
						bind:value={password}
						name="password"
						placeholder="•••••"
						required
					/>
				</Label>
				
				<Button type="submit" class="w-full">Login to your account</Button>
				
			</div>
		</Card>
	</form>
</main>
