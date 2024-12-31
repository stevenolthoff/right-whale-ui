declare module 'react-json-to-csv' {
  import { FC, PropsWithChildren } from 'react'
  
  interface CsvDownloadProps {
    data: any[]
    filename?: string
    delimiter?: string
    className?: string
  }

  const CsvDownload: FC<PropsWithChildren<CsvDownloadProps>>
  export default CsvDownload
} 
