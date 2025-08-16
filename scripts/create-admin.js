#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');
const { exit } = require('process');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdminUser() {
  try {
    console.log('\n🔐 OPEX MARKETPLACE - ADMIN USER CREATION 🔐\n');
    
    const username = await promptQuestion('Enter username: ');
    const email = await promptQuestion('Enter email: ');
    const fullName = await promptQuestion('Enter full name: ');
    const password = await promptQuestion('Enter password (min 8 characters): ');
    
    if (!username || !email || !password) {
      console.error('❌ Error: Username, email, and password are required');
      return;
    }
    
    if (password.length < 8) {
      console.error('❌ Error: Password must be at least 8 characters long');
      return;
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      console.error('❌ Error: User with this email or username already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        role: 'ADMIN'
      }
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log(`
    ID: ${newUser.id}
    Username: ${newUser.username}
    Email: ${newUser.email}
    Role: ${newUser.role}
    Created at: ${newUser.createdAt}
    `);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdminUser();
