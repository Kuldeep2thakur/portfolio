const express = require('express');
const { db } = require('../config/firebase');
const { contactValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', contactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create contact document
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    // Add to Firestore
    const docRef = await db.collection('contacts').add(contactData);

    // Optional: Send email notification (implement your email service here)
    // await sendEmailNotification(contactData);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: {
        id: docRef.id,
        name: contactData.name,
        email: contactData.email,
        timestamp: contactData.timestamp
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    });
  }
});

// GET /api/contact - Get all contact submissions (admin only)
router.get('/', async (req, res) => {
  try {
    // Add authentication middleware here for admin access
    const contactsRef = db.collection('contacts');
    const snapshot = await contactsRef.orderBy('timestamp', 'desc').get();
    
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
});

// GET /api/contact/:id - Get specific contact submission (admin only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contactRef = db.collection('contacts').doc(id);
    const contact = await contactRef.get();

    if (!contact.exists) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: contact.id,
        ...contact.data()
      }
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: error.message
    });
  }
});

// DELETE /api/contact/:id - Delete contact submission (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contactRef = db.collection('contacts').doc(id);
    const contact = await contactRef.get();

    if (!contact.exists) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    await contactRef.delete();

    res.json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact submission',
      error: error.message
    });
  }
});

module.exports = router;
