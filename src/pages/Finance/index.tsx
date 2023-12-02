import { PageContainer } from '@ant-design/pro-layout'
import { Card } from 'antd'
import { categoryData } from '@/data/category'
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts'

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
)

function Finance() {
  return (
    <PageContainer>
      <Card
        bordered={false}
        title='Category'
        style={{ width: '100%', marginTop: '1rem' }}
      >
        <ResponsiveContainer width='100%' height={280}>
          <BarChart
            width={1000}
            height={200}
            data={categoryData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='category' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey='Sept'
              fill='#8884d8'
              activeBar={<Rectangle fill='pink' stroke='blue' />}
            />
            <Bar
              dataKey='Oct'
              fill='#82ca9d'
              activeBar={<Rectangle fill='gold' stroke='purple' />}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </PageContainer>
  )
}

export default Finance
