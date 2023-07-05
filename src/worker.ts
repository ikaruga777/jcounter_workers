/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
	DISCORD_TOKEN: string;
	DISCORD_TEST_GUILD_ID: string;
}

const handler: ExportedHandler = {
	// The scheduled handler is invoked at the interval set in our wrangler.toml's
	// [[triggers]] configuration.
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		async function updateGuildName(env: Env): Promise<boolean> {
			const token = env.DISCORD_TOKEN;
			const guildId = env.DISCORD_TEST_GUILD_ID;

			if (!token) {
				throw new Error('The DISCORD_TOKEN environment variable is required.');
			}
			if (!guildId) {
				throw new Error('The DISCORD_TEST_GUILD_ID environment variable is required.');
			}
			const url = `https://discord.com/api/v10/guilds/${guildId}`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bot ${token}`,
				},
				method: 'PATCH',
				body: JSON.stringify({ name: makeServerName() }),
			});
			console.log(response);
			if (response.ok) {
				console.log('Registered all commands');
				return true;
			} else {
				console.error('Error registering commands');
				const text = await response.text();
				console.error(text);
				return false;
			}
		}

		function makeServerName(): string {
			const entrance = Date.parse('2007/4/1');
			const now = Date.now();
			const elapsedYears = (now - entrance) / 1000 / 60 / 60 / 24 / 365;
			const serverName: string = (elapsedYears + 1).toFixed(5).toString() + 'J';
			return serverName;
		}

		// A Cron Trigger can make requests to other endpoints on the Internet,
		// publish to a Queue, query a D1 Database, and much more.
		//
		// We'll keep it simple and make an API call to a Cloudflare API:
		let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
		let wasSuccessful = resp.ok ? 'success' : 'fail';

		const ret = await updateGuildName(env);

		// You could store this result in KV, write to a D1 Database, or publish to a Queue.
		// In this template, we'll just log the result:
		console.log(`trigger fired at ${event.cron}: ${wasSuccessful}, ${ret}`);
	},
};

export default handler;
