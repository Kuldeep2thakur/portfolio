const express = require('express');
const { db } = require('../config/firebase');
const { projectValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.orderBy('createdAt', 'desc').get();
    
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// GET /api/projects/:id - Get a specific project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projectRef = db.collection('projects').doc(id);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: project.id,
        ...project.data()
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
});

// POST /api/projects - Create a new project
router.post('/', projectValidation, handleValidationErrors, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('projects').add(projectData);
    const newProject = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        id: newProject.id,
        ...newProject.data()
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// PUT /api/projects/:id - Update a project
router.put('/:id', projectValidation, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const projectRef = db.collection('projects').doc(id);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await projectRef.update(updateData);
    const updatedProject = await projectRef.get();

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        id: updatedProject.id,
        ...updatedProject.data()
      }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projectRef = db.collection('projects').doc(id);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await projectRef.delete();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

module.exports = router;
