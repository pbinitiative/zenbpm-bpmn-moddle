/**
 * validate-xsd.js
 *
 * Validates test/example.bpmn against xsd/zenbpm.xsd using xsd-schema-validator.
 * Run with:  node test/validate-xsd.js
 */

'use strict';

const validator = require('xsd-schema-validator');
const path      = require('path');

const xsdPath  = path.resolve(__dirname, '../xsd/bpmn-with-zenbpm.xsd');
const bpmnPath = path.resolve(__dirname, 'example.bpmn');

validator.validateXML({ file: bpmnPath }, xsdPath)
  .then(function(result) {
    console.log('XSD validation PASSED');
    if (result.messages && result.messages.length) {
      console.log('Warnings:', result.messages);
    }
  })
  .catch(function(err) {
    console.error('XSD validation FAILED:');
    console.error(err.message);
    process.exit(1);
  });
