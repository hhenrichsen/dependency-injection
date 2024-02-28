import { makeProject } from "@motion-canvas/core";

import title from "./scenes/00_title?scene";
import intro from "./scenes/01_intro?scene";
import whyOrganize from "./scenes/02_why_organize?scene";
import model from "./scenes/03_model?scene";
import dependency from "./scenes/04_dependency?scene";

import { LezerHighlighter } from "@motion-canvas/2d";
import { parser as javascriptParser } from "@lezer/javascript";
import { parser as htmlParser } from "@lezer/html";
import { parser as javaParser } from "@lezer/java";

LezerHighlighter.registerParser(javascriptParser, "js");
LezerHighlighter.registerParser(javascriptParser, "javascript");
LezerHighlighter.registerParser(
  javascriptParser.configure({ dialect: "jsx" }),
  "jsx"
);
LezerHighlighter.registerParser(
  javascriptParser.configure({ dialect: "ts" }),
  "ts"
);
LezerHighlighter.registerParser(
  javascriptParser.configure({ dialect: "ts" }),
  "typescript"
);
LezerHighlighter.registerParser(htmlParser, "html");
LezerHighlighter.registerParser(javaParser, "java");

export default makeProject({
  scenes: [title, intro, whyOrganize, model, dependency],
  experimentalFeatures: true,
});
