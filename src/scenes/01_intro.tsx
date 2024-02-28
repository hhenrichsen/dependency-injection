import { Layout, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  createRef,
  all,
  loop,
  beginSlide,
  cancel,
  waitFor,
} from "@motion-canvas/core";
import hunter from "../assets/hunter.jpg";
import { Colors } from "../Colors";
import { belowScreenPosition } from "../Util";
import { Title, Body } from "../components/Body";
import { ImgWindow } from "../components/ImgWindow";
import { Window } from "../components/Window";

export default makeScene2D(function* (view) {
  view.fill(Colors.Tailwind.Slate["900"]);
  const window = createRef<Window>();

  yield view.add(
    <ImgWindow
      src={hunter}
      title="Hunter.jpg"
      size={600}
      ref={window}
      x={-450}
    />
  );

  yield* window().open(view, 1);
  const task = yield all(
    loop(Infinity, () => window().y(-25, 5).back(5)),
    loop(Infinity, () => window().rotation(1, 5).to(-1, 10).back(5))
  );

  const introText = createRef<Layout>();

  view.add(
    <Layout
      ref={introText}
      opacity={0}
      layout
      direction={"column"}
      x={400}
      width={700}
    >
      <Txt {...Title}>Hi, I'm Hunter</Txt>
      <Body
        wrapAt={35}
        text={
          "I'm a Software Engineer at Lucid, an Adjunct Professor at BYU, and a USU Alumni. I graduated almost 3 years ago.\n\nI'm hanging out on the discord if you have questions or want to chat after the talk."
        }
      />
    </Layout>
  );

  yield* introText().opacity(1, 1);

  yield* beginSlide("next");
  yield window().position(belowScreenPosition(view, window), 1);
  yield window().scale(0.0, 1);
  yield* introText().opacity(0, 1);

  window().remove();
  introText().remove();

  cancel(task);
  yield* waitFor(1);
});
