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
import findByMasterId from '../queries/AssetMasterByMasterId';
import FormItemCombo from '../components/common/FormItemCombo';
import FormItemTextInput from '../components/common/FormItemTextInput';
import FormItemDatePicker from '../components/common/FormItemDatePicker';
import { formItemLayout, colLayout } from '../layout/Layout';

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
        this.setName = this.setName.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setSerial = this.setSerial.bind(this);
        this.setRegistration = this.setRegistration.bind(this);
        this.setAcquisitionDate = this.setAcquisitionDate.bind(this);
        this.setServiceDate = this.setServiceDate.bind(this);
        this.setRetirementDate = this.setRetirementDate.bind(this);
        this.setPurchasePrice = this.setPurchasePrice.bind(this);
        this.setPurchaseOrderNumber = this.setPurchaseOrderNumber.bind(this);
        this.renderMasters = this.renderMasters.bind(this);
        this.setMasterId = this.setMasterId.bind(this);

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
        console.log("ONSUBMIT");
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
    setMasterId(masterId) {
        this.setState({ masterId })
    }
    setName(e) {
        this.setState({ name: e.target.value })
    }
    setSerial(e) {
        this.setState({ serial: e.target.value })
    }
    setDescription(e) {
        this.setState({ description: e.target.value })
    }
    setRegistration(e) {
        this.setState({ registration: e.target.value })
    }
    setAcquisitionDate(acquisitionDate) {
        this.setState({ acquisitionDate })
    }
    setServiceDate(serviceDate) {
        this.setState({ serviceDate })
    }
    setRetirementDate(retirementDate) {
        this.setState({ retirementDate })
    }
    setPurchasePrice(e) {
        this.setState({ purchasePrice: e.target.value })
    }
    setPurchaseOrderNumber(e) {
        this.setState({ purchaseOrderNumber: e.target.value })
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
            return (
                <div>
                    <div>
                        {
                            (this.state.readOnly) ? <h2 style={{ display: 'inline-block' }}>View Asset</h2> :
                                ((this.state.edit) ? <h2 style={{ display: 'inline-block' }}>Edit Asset</h2> : <h2 style={{ display: 'inline-block' }}>Create Asset</h2>)
                        }
                        {" "}
                        {
                            (this.state.hierarchyTypeId == componentHierarchyType && this.state.masterId) ?
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
                        </Row>
                        <Row>
                            <FormItemTextInput
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                labelValue={"Name"}
                                valueFieldName={"name"}
                                onChange={this.setName}
                                stringValue={this.state.name}
                                form={this.props.form}
                                required={true}
                                requiredMessage={"Name is required"}
                            />
                            <FormItemTextInput
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                labelValue={"Description"}
                                valueFieldName={"description"}
                                onChange={this.setDescription}
                                stringValue={this.state.description}
                                form={this.props.form}
                            />
                        </Row>
                        <Row>
                            <FormItemTextInput
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                labelValue={"Serial"}
                                valueFieldName={"serial"}
                                onChange={this.setSerial}
                                stringValue={this.state.serial}
                                form={this.props.form}
                                required={true}
                                requiredMessage={"Serial is required"}
                            />
                            <FormItemTextInput
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                labelValue={"Registration"}
                                valueFieldName={"registration"}
                                onChange={this.setRegistration}
                                stringValue={this.state.registration}
                                form={this.props.form}
                                required={true}
                                requiredMessage={"Registration is required"}
                            />
                        </Row>
                        <Row>
                            <FormItemDatePicker
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                dateValue={this.state.acquisitionDate}
                                labelValue={"Acquisition Date"}
                                valueFieldName={"acquisitionDate"}
                                required={true}
                                requiredMessage={"Acquisition Date is required"}
                                onChange={this.setAcquisitionDate}
                                form={this.props.form}
                            />
                            <FormItemDatePicker
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                dateValue={this.state.serviceDate}
                                labelValue={"Service Date"}
                                valueFieldName={"serviceDate"}
                                required={true}
                                requiredMessage={"Service Date is required"}
                                onChange={this.setServiceDate}
                                form={this.props.form}
                            />
                        </Row>
                        <Row>
                            <FormItemDatePicker
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                dateValue={this.state.retirementDate}
                                labelValue={"Retirement Date"}
                                valueFieldName={"retirementDate"}
                                required={true}
                                requiredMessage={"Retirement Date is required"}
                                onChange={this.setRetirementDate}
                                form={this.props.form}
                            />
                            <FormItemTextInput
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                labelValue={"Purchase Price"}
                                valueFieldName={"purchasePrice"}
                                onChange={this.setPurchasePrice}
                                stringValue={this.state.purchasePrice}
                                form={this.props.form}
                                required={true}
                                requiredMessage={"Purchase Price is required"}
                                type={"number"}
                            />
                        </Row>
                        <Row>
                            <FormItemTextInput
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                formItemLayout={formItemLayout}
                                labelValue={"Purchase Order"}
                                valueFieldName={"purchaseOrder"}
                                onChange={this.setPurchaseOrderNumber}
                                stringValue={this.state.purchaseOrderNumber}
                                form={this.props.form}
                            />
                            {/* <Col {...colLayout}>
                                {(this.state.edit && this.state.readOnly) ?
                                    <FormItem label="Purchase Order" {...formItemLayout}>
                                        <label>{this.state.purchaseOrderNumber}</label>
                                    </FormItem> :
                                    <FormItem label="Purchase Order" {...formItemLayout}>
                                        <Input value={this.state.purchaseOrderNumber} onChange={e => this.setState({ purchaseOrderNumber: e.target.value })} />
                                    </FormItem>
                                }
                            </Col> */}

                            <FormItemCombo
                                colLayout={colLayout}
                                edit={this.state.edit}
                                readOnly={this.state.readOnly}
                                options={this.state.assetMasters}
                                formItemLayout={formItemLayout}
                                idValue={this.state.masterId}
                                labelValue={"Master"}
                                valueFieldName={"masterid"}
                                onChange={this.setMasterId}
                                renderOptions={this.renderMasters}
                                descriptionFieldName={"description"}
                                lookupIdFieldName={"id"}
                                form={this.props.form}
                                disabled={this.state.hierarchyTypeId != componentHierarchyType}
                            />

                            {/* <Col {...colLayout}>
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
                            </Col> */}
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