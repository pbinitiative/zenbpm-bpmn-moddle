# zenbpm-bpmn-moddle

Custom BPMN 2.0 extension namespace — **`zenbpm`** — derived from the
[Zeebe](https://github.com/camunda/zeebe-bpmn-moddle) extension schema and fully
re-namespaced as a standalone public specification.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Namespace

| Property | Value |
|---|---|
| **Prefix** | `zenbpm` |
| **URI** | `http://zenbpm.pbinitiative.org/1.0` |
| **XSD** | `xsd/zenbpm.xsd` |
| **Moddle descriptor** | `resources/zenbpm.json` |

---

## Quick Start

### 1. Declare the namespace in your BPMN file

```xml
<bpmn:definitions
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:zenbpm="http://zenbpm.pbinitiative.org/1.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://zenbpm.pbinitiative.org/1.0
                      https://zenbpm.pbinitiative.org/1.0/zenbpm.xsd"
  targetNamespace="http://zenbpm.pbinitiative.org"
  id="Definitions_1">
  ...
</bpmn:definitions>
```

### 2. Use extension elements inside BPMN tasks

```xml
<bpmn:serviceTask id="Task_pay" name="Process Payment">
  <bpmn:extensionElements>
    <zenbpm:taskDefinition type="payment-worker" retries="3"/>
    <zenbpm:ioMapping>
      <zenbpm:input  source="=orderId" target="id"/>
      <zenbpm:output source="=result"  target="paymentResult"/>
    </zenbpm:ioMapping>
  </bpmn:extensionElements>
</bpmn:serviceTask>
```

---

## Extension Elements Reference

| Element | Allowed in | Purpose |
|---|---|---|
| `zenbpm:taskDefinition` | Service/Script/Business-rule/Send/User tasks, End/Intermediate events, AdHocSubProcess | Job type; retry count on worker tasks |
| `zenbpm:ioMapping` | Service tasks, Call activities, Receive tasks, SubProcesses, UserTasks, Events | Input/output variable mapping |
| `zenbpm:in` | Call activities, SubProcesses | Child business-key inheritance, clearing, or FEEL evaluation |
| `zenbpm:taskHeaders` | Service tasks, UserTask, Execution listeners | Static key/value headers for the job worker |
| `zenbpm:subscription` | Receive tasks, Message events | Correlation key for message subscriptions |
| `zenbpm:loopCharacteristics` | `bpmn:MultiInstanceLoopCharacteristics` | Collection expressions for multi-instance loops |
| `zenbpm:calledElement` | `bpmn:CallActivity` | Target process ID and binding type |
| `zenbpm:calledDecision` | `bpmn:BusinessRuleTask` | DMN decision ID, result variable, binding type |
| `zenbpm:script` | `bpmn:ScriptTask` | Inline FEEL expression + result variable |
| `zenbpm:userTask` | `bpmn:UserTask` | Marker for engine-managed user-task lifecycle |
| `zenbpm:formDefinition` | `bpmn:UserTask` | Form key / form ID / external form reference |
| `zenbpm:userTaskForm` | `bpmn:Process` | Embedded form JSON body |
| `zenbpm:assignmentDefinition` | `bpmn:UserTask` | Assignee, candidate groups/users |
| `zenbpm:priorityDefinition` | `bpmn:UserTask` | Task priority (0–100) |
| `zenbpm:taskSchedule` | `bpmn:UserTask` | Due date + follow-up date |
| `zenbpm:taskListeners` | `bpmn:UserTask` | Task-lifecycle listener declarations |
| `zenbpm:executionListeners` | Events, Activities, Process, Gateways | Flow-execution listener declarations |
| `zenbpm:properties` | Any element | Arbitrary key/value metadata |
| `zenbpm:versionTag` | `bpmn:Process` | Human-readable process version tag |
| `zenbpm:linkedResources` | `bpmn:ServiceTask` | External resource references (OpenAPI, etc.) |
| `zenbpm:adHoc` | `bpmn:AdHocSubProcess` | Active-elements collection + output collection |
| `zenbpm:conditionalFilter` | `bpmn:ConditionalEventDefinition` | Variable-name / event-type filter |
| `zenbpm:zenForm` | `bpmn:UserTask` | ZenBPM-native form reference by `formId` |

### Business-key syntax (`zenbpm:in`)

| `businessKey` form | Runtime meaning |
|---|---|
| Attribute omitted (`<zenbpm:in/>`) | Inherit the parent business key |
| Empty (`businessKey=""`) | Clear the child business key |
| Non-empty, starts with `=` | Evaluate as FEEL; the expression must be valid and return a string, for example `=processBusinessKey` |
| Any other non-empty value | Create an engine incident because the required `=` prefix is missing |

FEEL is the only supported non-empty syntax. An invalid FEEL expression, a FEEL
evaluation error, or a result that is nil/undefined or not a string creates an
engine incident. The moddle stores and serializes the optional string unchanged.
The XSD permits an unrestricted optional string and intentionally does not enforce
runtime FEEL rules, so the engine can create incidents.

A static key is also a FEEL string expression. Escape its quotes inside the XML
attribute:

```xml
<bpmn:extensionElements>
  <zenbpm:in businessKey="=&quot;fixed-key&quot;"/>
</bpmn:extensionElements>
```

---

## Modeler Attribute Injectors

These are **abstract types** — they do not appear as child elements inside `<bpmn:extensionElements>` but instead inject XML attributes directly onto standard BPMN elements. They are primarily used by BPMN modelers to track element templates.

### `TemplateSupported`

Injects modeler-template tracking attributes onto:
`bpmn:Collaboration`, `bpmn:Process`, `bpmn:FlowElement` (and all its subtypes — tasks, events, gateways, etc.)

| Attribute | Type | Purpose |
|---|---|---|
| `zenbpm:modelerTemplate` | `String` | ID of the element template applied by the modeler |
| `zenbpm:modelerTemplateVersion` | `Integer` | Version of the applied template |
| `zenbpm:modelerTemplateIcon` | `String` | Icon override for the element in the modeler |

**Example:**
```xml
<bpmn:serviceTask id="Task_1" zenbpm:modelerTemplate="my-template" zenbpm:modelerTemplateVersion="3" />
```

### `TemplatedRootElement`

Injects a modeler-template reference onto root-level BPMN elements:
`bpmn:Error`, `bpmn:Escalation`, `bpmn:Message`, `bpmn:Signal`

| Attribute | Type | Purpose |
|---|---|---|
| `zenbpm:modelerTemplate` | `String` | ID of the element template that created this root element |

**Example:**
```xml
<bpmn:message id="Msg_1" name="OrderReceived" zenbpm:modelerTemplate="order-template" />
```

---

## File Layout

```
zenbpm-bpmn-moddle/
├── resources/
│   └── zenbpm.json          ← moddle descriptor (register with bpmn-moddle)
├── xsd/
│   └── zenbpm.xsd           ← XSD — authoritative XML schema for validators/IDEs
├── test/
│   ├── example.bpmn        ← example BPMN using every extension element
│   ├── validate-xsd.js     ← XSD validation test runner
│   └── spec/
│       └── moddle.spec.js  ← Mocha unit tests for the moddle descriptor
├── package.json
└── README.md
```
---

## Building & Testing

```bash
npm install
npm test          # mocha unit tests
npm run validate-xsd   # XSD validation of example.bpmn
npm run all       # lint + test
```

---

## License

[MIT](LICENSE)
