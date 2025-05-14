export function resModel(status, msg, data) {
  return {
    success: status,
    message: msg,
    data: data,
  };
}


