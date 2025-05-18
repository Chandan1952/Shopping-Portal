require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Razorpay = require("razorpay");
const crypto = require("crypto");


const app = express();

// ✅ CORS (Fix Frontend URL)
app.use(
  cors({
    origin: "https://shopping-portal-client.onrender.com", // Ensure correct frontend URL
    credentials: true, // Allow cookies/session sharing
  })
);

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ✅ Session Middleware (MongoDB Store)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: { secure: false },
  })
);

// const MONGO_URI = "mongodb+srv://chandan1952:Chandan%401596@cluster0.dnvhw.mongodb.net/shopping-portal?retryWrites=true&w=majority";
// mongoose.connect(MONGO_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));






// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));





//********************REGISTRATION-AND-FORGET-PASSWORD-PAGE************************


// Using Schema Value in form "Sign-up" Page
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    dob: String,
    address: String,
    country: String,
    city: String,
  })
);


// Route: Handle "Sign-Up" Form Submission
app.post("/submit", async function (req, res) {
  const { fullName, email, phone, password, confirmPassword } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword, // Store encrypted password
      dob: "",
      address: "",
      country: "",
      city: "",
    });

    await newUser.save();
    req.session.userId = newUser._id; // Save user session

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during registration. Please try again." });
  }
});



// Route to handle "Forgot-Password" form submissions
app.post('/forgot-password', async function (req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    // Instead of sending an email, redirect user to password reset form
    return res.json({ success: true, redirectUrl: `/reset-password?email=${email}` });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error processing password reset request.' });
  }
});


// Route to handle "Reset-Password" form submissions
app.post('/reset-password', async function (req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.json({ success: true, message: 'Password updated successfully. You can now log in.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating password.' });
  }
});


//***********************************************************************





//**************************USER-DASHBOARD-PAGE************************


// Route for handling "User-login" form submissions
app.post('/user-login', async function (req, res) {
  const { email, password } = req.body;

  try {
    // Input Validation
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    // Find user by email
    const foundUser = await User.findOne({ email });

    // If user not found
    if (!foundUser) {
      return res.status(400).json({ status: 'error', message: 'Email not found.' });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ status: 'error', message: 'Incorrect password.' });
    }

    // Successful login
    req.session.userId = foundUser._id; // Store user ID in session
    req.session.username = foundUser.fullName; // Store user ID in session
    req.session.userEmail = foundUser.email;

    // Send success response
    res.status(200).json({ status: 'success', message: 'Login successful', userId: foundUser._id, userEmail: foundUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'An error occurred. Please try again.' });
  }
});


// 🟢 Check if User is Logged In
app.get("/api/auth/check", (req, res) => {
  res.json({ isAuthenticated: !!req.session.userId });
});


// 🔹 GET USER DETAILS (Authenticated)
app.get("/api/user", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Unauthorized. Please log in." });

  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user details." });
  }
});


// 🔹 PUT USER UPDATED DETAILS (Authenticated)
app.put("/update-users/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
});



// Route for handling "User-Change-Password" form submissions
app.put("/api/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body; // Ensure field names match frontend
  const userId = req.session.userId; // Get logged-in user ID

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Route to "User Logout" Page
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    // Clear the session cookie
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});







//*********************ADMIN-DASHBOARD-PAGE************************

// Hardcoded admin credentials
let admins = [
  { email: "admin@gmail.com", password: bcrypt.hashSync("admin", 10) },
];


// **Admin Login (Stores in Session)**
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  const admin = admins.find(user => user.email === email);

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  req.session.adminEmail = email;
  return res.json({ message: "Login successful" });
});


// **Check Admin Session**
app.get("/admin-verify", (req, res) => {
  if (req.session.adminEmail) {
    return res.json({ isAdmin: true, email: req.session.adminEmail });
  }
  return res.status(401).json({ error: "Unauthorized" });
});


// **Check Admin Session**
app.get("/api/admin", (req, res) => {
  if (!req.session.adminEmail) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  res.json({ name: "Admin", email: req.session.adminEmail });
});


// **Middleware to Check Admin Session**
const isAuthenticated = (req, res, next) => {
  if (!req.session.adminEmail) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};



