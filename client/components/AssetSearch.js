import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import query from '../queries/AssetMaster';
import { Form, Row, Col, Input, Button, Table } from 'antd';
const FormItem = Form.Item;
import FormItemTextInput from './common/FormItemTextInput';
import FormItemLabel from './common/FormItemLabel';
import { Link } from 'react-router';
import moment from 'moment';

let state = { name: null, description: null, hierarchyTypeId: null, errors: [], dataSource: [] };

class AssetSearch extends Component {

    constructor(props) {
        super(props);
        //this.state = { InvoiceNumber: '', InvoiceStatusID: null, errors: [], dataSource: [] };
        this.state = state;
        this.columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: 'Serial',
            dataIndex: 'serial',
            key: 'serial',
        }, {
            title: 'Registration',
            dataIndex: 'registration',
            key: 'registration',
        }, {
            title: 'Acquisition Date',
            dataIndex: 'acquisitionDate',
            key: 'acquisitionDate',
            render: (text, record) => (
                <span>{moment(record.acquisitionDate).format("DD/MM/YYYY")}</span>
            )
        },
        {
            render: (text, record) => (
                <Link to={`/assetEdit/${record.id}`}>Edit</Link>
            )
        }];
        // this.rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //         console.log("selectedRows[0]: ", selectedRows[0]);
        //     },
        // };
    }
    search() {
        let { name, description } = this.state;
        this.props.client.query({
            query,
            variables: { name, description },
            options: {
                fetchPolicy: 'network-only'
            }
        }).then((result) => {
            console.log("result", result);
            this.setState({ dataSource: result.data.assetMaster });
        });
    }
    componentDidMount() {
        console.log("componentDidMount");
        this.setState(prevState => ({
            name: prevState.name,
            description: prevState.description,
            hierarchyTypeId: prevState.hierarchyTypeId
        }));
    }
    componentWillUnmount() {
        console.log("componentWillUnmount");
        // Remember state for the next mount
        state = this.state;
    }
    render() {
        return (
            <div>
                <Row gutter={16}>
                    <FormItemLabel value="Name: " />
                    <FormItemTextInput value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                </Row>
                <Row gutter={16}>
                    <FormItemLabel value="Description: " />
                    <FormItemTextInput value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
                </Row>
                <Row gutter={16}>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6} />
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Button type="primary" style={{ width: '100%' }} size="large" onClick={() => this.search()}>Search</Button>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6} />
                </Row>
                <Row gutter={16}>
                    <div className="errors">
                        {this.state.errors.map(error => <div key={error}>{error}</div>)}
                    </div>
                </Row>
                <Row gutter={16}>
                    <Col span={16}>
                        <Table rowSelection={this.rowSelection} dataSource={this.state.dataSource} columns={this.columns} rowKey={record => record.id} />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withApollo(AssetSearch);