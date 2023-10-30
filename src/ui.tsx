import {
  Container,
  render,
  Text,
  VerticalSpace,Code,Space
} from "@create-figma-plugin/ui";
import { h } from "preact";
import { useEffect } from "preact/hooks";
import {copyToClipboard} from 'figx'

function UI({ content }: { content: string} ) {
  useEffect(() => {
    copyToClipboard(content)
  }, [content])

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
        <Text>Copied to Clipboard.</Text>
        <br />
        <Code>{content}</Code>
      <VerticalSpace space="medium" />
    </Container>
  );
}

export default render(UI);
