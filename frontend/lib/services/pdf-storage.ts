interface UploadGeneratedPdfParams {
  pdfBlob: Blob
  fileName: string
  documentType: string
  sessionId?: string
}

const DEFAULT_API_BASE = 'http://16.171.53.167:3000/api'

const getApiBaseUrl = () => {
  const configuredBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_API_BASE

  const normalizedBase = configuredBase.replace(/\/$/, '')
  return normalizedBase.endsWith('/api')
    ? normalizedBase
    : `${normalizedBase}/api`
}

export async function uploadGeneratedPdfToS3({
  pdfBlob,
  fileName,
  documentType,
  sessionId,
}: UploadGeneratedPdfParams): Promise<{ key: string; url: string }> {
  const formData = new FormData()
  formData.append('file', new File([pdfBlob], fileName, { type: 'application/pdf' }))
  formData.append('fileName', fileName)
  formData.append('source', 'generated')
  formData.append('documentType', documentType)

  if (sessionId) {
    formData.append('sessionId', sessionId)
  }

  const response = await fetch(`${getApiBaseUrl()}/storage/generated-pdf`, {
    method: 'POST',
    body: formData,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to upload generated PDF to S3')
  }

  return {
    key: payload?.storage?.key || '',
    url: payload?.storage?.url || '',
  }
}