// **Admin Dashboard Statistics Route**
app.get("/admin-dashboard", isAuthenticated, async (req, res) => {
  try {
    const [ImageCount, BrandCount, ProductCount, CategoryCount] = await Promise.all([
      Image.countDocuments(),
      Brand.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
    ]);

    res.json({
      stats: {
        Image: ImageCount,
        Brand: BrandCount,
        Product: ProductCount,
        Category: CategoryCount,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error.message);
    res.status(500).json({ message: "Error fetching data" });
  }
});



// **Change Admin Password (Protected Route)**
app.put("/api/change-password", isAuthenticated, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = admins.find(user => user.email === req.session.adminEmail);

  if (!admin) {
    return res.status(404).json({ error: "Admin not found" });
  }

  // Check if old password is correct
  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  // Hash new password
  admin.password = await bcrypt.hash(newPassword, 10);
  return res.json({ message: "Password updated successfully" });
});



// **Admin Logout**
app.post("/admin-logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});







//*********************ADMIN-Manage-User-Profile************************


// Admin - Manage Users (Pagination)
app.get("/admin-manageprofile", isAuthenticated, async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid pagination values" });
    }

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ users, totalUsers, totalPages: Math.ceil(totalUsers / limit), currentPage: page });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get User by ID
app.get("/get-user/:id", isAuthenticated, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update User by ID
app.put("/update-user/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { email, name } = req.body;

    // Basic validation for email and name
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete User by ID (With Authentication)
app.delete("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

//*******************************************************************************












//************************IMAGE-MULTER-MIDDLEWARE*************************************************

// Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static images
app.use("/uploads", express.static(uploadDir));


//**********************************************************************************






//*******************************BANNER-PAGE***************************************************


// Banner Schema
const ImageSchema = new mongoose.Schema({
  url: String,
});
const Image = mongoose.model("Image", ImageSchema);



// Upload Image Route (Admin)
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const newImage = new Image({ url: imageUrl });
    await newImage.save();
    res.json({ message: "Image uploaded", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});


// Fetch Images for User Page
app.get("/carousel-images", async (req, res) => {
  const images = await Image.find();
  res.json({ images });
});


// Fetch All Images API-Admin
app.get("/carousel-images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
});

// Delete Image API-Admin
app.delete("/carousel-images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    fs.unlinkSync(image.path); // Delete image from filesystem
    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
});


//**********************************************************************************







//*********************************BRAND-PAGE*************************************************

// Define Mongoose Schema
const BrandSchema = new mongoose.Schema({
  category: { type: String, required: true },
  img: { type: String, required: true }, // Store image URL/path
});

const Brand = mongoose.model("Brand", BrandSchema);


// Get all brands
app.get("/api/brands", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brands" });
  }
});


// Upload brand image
app.post("/api/brands", upload.single("img"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const newBrand = new Brand({
      category: req.body.category,
      img: `/uploads/${req.file.filename}`, // Store image path
    });

    await newBrand.save();
    res.json(newBrand);
  } catch (error) {
    res.status(500).json({ message: "Error uploading brand image" });
  }
});


// Delete a brand by ID
app.delete("/api/brands/:id", async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting brand" });
  }
});


// Update a brand
app.put("/api/brands/:id", async (req, res) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ message: "Error updating brand" });
  }
});


//Upload Image API
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});



//**********************************************************************************





//********************************PRODUCT-PAGE**************************************************

// Define Product Schema & Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  discount: String,
  description: String,
  category: String,  // ✅ Added category field
  image: String, // Image path
});

const Product = mongoose.model("Product", productSchema);


// API: Add Product with Image Upload
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
      const { name, price, originalPrice, discount, description, category } = req.body; // ✅ Get category from request
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

      const newProduct = new Product({
          name,
          price,
          originalPrice,
          discount,
          description,
          category, // ✅ Save category in DB
          image: imageUrl,
      });

      await newProduct.save();
      res.json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
      res.status(500).json({ message: "Error saving product", error: error.message });
  }
});



// GET- Admin All Product
app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") }; // ✅ Case-insensitive filter
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});


// ✅ Get a single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
  } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// Update Product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, price, category, image , discount } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, image, discount },
      { new: true }
    );
    
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});


// Delete a product
app.delete("/api/products/:id", async (req, res) => {
  try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
  }
});

//*********************************************************************************************




//******************************CATEGORY-PAGE****************************************************

// Define Category Schema
const categorySchema = new mongoose.Schema({
  title: String,
  img: String, // Image URL
  discount: String,
});

