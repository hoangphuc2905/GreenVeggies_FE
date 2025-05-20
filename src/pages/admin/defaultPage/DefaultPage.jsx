import { Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const DefaultPage = () => {
    return (
        <Layout className='min-h-screen bg-white '>
            <Header style={{ background: '#fff', padding: 0 }}>
                <Title level={2} style={{ margin: '16px' }}>Default Page</Title>
            </Header>
            <Content style={{ margin: '24px 16px 0' }}>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <Paragraph>Welcome to the default page of the application.</Paragraph>
                    <Paragraph>This is where you can add your content.</Paragraph>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2023 Your Company</Footer>
        </Layout>
    );
};

export default DefaultPage;