import { API_URL, API_FETCH_OPTIONS_FORM } from '../api-config';

interface UploadGeneratedPdfParams {
  pdfBlob: Blob
  fileName: string
  documentType: string
  sessionId?: string
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

  const response = await fetch(`${API_URL}/storage/generated-pdf`, {
    method: 'POST',
    ...API_FETCH_OPTIONS_FORM,
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
