// Visual Force labels
window.Visualforce = {
  remoting: {
    Manager: {
      invokeAction: undefined
    }
  }
};

// default all call to be successful
window.vfSuccess = true;

window.Visualforce.remoting.Manager.invokeAction = function actionInvoker() {
  var action = arguments[0];
  var callback;
  var payload = arguments[1];

  for (var index = 0; index < arguments.length; index++) {
    if (typeof(arguments[index]) == 'function'){
      callback = arguments[index];
      break;
    }
  }

  var res;
  var evt = {
    ref: false,
    status: true,
    statusCode: 200
  };

  if(!window.vfSuccess){
    res = {
      logs: [],
      payload: [],
      err: {
        message: `Error ${Math.round(Math.random() * 100)}`
      },
      payloadMap: {},
      success: false
    };
    evt = {
      action: "SPCommunityCustomer",
      method: "getMockFailure",
      status: true,
      statusCode: 200,
    }
  }

  if(action == '<VISUAL-FORCE-CLASS>') {
    res = {
      exceptionLogs:[],
      logs:[],
      payload:[],
      payloadMap:{
        records:{}
      },
      success: true
    };
  }

  setTimeout(function(){
    callback(res, evt);
  }, 100);
}