const Category = mongoose.model("Category", categorySchema);


// Upload Image & Create Category
app.post("/categories", upload.single("img"), async (req, res) => {
  const { title, discount } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null; // Save image path

  if (!title || !img || !discount) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newCategory = new Category({ title, img, discount });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Admin All Categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete Category
app.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//Updated Category
app.put("/categories/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, discount: req.body.discount },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//**********************************************************************************





//*******************************CART-PAGE***************************************************

//Schema
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  brand: String,
  size: String,
  quantity: { type: Number, default: 1, min: 1 },
  price: Number,
  discount: { type: Number, default: 0 },
  image: String,
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);



// ✅ Middleware for Authentication
const isAuthenticate = (req, res, next) => {
  if (!req.session.userId) {
      return res.status(401).json({ message: "❌ Unauthorized: Please log in" });
  }
  next();
};


// ✅ Get Cart Items (User-Specific)
app.get("/api/cart", isAuthenticate, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.session.userId });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching cart items" });
  }
});


// POST-All Card Product
app.post("/api/cart", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "❌ Unauthorized: User not logged in" });
    }

    const { productId, name, size, price, quantity } = req.body;
    if (!productId || !name || !size || !price || !quantity) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    let cartItem = await Cart.findOne({ productId, size, userId: req.session.userId });

    if (cartItem) cartItem.quantity += quantity;
    else cartItem = new Cart({ userId: req.session.userId, ...req.body });

    await cartItem.save();
    res.status(201).json({ message: "✅ Product added to cart!" });
  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ message: "❌ Error adding to cart", error: error.message });
  }
});


// ✅ Update Quantity (Increase / Decrease)
app.patch("/api/cart/:id", isAuthenticate, async (req, res) => {
  try {
    const { change } = req.body;
    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.session.userId });

    if (!cartItem) return res.status(404).json({ message: "❌ Item not found" });

    cartItem.quantity += change;
    if (cartItem.quantity < 1) cartItem.quantity = 1;

    await cartItem.save();
    res.json({ message: "✅ Quantity updated", cart: cartItem });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating quantity" });
  }
});


// ✅ Remove Product from Cart
app.delete("/api/cart/:id", isAuthenticate, async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
    if (!item) return res.status(404).json({ message: "❌ Item not found" });

    res.json({ message: "🗑 Item removed", item });
  } catch (error) {
    res.status(500).json({ message: "❌ Error removing item" });
  }
});

//**********************************************************************************





//****************************ORDER-PAGE******************************************************

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userInfo: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online Payment"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      default: null,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        brand: { type: String },
        size: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        image: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Return Approved",
        "Return Denied",
      ],
      default: "Pending",
    },
    trackingId: {
      type: String,
      default: null,
    },
    estimatedDelivery: {
      type: Date,
    },
    returnStatus: {
      type: String,
      enum: [
        "Not Requested",
        "Requested",
        "Return Approved",
        "Return Denied",
        "Returned",
      ],
      default: "Not Requested",
    },
    returnReason: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

// Razorpay Instance (HARDCODED keys - use only in development)
const razorpay = new Razorpay({
  key_id: "rzp_test_rv1bH6Okprpr7t",        // Replace with your actual Razorpay key_id
  key_secret: "UQLubEmmVQVepHrqrET6GTDZ",   // Replace with your actual Razorpay secret
});

// ✅ Create Razorpay Order
app.post("/api/payment/orders", isAuthenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({ message: "❌ Could not create Razorpay order" });
  }
});


// ✅ Verify Razorpay Signature & Place Order
app.post("/api/payment/verify", isAuthenticate, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userInfo,
      cart,
      paymentMethod,
    } = req.body;

    // 🔐 Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", "UQLubEmmVQVepHrqrET6GTDZ")
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "❌ Invalid payment signature" });
    }

    // 🧮 Total & Items
    const userId = req.session.userId;
    const totalAmount = cart.reduce((acc, item) => {
      const discounted = item.price - (item.discount || 0);
      return acc + discounted * item.quantity;
    }, 0);

    const orderItems = cart.map((item) => ({
      productId: item._id,
      name: item.name,
      brand: item.brand || "", // fallback if undefined
      size: item.size || "N/A",
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      image: item.image || "",
    }));

    // ✅ Save order with payment info
      const newOrder = new Order({
        userId,
        userInfo: {
          name: userInfo.fullName,
          address: userInfo.address,
          phone: userInfo.phone,
        },
        paymentMethod,
        paymentStatus: "Paid",
        transactionId: razorpay_payment_id,
        items: orderItems,
        totalAmount,
      });
      

    await newOrder.save();
    await Cart.deleteMany({ userId });

    res.json({
      message: "✅ Payment verified & order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({ message: "❌ Could not verify payment" });
  }
});


