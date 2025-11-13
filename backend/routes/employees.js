const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all employees');
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching employees', 
      error: error.message 
    });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching employee', 
      error: error.message 
    });
  }
});

// Create new employee
router.post('/', async (req, res) => {
  try {
    const { name, position, department, email } = req.body;
    console.log('Creating employee:', req.body);
    
    // Basic validation
    if (!name || !position || !department || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if employee with email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }

    const employee = new Employee({
      name,
      position,
      department,
      email
    });

    await employee.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Employee created successfully', 
      data: employee 
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error creating employee', 
      error: error.message 
    });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, position, department, email } = req.body;
    console.log('Updating employee:', req.params.id, req.body);
    
    // Check if email is taken by another employee
    const existingEmployee = await Employee.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, position, department, email },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Employee updated successfully', 
      data: employee 
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error updating employee', 
      error: error.message 
    });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting employee:', req.params.id);
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Employee deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting employee', 
      error: error.message 
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Employee routes are working!' });
});

module.exports = router;