const CartDB = require("../model/cartModel");
const OrderDB = require("../model/orderModel");
const AddressDB = require("../model/addressModel");

function generateOrderId() {
  const timestampPart = Date.now().toString().slice(-5);
  const randomPart = Math.floor(Math.random() * 100000).toString().padStart(5, '0'); 
  return timestampPart + randomPart;
}

const getPlaceOrder = async (req, res) => {
  try {
    const cartItems = await CartDB.findOne({
      user: req.session.user._id,
    }).populate("products.productId");
    const userAddress = await AddressDB.find({ user: req.session.user._id });
    const haveCart = await CartDB.find({user:req.session.user._id})
    if (haveCart.length === 0) {
      res.redirect('/orders')
    }
    const productCount = cartItems.products.length;
    res.render("user/place-order", {
      cartItems,
      productCount,
      userAddress,
      user: req.session.user,
      title: "Place Order",
    });
  } catch (error) {
    console.log(error);
  }
};

const addAddress = async (req, res) => {
  try {
    const { fullName, mobile, email, address, city, state, pincode } = req.body;
    const userId = req.session.user._id;
    console.log(userId);
    const orderDetails = new AddressDB({
      user: userId,
      fullname: fullName,
      mobile: mobile,
      email: email,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
    });
    await orderDetails.save();
    res.json({ saved: true, address: orderDetails });
  } catch (error) {
    console.log(error);
  }
};
const postPlaceOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, cartId, totalPrice } = req.body;
    let status = paymentMethod==='cod'?'placed':'pending'
    const userId = req.session.user._id;
    const userAddress = await AddressDB.findOne({ _id: addressId });
    const cartData = await CartDB.findOne({ _id: cartId }).populate(
      "products.productId"
    );
    const orderdProducts = cartData.products.map((element) => {
      let productStore = {
        productId: element.productId,
        quantity: element.quantity,
        price: element.priceByQuantity,
      };
      return productStore;
    });

    const newOrder = new OrderDB({
      orderId:generateOrderId(),
      user: userId,
      deliveryDetails: userAddress,
      products: orderdProducts,
      totalAmount: totalPrice,
      paymentMethod:paymentMethod,
      status:status,
      orderDate:new Date()
    });
    await newOrder.save()
    await CartDB.deleteOne({_id:cartId})
    res.json({success:true})
  } catch (error) {
    console.log(error);
    res.json({success:false})
  }
}

const getOrders = async(req,res)=>{
  try {
  let orderdProducts = await OrderDB.find({user:req.session.user._id}).populate("products.productId")
  const hasOrders = orderdProducts.length > 0;
  orderdProducts = orderdProducts.reverse();
  res.render('user/orders', { orderdProducts, hasOrders,user:req.session.user }); 
  } catch (error) {
    console.log(error);
  }
}

const getOrderDetails = async(req,res)=>{
 try {
  const {id} = req.params
  const orderDetails = await OrderDB.findOne({_id:id}).populate("products.productId")
  console.log(orderDetails);
  const deliveryDetails = orderDetails.deliveryDetails
  console.log(deliveryDetails);
  res.render('user/view-order-details',{user:req.session.user,orderDetails,deliveryDetails})
 } catch (error) {
  console.log(error);
 }
}
module.exports = {
  getPlaceOrder,
  postPlaceOrder,
  addAddress,
  getOrders,
  getOrderDetails
};
