import { google } from 'googleapis'

const drive = google.drive('v3')

const getAuth = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  
  if (!clientEmail || !privateKey) {
    throw new Error('Faltan credenciales de Google Drive')
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
}

export const getPublicImageUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?id=${fileId}&export=view`
}

export const getFileFromDrive = async (fileId: string) => {
  try {
    const auth = getAuth()
    const authClient = await auth.getClient()
    
    const response = await drive.files.get({
      auth: authClient,
      fileId: fileId,
      fields: 'id,name,webViewLink,size,mimeType',
    })
    
    return response.data
  } catch (error) {
    console.error('Error al obtener archivo de Drive:', error)
    throw new Error('Error al obtener archivo de Google Drive')
  }
}

export const getFilesFromFolder = async (folderId: string) => {
  try {
    const auth = getAuth()
    const authClient = await auth.getClient()
    
    const response = await drive.files.list({
      auth: authClient,
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id,name,webViewLink,size,mimeType,createdTime)',
      orderBy: 'name',
    })
    
    return response.data.files || []
  } catch (error) {
    console.error('Error al listar archivos de Drive:', error)
    throw new Error('Error al listar archivos de Google Drive')
  }
}
