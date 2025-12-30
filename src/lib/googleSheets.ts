import { google } from 'googleapis'

const sheets = google.sheets('v4')

const getAuth = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  
  if (!clientEmail || !privateKey) {
    throw new Error('Faltan credenciales de Google Sheets')
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export const getSheetData = async (sheetName: string, range: string = 'A:Z') => {
  try {
    const auth = getAuth()
    const authClient = await auth.getClient() as any
    
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${sheetName}!${range}`,
    })
    
    return response.data.values || []
  } catch (error) {
    console.error(`Error al obtener datos de ${sheetName}:`, error)
    return []
  }
}

export const getSheetHeaders = async (sheetName: string) => {
  try {
    const data = await getSheetData(sheetName, 'A1:Z1')
    return data[0] || []
  } catch (error) {
    console.error(`Error al obtener headers de ${sheetName}:`, error)
    return []
  }
}

export const updateSheetData = async (
  sheetName: string, 
  range: string, 
  values: any[][]
) => {
  try {
    const auth = getAuth()
    const authClient = await auth.getClient() as any
    
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${sheetName}!${range}`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    })
    
    return { success: true }
  } catch (error) {
    console.error(`Error al actualizar ${sheetName}:`, error)
    return { success: false, error }
  }
}

export const appendSheetData = async (sheetName: string, values: any[][]) => {
  try {
    const auth = getAuth()
    const authClient = await auth.getClient() as any
    
    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    })
    
    return { success: true }
  } catch (error) {
    console.error(`Error al agregar datos a ${sheetName}:`, error)
    return { success: false, error }
  }
}
