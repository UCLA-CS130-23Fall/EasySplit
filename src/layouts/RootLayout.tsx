import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'

const RootLayout: React.FC = ({ children }) => {
  return <ConfigProvider locale={enUS}>{children}</ConfigProvider>
}

export default RootLayout
