import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-layout'

const authorId = 'UCLA'

export default function GlobalFooter() {
  return (
    <DefaultFooter
      links={[
        {
          key: 'CS130 23Fall',
          title: 'CS130 23Fall',
          href: 'https://github.com/UCLA-CS130-23Fall/EasySplit',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: `https://github.com/UCLA-CS130-23Fall/EasySplit`,
          blankTarget: true,
        },
        {
          key: 'UCLA',
          title: 'UCLA',
          href: 'https://github.com/UCLA-CS130-23Fall/EasySplit',
          blankTarget: true,
        },
      ]}
      copyright={`${new Date().getFullYear()} ${authorId} Copyright`}
    />
  )
}
