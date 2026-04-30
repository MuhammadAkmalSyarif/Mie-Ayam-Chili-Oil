const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
          customerPhone,
          deliveryAddress,
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

      return order;
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: error.message });
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

module.exports = {
  createOrder,
  getOrderById,
};
