import  { useState } from 'react';

import {

  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Outlet } from 'react-router-dom';

import "./AdminLayout.css"
const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider
      className='admin-sider'
       trigger={null} collapsible collapsed={collapsed}>
        <div className='admin-logo'>{collapsed ? "LMC" :"Admin panel"}</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UsergroupAddOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <UsergroupAddOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <LogoutOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
        className='admin-content'
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;