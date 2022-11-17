const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {UserInputError} = require('apollo-server')

const {validateRegisterInput,validateLoginInput} = require('../../utils/validators')
const User = require("../../models/User");

function generateTokn (user){
    const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return token;
}
module.exports = {
  Mutation: {
    async login(_, {username,password}){
        const {valid , errors} = validateLoginInput(username,password)
        if(!valid){
            throw new UserInputError('Errors',{errors})
        }
        const user = await User.findOne({username})
        if(!user){
            errors.general = "User Not Found";
            throw new UserInputError('User Fot Found',{errors})
        }
        const match = await bcrypt.compare(password,user.password)
        if(!match){
            errors.general = "Wrong Credentials";
            throw new UserInputError('Wrong Credentials',{errors})
        }
        const token = generateTokn (user);
        return {
            ...user._doc,
            id: user._id,
            token,
          };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
    // validate user data
    const {valid , errors} = validateRegisterInput(username, email, password, confirmPassword)
    if(!valid){
        throw new UserInputError('Errors',{errors})
    }
    // Make sure user doesn't already exists
    const user = await User.findOne({username })
    if(user){
        throw new UserInputError('Username is taken',{
            errors: {
                username : `This username ${username} is taken`
            }
        })
    }
      // Creating Password Hash started
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateTokn (res);
      // creating password hash ended
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
