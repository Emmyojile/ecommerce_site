// const {StatusCodes} = require('http-status-codes')
// const Customer = require('../models/customers')
// const jwt = require('jsonwebtoken')
// const nodemailer = require('nodemailer')

function generateVerificationCode() {
     const code = Math.floor(Math.random() * 1000000);
     return code.toString().padStart(6, '0');
   }

// exports.register = async (req,res) => {
//      try {
//           const {username, email, password, confirmPassword} = req.body
//           const verificationCode = generateVerificationCode() 
//           if (!(username || email || password || confirmPassword)) {
//                return res.status(StatusCodes.BAD_REQUEST).render({msg:`Please provide all the required information`})               
//           }

//           const user = await Customer.findOne({email})
//           if (user) {
//                return res.status(StatusCodes.BAD_REQUEST).render('register', {msg:`${req.body.email} already exists`})
//           }

//           const newUser = await {
//                username,
//                email,
//                password,
//                confirmPassword,
//                verificationCode,
//                isVerified: false
//           };
          
//           //Email Verfication
//           const transporter = nodemailer.createTransport({
//                service : 'Gmail',
//                auth : {
//                     user : process.env.email,
//                     pass : process.env.emailPassword
//                }
//           });

//           const mailOptions = {
//                from : process.env.email,
//                to : email,
//                subject: 'Verify Your account',
//                html: `<p>Please click the following link to verify your account:</p>
//                <a href="http://localhost:8000/verify/${verificationCode}">Verify my account</a>`
//           };

//           transporter.sendMail(mailOptions, (error, info) => {
//                if (error) {
//                     console.log(error);
//                     res.status(500).json({message:'Unable to send verification mail.'});
//                } else{
//                     console.log('Email sent: ' + info.response);
//                }
//           })

//           const token = newUser.createjwt()
//           // REMEMBER TO SET THE SECURE TO TRUE ON DEPLOYMENT
//           res.cookie('token', token, {httpOnly: true, secure: false})
//           console.log(newUser);
//           return res.status(StatusCodes.CREATED).redirect('login', {msg:'Registration successful. Please check your email to verify your account.'})
//      } catch (error) {
//           console.log(error);
//           return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('register', {msg:error.msg})
//      }
// };



// --------verficationCode section-----------------------

// const nodemailer = require('nodemailer');
// const { StatusCodes } = require('http-status-codes');
// const Customer = require('../models/customers');

// exports.register = async (req, res) => {
//   try {
//     const { username, email, password, confirmPassword } = req.body;
//     if (!username || !email || !password || !confirmPassword) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .render('register', { msg: 'Please provide all the required information' });
//     }

//     // Check if user with this email already exists
//     const user = await Customer.findOne({ email });
//     if (user) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .render('register', { msg: 'Email already exists' });
//     }

//     // Generate a random verification code
//     const verificationCode = Math.floor(Math.random() * 900000) + 100000;

//     // Create a new user with the provided information and verification code
//     const newUser = new Customer({
//       username,
//       email,
//       password,
//       verificationCode,
//       isVerified: false
//     });

//     // Save the new user to the database
//     await newUser.save();

//     // Send a verification email to the user's email address
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Please verify your email address',
//       text: `Hi ${username},\n\nPlease enter the following verification code to confirm your email address:\n\n${verificationCode}\n\nThank you!`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//         return res
//           .status(StatusCodes.INTERNAL_SERVER_ERROR)
//           .render('register', { msg: 'Failed to send verification email' });
//       } else {
//         console.log('Verification email sent: ' + info.response);
//         return res
//           .status(StatusCodes.OK)
//           .render('verify', { email: email });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .render('register', { msg: 'Failed to register new user' });
//   }
// };






const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const { StatusCodes } = require('http-status-codes');
const Customer = require('../models/customers');

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .render('register', { msg: 'Please provide all the required information' });
    }

    // Check if user with this email already exists
    const user = await Customer.findOne({ email });
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .render('register', { msg: 'Email already exists' });
    }

    // Generate a random verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a new user with the provided information and verification token
    const newUser = new Customer({
      username,
      email,
      password,
      verificationToken,
      isVerified: false
    });

    // Save the new user to the database
    await newUser.save();

    // Send a verification email to the user's email address
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const verificationLink = `http://localhost:8000/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Please verify your email address',
      text: `Hi ${username},\n\nPlease click the following link to verify your email address:\n\n${verificationLink}\n\nThank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .render('register', { msg: 'Failed to send verification email' });
      } else {
        console.log('Verification email sent: ' + info.response);
        return res
          .status(StatusCodes.OK)
          .render('verify', { email: email });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render('register', { msg: 'Failed to register new user' });
  }
};




exports.verify = async (req,res) => {
     const verficationCode = req.params.verificationCode;

     const user = await getUserByVerificationCode(verficationCode);

     if (!user) {
          return res.status(StatusCodes.BAD_REQUEST).render('register', {msg:`Invalid verification code`})
     }    else{
          updateUserVerificationStatus(user.id, true);

          res.json({msg:'Email verified successfully.'});
     }
     res.render('verify')

}

exports.login = async (req,res) => {
     try {
          const {email, password} = req.body

          const user = await Customer.findOne({email})
          if (!user) {
               return res.status(StatusCodes.BAD_REQUEST).render('login', {msg:`${req.body.email} does not exist in our database`})
          }

          const userExist = await user.comparePassword(password)

          if (!userExist) {
               console.log('Incorrect password')
               return res.status(StatusCodes.BAD_REQUEST).render('login', {msg:`You entered an Incorrect password`})
          }

          const token = user.createjwt()
          res.cookie('token', token, {httpOnly: true, secure:false})

          console.log('Successfully Logged in');
          return res.status(StatusCodes.OK).render('products')
     } catch (error) {
          console.log(error)
     }
}

exports.registerPage =  (req,res) => {
     res.render('register')
}

exports.loginPage = (req,res) => {
     res.render('login', {layout:"log"})
}

exports.productsPage = (req, res) => {
     res.render('products', {layout:"products"})
}