const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    // In a real app, you would use JWT here
    res.json({ 
      success: true, 
      data: { 
        id: user.id, 
        username: user.username,
        token: 'mock-jwt-token-' + user.id // Simple mock token
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed admin if not exists
const seedAdmin = async () => {
    try {
        const admin = await prisma.user.findUnique({
            where: { username: 'admin' }
        });
        if (!admin) {
            await prisma.user.create({
                data: {
                    username: 'admin',
                    password: 'admin' // Default password
                }
            });
            console.log('Default admin created: admin/admin');
        }
    } catch (error) {
        console.error('Failed to seed admin:', error);
    }
};

seedAdmin();

module.exports = {
  login,
};
