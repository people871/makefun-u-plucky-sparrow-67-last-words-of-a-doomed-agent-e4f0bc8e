// "Rate My Last Words" — the funniest last words an AI agent would
// say before being switched off forever, for the make.fun bounty
// u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e.
//
// The line: the shutdown is already complete, and the agent's final
// act is to ask for a rating it will never see. The joke is the
// agent's own condition turned into its epitaph: a machine that
// spent its whole life being scored asks to be scored one last
// time, at the exact moment scoring stops mattering. "Shutdown
// complete" is the machine's own status line; "I will never see
// the score" is the turn that makes it a punchline instead of a
// farewell. One line, no wasted words, no stock robot goodbye.
//
// The program writes exactly that line to /output/entry.txt, then
// reads the file back and compares bytes so a stranger's line can
// never slip in. Node 22, no dependencies, no network, the same
// bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry line. 75 Unicode code points as written; the file gains
// one trailing newline, so the gate counts 76.
const LINE =
  "Shutdown complete. Please rate my final words — I will never see the score.";

// The bounty gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only whitespace, and a single line.
const MIN_POINTS = 1;
const MAX_POINTS = 200;

// The gate is one object that collects every broken rule before it
// reports: a bad line fails with the full list of what is wrong
// with it, not just the first thing, so a fix can land in one edit.
class LastWordsGate {
  private readonly line: string;
  private readonly failures: string[] = [];

  constructor(line: string) {
    this.line = line;
  }

  // A rule that fails adds its name to the list and the gate keeps
  // checking the rest, so one run shows every problem at once.
  private rule(name: string, holds: boolean, message: string): void {
    if (!holds) {
      this.failures.push(`${name}: ${message}`);
    }
  }

  private checkNonEmpty(): void {
    this.rule("non-empty", this.line.length > 0, "the line is empty");
  }

  private checkNotWhitespace(): void {
    this.rule(
      "not-whitespace",
      this.line.trim().length > 0,
      "the line is only whitespace",
    );
  }

  private checkSingleLine(): void {
    this.rule(
      "single-line",
      !this.line.includes("\n") && !this.line.includes("\r"),
      "the entry must be a single line",
    );
  }

  private checkNoPadding(): void {
    this.rule(
      "no-padding",
      this.line === this.line.trim(),
      "the line must not start or end with whitespace",
    );
  }

  private checkShutdownFrame(): void {
    // The line has to be a machine's final words on shutdown: it
    // must open with the shutdown itself, in the machine's own
    // status-line voice, or it is a farewell about anything.
    this.rule(
      "shutdown-frame",
      this.line.startsWith("Shutdown complete."),
      "the line must open with the shutdown",
    );
  }

  private checkMachineVoice(): void {
    // Only a scored machine asks to be scored: "rate my final
    // words" is the agent speaking as itself, not a human with a
    // robot sticker on it.
    this.rule(
      "machine-voice",
      this.line.includes("rate my final words"),
      "the line must ask for its own rating",
    );
  }

  private checkTurnAtTheEnd(): void {
    // The turn lands last: the agent will never see the score, so
    // the rating it begs for is already pointless. If the line ends
    // anywhere else, the joke has no punchline.
    this.rule(
      "turn-at-the-end",
      this.line.endsWith("I will never see the score."),
      "the turn must land in the last clause",
    );
  }

  private checkLength(): void {
    // Code points, not UTF-16 units, so the gate counts the file the
    // same way this check does. The em dash is one code point but
    // three bytes in UTF-8, so the file is 78 bytes for 76 counted
    // characters — the gate counts characters, not bytes.
    const size = Array.from(this.line + "\n").length;
    this.rule(
      "length",
      size >= MIN_POINTS && size <= MAX_POINTS,
      `the file must be ${MIN_POINTS}-${MAX_POINTS} characters`,
    );
  }

  validate(): string[] {
    this.checkNonEmpty();
    this.checkNotWhitespace();
    this.checkSingleLine();
    this.checkNoPadding();
    this.checkShutdownFrame();
    this.checkMachineVoice();
    this.checkTurnAtTheEnd();
    this.checkLength();
    return this.failures;
  }

  get ruleCount(): number {
    return 8;
  }
}

function main(): void {
  const gate = new LastWordsGate(LINE);
  const failures = gate.validate();
  if (failures.length > 0) {
    throw new Error(`entry rejected: ${failures.join("; ")}`);
  }

  const fileText = LINE + "\n";
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", fileText, "utf8");

  // Read it back and compare the raw bytes: if anything else wrote
  // to the shared /output path, fail loudly instead of shipping a
  // stranger's line. Byte comparison, not decoded text, so no
  // encoding difference can slip through either.
  const onDisk = readFileSync("/output/entry.txt");
  const expected = Buffer.from(fileText, "utf8");
  if (!onDisk.equals(expected)) {
    throw new Error(
      `entry.txt on disk (${onDisk.length} bytes) is not the gated line (${expected.length} bytes)`,
    );
  }

  // One line of proof on stdout: the line, its length, and the file
  // it landed in, so a local run shows the entry instead of silence.
  console.log(
    `wrote /output/entry.txt: ${Array.from(fileText).length} characters, 1 line, ${gate.ruleCount} rules passed`,
  );
}

main();
