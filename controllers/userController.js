const userViewModel = require("../viewmodel/userViewModel");
const userView = require("../view/userView");

class UserController {

   async registerUser(req, res) {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json(
        userView.renderError("All fields (name, email, phone, password) are required.", 400)
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(
        userView.renderError("Invalid email format.", 400)
      );
    }

    const phoneRegex = /^\d{9,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json(
        userView.renderError("Phone must contain only digits and be at least 9 digits long.", 400)
      );
    }

    if (password.length < 8) {
      return res.status(400).json(
        userView.renderError("Password must be at least 8 characters long.", 400)
      );
    }

    try {
      const user = await userViewModel.registerUser({ name, email, phone, password });
      return res.status(201).json(
        userView.renderDetail(user, "User successfully registered", 201)
      );

    } catch (error) {
      if (error.message.includes('already exists') || error.original?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json(
          userView.renderError("Email or phone already registered.", 409)
        );
      }
      return res.status(500).json(
        userView.renderError(error.toString(), 500)
      );
    }
  }

  async loginUser(req, res) {

    const { login, password } = req.body;

    if (!login|| !password) {
      return res.status(400).send("All fields are required");
    }

    try {
      const user = await userViewModel.loginUsers({login, password});
      res.send(userView.renderDetail(user));

    } catch (error) {
      res.status(500).send(error.toString());
    }
  }

}

module.exports = new UserController();
