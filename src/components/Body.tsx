import { Layout, LayoutProps, Txt, TxtProps } from "@motion-canvas/2d";
import { Colors } from "../Colors";

export const Text: TxtProps = {
  fontFamily: "Montserrat",
  fill: Colors.Tailwind.Slate["100"],
  fontSize: 36,
};

export const Title: TxtProps = {
  ...Text,
  fontSize: 64,
  fontWeight: 700,
};

export const Bold = (props: TxtProps) => <Txt {...props} fontWeight={700} />;

export const Em = (props: TxtProps) => <Txt {...props} fontStyle={"italic"} />;

export const Body = (
  props: LayoutProps & { text: string; wrapAt?: number; txtProps?: TxtProps }
) => {
  const wrapAt = props.wrapAt ?? 20;
  return (
    <Layout layout direction={"column"} {...props}>
      {...props.text
        .split(" ")
        .reduce<string[]>((acc, word) => {
          if (acc.length === 0) {
            return [word];
          }
          if (acc[acc.length - 1].length + word.length > wrapAt) {
            return [...acc, word];
          }
          return [...acc.slice(0, -1), `${acc[acc.length - 1]} ${word}`];
        }, [])
        .map((line) => (
          <Txt {...Text} {...props.txtProps}>
            {line}
          </Txt>
        ))}
    </Layout>
  );
};
