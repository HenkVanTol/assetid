import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select, Label } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import create from '../mutations/CreateAssetMaster';
import findById from '../queries/InvoiceByID';
//import findLookups from '../queries/InvoiceLookups';
import findLookups from '../queries/AssetLookups';
import update from '../mutations/UpdateInvoice';
import hierarchyTypeQuery from '../queries/HierarchyType';
import userQuery from '../queries/CurrentUser';

import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';

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
    serviceDate: null,
    purchasePrice: null,
    purchaseOrderNumber: null,
    creatorId: null,
    hierarchyTypes: [],
    assetClasses: [],
    hierarchyTypeId: null,
    creatorId: null,
    errors: [],
    edit: false
};

class AssetCreate extends Component {
    constructor(props) {
        super(props);
        this.state = state;
        console.log("props in constructor: ", props);
        console.log("user in constructor: ", props.data.user);
    }
    componentDidMount() {
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
            query: userQuery,
            // options: {
            //     fetchPolicy: 'network-only'
            // }
        }).then((result) => {
            console.log("user result: ", result);
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
            // hierarchyTypes: prevState.serial, 
            // assetClasses: prevState.serial, 
            errors: prevState.errors
        }));
    }
    componentWillUnmount() {
        console.log("componentWillUnmount");
        // Remember state for the next mount
        state = this.state;
    }
    mapState(lookups) {
        console.log("lookups in mapstate: ", lookups);
        this.setState({
            //DateRaised: moment(), errors: [], InvoiceStatuses: lookups.InvoiceStatuses, Contracts: lookups.Contracts
            hierarchyTypes: lookups.HierarchyTypes,
            assetClasses: lookups.AssetClasses
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
                    creatorId
                } = this.state;

                if (this.state.edit == true) {
                    this.props.client.mutate({
                        mutation: update,
                        variables: { InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value }
                    }).then(() => {
                        this.props.client.query({
                            query: findById,
                            variables: { InvoiceID: this.props.params.id },
                            options: {
                                fetchPolicy: 'network-only'
                            }
                        }).then((result) => {
                            let invoice = result.data.InvoiceByID[0];
                            if (invoice) {
                                this.mapState(invoice);
                            }
                            toastr.success('Invoice Updated', 'Edit Invoice', { timeOut: 1000 });
                        });
                    }).catch(res => {
                        const errors = res.graphQLErrors.map(error => error.message);
                        this.setState({ errors });
                    });
                }
                else {

                    // $name:String, $description:String, $serial:String, 
                    // $registration:String, $acquisitionDate: Date, $retirementDate: Date, $hierarchyTypeId: Int) {
                    // createAssetMaster(name:$name, description:$description, serial:$serial, registration:$registration, 
                    //   acquisitionDate: $acquisitionDate, retirementDate: $retirementDate, hierarchyTypeId: $hierarchyTypeId

                    this.props.client.mutate({
                        mutation: create,
                        variables: {
                            hierarchyTypeId,
                            masterId,
                            classId,
                            name,
                            description,
                            serial,
                            registration,
                            acquisitionDate,
                            serviceDate,
                            retirementDate,
                            purchasePrice,
                            purchaseOrderNumber,
                            creatorId
                        }
                    }).then(() => {
                        toastr.success('Invoice Created', 'Create Invoice', { timeOut: 1000 });
                    }).catch(res => {
                        const errors = res.graphQLErrors.map(error => error.message);
                        this.setState({ errors });
                    });
                }
            }
            else {
                console.log("Validation errors");
            }
        });
    }
    renderHierarchyTypes() {
        if (!this.props.data.loading) {
            console.log("hierarchyTypes in render(): ", this.state.hierarchyTypes);
            return (
                this.state.hierarchyTypes.map(hierarchyType => {
                    return <Option key={hierarchyType.id} value={hierarchyType.id}>{hierarchyType.description}</Option>;
                })
            );
        }
    }
    renderAssetClasses() {
        if (!this.props.data.loading) {
            console.log("assetClasses in render(): ", this.state.assetClasses);
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
                <div>Loading...</div>
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
                    lg: { span: 6 },
                    xl: { span: 6 }
                },
            };
            const colLayout = {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 12 },
                xl: { span: 12 },
            };
            return (
                <div>
                    <h2>Create Invoice</h2>
                    <Form onSubmit={this.onSubmit.bind(this)} className="ant-advanced-search-form">
                        {/* <Row>
                            <FormItemLabel value="Contract: " />
                            <FormItemCombo value={this.state.ContractID} onChange={(value) => this.setState({ ContractID: value })}
                                renderOptions={this.renderContracts.bind(this)} />
                        </Row> */}
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Hierarchy Type" {...formItemLayout}>
                                    {
                                        getFieldDecorator('hierarchyTypeId', {
                                            initialValue: this.state.InvoiceNumber,
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
                            {/* <Col {...colLayout}>
                                <FormItem label="Invoice Number" {...formItemLayout}>
                                    {
                                        this.props.params.id > 0 ?
                                            <span style={{ fontWeight: 'bold' }}>{this.state.InvoiceNumber}</span> :
                                            getFieldDecorator('invoiceNumber', {
                                                initialValue: this.state.InvoiceNumber,
                                                valuePropName: 'value',
                                                rules: [{
                                                    required: true,
                                                    message: 'Invoice Number is required',
                                                }],
                                            })(
                                                <Input onChange={e => this.setState({ InvoiceNumber: e.target.value })} />
                                            )
                                    }
                                </FormItem>
                            </Col> */}
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
                                        <Input onChange={e => this.setState({ description: e.target.value })} />
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
                                            <DatePicker onChange={(date, dateString) => { this.setState({ acquisitionDate: date }) }} />
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
                                            <DatePicker onChange={(date, dateString) => { this.setState({ serviceDate: date }) }} />
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
                                            <DatePicker onChange={(date, dateString) => { this.setState({ retirementDate: date }) }} />
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
                            <Col {...colLayout}>
                                <FormItem label="Master" {...formItemLayout}>
                                    <Input value={this.state.masterId} onChange={e => this.setState({ masterId: e.target.value })} />
                                </FormItem>
                            </Col>
                        </Row>
                        <br>
                        </br>
                        <Row>
                            <Col span={8} />
                            <Col span={8}>
                                <Button type="primary" style={{ width: '100%' }} size="large" htmlType="submit">Submit</Button>
                            </Col>
                            <Col span={8} />
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