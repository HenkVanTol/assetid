import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import query from '../queries/AssetMaster';
import deleteAsset from '../mutations/DeleteAsset';
import { Form, Row, Col, Input, Button, Table } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router';
import moment from 'moment';
import swal from 'sweetalert2';
import findByHierarchyTypeId from '../queries/AssetMasterByHierarchyTypeId';
import findByIdNameOnly from '../queries/AssetMasterByIdNameOnly';
import setComponentMaster from '../mutations/SetComponentMaster';
import clearComponents from '../mutations/ClearComponents';
import toastr from 'toastr';
import { BarLoader, RingLoader } from 'react-spinners';

const componentHierarchyType = 2;

let state = { name: null, description: null, hierarchyTypeId: null, errors: [], dataSource: [], selectedComponents: [], masterName: null, selectedRowKeys: [], mutationLoading: false };

class ManageComponents extends Component {

    constructor(props) {
        super(props);
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
        }];
        this.onSelectChange = (selectedRowKeys) => {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.setState({ selectedRowKeys });
        }
        // this.rowSelection = {
        //     selectedRowKeys: this.state.selectedRowKeys,
        //     onChange: this.onSelectChange,
        // };

        // this.rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //         console.log("selectedRows[0]: ", selectedRows[0]);
        //         let currentSelection = this.state.selectedComponents;
        //         currentSelection.push(selectedRows);
        //         this.setState({ selectedComponents: currentSelection });
        //         console.log("STATE SELECTION: ", this.state.selectedComponents);
        //     },
        //     getCheckboxProps: record => ({
        //         //checked: record.masterId == this.props.params.id
        //         checked: this.state.selectedComponents.some((selected) => {
        //             return selected.id == record.id;
        //         })
        //     }),
        // };
    }
    componentDidMount() {
        this.props.client.query({
            query: findByIdNameOnly,
            variables: { id: this.props.params.id },
            options: {
                fetchPolicy: 'network-only'
            }
        }).then((result) => {
            this.setState({ masterName: result.data.assetMasterById.name });
        });
        this.props.client.query({
            query: findByHierarchyTypeId,
            variables: {
                hierarchyTypeId: componentHierarchyType
            }
        }).then((result) => {
            this.setState({ dataSource: result.data.assetMasterByHierarchyTypeId })
            let previouslySelected = result.data.assetMasterByHierarchyTypeId.filter((asset) => {
                return asset.masterId == this.props.params.id;
            }).map((el) => { return el.id });
            //this.setState({ selectedComponents: previouslySelected });
            this.setState({ selectedRowKeys: previouslySelected });
            console.log("PREVIOUSLY SELECTED: ", this.state.selectedRowKeys);
        });

        this.setState(prevState => ({
            //selectedComponents: prevState.selectedComponents
            selectedRowKeys: prevState.selectedRowKeys
        }));
    }
    componentWillUnmount() {
        state = this.state;
    }
    save() {
        console.log("SELECTED COMPONENTS:", this.state.selectedRowKeys);
        this.setState({ mutationLoading: true });
        this.props.client.mutate({
            mutation: clearComponents,
            variables: {
                masterId: this.props.params.id
            }
        }).then(() => {
            let i = 0;
            //hack
            let temp = this.state.selectedRowKeys;
            temp.push(-1);
            this.setState({ selectedRowKeys: temp });
            this.state.selectedRowKeys.forEach(key => {
                console.log("KEY: ", key);
                this.props.client.mutate({
                    mutation: setComponentMaster,
                    variables: {
                        componentId: key,
                        masterId: this.props.params.id
                    }
                }).then(() => {
                    i++;
                    if (i == this.state.selectedRowKeys.length) {
                        this.setState({ mutationLoading: false });
                        toastr.success('Components Updated', 'Manage Components', { timeOut: 1000 });
                    }
                }).catch(res => {
                    const errors = res.graphQLErrors.map(error => error.message);
                    this.setState({ errors });
                });
            })
        }).catch(res => {
            const errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors });
        });
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


        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        if (this.props.data.loading) {
            return (
                <div className='center-div'>
                    <div className='sweet-loading' >
                        <RingLoader
                            size={120}
                            color={'red'}
                            loading={this.props.data.loading}
                        />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h2>Manage Components for: {this.state.masterName}</h2>
                    <Row>
                        <br>
                        </br>
                    </Row>
                    <Row>
                        <Col>
                            <Table pagination={{ pageSize: 10 }}
                                rowSelection={rowSelection}
                                dataSource={this.state.dataSource}
                                columns={this.columns}
                                rowKey={record => record.id} />
                        </Col>
                    </Row>
                    {/* <Row>
                    <br>
                    </br>
                </Row> */}
                    <Row>
                        <Col {...colLayout}>
                            {/* <Col {...colLayout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
                            <FormItem label=" " colon={false} {...formItemLayout}>
                                <Button type="primary" size="large" onClick={() => this.save()}>Save</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col {...colLayout}>
                            <div className='sweet-loading center-div-horizontal' >
                                <BarLoader
                                    size={800}
                                    color={'red'}
                                    loading={this.state.mutationLoading}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div className="errors">
                            {this.state.errors.map(error => <div key={error}>{error}</div>)}
                        </div>
                    </Row>
                </div>
            );
        }
    }
}

export default withApollo(ManageComponents);