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
        <Text>The XState V4 config has been copied to clipboard.</Text>
      <VerticalSpace space="medium" />
        <Code>{content}</Code>
      <VerticalSpace space="medium" />
    </Container>
  );
}

export default render(UI);
