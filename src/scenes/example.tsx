import {
  Circle,
  Code,
  DefaultHighlightStyle,
  LezerHighlighter,
  insert,
  makeScene2D,
} from "@motion-canvas/2d";
import { createRef, sequence, waitFor } from "@motion-canvas/core";
import { parser as javascriptParser } from "@lezer/javascript";

export default makeScene2D(function* (view) {
  LezerHighlighter.registerParser(javascriptParser);

  // Create your animations here
  const code = Code.createSignal(
    `export class MyClass {
    constructor() {

    }
  }`,
    undefined,
    "typescript"
  );

  const c = createRef<Code>();

  view.add(<Code ref={c} code={code} />);

  yield c().code.edit(3)`function hello() {${insert(`
  if (Math.random() > .5) {`)}
  ${insert(`  `)}console.log('Hello World');${insert(`
  } else {
    console.log('Goodbye World');
  }`)}
}`;

  yield* sequence(
    0.5,
    c().code.append(2)`\n// 1. One`,
    c().code.append(2)`\n// 2. Two`,
    c().code.append(2)`\n// 3. Three`
  );

  yield* waitFor(5);
});
