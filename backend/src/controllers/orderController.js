const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const midtransClient = require('midtrans-client');

// Initialize Midtrans Snap client
// NOTE: In production, move these to .env
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-placeholder', // Replace with real Server Key
  clientKey: 'SB-Mid-client-placeholder'  // Replace with real Client Key
});

const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, deliveryAddress, items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Use a transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          customerName,
          customerPhone, // Reused as payment method label in UI
          deliveryAddress, // Reused as table number in UI
          totalAmount,
          status: 'PENDING',
        },
      });

      // 2. Create Order Items and their Toppings
      for (const item of items) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
        });

        if (item.selectedToppings && item.selectedToppings.length > 0) {
          await tx.orderItemTopping.createMany({
            data: item.selectedToppings.map((t) => ({
              orderItemId: orderItem.id,
              toppingName: t.name,
              toppingPrice: t.price,
            })),
          });
        }
      }

      let snapToken = 'mock-snap-token-123';
      
      // Only call Midtrans if keys are configured
      if (snap.apiConfig.serverKey !== 'SB-Mid-server-placeholder') {
        const transactionDetails = {
          transaction_details: {
            order_id: order.id,
            gross_amount: totalAmount,
          },
          customer_details: {
            first_name: customerName,
          },
          item_details: items.map(item => ({
            id: String(item.productId),
            price: item.unitPrice,
            quantity: item.quantity,
            name: "Produk Mie Ayam", 
          }))
        };

        const midtransResponse = await snap.createTransaction(transactionDetails);
        snapToken = midtransResponse.token;
      } else {
        console.warn('Using MOCK snap token because Midtrans keys are not configured.');
      }
      
      return { ...order, snapToken };
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Checkout error detail:', error.ApiResponse ? error.ApiResponse.error_messages : error.message);
    res.status(500).json({ success: false, message: 'Checkout failed' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
            toppings: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
            toppings: true,
          },
        },
      },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const notification = req.body;
    const statusResponse = await snap.transaction.notification(notification);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let orderStatus = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatus = 'CHALLENGE';
      } else if (fraudStatus === 'accept') {
        orderStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      orderStatus = 'CANCELLED';
    } else if (transactionStatus === 'pending') {
      orderStatus = 'PENDING';
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus },
    });

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAllOrders = async (req, res) => {
  try {
    // Delete in correct order due to foreign key constraints
    await prisma.orderItemTopping.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    
    res.json({ success: true, message: 'Semua pesanan berhasil dihapus.' });
  } catch (error) {
    console.error('Delete all orders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  handleWebhook,
  deleteAllOrders,
};
