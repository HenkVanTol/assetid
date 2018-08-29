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
            form
        } = this.props;
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
                                <Input onChange={(value) => onChange(value)} />
                            )
                        }
                    </FormItem>
                }
            </Col>
        );
    }
}

export default FormItemTextInput;