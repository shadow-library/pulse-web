/**
 * Importing npm packages
 */
import { createFileRoute } from '@tanstack/react-router';
import { Card, Col, Row, Statistic, Typography, Progress, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, MailOutlined, MessageOutlined, NotificationOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { getStats } from '@/api';

/**
 *  Importing user defined modules
 */

/**
 * Declaring types
 */

interface ChannelStats {
  total: number;
  succeeded: number;
  failed: number;
  pending: number;
}

interface TrendItem extends ChannelStats {
  date: string;
}

interface DashboardData {
  today: {
    date: string;
    overall: ChannelStats;
    channels: {
      email: ChannelStats;
      sms: ChannelStats;
      push: ChannelStats;
    };
  };
  trend: {
    fromDate: string;
    toDate: string;
    stats: TrendItem[];
  };
}

/**
 * Declaring constants
 */

const dashboardData: DashboardData = {
  today: {
    date: '01-01-2025',
    overall: {
      total: 100,
      succeeded: 80,
      failed: 15,
      pending: 5,
    },
    channels: {
      email: {
        total: 50,
        succeeded: 40,
        failed: 7,
        pending: 3,
      },
      sms: {
        total: 30,
        succeeded: 25,
        failed: 4,
        pending: 1,
      },
      push: {
        total: 20,
        succeeded: 15,
        failed: 4,
        pending: 1,
      },
    },
  },
  trend: {
    fromDate: '27-12-2024',
    toDate: '31-12-2024',
    stats: [
      { total: 100, succeeded: 80, failed: 15, pending: 5, date: '27-12-2024' },
      { total: 90, succeeded: 70, failed: 15, pending: 5, date: '28-12-2024' },
      { total: 95, succeeded: 75, failed: 15, pending: 5, date: '29-12-2024' },
      { total: 85, succeeded: 65, failed: 15, pending: 5, date: '30-12-2024' },
      { total: 110, succeeded: 90, failed: 15, pending: 5, date: '31-12-2024' },
    ],
  },
};

const trendColumns: ColumnsType<TrendItem> = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    align: 'center',
  },
  {
    title: 'Succeeded',
    dataIndex: 'succeeded',
    key: 'succeeded',
    align: 'center',
    render: (value: number) => <span className="text-[var(--color-success)]">{value}</span>,
  },
  {
    title: 'Failed',
    dataIndex: 'failed',
    key: 'failed',
    align: 'center',
    render: (value: number) => <span className="text-[var(--color-error)]">{value}</span>,
  },
  {
    title: 'Pending',
    dataIndex: 'pending',
    key: 'pending',
    align: 'center',
    render: (value: number) => <span className="text-[var(--color-warning)]">{value}</span>,
  },
  {
    title: 'Success Rate',
    key: 'successRate',
    align: 'center',
    render: (_, record) => {
      const rate = Math.round((record.succeeded / record.total) * 100);
      return <Progress percent={rate} size="small" status={rate >= 80 ? 'success' : rate >= 60 ? 'normal' : 'exception'} />;
    },
  },
];

const channelIcons = {
  email: <MailOutlined className="text-2xl" />,
  sms: <MessageOutlined className="text-2xl" />,
  push: <NotificationOutlined className="text-2xl" />,
};

const channelLabels = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push Notification',
};

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="h-full">
      <Statistic title={title} value={value} prefix={<span style={{ color }}>{icon}</span>} valueStyle={{ color }} />
    </Card>
  );
}

function ChannelCard({ channel, stats }: { channel: 'email' | 'sms' | 'push'; stats: ChannelStats }) {
  const successRate = Math.round((stats.succeeded / stats.total) * 100);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          {channelIcons[channel]}
          <span>{channelLabels[channel]}</span>
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-text-secondary)]">Total</span>
          <span className="font-semibold text-lg">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-text-secondary)]">Succeeded</span>
          <span className="font-semibold text-lg text-[var(--color-success)]">{stats.succeeded}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-text-secondary)]">Failed</span>
          <span className="font-semibold text-lg text-[var(--color-error)]">{stats.failed}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-text-secondary)]">Pending</span>
          <span className="font-semibold text-lg text-[var(--color-warning)]">{stats.pending}</span>
        </div>
        <Progress percent={successRate} status={successRate >= 80 ? 'success' : successRate >= 60 ? 'normal' : 'exception'} />
      </div>
    </Card>
  );
}

function Dashboard() {
  const { today, trend } = dashboardData;
  const overallSuccessRate = Math.round((today.overall.succeeded / today.overall.total) * 100);

  useEffect(() => {
    console.log('Fetching dashboard stats...');
    getStats().then(console.log).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Typography.Title level={2} className="!mb-0">
          Dashboard
        </Typography.Title>
        <Typography.Text type="secondary">Today: {today.date}</Typography.Text>
      </div>

      {/* Overall Stats */}
      <Card title="Today's Overview" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Total Notifications" value={today.overall.total} icon={<NotificationOutlined />} color="var(--color-primary)" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Succeeded" value={today.overall.succeeded} icon={<CheckCircleOutlined />} color="var(--color-success)" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Failed" value={today.overall.failed} icon={<CloseCircleOutlined />} color="var(--color-error)" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Pending" value={today.overall.pending} icon={<ClockCircleOutlined />} color="var(--color-warning)" />
          </Col>
        </Row>
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <span className="text-[var(--color-text-secondary)]">Overall Success Rate:</span>
            <Progress percent={overallSuccessRate} status={overallSuccessRate >= 80 ? 'success' : overallSuccessRate >= 60 ? 'normal' : 'exception'} className="flex-1 max-w-md" />
          </div>
        </div>
      </Card>

      {/* Channel Stats */}
      <Typography.Title level={4}>Channel Breakdown</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <ChannelCard channel="email" stats={today.channels.email} />
        </Col>
        <Col xs={24} md={8}>
          <ChannelCard channel="sms" stats={today.channels.sms} />
        </Col>
        <Col xs={24} md={8}>
          <ChannelCard channel="push" stats={today.channels.push} />
        </Col>
      </Row>

      {/* Trend */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>5-Day Trend</span>
            <Typography.Text type="secondary" className="font-normal">
              {trend.fromDate} - {trend.toDate}
            </Typography.Text>
          </div>
        }
        className="shadow-sm"
      >
        <Table columns={trendColumns} dataSource={trend.stats} rowKey="date" pagination={false} />
      </Card>
    </div>
  );
}
