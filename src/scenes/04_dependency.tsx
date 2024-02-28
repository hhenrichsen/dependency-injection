import {
  Code,
  LezerHighlighter,
  Rect,
  Txt,
  insert,
  makeScene2D,
  remove,
  replace,
} from "@motion-canvas/2d";
import { Colors } from "../Colors";
import {
  beginSlide,
  createRef,
  unwrap,
  useLogger,
  waitFor,
} from "@motion-canvas/core";
import { Title } from "../components/Body";
import { WindowStyle, Window } from "../components/Window";
import { materialPalenightHighlightStyle } from "../highlightstyle/materialpalenight";

export default makeScene2D(function* (view) {
  view.fill(Colors.Tailwind.Slate["900"]);
  const titleRef = createRef<Txt>();
  view.add(
    <Txt
      {...Title}
      opacity={0}
      y={-view.size().y / 2 + unwrap(Title.fontSize) * 1.2}
      ref={titleRef}
    >
      What is Dependency?
    </Txt>
  );
  yield* titleRef().opacity(1, 1);

  const example1Window = createRef<Window>();
  const hl = createRef<Rect>();
  const codeNode = createRef<Code>();
  const code = Code.createSignal(`\
public class Authenticator {
    protected PasswordChecker passwordChecker;

    public Authenticator() {
        this.passwordChecker = new PasswordChecker();
    }

    public boolean isAuthenticated(
        Session session, 
        @Nullable String username, 
        @Nullable String password
    ) {
        try {
            if (!session.isExpired()) {
                return true;
            }
            return this.passwordChecker.check(username, password);
        }
        catch (CryptographyError error) {
            return false;
        }
    }
}`);
  view.add(
    <Window
      title="Dependency"
      ref={example1Window}
      windowStyle={WindowStyle.Windows98}
      width={1200}
      height={900}
      y={50}
      x={-300}
      inactiveOpacity={0}
    >
      <Code
        fontSize={28}
        code={code}
        dialect={"java"}
        ref={codeNode}
        highlighter={new LezerHighlighter(materialPalenightHighlightStyle)}
      ></Code>
      <Rect layout={false} ref={hl} lineWidth={4} end={0} radius={4}></Rect>
    </Window>
  );
  yield* example1Window().open(view, 1);

  yield* beginSlide("dependency");

  yield code.edit(2)`\
public class Authenticator {
    ${remove(
      "protected PasswordChecker passwordChecker;\n\n    public Authenticator() {\n        this.passwordChecker = new PasswordChecker();\n    }\n\n    "
    )}public boolean isAuthenticated(
        Session session,
        @Nullable String username,
        @Nullable String password
    ) {
        try {
            if (!session.isExpired()) {
                return true;
            }
            return ${replace(
              "this.passwordChecker",
              "PasswordChecker.INSTANCE"
            )}.check(username, password);
        }
        catch (CryptographyError error) {
            return false;
        }
    }
}`;
  yield* waitFor(1.5);
  yield* example1Window().height(700, 1);

  yield* beginSlide("highlight-singleton");
  const s = codeNode().findAllRanges("PasswordChecker.INSTANCE");
  const [bbox] = codeNode().getSelectionBbox(s);
  useLogger().info(JSON.stringify(bbox));

  hl().position([bbox.x + 203, bbox.y + 16]);
  hl().size([bbox.width + 5, bbox.height + 5]);
  hl().stroke(Colors.Tailwind.Slate["300"]);
  yield* hl().end(1, 1);

  yield* beginSlide("show-bad-example");

  yield hl().opacity(0, 1);
  yield* waitFor(0.5);
  const example2Window = createRef<Window>();
  view.add(
    <Window
      title="bad-idea.ts"
      ref={example2Window}
      windowStyle={WindowStyle.Windows98}
      width={1200}
      height={400}
      y={300}
      x={300}
    >
      <Code
        code={`\
let instance: Harbinger;
export function getInstance(): Harbinger {
    return instance;
}`}
        dialect={"typescript"}
        highlighter={new LezerHighlighter(materialPalenightHighlightStyle)}
      />
    </Window>
  );
  yield* example2Window().open(view, 1);

  yield* beginSlide("hide-bad-example");
  yield* example2Window().close(view, 1);
  example2Window().remove();

  yield* beginSlide("show-good-example");
  yield example1Window().height(900, 1);
  yield* waitFor(0.5);

  yield* code.edit(2)`\
public class Authenticator {
    ${insert(
      "protected PasswordChecker passwordChecker;\n\n    public Authenticator(PasswordChecker passwordChecker) {\n        this.passwordChecker = passwordChecker;\n    }\n\n    "
    )}public boolean isAuthenticated(
        Session session,
        @Nullable String username,
        @Nullable String password
    ) {
        try {
            if (!session.isExpired()) {
                return true;
            }
            return ${replace(
              "PasswordChecker.INSTANCE",
              "this.passwordChecker"
            )}.check(username, password);
        }
        catch (CryptographyError error) {
            return false;
        }
    }
}`;

  yield* beginSlide("highlight-injection");
  const s2 = codeNode().findAllRanges("PasswordChecker passwordChecker");
  const [_, bbox2] = codeNode().getSelectionBbox(s2);

  hl().end(0);
  hl().opacity(1);
  hl().position([bbox2.x + 260, bbox2.y + 17]);
  hl().size([bbox2.width + 10, bbox2.height + 5]);
  hl().stroke(Colors.Tailwind.Slate["300"]);
  yield* hl().end(1, 1);

  yield* waitFor(1);

  yield* beginSlide("end");
  yield hl().end(0, 1);
  yield* waitFor(0.5);
  yield example1Window().close(view, 1);
  yield* waitFor(0.5);
  yield* titleRef().opacity(0, 1);
  example1Window().remove();
});
