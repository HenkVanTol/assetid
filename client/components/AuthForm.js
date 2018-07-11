import React, { Component } from 'react';
import { Button, Input, Row, Col, Form, Icon } from 'antd';
const FormItem = Form.Item;
import { BarLoader } from 'react-spinners';

class AuthForm extends Component {
    constructor(props) {
        super(props);

        this.state = { email: '', password: '' };
        this.labelBefore = (
            <label style={{ width: '100px' }}>Email: </label>
        )
    }
    onSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;
        // this.props.onSubmit(this.state); //state looks exactly like required params
        this.props.onSubmit({ email, password });
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
            <Form onSubmit={this.onSubmit.bind(this)}>
                <Row>
                    <Col {...colLayout}>
                        <FormItem label="Email" {...formItemLayout}>
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                                value={this.state.email}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLayout}>
                        <FormItem label="Password" {...formItemLayout}>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Password"
                                type="password"
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLayout}>
                        {/* <Col {...colLayout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
                        <FormItem label=" " colon={false} {...formItemLayout}>
                            <Button type="primary" size="large" htmlType="submit">Submit</Button>
                        </FormItem>
                    </Col>
                </Row>
                {/* <Row>
                    <Button type="primary" style={{ width: '100%' }} size="large" htmlType="submit" >Submit</Button>
                </Row> */}
                <Row>
                    <div>
                        <div className='sweet-loading center-div-horizontal' >
                            <BarLoader
                                size={800}
                                color={'red'}
                                loading={this.props.loading}
                            />
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="errors">
                        {this.props.errors.map(error => <div key={error}>{error}</div>)}
                    </div>
                </Row>
            </Form>
        );
    }
}

export default AuthForm;