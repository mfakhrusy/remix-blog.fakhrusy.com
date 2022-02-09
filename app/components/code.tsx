import Highlight, { defaultProps, Language } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";

type Props = {
  language: Language;
  text: string;
};

const Code = ({ text, language = "javascript" }: Props) => {
  return (
    <Highlight {...defaultProps} theme={theme} code={text} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            textAlign: "left",
            margin: "1em 0",
            padding: "0.5em",
            overflow: "auto",
            fontSize: "0.9rem",
          }}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default Code;
