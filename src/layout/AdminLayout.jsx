import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Modal, theme } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import "./AdminLayout.css";
import { TOKEN } from '../constants';
import PropTypes from "prop-types";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const logout = () => {
    Modal.confirm({
      title: 'Do you want to exit?',
      onOk: () => {
        navigate('/login');
        localStorage.removeItem(TOKEN);
        setIsLogin(false);
      },
    });
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  return (
    <Layout>
      <Sider
        className='admin-sider'
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className='admin-logo'>{collapsed ? "LMC" : "Admin panel"}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={[
            {
              key: '/teachers',
              icon: <UsergroupAddOutlined />,
              label: <Link to='/teachers'>Teachers</Link>,
            },
            {
              key: '/teacher/:id/student',
              icon: <UsergroupAddOutlined />,
              label: <Link to='/teacher/:id/student'>Students</Link>,
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: <Button type='primary' danger onClick={logout}>Logout</Button>,
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

AdminLayout.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};

export default AdminLayout;
