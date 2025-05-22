class UserView {
  constructor() {
    this.version = "1.0.0"; 
  }

  render(data, message = "Success", code = 200) {
    const finalMessage = data?.message || message;

    return {
      code,
      version_apps: this.version,
      date_created: new Date().toISOString(),
      message: finalMessage,
      data
    };
  }

  renderDetail(user, message = "Success", code = 200) {
  
    if (user && user.password) {
      user = { ...user.toJSON() }; 
      delete user.password;
    }
    return this.render(user, message, code);
  }

  renderError(message = "Error", code = 500, data = null) {
    const finalMessage = data?.message || message;

    return {
      code,
      version_apps: this.version,
      date_created: new Date().toISOString(),
      message: finalMessage,
      data
    };
  }

  renderDeleteResponse(status, message, data = null) {
    return {
      status,
      message,
      data
    };
  }
}

module.exports = new UserView();
