import {
  Bot,
  InlineQueryResultBuilder,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.19.2/mod.ts";

const token = Deno.env.get("BOT_TOKEN") ?? "";
const secretToken = token.replaceAll(":", "_");
const bot = new Bot(token);
const AUDIO = Deno.env.get("AUDIO_FILE_ID")!;

bot.hears("oh no", (ctx) => ctx.replyWithVoice(AUDIO));
bot.on("inline_query", async (ctx) => {
  const result = InlineQueryResultBuilder.voiceCached("0", "oh no", AUDIO);
  await ctx.answerInlineQuery([result], { cache_time: 3600 });
});
bot.chatType("private")
  .drop((ctx) => ctx.msg?.via_bot?.id === ctx.me.id)
  .on("message", (ctx) => ctx.reply("oh no"));

Deno.serve(webhookCallback(bot, "std/http", { secretToken }));
