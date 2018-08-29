import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import create from '../mutations/CreateAssetMaster';
import update from '../mutations/UpdateAssetMaster';
import findLookups from '../queries/AssetLookups';
import userQuery from '../queries/CurrentUser';
import findByHierarchyTypeId from '../queries/AssetMasterByHierarchyTypeId';
import findById from '../queries/AssetMasterById';

import { Link } from 'react-router';
import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';
import { RingLoader } from 'react-spinners';
import { BarLoader } from 'react-spinners';
import findByMasterId from '../queries/AssetMasterByMasterId';
import FormItemCombo from '../components/common/FormItemCombo';

const masterHierarchyType = 1;
const componentHierarchyType = 2;

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
    assetMasters: [],
    hierarchyTypeId: null,
    creatorId: null,
    errors: [],
    edit: false,
    readOnly: true,
    components: []
};

class AssetCreate extends Component {
    constructor(props) {
        super(props);
        //Bind functions in constructor to prevent re-rendering of child components
        this.setClassId = this.setClassId.bind(this);
        this.renderAssetClasses = this.renderAssetClasses.bind(this);
        this.renderHierarchyTypes = this.renderHierarchyTypes.bind(this);
        this.loadMasters = this.loadMasters.bind(this);

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
        },
        {
            title: 'Acquisition Date',
            dataIndex: 'acquisitionDate',
            key: 'acquisitionDate',
            render: (record) => (
                <span>{moment(record.acquisitionDate).format("DD/MM/YYYY")}</span>
            )
        },
        {
            render: (record) => (
                <Link to={`/assetCreate/${record.id}`}>View</Link>
            )
        }];

        if (!state.edit && !(this.props.params.id > 0)) {
            this.state = state;
        }
        else {
            this.state = {
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
                assetMasters: [],
                hierarchyTypeId: null,
                creatorId: null,
                errors: [],
                edit: false,
                readOnly: true,
                components: []
            };
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id != this.state.id) {
            this.load();
        }
    }
    componentDidMount() {
        this.load();
    }
    load() {
        //edit existing
        if (this.props.params.id) {
            this.setState({ edit: true });
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
        else {
            this.setState({ readOnly: false });
        }
        console.log("state in did mount: ", this.state);
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

        //load components if master
        this.props.client.query({
            query: findByMasterId,
            variables: {
                masterId: this.props.params.id
            }
        }).then((result) => {
            this.setState({ components: result.data.assetMasterByMasterId });
        });

        this.loadMasters(this.state.hierarchyTypeId);
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
            assetMasters: prevState.assetMasters,
            errors: prevState.errors,
            components: prevState.components
        }));
    }
    componentWillUnmount() {
        // Remember state for the next mount
        state = this.state;
    }
    mapAsset(asset) {
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
    mapState(lookups) {
        this.setState({
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
                    creatorId,
                    id
                } = this.state;

                if (this.state.edit == true) {
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
                        toastr.success('Asset Created', 'Create Asset', { timeOut: 1000 });
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
    renderMasters() {
        if (!this.props.data.loading) {
            return (
                this.state.assetMasters.map(assetMaster => {
                    return <Option key={assetMaster.id} value={assetMaster.id}>{assetMaster.name}</Option>;
                })
            );
        }
    }
    setClassId(classId) {
        this.setState({ classId })
    }
    loadMasters(selectedHierarchyTypeId) {
        this.setState({ hierarchyTypeId: selectedHierarchyTypeId, masterId: null });
        this.props.client.query({
            query: findByHierarchyTypeId,
            variables: {
                hierarchyTypeId: masterHierarchyType
            }
        }).then((result) => {
            this.setState({ assetMasters: result.data.assetMasterByHierarchyTypeId });
        });
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
                    <div>
                        {
                            (this.state.readOnly) ? <h2 style={{ display: 'inline-block' }}>View Asset</h2> :
                                ((this.state.edit) ? <h2 style={{ display: 'inline-block' }}>Edit Asset</h2> : <h2 style={{ display: 'inline-block' }}>Create Asset</h2>)
                        }
                        {" "}
                        {
                            (this.state.hierarchyTypeId == componentHierarchyType) ?
                                <Link to={`/assetcreate/${this.state.masterId}`}>View Master</Link> :
                                <div></div>
                        }
                    </div>
                    <Form onSubmit={this.onSubmit.bind(this)} className="ant-advanced-search-form">
                        <Row>
                            <FormItemCombo
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                options={this.state.hierarchyTypes}
                                formItemLayout={formItemLayout}
                                idValue={this.state.hierarchyTypeId}
                                labelValue={"Hierarchy Type"}
                                valueFieldName={"hierarchyTypeId"}
                                required={true}
                                requiredMessage={"Hierarchy Type is required"}
                                onChange={this.loadMasters}
                                renderOptions={this.renderHierarchyTypes}
                                descriptionFieldName={"description"}
                                lookupIdFieldName={"id"}
                                form={this.props.form}
                            />
                            <FormItemCombo
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                options={this.state.assetClasses}
                                formItemLayout={formItemLayout}
                                idValue={this.state.classId}
                                labelValue={"Class"}
                                valueFieldName={"classid"}
                                onChange={this.setClassId}
                                renderOptions={this.renderAssetClasses}
                                descriptionFieldName={"description"}
                                lookupIdFieldName={"classid"}
                                form={this.props.form}
                            />
                            {/* <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly && this.state.assetClasses.length > 0) ?
                                    (this.state.classId > 0) ?
                                        <FormItem label="Class" {...formItemLayout}>
                                            <label>{this.state.assetClasses.filter(e => e.classid == this.state.classId)[0].description}</label>
                                        </FormItem> : <FormItem label="Class" {...formItemLayout}></FormItem> :
                                    <FormItem label="Class" {...formItemLayout}>
                                        <Select value={this.state.classId} onChange={(value) => this.setState({ classId: value })} >
                                            {this.renderAssetClasses()}
                                        </Select>
                                    </FormItem>
                                }
                            </Col> */}
                            {/* <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly && this.state.assetClasses.length > 0) ?
                                    (this.state.classId > 0) ?
                                        <FormItem label="Class" {...formItemLayout}>
                                            <label>{this.state.assetClasses.filter(e => e.classid == this.state.classId)[0].description}</label>
                                        </FormItem>
                                        : 
                                        <FormItem label="Class" {...formItemLayout}></FormItem>
                                    :
                                    <FormItem label="Class" {...formItemLayout}>
                                        <Select value={this.state.classId} onChange={(value) => this.setState({ classId: value })} >
                                            {this.renderAssetClasses()}
                                        </Select>
                                    </FormItem>
                                }
                            </Col> */}
                            {/* <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly && this.state.hierarchyTypes.length > 0) ?
                                    <FormItem label="Hierarchy Type" {...formItemLayout}>
                                        <label>{this.state.hierarchyTypes.filter(e => e.id == this.state.hierarchyTypeId)[0].description}</label>
                                    </FormItem> :
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
                                                // <Select onChange={(value) => this.setState({ hierarchyTypeId: value })} >
                                                //     {this.renderHierarchyTypes()}
                                                // </Select>
                                                <Select onChange={(value) => this.loadMasters(value)} >
                                                    {this.renderHierarchyTypes()}
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                }
                            </Col> */}
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Name" {...formItemLayout}>
                                        <label>{this.state.name}</label>
                                    </FormItem> :
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
                                }
                            </Col>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Description" {...formItemLayout}>
                                        <label>{this.state.description}</label>
                                    </FormItem> :
                                    <FormItem label="Description" {...formItemLayout}>
                                        {
                                            <Input value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
                                        }
                                    </FormItem>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Serial" {...formItemLayout}>
                                        <label>{this.state.serial}</label>
                                    </FormItem> :
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
                                }
                            </Col>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Registration" {...formItemLayout}>
                                        <label>{this.state.registration}</label>
                                    </FormItem> :
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
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Acquisition Date" {...formItemLayout}>
                                        <label>{this.state.acquisitionDate.format("DD/MM/YYYY")}</label>
                                    </FormItem> :
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
                                                <DatePicker style={{ width: '100%' }} onChange={(date) => { this.setState({ acquisitionDate: date }) }} />
                                            )
                                        }
                                    </FormItem>
                                }
                            </Col>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Service Date" {...formItemLayout}>
                                        <label>{this.state.serviceDate.format("DD/MM/YYYY")}</label>
                                    </FormItem> :
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
                                                <DatePicker style={{ width: '100%' }} onChange={(date) => { this.setState({ serviceDate: date }) }} />
                                            )
                                        }
                                    </FormItem>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Retirement Date" {...formItemLayout}>
                                        <label>{this.state.retirementDate.format("DD/MM/YYYY")}</label>
                                    </FormItem> :
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
                                                <DatePicker style={{ width: '100%' }} onChange={(date) => { this.setState({ retirementDate: date }) }} />
                                            )
                                        }
                                    </FormItem>
                                }
                            </Col>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Purchase Price" {...formItemLayout}>
                                        <label>{this.state.purchasePrice}</label>
                                    </FormItem> :
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
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Purchase Order" {...formItemLayout}>
                                        <label>{this.state.purchaseOrderNumber}</label>
                                    </FormItem> :
                                    <FormItem label="Purchase Order" {...formItemLayout}>
                                        <Input value={this.state.purchaseOrderNumber} onChange={e => this.setState({ purchaseOrderNumber: e.target.value })} />
                                    </FormItem>
                                }
                            </Col>

                            <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly && this.state.assetMasters.length > 0 && this.state.hierarchyTypeId == componentHierarchyType)
                                    ?
                                    (this.state.masterId > 0)
                                        ?
                                        <FormItem label="Master" {...formItemLayout}>
                                            <label>{this.state.assetMasters.filter(e => e.id == this.state.masterId)[0].description}</label>
                                        </FormItem>
                                        :
                                        <FormItem label="Master" {...formItemLayout}></FormItem>
                                    :
                                    (!this.state.readOnly)
                                        ?
                                        <FormItem label="Master" {...formItemLayout}>
                                            <Select disabled={this.state.hierarchyTypeId != componentHierarchyType} value={this.state.masterId} onChange={(value) => this.setState({ masterId: value })} >
                                                {this.renderMasters()}
                                            </Select>
                                        </FormItem>
                                        :
                                        <FormItem label="Master" {...formItemLayout}></FormItem>
                                }
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label=" " colon={false} {...formItemLayout}>
                                    <Button type="primary" size="large" htmlType="submit">Submit</Button>
                                    {" "}
                                    <Button type="primary" size="large" onClick={() => this.setState(prevState => ({ readOnly: !prevState.readOnly }))}>{this.state.readOnly ? "Edit" : "Cancel"}</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <div className="errors">
                                {this.state.errors.map(error => <div key={error}>{error}</div>)}
                            </div>
                        </Row>
                        {(this.state.hierarchyTypeId && this.state.hierarchyTypeId != componentHierarchyType) ?
                            <Row>
                                <h2>Components</h2>
                                <Col>
                                    <Table pagination={{ pageSize: 10 }}
                                        dataSource={this.state.components}
                                        columns={this.columns}
                                        rowKey={record => record.id} />
                                </Col>
                            </Row> :
                            <div></div>
                        }
                    </Form>
                </div>
            );
        }
    }
}
export default withApollo(Form.create()(AssetCreate));