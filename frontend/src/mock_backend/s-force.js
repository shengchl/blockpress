// Mock responses for SF ajax actions
window['sforce'] = {};
window['sforce'].SObject = function(sfObjectType) {
  return {};
}

window['sforce'].apex = {};
window['sforce'].apex.execute = function(actionType, subActionType, params) {
  return `Successful mock action response ${actionType} ${subActionType}`;
};

window['sforce'].connection = {};