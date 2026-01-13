export interface BrowserCompatibility {
  supported: boolean
  videoDecoder: boolean
  videoEncoder: boolean
  offscreenCanvas: boolean
  webWorker: boolean
  missingFeatures: string[]
}

export function checkBrowserCompatibility(): BrowserCompatibility {
  const videoDecoder = typeof VideoDecoder !== 'undefined'
  const videoEncoder = typeof VideoEncoder !== 'undefined'
  const offscreenCanvas = typeof OffscreenCanvas !== 'undefined'
  const webWorker = typeof Worker !== 'undefined'

  const missingFeatures: string[] = []

  if (!videoDecoder) missingFeatures.push('VideoDecoder')
  if (!videoEncoder) missingFeatures.push('VideoEncoder')
  if (!offscreenCanvas) missingFeatures.push('OffscreenCanvas')
  if (!webWorker) missingFeatures.push('Web Workers')

  return {
    supported: videoDecoder && videoEncoder && offscreenCanvas && webWorker,
    videoDecoder,
    videoEncoder,
    offscreenCanvas,
    webWorker,
    missingFeatures,
  }
}

export function getCompatibilityMessage(compat: BrowserCompatibility): string {
  if (compat.supported) {
    return 'Your browser supports video processing.'
  }

  const missing = compat.missingFeatures.join(', ')
  return `Your browser doesn't support video processing. Missing features: ${missing}. Please use Chrome or Edge for full functionality.`
}

// Check if a specific codec is supported
export async function isCodecSupported(codec: string): Promise<boolean> {
  if (typeof VideoEncoder === 'undefined') return false

  try {
    const support = await VideoEncoder.isConfigSupported({
      codec,
      width: 1920,
      height: 1080,
    })
    return support.supported === true
  } catch {
    return false
  }
}

// Get the best available codec for encoding
export async function getBestCodec(): Promise<string> {
  // Prefer H.264 (AVC) for compatibility
  const codecs = [
    'avc1.42E01E',
    'avc1.4D401E',
    'avc1.640028',
    'vp8',
    'vp09.00.10.08',
  ]

  for (const codec of codecs) {
    if (await isCodecSupported(codec)) {
      return codec
    }
  }

  return 'avc1.42E01E' // Default to H.264 baseline
}
