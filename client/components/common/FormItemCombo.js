import React, { Component } from 'react';
import { Col, Form, Select } from 'antd';
const FormItem = Form.Item;

class FormItemCombo extends Component {
    render() {
        let {
            colLayout,
            readOnly,
            edit,
            options,
            formItemLayout,
            idValue,
            labelValue,
            valueFieldName,
            required,
            requiredMessage,
            onChange,
            renderOptions,
            descriptionFieldName,
            form
        } = this.props;
        return (
            <Col {...colLayout}>
                {(edit && readOnly && options.length > 0) ?
                    <FormItem label={labelValue} {...formItemLayout}>
                        <label>{options.filter(e => e.id == idValue)[0][descriptionFieldName]}</label>
                    </FormItem> :
                    <FormItem label={labelValue} {...formItemLayout}>
                        {
                            form.getFieldDecorator(valueFieldName, {
                                initialValue: idValue,
                                valuePropName: "value",
                                rules: [{
                                    required: required,
                                    message: requiredMessage,
                                }],
                            })(
                                <Select onChange={(value) => onChange(value)} >
                                    {renderOptions()}
                                </Select>
                            )
                        }
                    </FormItem>
                }
            </Col>
        );
    }
}

export default FormItemCombo;