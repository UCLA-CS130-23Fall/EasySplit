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
  Cell,
} from 'recharts'

import { COLORS } from '@/data/color'

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
        title='Analysis by Category'
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
              fill='#0088FE'
              activeBar={<Rectangle fill='pink' stroke='blue' />}
            />
            <Bar
              dataKey='Oct'
              fill='#82ca9d'
              activeBar={<Rectangle fill='gold' stroke='purple' />}
            />
            <Bar
              dataKey='Nov'
              fill='#FFBB28'
              activeBar={<Rectangle fill='gold' stroke='purple' />}
            />
          </BarChart>
        </ResponsiveContainer>
        <div
          style={{ display: 'flex', flexDirection: 'row', marginTop: '2rem' }}
        >
          <ResponsiveContainer width='40%' height={250}>
            <PieChart width={400} height={400}>
            <Tooltip />
              <Pie
                data={categoryData}
                cx='50%'
                cy='50%'
                label
                nameKey='category'
                labelLine={true}
                outerRadius={80}
                dataKey='Sept'
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`sept-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width='40%' height={250}>
            <PieChart width={400} height={400}>
            <Tooltip />
              <Pie
                data={categoryData}
                cx='50%'
                cy='50%'
                label
                nameKey='category'
                labelLine={true}
                outerRadius={80}
                dataKey='Oct'
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`oct-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width='40%' height={250}>
            <PieChart width={400} height={400}>
            <Tooltip />
              <Pie
                data={categoryData}
                cx='50%'
                cy='50%'
                label
                nameKey='category'
                labelLine={true}
                outerRadius={80}
                dataKey='Nov'
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`nov-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </PageContainer>
  )
}

export default Finance
