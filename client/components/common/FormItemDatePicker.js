import React, { Component } from 'react';
import { Row, Col, DatePicker, Form } from 'antd';
const FormItem = Form.Item;

class FormItemDatePicker extends Component {
    render() {
        let {
            colLayout,
            readOnly,
            edit,
            formItemLayout,
            dateValue,
            labelValue,
            valueFieldName,
            required,
            requiredMessage,
            onChange,
            form
        } = this.props;
        return (
            <Col {...colLayout}>
                {(edit && readOnly) ?
                    <FormItem label={labelValue} {...formItemLayout}>
                        <label>{dateValue.format("DD/MM/YYYY")}</label>
                    </FormItem> :
                    <FormItem label={labelValue} {...formItemLayout}>
                        {
                            form.getFieldDecorator(valueFieldName, {
                                initialValue: dateValue,
                                valuePropName: 'value',
                                rules: [{
                                    required: required,
                                    message: requiredMessage,
                                }],
                            })(
                                <DatePicker style={{ width: '100%' }} onChange={(value) => onChange(value)} />
                            )
                        }
                    </FormItem>
                }
            </Col>
        );
    }
}

export default FormItemDatePicker;