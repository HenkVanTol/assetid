import React, { PureComponent } from 'react';
import { Col, Input, Form } from 'antd';
const FormItem = Form.Item;

class FormItemTextInput extends PureComponent {
    render() {
        let {
            colLayout,
            readOnly,
            edit,
            formItemLayout,
            labelValue,
            valueFieldName,
            required,
            requiredMessage,
            onChange,
            stringValue,
            form,
            type
        } = this.props;
        if (!type) {
            type = "text";
        }
        console.log("stringValue: ", stringValue);
        return (
            <Col {...colLayout}>
                {(edit && readOnly) ?
                    <FormItem label={labelValue} {...formItemLayout}>
                        <label>{stringValue}</label>
                    </FormItem> :
                    <FormItem label={labelValue} {...formItemLayout}>
                        {
                            form.getFieldDecorator(valueFieldName, {
                                initialValue: stringValue,
                                valuePropName: 'value',
                                rules: [{
                                    required: required,
                                    message: requiredMessage,
                                }],
                            })(
                                <Input onChange={(value) => onChange(value)} type={type} />
                            )
                        }
                    </FormItem>
                }
            </Col>
        );
    }
}

export default FormItemTextInput;