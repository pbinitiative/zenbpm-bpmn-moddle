'use strict';

/**
 * test/spec/moddle.spec.js
 *
 * Tests that the zenbpm moddle descriptor can create every element type
 * and that the namespace URI and prefix are correct.
 */

const { expect }  = require('chai');
const { BpmnModdle } = require('bpmn-moddle');
const zenbpmModdle = require('../../resources/zenbpm.json');

const NAMESPACE = 'http://zenbpm.pbinitiative.org/1.0';
const PREFIX    = 'zenbpm';

describe('zenbpm moddle descriptor', function() {

  let moddle;

  before(function() {
    moddle = new BpmnModdle({ zenbpm: zenbpmModdle });
  });

  // ── Meta ──────────────────────────────────────────────────────
  describe('namespace', function() {
    it('has correct URI', function() {
      expect(zenbpmModdle.uri).to.equal(NAMESPACE);
    });
    it('has correct prefix', function() {
      expect(zenbpmModdle.prefix).to.equal(PREFIX);
    });
  });

  // ── TaskDefinition ────────────────────────────────────────────
  describe('zenbpm:TaskDefinition', function() {
    it('creates with type and retries', function() {
      const td = moddle.create('zenbpm:TaskDefinition', {
        type:    'payment-worker',
        retries: '3'
      });
      expect(td.type).to.equal('payment-worker');
      expect(td.retries).to.equal('3');
    });
  });

  // ── IoMapping ─────────────────────────────────────────────────
  describe('zenbpm:IoMapping', function() {
    it('creates with inputs and outputs', function() {
      const input  = moddle.create('zenbpm:Input',  { source: '=orderId', target: 'id' });
      const output = moddle.create('zenbpm:Output', { source: '=result',  target: 'res' });
      const io     = moddle.create('zenbpm:IoMapping', {
        inputParameters:  [input],
        outputParameters: [output]
      });
      expect(io.inputParameters).to.have.length(1);
      expect(io.outputParameters).to.have.length(1);
      expect(io.inputParameters[0].source).to.equal('=orderId');
    });
  });

  // ── TaskHeaders ───────────────────────────────────────────────
  describe('zenbpm:TaskHeaders', function() {
    it('creates with header values', function() {
      const hdr = moddle.create('zenbpm:Header', { key: 'env', value: 'prod' });
      const th  = moddle.create('zenbpm:TaskHeaders', { values: [hdr] });
      expect(th.values[0].key).to.equal('env');
    });
  });

  // ── Subscription ──────────────────────────────────────────────
  describe('zenbpm:Subscription', function() {
    it('creates with correlationKey', function() {
      const sub = moddle.create('zenbpm:Subscription', { correlationKey: '=orderId' });
      expect(sub.correlationKey).to.equal('=orderId');
    });
  });

  // ── LoopCharacteristics ───────────────────────────────────────
  describe('zenbpm:LoopCharacteristics', function() {
    it('creates with collection expressions', function() {
      const lc = moddle.create('zenbpm:LoopCharacteristics', {
        inputCollection:  '=items',
        inputElement:     'item',
        outputCollection: 'results',
        outputElement:    'result'
      });
      expect(lc.inputCollection).to.equal('=items');
      expect(lc.outputElement).to.equal('result');
    });
  });

  // ── CalledElement ─────────────────────────────────────────────
  describe('zenbpm:CalledElement', function() {
    it('creates with processId and propagation flags', function() {
      const ce = moddle.create('zenbpm:CalledElement', {
        processId:                   'sub-process',
        propagateAllChildVariables:  true,
        propagateAllParentVariables: true
      });
      expect(ce.processId).to.equal('sub-process');
      expect(ce.propagateAllChildVariables).to.be.true;
    });
  });

  // ── CalledDecision ────────────────────────────────────────────
  describe('zenbpm:CalledDecision', function() {
    it('creates with decisionId and resultVariable', function() {
      const cd = moddle.create('zenbpm:CalledDecision', {
        decisionId:     'discount-rules',
        resultVariable: 'discount'
      });
      expect(cd.decisionId).to.equal('discount-rules');
    });
  });

  // ── Script ────────────────────────────────────────────────────
  describe('zenbpm:Script', function() {
    it('creates with expression and resultVariable', function() {
      const s = moddle.create('zenbpm:Script', {
        expression:     '=price * 0.9',
        resultVariable: 'finalPrice'
      });
      expect(s.expression).to.equal('=price * 0.9');
    });
  });

  // ── AssignmentDefinition ──────────────────────────────────────
  describe('zenbpm:AssignmentDefinition', function() {
    it('creates with assignee and candidates', function() {
      const ad = moddle.create('zenbpm:AssignmentDefinition', {
        assignee:        '=currentUser',
        candidateGroups: 'approvers',
        candidateUsers:  'alice,bob'
      });
      expect(ad.assignee).to.equal('=currentUser');
      expect(ad.candidateGroups).to.equal('approvers');
    });
  });

  // ── PriorityDefinition ────────────────────────────────────────
  describe('zenbpm:PriorityDefinition', function() {
    it('creates with priority', function() {
      const pd = moddle.create('zenbpm:PriorityDefinition', { priority: '80' });
      expect(pd.priority).to.equal('80');
    });
  });

  // ── TaskSchedule ──────────────────────────────────────────────
  describe('zenbpm:TaskSchedule', function() {
    it('creates with dueDate and followUpDate', function() {
      const ts = moddle.create('zenbpm:TaskSchedule', {
        dueDate:      '2026-06-01T00:00:00Z',
        followUpDate: '2026-05-25T00:00:00Z'
      });
      expect(ts.dueDate).to.equal('2026-06-01T00:00:00Z');
    });
  });

  // ── FormDefinition ────────────────────────────────────────────
  describe('zenbpm:FormDefinition', function() {
    it('creates with formKey', function() {
      const fd = moddle.create('zenbpm:FormDefinition', { formKey: 'camunda-forms:Form_abc' });
      expect(fd.formKey).to.equal('camunda-forms:Form_abc');
    });
    it('creates with formId', function() {
      const fd = moddle.create('zenbpm:FormDefinition', { formId: 'Form_orderDetails' });
      expect(fd.formId).to.equal('Form_orderDetails');
    });
  });

  // ── UserTaskForm ──────────────────────────────────────────────
  describe('zenbpm:UserTaskForm', function() {
    it('creates with id and body', function() {
      const utf = moddle.create('zenbpm:UserTaskForm', {
        id:   'Form_1',
        body: '{"components":[]}'
      });
      expect(utf.id).to.equal('Form_1');
      expect(utf.body).to.include('components');
    });
  });

  // ── Properties ────────────────────────────────────────────────
  describe('zenbpm:Properties', function() {
    it('creates with name/value pairs', function() {
      const p1 = moddle.create('zenbpm:Property', { name: 'team', value: 'payments' });
      const ps = moddle.create('zenbpm:Properties', { properties: [p1] });
      expect(ps.properties[0].name).to.equal('team');
    });
  });

  // ── ExecutionListeners ────────────────────────────────────────
  describe('zenbpm:ExecutionListeners', function() {
    it('creates with listener entries', function() {
      const listener = moddle.create('zenbpm:ExecutionListener', {
        eventType: 'start',
        type:      'audit-worker',
        retries:   '3'
      });
      const els = moddle.create('zenbpm:ExecutionListeners', { listeners: [listener] });
      expect(els.listeners[0].type).to.equal('audit-worker');
    });
  });

  // ── TaskListeners ─────────────────────────────────────────────
  describe('zenbpm:TaskListeners', function() {
    it('creates with task listener entries', function() {
      const tl = moddle.create('zenbpm:TaskListener', {
        eventType: 'assignment',
        type:      'notifier',
        retries:   '1'
      });
      const tls = moddle.create('zenbpm:TaskListeners', { listeners: [tl] });
      expect(tls.listeners[0].eventType).to.equal('assignment');
    });
  });

  // ── VersionTag ────────────────────────────────────────────────
  describe('zenbpm:VersionTag', function() {
    it('creates with value', function() {
      const vt = moddle.create('zenbpm:VersionTag', { value: '1.2.0' });
      expect(vt.value).to.equal('1.2.0');
    });
  });

  // ── AdHoc ─────────────────────────────────────────────────────
  describe('zenbpm:AdHoc', function() {
    it('creates with collection expressions', function() {
      const ah = moddle.create('zenbpm:AdHoc', {
        activeElementsCollection: '=elements',
        outputCollection:         'results',
        outputElement:            'result'
      });
      expect(ah.activeElementsCollection).to.equal('=elements');
    });
  });

  // ── ZenForm ───────────────────────────────────────────────────
  describe('zenbpm:ZenForm', function() {
    it('creates with formId', function() {
      const zf = moddle.create('zenbpm:ZenForm', {
        formId: 'Form_myCustomZenForm'
      });
      expect(zf.formId).to.equal('Form_myCustomZenForm');
    });
  });

  // ── ConditionalFilter ─────────────────────────────────────────
  describe('zenbpm:ConditionalFilter', function() {
    it('creates with variableNames and variableEvents', function() {
      const cf = moddle.create('zenbpm:ConditionalFilter', {
        variableNames:  'orderId,status',
        variableEvents: 'create,update'
      });
      expect(cf.variableNames).to.equal('orderId,status');
    });
  });

});
