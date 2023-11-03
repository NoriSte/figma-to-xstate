import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { copyToClipboard } from 'figx'

import {
  Code,
  Text,
  Banner,
  render,
  Container,
  IconWarning32,
  VerticalSpace,
} from '@create-figma-plugin/ui'

function SomethingWentWrong({ reason }: { reason: string }) {
  return (
    <Banner icon={<IconWarning32 />} variant="warning">
      Something went wrong ({reason})
    </Banner>
  )
}

function PrintXStateV4Config({ generatedXStateConfig }: { generatedXStateConfig: string }) {
  useEffect(() => {
    copyToClipboard(generatedXStateConfig)
  }, [generatedXStateConfig])

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      <Text>The XState V4 config has been copied to clipboard.</Text>
      <VerticalSpace space="medium" />
      <Text>
        <Code>{generatedXStateConfig}</Code>
      </Text>
      <VerticalSpace space="medium" />
    </Container>
  )
}

/**
 * The UI entry point rendered by create-figma-plugin
 */
function UI({ generatedXStateConfig }: { generatedXStateConfig: unknown }) {
  if (typeof generatedXStateConfig !== 'string') {
    console.log({ generatedXStateConfig })
    return <SomethingWentWrong reason="The received generatedXStateConfig is not a string" />
  }

  return <PrintXStateV4Config generatedXStateConfig={generatedXStateConfig} />
}

export default render(UI)
