import React, { PureComponent } from 'react';
import { Col, Form, Select } from 'antd';
const FormItem = Form.Item;

class FormItemCombo extends PureComponent {
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
            lookupIdFieldName,
            form,
            disabled
        } = this.props;
        console.log("IDVALUE: ", idValue);
        return (
            <Col {...colLayout}>
                {(edit && readOnly && options.length > 0 && !disabled)
                    ?
                    (idValue > 0)
                        ?
                        <FormItem label={labelValue} {...formItemLayout}>
                            <label>{options.filter(e => e[lookupIdFieldName] == idValue)[0][descriptionFieldName]}</label>
                        </FormItem>
                        :
                        <FormItem label={labelValue} {...formItemLayout}></FormItem>
                    :
                    (!readOnly)
                        ?
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
                                    <Select disabled={disabled} onChange={(value) => onChange(value)} >
                                        {renderOptions()}
                                    </Select>
                                )
                            }
                        </FormItem>
                        :
                        <FormItem label={labelValue} {...formItemLayout}></FormItem>
                }
            </Col>
        );
    }
}

export default FormItemCombo;