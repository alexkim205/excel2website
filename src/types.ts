export interface ChartType {
    id: string | number
    dataSourceId: string // data file id related to Microsoft Graph API
    selector: string // Sheet and range in this format, i.e. 'Sheet1'!A3:B9
}

export interface WorkbookType {
    id: string
    lastModifiedDateTime: string
    createdDateTime: string,
    name: string
}