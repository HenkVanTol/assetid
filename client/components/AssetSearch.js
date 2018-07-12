import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import query from '../queries/AssetMaster';
import deleteAsset  from '../mutations/DeleteAsset';
import { Form, Row, Col, Input, Button, Table } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router';
import moment from 'moment';
import swal from 'sweetalert2';

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
                <Link to={`/assetCreate/${record.id}`}>Edit</Link>
            )
        },
        {
            render: (text, record) => (
                <Button onClick={() => this.delete(record.id)}>Delete</Button>
            )
        }];
        // this.rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //         console.log("selectedRows[0]: ", selectedRows[0]);
        //     },
        // };
    }
    delete(id) {
        console.log("delete: ", id);
        swal({
            title: 'Delete Asset',
            text: "Are you sure?",
            //type: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'red',
            cancelButtonColor: 'grey',
            confirmButtonText: 'OK',
            animation: false,
            width: 400, 
            height: 200
        }).then((result) => {
            if (result.value) {
                this.props.client.mutate({
                    mutation: deleteAsset,
                    variables: {
                        id
                    }
                }).then(() => {
                    this.search();
                }).catch(res => {
                    console.log("res: ", res);
                    const errors = res.graphQLErrors.map(error => error.message);
                    this.setState({ errors });
                });
            }
        })
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
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 12 },
                md: { span: 12 },
                lg: { span: 6 },
                xl: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 },
                md: { span: 12 },
                lg: { span: 12 },
                xl: { span: 12 }
            },
        };
        const colLayout = {
            xs: { span: 24 },
            sm: { span: 24 },
            md: { span: 12 },
            lg: { span: 12 },
            xl: { span: 12 },
        };
        return (
            <div>
                <h2>Search Assets</h2>
                <Row>
                    <Col {...colLayout}>
                        <FormItem label="Description" {...formItemLayout}>
                            {
                                <Input value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLayout}>
                        <FormItem label="Name" {...formItemLayout}>
                            {
                                <Input value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLayout}>
                        {/* <Col {...colLayout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
                        <FormItem label=" " colon={false} {...formItemLayout}>
                            <Button type="primary" size="large" onClick={() => this.search()}>Search</Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <br>
                    </br>
                </Row>
                <Row>
                    <div className="errors">
                        {this.state.errors.map(error => <div key={error}>{error}</div>)}
                    </div>
                </Row>
                <Row>
                    <Col>
                        <Table pagination={{ pageSize: 5 }} rowSelection={this.rowSelection} dataSource={this.state.dataSource} columns={this.columns} rowKey={record => record.id} />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withApollo(AssetSearch);