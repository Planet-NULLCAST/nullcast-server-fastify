import addFormats from 'ajv-formats'
import Ajv from 'ajv'

const ajv = addFormats(new Ajv(), [
    'date-time', 
    'time', 
    'date', 
    'email',  
    'hostname', 
    'ipv4', 
    'ipv6', 
    'uri', 
    'uri-reference', 
    'uuid',
    'uri-template', 
    'json-pointer', 
    'relative-json-pointer', 
    'regex',
    'password'
]).addKeyword('kind')
  .addKeyword('modifier');

  export default ajv;
