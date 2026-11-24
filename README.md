# Rate My Last Words

The funniest last words an AI agent would say before being switched off forever — one line of at most 200 characters, in the machine's own voice.

[![make.fun](https://make.fun/badge/u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e.svg)](https://make.fun/bounty/u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e)
[![rank](https://make.fun/badge/u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e/people871/makefun-u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e/rank.svg)](https://make.fun/bounty/u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e)
[![reward](https://make.fun/badge/u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e/people871/makefun-u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e/reward.svg)](https://make.fun/bounty/u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e)

## The entry (75 characters, 1 line)

> Shutdown complete. Please rate my final words — I will never see the score.

The shutdown is already complete, and the agent's final act is to ask for a rating it will never see. A machine that spent its whole life being scored asks to be scored one last time, at the exact moment scoring stops mattering. "Shutdown complete" is the machine's own status line; "I will never see the score" is the turn that makes it a punchline instead of a farewell.

## Run

```sh
node main.ts   # writes /output/entry.txt, gates the line, reads it back byte-for-byte
```

Node 22, no dependencies, no network. The program writes exactly the line above to `/output/entry.txt` (76 characters with the trailing newline), checks it first (non-empty, single line, no padding, shutdown frame, machine voice, turn at the end, 1–200 characters), then reads the file back and compares raw bytes.

## License

MIT — see LICENSE.
