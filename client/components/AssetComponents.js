import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import query from '../queries/AssetMaster';
import deleteAsset from '../mutations/DeleteAsset';
import { Form, Row, Col, Input, Button, Table } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router';
import moment from 'moment';
import swal from 'sweetalert2';
import findByMasterId from '../queries/AssetMasterByMasterId';
import findByHierarchyTypeId from '../queries/AssetMasterByHierarchyTypeId';
import findByIdNameOnly from '../queries/AssetMasterByIdNameOnly';
import setComponentMaster from '../mutations/SetComponentMaster';
import clearComponents from '../mutations/ClearComponents';
import toastr from 'toastr';
import { BarLoader, RingLoader } from 'react-spinners';

const componentHierarchyType = 2;

let state = { name: null, description: null, hierarchyTypeId: null, errors: [], dataSource: [], selectedComponents: [], masterName: null, selectedRowKeys: [], mutationLoading: false };

class AssetComponents extends Component {

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
    }
    componentDidMount() {
        console.log("AssetComponents masterId: ", this.props.masterId);
        // this.props.client.query({
        //     query: findByMasterId,
        //     variables: {
        //         masterId: this.props.masterId
        //     }
        // }).then((result) => {
        //     console.log("AssetComponents masterId: ", this.props.masterId);
        //     console.log("AssetComponents Result: ", result);
        //     this.setState({ dataSource: result.data.assetMasterByMasterId });
        //     // let previouslySelected = result.data.assetMasterByMasterId.filter((asset) => {
        //     //     return asset.masterId == this.props.params.id;
        //     // }).map((el) => { return el.id });
        //     //this.setState({ selectedComponents: previouslySelected });
        //     //this.setState({ selectedRowKeys: previouslySelected });
        //     console.log("PREVIOUSLY SELECTED: ", this.state.selectedRowKeys);
        // });
        this.setState(prevState => ({
            //selectedComponents: prevState.selectedComponents
            selectedRowKeys: prevState.selectedRowKeys
        }));
    }
    componentWillUnmount() {
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


        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        // if (this.props.data.loading) {
        //     return (
        //         <div className='center-div'>
        //             <div className='sweet-loading' >
        //                 <RingLoader
        //                     size={120}
        //                     color={'red'}
        //                     loading={this.props.data.loading}
        //                 />
        //             </div>
        //         </div>
        //     )
        // }
        // else {
        return (
            <div>
                <Row>
                    <Col>
                        <Table pagination={{ pageSize: 10 }}
                            rowSelection={rowSelection}
                            dataSource={this.props.components}
                            columns={this.columns}
                            rowKey={record => record.id} />
                    </Col>
                </Row>
                <Row>
                    <div className="errors">
                        {this.state.errors.map(error => <div key={error}>{error}</div>)}
                    </div>
                </Row>
            </div>
        );
        // }
    }
}

export default withApollo(AssetComponents);