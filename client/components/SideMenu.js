import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';

import { Menu, Icon, Layout } from 'antd';
const Sider = Layout.Sider;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { current: '', collapsed: false };
        this.handleClick = (e) => {
            this.setState({
                current: e.key,
            });
        }
    }
    onCollapse(collapsed) {
        this.setState({ collapsed });
    }
    render() {
        return (
            <Sider
                // collapsible
                // collapsed={this.state.collapsed}
                // onCollapse={this.onCollapse.bind(this)}

                breakpoint="lg"
                collapsedWidth="0"
                onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
            >
                <Menu onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                    style={{ height: '100%', borderRight: 0 }}>
                    <Menu.Item key="home">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="invoiceCreate">
                        <Link to="/invoiceCreate">Create</Link>
                    </Menu.Item>
                    <Menu.Item key="invoiceSearch">
                        <Link to="/invoiceSearch">Search</Link>
                    </Menu.Item>
                    <Menu.Item key="assetSearch">
                        <Link to="/assetSearch">Search Assets</Link>
                    </Menu.Item>
                    <Menu.Item key="assetCreate">
                        <Link to="/assetCreate">Create Asset</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

export default SideMenu;