// ✅ Cash on Delivery Order
app.post("/api/orders/place", isAuthenticate, async (req, res) => {
  try {
    const { userInfo, paymentMethod } = req.body;
    const userId = req.session.userId;

    // ✅ Validate userInfo fields
    if (
      !userInfo ||
      !(userInfo.fullName || userInfo.name) ||
      !userInfo.address ||
      !userInfo.phone
    ) {
      return res.status(400).json({ message: "❌ Incomplete user info" });
    }

    // ✅ Normalize userInfo
    const normalizedUserInfo = {
      name: userInfo.fullName || userInfo.name,
      address: userInfo.address,
      phone: userInfo.phone,
    };

    // ✅ Get cart items with product details
    const cartItems = await Cart.find({ userId }).populate("productId", "name price discount image");

    if (!cartItems.length) {
      return res.status(400).json({ message: "❌ Cart is empty" });
    }

    // ✅ Calculate total amount after discount
    const totalAmount = cartItems.reduce((acc, item) => {
      const discounted = item.productId.price - (item.productId.discount || 0);
      return acc + discounted * item.quantity;
    }, 0);

    // ✅ Prepare order items
    const orderItems = cartItems.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
      discount: item.productId.discount || 0,
      image: item.productId.image,
    }));

    // ✅ Create new order
    const newOrder = new Order({
      userId,
      userInfo: normalizedUserInfo,
      paymentMethod,
      items: orderItems,
      totalAmount,
      status: "Cash on Delivery",
    });

    await newOrder.save();

    // ✅ Clear user's cart after order placed
    await Cart.deleteMany({ userId });

    res.json({ message: "✅ Order placed (Cash on Delivery)", orderId: newOrder._id });
  } catch (error) {
    console.error("❌ Error placing COD order:", error);
    res.status(500).json({ message: "❌ Could not place order" });
  }
});





// ✅ Get User Orders
app.get("/api/orders", isAuthenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching orders" });
  }
});

// ✅ Get All Orders (Admin)
app.get("/api/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName email phone") // Fetch user info
      .select("userInfo paymentMethod paymentStatus transactionId items totalAmount status returnReason createdAt");

    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching admin orders:", error);
    res.status(500).json({ message: "❌ Error fetching orders" });
  }
});

// ✅ Approve Order with Payment Verification
app.put("/api/orders/:id/approve", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Ensure the payment status is "Paid" for Online Payments
    if (order.paymentMethod === "Online Payment" && order.paymentStatus !== "Paid") {
      return res.status(400).json({ error: "❌ Payment not completed, cannot approve order" });
    }

    // ✅ Update order status to approved
    order.status = "Approved";
    order.orderStatus = "Approved";  // If it's a separate field to track the order approval
    await order.save();

    res.json({ message: "✅ Order approved successfully!", order });
  } catch (error) {
    console.error("❌ Failed to approve order:", error);
    res.status(500).json({ error: "Failed to approve order" });
  }
});


// ✅ Mark Order as Shipped with Tracking Information
app.put("/api/orders/:id/shipped", async (req, res) => {
  try {
    const { trackingId, estimatedDelivery } = req.body; // Get tracking information from request body
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "❌ Order not found" });

    if (order.status !== "Approved") {
      return res.status(400).json({ error: "❌ Only approved orders can be shipped" });
    }

    // ✅ Update order status to "Shipped"
    order.status = "Shipped";
    order.orderStatus = "Shipped"; // Ensure orderStatus is also updated

    // Add tracking ID and estimated delivery date if provided
    if (trackingId) order.trackingId = trackingId;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);

    await order.save();

    res.json({ message: "✅ Order marked as shipped!", order });
  } catch (error) {
    console.error("❌ Failed to update order:", error);
    res.status(500).json({ error: "❌ Failed to update order" });
  }
});



