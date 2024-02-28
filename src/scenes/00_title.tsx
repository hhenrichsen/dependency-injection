import {
  Circle,
  Layout,
  Line,
  Rect,
  Txt,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  beginSlide,
  createRef,
  loop,
  easeOutCubic,
  easeInCubic,
  ThreadGenerator,
  all,
  makeRef,
  waitFor,
  useRandom,
  cancel,
} from "@motion-canvas/core";
import { Colors } from "../Colors";
import { Title, Text } from "../components/Body";

export default makeScene2D(function* (view) {
  view.fill(Colors.Tailwind.Slate["900"]);
  const rectCt = 20;
  const rects: Rect[] = [];
  const random = useRandom();
  const container = createRef<Layout>();
  view.add(<Layout ref={container} zIndex={-100}></Layout>);
  for (let i = 0; i < rectCt; i++) {
    container().add(
      <Rect
        size={50}
        ref={makeRef(rects, i)}
        position={[
          random.nextInt(-view.width() / 2, view.width() / 2),
          random.nextInt(-view.height() / 2, view.height() / 2),
        ]}
        fill={Colors.Tailwind.Slate["700"]}
        radius={5}
      ></Rect>
    );
  }

  const connectionLoop = loop(Infinity, () => {
    const lines: Line[] = [];
    const target: number[] = [];
    const targets = [...Array(rectCt)]
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5);
    const tmp = createRef<Layout>();
    container().add(<Layout ref={tmp} cache layout={false}></Layout>);
    for (let c = 0; c < 2; c++) {
      const idx = random.nextInt(0, rects.length);
      const rect = rects[idx];
      const connectionCount = lines.length
        ? 8 - lines.length
        : random.nextInt(2, 7);

      for (let i = 0; i < connectionCount; i++) {
        if (targets[0] == idx) {
          targets.shift();
        }
        target.push(targets.shift());
        tmp().add(
          <Line
            layout={false}
            ref={makeRef(lines, i)}
            points={[rect.position(), rect.position()]}
            stroke={rect.fill}
            lineWidth={3}
          ></Line>
        );
      }
    }
    return all(
      ...lines.map(function* (line, idx): ThreadGenerator {
        const rect = rects[target[idx]];
        const circle = createRef<Circle>();
        yield* line.points([line.points()[0], rect.position()], 1, easeInCubic);
        tmp().add(
          <Circle
            layout={false}
            position={rect.position()}
            opacity={0}
            size={5}
            fill={line.stroke()}
            ref={circle}
          />
        );
        yield* all(
          circle().opacity(1, 0.5, easeOutCubic),
          circle().size(30, 0.4, easeOutCubic)
        );
        yield* waitFor(0.5);
        yield* tmp().opacity(0, 1);

        line.remove();
        circle().remove();
      })
    );
  });
  yield connectionLoop;

  const titleText = createRef<Txt>();
  view.add(
    <Layout layout direction={"column"} alignItems={"center"} ref={titleText}>
      <Txt {...Title} stroke={view.fill} lineWidth={10} strokeFirst>
        Code Organization and Dependency Injection
      </Txt>
      <Txt {...Text} stroke={view.fill} lineWidth={5} strokeFirst>
        By Hunter Henrichsen
      </Txt>
    </Layout>
  );

  yield* beginSlide("intro");

  cancel(connectionLoop);
  yield* container().opacity(0, 1);
  yield titleText().opacity(0, 1);
});
