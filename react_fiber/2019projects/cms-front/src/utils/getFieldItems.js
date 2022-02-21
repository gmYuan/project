import {Form} from 'antd';
const FormItem = Form.Item;
let formItemLayout = {
   labelCol:{span:4},wrapperCol:{span:20}
}
function getFieldItems(getFieldDecorator,fields){
    //{label,name,rules,input}
   return fields.filter(filed=>filed.visible).map((field,index)=>{
       let layout = field.layout?field.layout:formItemLayout;
       field.extra = field.extra||{};
       field.rules = field.rules||[];
       return (
           <FormItem key={index} label={field.label} {...layout}>
            {
                        getFieldDecorator(field.name,{
                            rules:[{required:field.required,message:`${field.label}必须输入`},...field.rules],
                            ...field.extra
                        })(field.input)
                      }
           </FormItem>
       )
   });
}
export default getFieldItems;