// ✅ Soft Delete Order
app.delete("/api/orders/:id", isAuthenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "❌ Order not found" });

    // Restrict deletion to Admins or the order owner
    if (req.user.role !== "admin" && order.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "❌ You are not authorized to delete this order" });
    }

    // Ensure only non-shipped orders can be deleted
    if (order.status === "Shipped" || order.orderStatus === "Shipped") {
      return res.status(400).json({ error: "❌ Cannot delete a shipped order" });
    }

    // Set isDeleted flag to true for soft deletion
    order.isDeleted = true;
    await order.save();

    res.json({ message: "✅ Order marked as deleted successfully!" });

  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ error: "❌ Failed to delete order" });
  }
});


// ✅ Submit a Return Request
app.post("/api/orders/return", isAuthenticate, async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    
    // Validate input
    if (!orderId || !reason.trim()) {
      return res.status(400).json({ error: "❌ Order ID and reason required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "❌ Order not found" });

    // Ensure only the order owner can request a return
    if (order.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "❌ You are not authorized to return this order" });
    }

    // Allow return requests only for shipped orders
    if (order.status !== "Shipped") {
      return res.status(400).json({ error: "❌ Only shipped orders can be returned" });
    }

    // Check if the return request is within the allowed time frame (e.g., 7 days from shipped date)
    const now = new Date();
    const shippedDate = new Date(order.createdAt); // Assuming order creation date is the shipment date
    const returnDeadline = new Date(shippedDate.setDate(shippedDate.getDate() + 7)); // 7 days after shipped date

    if (now > returnDeadline) {
      return res.status(400).json({ error: "❌ Return request period has expired" });
    }

    // Prevent multiple return requests
    if (["Requested", "Return Approved", "Return Denied"].includes(order.returnStatus)) {
      return res.status(400).json({ error: "❌ Return request already submitted" });
    }

    // Update return status
    order.returnStatus = "Requested";
    order.returnReason = reason;
    await order.save();

    res.json({ message: "✅ Return request submitted successfully!" });

  } catch (error) {
    console.error("❌ Error submitting return request:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});



// ✅ Cancel Return Request
app.put("/api/orders/:orderId/cancel-return", isAuthenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "❌ Order not found" });

    // Ensure only the order owner or an admin can cancel the return
    if (order.userId.toString() !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json({ error: "❌ Unauthorized to cancel this return request" });
    }

    // Check if return request is in a valid state for cancellation
    if (["Return Approved", "Return Denied"].includes(order.returnStatus)) {
      return res.status(400).json({ error: "❌ Return request cannot be canceled at this stage" });
    }

    if (order.returnStatus !== "Requested") {
      return res.status(400).json({ error: "❌ No active return request to cancel" });
    }

    // Cancel the return request
    order.returnStatus = "Not Requested";
    order.returnReason = "";
    await order.save();

    res.json({ message: "✅ Return request cancelled successfully!" });
  } catch (error) {
    console.error("❌ Error canceling return request:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});



// ✅ Cancel an Order (Only if Not Shipped)
app.put("/api/orders/:orderId/cancel", isAuthenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "❌ Order not found" });

    // Ensure only the order owner or an admin can cancel
    if (order.userId.toString() !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json({ error: "❌ Unauthorized to cancel this order" });
    }

    // Prevent cancellation of shipped or return-approved orders
    if (["Shipped", "Return Approved"].includes(order.status)) {
      return res.status(400).json({ error: "❌ This order cannot be canceled" });
    }

    // Optional: Add a check for orders that can only be canceled within a specific time window
    const cancelTimeWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (new Date() - new Date(order.createdAt) > cancelTimeWindow) {
      return res.status(400).json({ error: "❌ Order cancellation period has expired" });
    }

    // Cancel the order
    order.status = "Cancelled";
    
    // Optional: Record the cancellation action
    order.cancelledBy = req.session.userId; // Save the user who canceled the order (for auditing)
    order.cancelledAt = new Date(); // Save the cancellation timestamp
    
    await order.save();

    res.json({ message: "✅ Order cancelled successfully!", order });
  } catch (error) {
    console.error("❌ Error canceling order:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

// ✅ Approve Return Request
app.put("/api/orders/:orderId/approve-return", isAuthenticate, async (req, res) => {
  try {
    // Ensure only admins can approve returns
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: "❌ Unauthorized. Only admins can approve returns" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "❌ Order not found" });

    // Ensure a return request was actually made
    if (order.returnStatus !== "Requested") {
      return res.status(400).json({ error: "❌ No return request found for this order" });
    }

    // Ensure the order was shipped before approving a return
    if (order.status !== "Shipped") {
      return res.status(400).json({ error: "❌ Return can only be approved for shipped orders" });
    }

    // Approve the return
    order.returnStatus = "Return Approved";
    order.status = "Return Approved";

    // Optional: Record who approved the return
    order.returnApprovedBy = req.session.userId; // Log the admin who approved the return
    order.returnApprovedAt = new Date(); // Log the approval date

    // Save changes
    await order.save();

    // Optional: Notify the customer (Implement notification logic here)
    // sendReturnApprovalNotification(order.userId);  // Example for notification function (Email, SMS, etc.)

    res.json({ message: "✅ Return request approved", order });
  } catch (error) {
    console.error("❌ Error approving return:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});


// ❌ Cancel Return Request (Deny)
app.put("/api/orders/:orderId/cancel-return", isAuthenticate, async (req, res) => {
  try {
    // Ensure only admins can deny return requests
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: "❌ Unauthorized. Only admins can cancel return requests" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "❌ Order not found" });

    // Check if a return request exists
    if (order.returnStatus !== "Requested") {
      return res.status(400).json({ error: "❌ No return request found for this order" });
    }

    // Deny the return request
    order.returnStatus = "Return Denied";
    order.returnReason = ""; // Clear reason
    order.returnDeniedBy = req.session.userId; // Log who denied the return request
    order.returnDeniedAt = new Date(); // Log the date of denial

    // Save changes to the order
    await order.save();

    // Optional: Notify the customer (implement notification logic here)
    // sendReturnDenialNotification(order.userId); // Example of a notification function (Email/SMS)

    res.json({ message: "❌ Return request denied", order });
  } catch (error) {
    console.error("❌ Error canceling return request:", error);
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});




//*****************************WISHLIST-PAGE*****************************************************

//Schema
const wishlistSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  size: { type: String, default: "M" }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);


// ✅ Add Product to Wishlist
app.post("/api/wishlist", async (req, res) => {
  try {

      const { productId, name, price, image, size } = req.body;
      if (!productId) return res.status(400).json({ message: "Product ID is required" });

      const existingItem = await Wishlist.findOne({ productId });
      if (existingItem) return res.status(400).json({ message: "Item already in wishlist" });

      const newItem = new Wishlist({ productId, name, price, image, size });
      await newItem.save();

      res.status(201).json(newItem);
  } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});



// DELETE an item from the wishlist
app.delete("/api/wishlist/:productId", async (req, res) => {
    try {
        const deletedItem = await Wishlist.findOneAndDelete({ productId: req.params.productId });
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });

        res.json({ message: "Item removed from wishlist" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ Get All Wishlist Items
app.get("/api/wishlist", async (req, res) => {
  try {
      const wishlistItems = await Wishlist.find();
      res.json(wishlistItems);
  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
});


//**********************************************************************************





// **************************CONTACT-UPDATED-PAGE*****************************************

//Schema
let contactDetails = {
  email: "support@myntra.com",
  phone: "+91-80-61561999",
  address: "Myntra Designs Pvt. Ltd., Bengaluru, India",
};


// GET request to fetch contact details
app.get("/contact-details", (req, res) => {
  res.json(contactDetails);
});

// POST request to update contact details
app.post("/update-contact", (req, res) => {
  contactDetails = req.body;
  res.json({ message: "Contact details updated successfully!" });
});


// ************************************************************************************



//*******************************GIFTCARD-PAGE***************************************************

const giftCardSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const GiftCard = mongoose.model("GiftCard", giftCardSchema);

// Create a new gift card
app.post("/api/giftcards", async (req, res) => {
  try {
    const { name, email, amount } = req.body;
    if (!name || !email || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newGiftCard = new GiftCard({ name, email, amount });
    await newGiftCard.save();
    res.status(201).json({ message: "Gift card purchased successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all gift cards
app.get("/api/giftcards", async (req, res) => {
  try {
    const giftCards = await GiftCard.find();
    res.status(200).json(giftCards);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a gift card
app.delete("/api/giftcards/:id", async (req, res) => {
  try {
    await GiftCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gift card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//***********************************************************************************************


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
