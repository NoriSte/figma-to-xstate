import { useEffect } from 'preact/hooks'
import { copyToClipboard } from 'figx'

import {
  Banner,
  Button,
  Code,
  Container,
  IconWarning32,
  Stack,
  Text,
  render,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'

function SomethingWentWrong({ reason }: { reason: string }) {
  return (
    <Banner icon={<IconWarning32 />} variant="warning">
      Something went wrong (
      {reason}
      )
    </Banner>
  )
}

function PrintXStateV4Config({ generatedXStateConfig }: { generatedXStateConfig: string }) {
  useEffect(() => {
    copyToClipboard(generatedXStateConfig)
  }, [generatedXStateConfig])

  return (
    <Stack space="medium">
      <Text>The XState V4 config has been copied to clipboard.</Text>
      <Text>
        <Code>{generatedXStateConfig}</Code>
      </Text>

    </Stack>
  )
}

function RegenerateButton({ handleClick }: { handleClick: () => void }) {
  return (

    <Button onClick={handleClick} secondary>
      Regenerate
    </Button>

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

  return (
    <Container space="medium">
      <Stack space="medium">
        <PrintXStateV4Config generatedXStateConfig={generatedXStateConfig} />
        <RegenerateButton handleClick={() => {
          emit('REGENERATE')
        }}
        />
      </Stack>
    </Container>
  )
}

export default render(UI)
