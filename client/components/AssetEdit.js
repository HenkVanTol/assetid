import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select, Label } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import update from '../mutations/UpdateAssetMaster';
import findLookups from '../queries/AssetLookups';
import findById from '../queries/AssetMasterById';
import userQuery from '../queries/CurrentUser';

import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';
import { RingLoader } from 'react-spinners';

let state = {
    hierarchyTypeId: null,
    masterId: null,
    classId: null,
    name: null,
    description: null,
    serial: null,
    registration: null,
    acquisitionDate: moment(),
    retirementDate: moment(),
    serviceDate: moment(),
    purchasePrice: null,
    purchaseOrderNumber: null,
    creatorId: null,
    hierarchyTypes: [],
    assetClasses: [],
    hierarchyTypeId: null,
    creatorId: null,
    errors: [],
    edit: false,
    id: null
};

class AssetCreate extends Component {
    constructor(props) {
        super(props);
        this.state = state;
    }
    componentDidMount() {
        //edit existing
        if (this.props.params.id) {
            console.log("params id:", this.props.params.id);
            this.props.client.query({
                query: findById,
                variables: { id: this.props.params.id },
                options: {
                    fetchPolicy: 'network-only'
                }
            }).then((result) => {
                let asset = result.data.assetMasterById;
                if (asset) {
                    this.mapAsset(asset);
                }
            });
        }
        this.props.client.query({
            query: findLookups,
            // options: {
            //     fetchPolicy: 'network-only'
            // }
        }).then((result) => {
            let lookups = result.data.AssetLookups;
            if (lookups) {
                this.mapState(lookups);
            }
        });
        this.props.client.query({
            query: userQuery
        }).then((result) => {
            this.setState({ creatorId: result.data.user.id });
        });
        this.setState(prevState => ({
            hierarchyTypeId: prevState.hierarchyTypeId,
            masterId: prevState.masterId,
            classId: prevState.classId,
            name: prevState.name,
            description: prevState.description,
            serial: prevState.serial,
            registration: prevState.registration,
            acquisitionDate: prevState.acquisitionDate,
            retirementDate: prevState.retirementDate,
            serviceDate: prevState.serviceDate,
            purchasePrice: prevState.purchasePrice,
            purchaseOrderNumber: prevState.purchaseOrderNumber,
            hierarchyTypeId: prevState.hierarchyTypeId,
            creatorId: prevState.creatorId,
            hierarchyTypes: prevState.hierarchyTypes,
            assetClasses: prevState.assetClasses,
            errors: prevState.errors
        }));
    }
    componentWillUnmount() {
        // Remember state for the next mount
        state = this.state;
    }
    mapState(lookups) {
        this.setState({
            hierarchyTypes: lookups.HierarchyTypes,
            assetClasses: lookups.AssetClasses
        });
    }
    mapAsset(asset) {
        console.log("asset in mapAsset: ", asset);
        this.setState({
            hierarchyTypeId: asset.hierarchyTypeId,
            masterId: asset.masterId,
            classId: asset.classId,
            name: asset.name,
            description: asset.description,
            serial: asset.serial,
            registration: asset.registration,
            acquisitionDate: moment(asset.acquisitionDate),
            retirementDate: moment(asset.retirementDate),
            serviceDate: moment(asset.serviceDate),
            purchasePrice: asset.purchasePrice,
            purchaseOrderNumber: asset.purchaseOrderNumber,
            creatorId: asset.creatorId,
            id: asset.id
        });
    }
    onSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    hierarchyTypeId,
                    masterId,
                    classId,
                    name,
                    description,
                    serial,
                    registration,
                    acquisitionDate,
                    retirementDate,
                    serviceDate,
                    purchasePrice,
                    purchaseOrderNumber,
                    creatorId,
                    id
                } = this.state;

                this.props.client.mutate({
                    mutation: update,
                    variables: {
                        hierarchyTypeId,
                        masterId,
                        classId,
                        name,
                        description,
                        serial,
                        registration,
                        acquisitionDate,
                        retirementDate,
                        serviceDate,
                        purchasePrice,
                        purchaseOrderNumber,
                        creatorId,
                        id
                    }
                }).then(() => {
                    this.props.client.query({
                        query: findById,
                        variables: { id },
                        options: {
                            fetchPolicy: 'network-only'
                        }
                    }).then((result) => {
                        let asset = result.data.assetMasterById;
                        if (asset) {
                            this.mapAsset(asset);
                        }
                        toastr.success('Asset Updated', 'Edit Asset', { timeOut: 1000 });
                    });
                }).catch(res => {
                    const errors = res.graphQLErrors.map(error => error.message);
                    this.setState({ errors });
                });
            }
            else {
                console.log("Validation errors");
            }
        });
    }
    renderHierarchyTypes() {
        if (!this.props.data.loading) {
            return (
                this.state.hierarchyTypes.map(hierarchyType => {
                    return <Option key={hierarchyType.id} value={hierarchyType.id}>{hierarchyType.description}</Option>;
                })
            );
        }
    }
    renderAssetClasses() {
        if (!this.props.data.loading) {
            return (
                this.state.assetClasses.map(assetClass => {
                    return <Option key={assetClass.classid} value={assetClass.classid}>{assetClass.description}</Option>;
                })
            );
        }
    }
    render() {
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
            const { getFieldDecorator } = this.props.form;
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
                    <h2>Edit Asset</h2>
                    <Form onSubmit={this.onSubmit.bind(this)} className="ant-advanced-search-form">
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Hierarchy Type" {...formItemLayout}>
                                    {
                                        getFieldDecorator('hierarchyTypeId', {
                                            initialValue: this.state.hierarchyTypeId,
                                            valuePropName: 'value',
                                            rules: [{
                                                required: true,
                                                message: 'Hierarchy Type is required',
                                            }],
                                        })(
                                            <Select onChange={(value) => this.setState({ hierarchyTypeId: value })} >
                                                {this.renderHierarchyTypes()}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="Class" {...formItemLayout}>
                                    <Select value={this.state.classId} onChange={(value) => this.setState({ classId: value })} >
                                        {this.renderAssetClasses()}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Name" {...formItemLayout}>
                                    {
                                        getFieldDecorator('name', {
                                            initialValue: this.state.name,
                                            valuePropName: 'value',
                                            rules: [{
                                                required: true,
                                                message: 'Name is required',
                                            }],
                                        })(
                                            <Input onChange={e => this.setState({ name: e.target.value })} />
                                        )
                                    }
                                </FormItem>
                            </Col>
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
                                <FormItem label="Serial" {...formItemLayout}>
                                    {
                                        getFieldDecorator('serial', {
                                            initialValue: this.state.serial,
                                            valuePropName: 'value',
                                            rules: [{
                                                required: true,
                                                message: 'Serial is required',
                                            }],
                                        })(
                                            <Input onChange={e => this.setState({ serial: e.target.value })} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="Registration" {...formItemLayout}>
                                    {
                                        getFieldDecorator('Registration', {
                                            initialValue: this.state.registration,
                                            valuePropName: 'value',
                                            rules: [{
                                                required: true,
                                                message: 'Registration is required',
                                            }],
                                        })(
                                            <Input onChange={e => this.setState({ registration: e.target.value })} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Acquisition Date" {...formItemLayout}>
                                    {
                                        getFieldDecorator('acquisitionDate', {
                                            initialValue: this.state.acquisitionDate,
                                            valuePropName: 'value',
                                            rules: [{
                                                required: true,
                                                message: 'Acquisition Date is required',
                                            }],
                                        })(
                                            <DatePicker style={{ width: '100%' }} onChange={(date, dateString) => { this.setState({ acquisitionDate: date }) }} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="Service Date" {...formItemLayout}>
                                    {
                                        getFieldDecorator('serviceDate', {
                                            initialValue: this.state.serviceDate,
                                            valuePropName: 'value',
                                            rules: [{
                                                required: true,
                                                message: 'Service Date is required',
                                            }],
                                        })(
                                            <DatePicker style={{ width: '100%' }} onChange={(date, dateString) => { this.setState({ serviceDate: date }) }} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Retirement Date" {...formItemLayout}>
                                    {
                                        getFieldDecorator('retirementDate', {
                                            initialValue: this.state.retirementDate,
                                            valuePropName: 'value',
                                            rules: [{
                                                required: true,
                                                message: 'Retirement Date is required',
                                            }],
                                        })(
                                            <DatePicker style={{ width: '100%' }} onChange={(date, dateString) => { this.setState({ retirementDate: date }) }} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="Purchase Price" {...formItemLayout}>
                                    {getFieldDecorator('purchasePrice', {
                                        initialValue: this.state.purchasePrice,
                                        valuePropName: 'value',
                                        rules: [{
                                            required: true,
                                            message: 'Purchase Price is required',
                                        }],
                                    })(
                                        <Input onChange={e => this.setState({ purchasePrice: e.target.value })} type="number" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Purchase Order" {...formItemLayout}>
                                    <Input value={this.state.purchaseOrderNumber} onChange={e => this.setState({ purchaseOrderNumber: e.target.value })} />
                                </FormItem>
                            </Col>
                            {/* <Col {...colLayout}>
                                <FormItem label="Master" {...formItemLayout}>
                                    <Input value={this.state.masterId} onChange={e => this.setState({ masterId: e.target.value })} />
                                </FormItem>
                            </Col> */}
                        </Row>
                        <br>
                        </br>
                        <Row>
                            <Row>
                                <Col {...colLayout}>
                                    {/* <Col {...colLayout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
                                    <FormItem label=" " colon={false} {...formItemLayout}>
                                        <Button type="primary" size="large" htmlType="submit">Submit</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                        <Row>
                            <div className="errors">
                                {this.state.errors.map(error => <div key={error}>{error}</div>)}
                            </div>
                        </Row>
                    </Form>
                </div>
            );
        }
    }
}
export default withApollo(Form.create()(AssetCreate));