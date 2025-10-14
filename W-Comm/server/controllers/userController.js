// import User from '../models/userSchema.js';
// import jwt from 'jsonwebtoken';


// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '30d'
//     });
// };

// export const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !password || !email) {
//         return res.status(400).json({ message: "Name, email, and password are required" });
//     }

//     try {
//         const userExists = await User.findOne({ email });

//         if (userExists) {
//             return res.status(400).json({ message: 'User with this email already exists' })
//         }

//         const user = await User.create({
//             name,
//             email,
//             password,
//         }) 

//         if (user) {
//             res.status(201).json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 token: generateToken(user._id), 
//             });
//         } else {
//             res.status(400).json({ message: 'Invalid user data' });
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// export const loginuser = async (req, res) => {
//     const { email, password  } = req.body;


//     if (!email || !password ) {
//         return res.status(400).json({ message: "Email and password are required" });
//     }

//     try {
//         const user = await User.findOne({ email });

       
//         if (user && (await user.matchPassword(password))) {
//             res.status(200).json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 token: generateToken(user._id),
//             });
//         } else {
//             res.status(401).json({ message: 'Invalid email or password' });
//         }
//     } catch (error) {
       
//         res.status(500).json({ message: error.message })
//     }
// }



import User from '../models/userSchema.js'; // Your schema file
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const registerUser = async (req, res) => {
    // 1. Reads all the data your frontend is sending
    const { name, email, password, role, sellerInfo } = req.body;

    // 2. Validates the required fields
    if (!name || !password || !email || !role) {
        return res.status(400).json({ message: "Name, email, password, and role are required" });
    }
    if (role === 'seller' && (!sellerInfo || !sellerInfo.shopName || !sellerInfo.gstNumber)) {
        return res.status(400).json({ message: "Sellers must provide a shop name and GST number." });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' })
        }

        // 3. Creates a new user with all the correct fields for your schema
        const user = await User.create({
            name,
            email,
            password,
            role,
            sellerInfo: role === 'seller' ? sellerInfo : undefined,
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const loginuser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Returns the role, which is useful
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}