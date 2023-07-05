# jcounter

Discordのサーバー名を2007-04-01からの経過年数に変更するCloudflare Workers

## Setup

```console
$ npm i
```

## Development

```console
$ npx wrangler init
```

## Deploy

```console
$ npx wrangler secret put DISCORD_TOKEN # DiscordのBotのトークン
$ npx wrangler secret put DISCORD_TEST_GUILD_ID # サーバーのGuild ID

$ npx wrangler deploy
```

ref: https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers#storing-secrets
> For example, if my URL was https://discord.com/channels/123456/789101112, the Guild ID is the first number—in this case 123456.
