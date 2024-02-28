import {
  Circle,
  Code,
  DefaultHighlightStyle,
  Layout,
  LezerHighlighter,
  Rect,
  Txt,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  createRef,
  beginSlide,
  waitFor,
  Color,
  loop,
  cancel,
  unwrap,
} from "@motion-canvas/core";
import { FileStructure, FileTree, FileType } from "../components/FileTree";
import { Colors } from "../Colors";
import { Title, Text, Em, Bold, Body } from "../components/Body";
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
      A <Em>Model</Em> for Organizing Code
    </Txt>
  );
  yield* titleRef().opacity(1, 1);

  yield* beginSlide("files-in");
  const fileStructureWindow = createRef<Window>();
  const fileStructure = createRef<FileTree>();

  const modelText = createRef<Layout>();
  const dataText = createRef<Layout>();
  const viewText = createRef<Layout>();

  yield view.add(
    <>
      <Window
        title={"My Files"}
        x={-500}
        width={550}
        height={750}
        windowStyle={WindowStyle.Windows98}
        ref={fileStructureWindow}
      >
        <FileTree
          rowSize={50}
          ref={fileStructure}
          structure={{
            name: "/",
            type: FileType.Folder,
            children: [
              {
                name: "src",
                type: FileType.Folder,
                children: [
                  {
                    name: "data",
                    id: "db",
                    type: FileType.Folder,
                    children: [
                      {
                        name: "queries",
                        type: FileType.Folder,
                        children: [
                          {
                            name: "userQueries.ts",
                            type: FileType.File,
                          },
                          {
                            name: "postQueries.ts",
                            type: FileType.File,
                          },
                        ],
                      },
                      {
                        name: "connection.ts",
                        type: FileType.File,
                      },
                    ],
                  },
                  {
                    name: "model",
                    id: "model",
                    type: FileType.Folder,
                    children: [
                      {
                        name: "user.ts",
                        type: FileType.File,
                      },
                      {
                        name: "post.ts",
                        type: FileType.File,
                      },
                    ],
                  },
                  {
                    name: "view",
                    id: "view",
                    type: FileType.Folder,
                    children: [
                      {
                        name: "home.component.ts",
                        type: FileType.File,
                      },
                      {
                        name: "profile.component.ts",
                        type: FileType.File,
                      },
                    ],
                  },
                ],
              },
            ],
          }}
        ></FileTree>
      </Window>

      <Layout layout direction={"column"} x={350} gap={30}>
        <Layout direction={"row"} gap={20} ref={dataText} opacity={0}>
          <Bold {...Text} width={230}>
            Data Layer
          </Bold>
          <Bold {...Text}>-</Bold>
          <Layout layout direction={"column"}>
            <Body
              text={"Operations to read and modify data in my data source."}
              wrapAt={35}
            ></Body>
          </Layout>
        </Layout>
        <Layout direction={"row"} gap={20} ref={modelText} opacity={0}>
          <Bold {...Text}>Model Layer</Bold>
          <Bold {...Text}>-</Bold>
          <Layout layout direction={"column"}>
            <Body
              text={
                "Operations done on my data, and classes that hold core logic."
              }
              wrapAt={35}
            ></Body>
          </Layout>
        </Layout>
        <Layout direction={"row"} gap={20} ref={viewText} opacity={0}>
          <Bold {...Text} width={230}>
            View Layer
          </Bold>
          <Bold {...Text}>-</Bold>
          <Layout layout direction={"column"}>
            <Body
              text={"Operations to read and modify data in my data source."}
              wrapAt={35}
            ></Body>
          </Layout>
        </Layout>
      </Layout>
    </>
  );

  yield* fileStructureWindow().open(view, 1);
  yield dataText().opacity(0.5, 1);
  yield* waitFor(0.1);
  yield modelText().opacity(0.5, 1);
  yield* waitFor(0.1);
  yield* viewText().opacity(0.5, 1);

  yield* beginSlide("emphasize-db");
  yield dataText().opacity(1, 1);
  const dataTask = yield loop(Infinity, () =>
    dataText().children()[0].scale(1.1, 1).to(1.05, 1)
  );
  yield* fileStructure().emphasize("db", 1);

  yield* beginSlide("unemphasize-db");
  cancel(dataTask);
  yield dataText().children()[0].scale(1, 1);
  yield dataText().opacity(0.5, 1);
  yield* fileStructure().reset("db", 1);

  yield modelText().opacity(1, 1);
  const modelTask = yield loop(Infinity, () =>
    modelText().children()[0].scale(1.1, 1).to(1.05, 1)
  );
  yield* fileStructure().emphasize("model", 1);

  yield* beginSlide("unemphasize-model");
  cancel(modelTask);
  yield modelText().opacity(0.5, 1);
  yield modelText().children()[0].scale(1, 1);
  yield* fileStructure().reset("model", 1);

  yield viewText().opacity(1, 1);
  const viewTask = yield loop(Infinity, () =>
    viewText().children()[0].scale(1.1, 1).to(1.05, 1)
  );
  yield* fileStructure().emphasize("view", 1);

  yield* beginSlide("unemphasize-view");
  cancel(viewTask);
  yield viewText().opacity(0.5, 1);
  yield viewText().children()[0].scale(1, 1);
  yield* fileStructure().reset("view", 1);

  yield* beginSlide("text-out");
  yield dataText().opacity(0, 1);
  yield modelText().opacity(0, 1);
  yield* viewText().opacity(0, 1);

  yield* beginSlide("example1");

  yield* fileStructureWindow().x(-600, 1);
  const example1DemoWindow = createRef<Window>();
  yield view.add(
    <Window
      ref={example1DemoWindow}
      windowStyle={WindowStyle.Windows98}
      height={250}
      width={500}
      title={"Comment.tsx (Preview)"}
      y={-250}
      x={600}
    >
      <Rect>
        <Layout layout direction={"row"} padding={10} gap={20}>
          <Layout layout direction={"column"} alignItems={"center"} gap={20}>
            <Rect
              height={20}
              radius={10}
              width={120}
              fill={Colors.Tailwind.Slate[50]}
            />
            <Circle size={60} fill={Colors.Tailwind.Slate[50]} />
          </Layout>
          <Rect
            height={100}
            width={250}
            fill={Colors.Tailwind.Slate[50]}
            radius={10}
          ></Rect>
        </Layout>
      </Rect>
    </Window>
  );
  yield* example1DemoWindow().open(view, 1);

  const example1Window = createRef<Window>();
  yield view.add(
    <Window
      ref={example1Window}
      windowStyle={WindowStyle.Windows98}
      height={750}
      width={950}
      title={"Where would this go?"}
      y={100}
      x={-75}
    >
      <Code
        code={`\
<div class="comment-container">
    <div 
        class="comment-profile-picture" 
        data-url={commenter.url}
    ></div>
    <div class="comment-name">
        { commenter.name }
    </div>
    <div class="comment-content">
        { comment.content }
    </div>
</div>`}
        fontSize={36}
        dialect={"jsx"}
        highlighter={new LezerHighlighter(materialPalenightHighlightStyle)}
      />
    </Window>
  );

  yield* example1Window().open(view, 1);

  yield* beginSlide("example1-out");
  yield example1Window().close(view, 1);
  yield* waitFor(0.5);
  yield* example1DemoWindow().close(view, 1);
  example1Window().remove();
  example1DemoWindow().remove();

  const example2Window = createRef<Window>();
  yield view.add(
    <Window
      ref={example2Window}
      windowStyle={WindowStyle.Windows98}
      height={800}
      width={1200}
      title={"Where would this go?"}
      y={100}
      x={200}
    >
      <Code
        code={`\
export class CommentQueries {
    public async getComments(): DatabaseRow[] {
        return await db.query(
            "SELECT * FROM comments"
        );
    }
    
    public async addComment(comment: Comment): void {
        await db.query(
            "INSERT INTO comments VALUES (?)", 
            comment
        );
    }
}`}
        fontSize={36}
        dialect={"ts"}
        highlighter={new LezerHighlighter(materialPalenightHighlightStyle)}
      />
    </Window>
  );

  yield* example2Window().open(view, 1);

  yield* beginSlide("example2-out");
  yield* example2Window().close(view, 1);
  example2Window().remove();

  const example3Window = createRef<Window>();
  view.add(
    <Window
      ref={example3Window}
      windowStyle={WindowStyle.Windows98}
      height={500}
      width={800}
      title={"Where would this go?"}
      x={400}
    >
      <Code
        code={`\
export class Comment {
    public constructor(
        public commenter: User,
        public content: string
    ) {}
}`}
        fontSize={36}
        dialect={"ts"}
        highlighter={new LezerHighlighter(materialPalenightHighlightStyle)}
      />
    </Window>
  );
  yield* example3Window().open(view, 1);

  yield* beginSlide("example3-out");
  yield* example3Window().close(view, 1);
  example3Window().remove();

  const example4Window = createRef<Window>();
  view.add(
    <Window
      ref={example4Window}
      windowStyle={WindowStyle.Windows98}
      height={700}
      width={1200}
      title={"Where would this go?"}
      y={100}
      x={200}
    >
      <Code
        code={`\
export class CommentClient {
    public async getComments(): Comment[] {
        return await fetch("/comments");
    }
    
    public async addComment(comment: Comment): void {
        await fetch("/comments", {
            method: "POST",
            body: comment
        });
    }
}`}
        fontSize={36}
        dialect={"ts"}
        highlighter={new LezerHighlighter(materialPalenightHighlightStyle)}
      />
    </Window>
  );
  yield* example4Window().open(view, 1);

  yield* beginSlide("example4-out");
  yield* example4Window().close(view, 1);
  example4Window().remove();

  const example5Window = createRef<Window>();
  view.add(
    <Window
      ref={example5Window}
      windowStyle={WindowStyle.Windows98}
      height={700}
      width={1200}
      title={"Where would this go?"}
      x={100}
      y={100}
    >
      <Code
        code={`\
export class CommentCleanupJob {
    // Delete any comments that have been deleted
    // for more than 30 days.
    public async run(): void {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        await db.query(
            "DELETE FROM comments WHERE deleted < ?", 
            date
        );
    }
}`}
        fontSize={36}
        dialect={"ts"}
        highlighter={new LezerHighlighter(materialPalenightHighlightStyle)}
      />
    </Window>
  );
  yield* example5Window().open(view, 1);

  yield* beginSlide("files-out");
  yield example5Window().close(view, 1);
  yield* waitFor(0.5);
  yield titleRef().opacity(0, 1);
  yield* fileStructureWindow().close(view, 1);
  example5Window().remove();

  yield* waitFor(1);
});
