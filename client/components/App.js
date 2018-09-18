import React from 'react';
import HeaderMenu from './Header';
import SideMenu from './SideMenu';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
//import imageName from './saflag.gif';

const App = (props) => {
    return (
        <div>
            <Layout>
                <Header className="header">
                    <div className="logo">
                        {/* <img className="logo" src={imageName} /> */}
                    </div>
                    <HeaderMenu />
                </Header>
                <Layout>
                    <SideMenu />
                    <Layout style={{ padding: '0 24px' }}>
                        <Content style={{ background: '#fff', padding: '24px', margin: 0, minHeight: 800 }}>
                            {props.children}
                        </Content>
                    </Layout>
                </Layout>
                <Footer style={{ textAlign: 'center' }}>
                    ©2018 Henk van Tol
                </Footer>
            </Layout>
        </div>
    );
}

export default App;