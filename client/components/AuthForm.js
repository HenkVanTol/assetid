import React, { Component } from 'react';
import { Button, Input, Row, Col, Form, Icon } from 'antd';
const FormItem = Form.Item;

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
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <Form onSubmit={this.onSubmit.bind(this)}>
                            <FormItem>
                                <label>Email: </label>
                                <Input
                                    addonBefore={"Email: "}
                                    // prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={e => this.setState({ email: e.target.value })}
                                />
                            </FormItem>
                            <FormItem>
                                <Input
                                    addonBefore={"Password: "}
                                    // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Password"
                                    type="password"
                                    value={this.state.password}
                                    onChange={e => this.setState({ password: e.target.value })}
                                />
                            </FormItem>
                            <Button type="primary" style={{ width: '100%' }} size="large" htmlType="submit" >Submit</Button>
                            <div className="errors">
                                {this.props.errors.map(error => <div key={error}>{error}</div>)}
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default AuthForm;