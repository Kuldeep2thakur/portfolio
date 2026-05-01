import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { FiLogOut, FiTrash2, FiPlus, FiMessageSquare, FiFolder, FiUser, FiStar, FiEdit2 } from 'react-icons/fi';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState({ bio: '', resumeLink: '', title: '', profileImage: '' });
  
  const [activeTab, setActiveTab] = useState('projects');
  
  // Forms state
  const [newProject, setNewProject] = useState({
    title: '', description: '', image: '', githubUrl: '', demoUrl: '', techStack: '', featured: false
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  
  const [newSkill, setNewSkill] = useState({ name: '', icon: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    // Fetch Projects
    const projSnap = await getDocs(collection(db, 'projects'));
    setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    // Fetch Messages
    const msgSnap = await getDocs(collection(db, 'contacts'));
    setMessages(msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Fetch Skills
    const skillSnap = await getDocs(collection(db, 'skills'));
    setSkills(skillSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Fetch Profile
    const profSnap = await getDoc(doc(db, 'profile', 'main'));
    if (profSnap.exists()) {
      setProfile(profSnap.data());
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  // --- PROJECTS ---
  const handleImageUpload = async (file) => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary credentials missing in .env");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary Error Details:", errorData);
      throw new Error(`Cloudinary Error: ${errorData.error?.message || "Upload failed"}`);
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imageUrl = newProject.image;
      
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const techStackArray = typeof newProject.techStack === 'string' 
        ? newProject.techStack.split(',').map(item => item.trim()) 
        : newProject.techStack;

      const projectData = { ...newProject, techStack: techStackArray, image: imageUrl };

      if (editingProjectId) {
        await updateDoc(doc(db, 'projects', editingProjectId), projectData);
        alert("Project Updated!");
      } else {
        await addDoc(collection(db, 'projects'), projectData);
        alert("Project Added!");
      }
      
      setNewProject({ title: '', description: '', image: '', githubUrl: '', demoUrl: '', techStack: '', featured: false });
      setImageFile(null);
      setEditingProjectId(null);
      fetchData();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditProject = (project) => {
    setNewProject({
      ...project,
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack
    });
    setImageFile(null);
    setEditingProjectId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteDoc(doc(db, 'projects', id));
      fetchData();
    }
  };

  // --- SKILLS ---
  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'skills'), newSkill);
      setNewSkill({ name: '', icon: '' });
      fetchData();
      alert("Skill Added!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteDoc(doc(db, 'skills', id));
      fetchData();
    }
  };

  // --- PROFILE ---
  const handleSaveProfileInfo = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'profile', 'main'), profile, { merge: true });
      alert("Profile Details Updated!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleUpdateProfileImage = async (e) => {
    e.preventDefault();
    if (!profileImageFile) {
      return alert("Please select an image file first.");
    }
    
    setIsProfileUploading(true);
    try {
      const imageUrl = await handleImageUpload(profileImageFile);
      const updatedProfile = { ...profile, profileImage: imageUrl };
      
      await setDoc(doc(db, 'profile', 'main'), updatedProfile, { merge: true });
      setProfile(updatedProfile);
      setProfileImageFile(null);
      alert("Profile Photo Updated!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsProfileUploading(false);
    }
  };

  // --- MESSAGES ---
  const handleDeleteMessage = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteDoc(doc(db, 'contacts', id));
      fetchData();
    }
  };

  if (!user) {
    // ... Login UI (unchanged) ...
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">ADMIN <span className="text-primary-600">PORTAL</span></h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 rounded-xl text-gray-900 dark:text-white outline-none" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 rounded-xl text-gray-900 dark:text-white outline-none" />
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl">Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">ADMIN <span className="text-primary-600">DASHBOARD</span></h1>
          </div>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-600 rounded-xl font-semibold">
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'projects' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300'}`}><FiFolder /> Projects</button>
          <button onClick={() => setActiveTab('skills')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'skills' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300'}`}><FiStar /> Skills</button>
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'profile' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300'}`}><FiUser /> Profile & Resume</button>
          <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap ${activeTab === 'messages' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300'}`}><FiMessageSquare /> Messages ({messages.length})</button>
        </div>

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FiPlus className="text-primary-500" /> {editingProjectId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleSaveProject} className="space-y-4">
                <input type="text" placeholder="Project Title" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none" />
                <textarea placeholder="Description" required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none h-32 resize-none"></textarea>
                
                {/* Cloudinary Image Upload */}
                <div className="space-y-2 p-3 bg-gray-50 dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Project Thumbnail</label>
                  {newProject.image && !imageFile && (
                    <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-dark-600">
                      <img src={newProject.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setImageFile(e.target.files[0])} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400" 
                  />
                  <p className="text-xs text-gray-500">Select an image to upload via Cloudinary.</p>
                </div>

                <input type="text" placeholder="Tech Stack (comma separated)" required value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none" />
                <input type="url" placeholder="GitHub Repository URL" value={newProject.githubUrl} onChange={e => setNewProject({...newProject, githubUrl: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none" />
                <input type="url" placeholder="Live Demo URL" value={newProject.demoUrl} onChange={e => setNewProject({...newProject, demoUrl: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none" />
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 py-2 cursor-pointer">
                  <input type="checkbox" checked={newProject.featured} onChange={e => setNewProject({...newProject, featured: e.target.checked})} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                  Mark as Featured Project
                </label>
                <div className="flex gap-2 mt-4">
                  <button type="submit" disabled={isUploading} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-md disabled:opacity-50 transition-colors">
                    {isUploading ? 'Uploading Image...' : editingProjectId ? 'Update Project' : 'Save Project'}
                  </button>
                  {editingProjectId && (
                    <button type="button" onClick={() => { setEditingProjectId(null); setNewProject({title: '', description: '', image: '', githubUrl: '', demoUrl: '', techStack: '', featured: false}); setImageFile(null); }} className="px-4 bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-white font-bold rounded-xl">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="lg:col-span-2">
              {projects.length === 0 ? (
                <div className="bg-white dark:bg-dark-800 p-12 rounded-3xl text-center border border-gray-100 dark:border-dark-700 flex flex-col items-center justify-center h-full">
                  <div className="w-20 h-20 bg-primary-50 dark:bg-dark-700 rounded-full flex items-center justify-center mb-6">
                    <FiFolder size={32} className="text-primary-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Start building your portfolio by adding your first project using the form.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {projects.map(project => (
                    <div key={project.id} className="group bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 flex flex-col h-full">
                      {/* Project Image Header */}
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-dark-900">
                        <img 
                          src={project.image || '/portfolio.jpg'} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {project.featured && (
                            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-lg">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        {/* Action Buttons Overlay */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                          <button onClick={() => handleEditProject(project)} className="p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-xl transition-all shadow-lg" title="Edit">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteProject(project.id)} className="p-2.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white rounded-xl transition-all shadow-lg" title="Delete">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">{project.title}</h3>
                        </div>
                      </div>
                      
                      {/* Project Details */}
                      <div className="p-6 flex flex-col flex-grow">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">{project.description}</p>
                        
                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {Array.isArray(project.techStack) ? project.techStack.slice(0, 4).map((tech, i) => (
                            <span key={i} className="text-[10px] font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-md border border-primary-100 dark:border-primary-800/30">
                              {tech}
                            </span>
                          )) : null}
                          {Array.isArray(project.techStack) && project.techStack.length > 4 && (
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded-md">
                              +{project.techStack.length - 4} more
                            </span>
                          )}
                        </div>
                        
                        {/* Links */}
                        <div className="flex items-center gap-4 text-sm font-medium pt-4 border-t border-gray-100 dark:border-dark-700">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                              GitHub Link
                            </a>
                          )}
                          {project.demoUrl && (
                            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors ml-auto flex items-center gap-1">
                              Live Demo →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FiPlus className="text-primary-500" /> Add Skill
              </h2>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <input type="text" placeholder="Skill Name (e.g. React)" required value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none" />
                <input type="text" placeholder="Icon Emoji (e.g. ⚛️)" required value={newSkill.icon} onChange={e => setNewSkill({...newSkill, icon: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none" />
                <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl">Add Skill</button>
              </form>
            </div>
            <div className="lg:col-span-2">
               <div className="flex flex-wrap gap-4">
                {skills.map(skill => (
                  <div key={skill.id} className="bg-white dark:bg-dark-800 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-4">
                    <span className="text-2xl">{skill.icon}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{skill.name}</span>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="ml-2 text-red-500 hover:text-red-700"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl">
            {/* Profile Info Form */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm h-fit">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FiUser className="text-primary-500" /> Update Details
              </h2>
              <form onSubmit={handleSaveProfileInfo} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title / Subtitle</label>
                  <input type="text" placeholder="e.g. Full Stack Developer" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resume Link (Google Drive / PDF URL)</label>
                  <input type="url" placeholder="https://..." value={profile.resumeLink} onChange={e => setProfile({...profile, resumeLink: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About Me / Bio</label>
                  <textarea placeholder="Write your main bio here..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-900 dark:text-white outline-none h-48 resize-none focus:ring-2 focus:ring-primary-500 transition-all"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-md">
                  Save Details
                </button>
              </form>
            </div>

            {/* Profile Image Form */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm h-fit">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <FiUser className="text-primary-500" /> Update Profile Photo
              </h2>
              <form onSubmit={handleUpdateProfileImage} className="space-y-6 flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary-500 shadow-xl bg-gray-100 dark:bg-dark-900 mb-4">
                  <img 
                    src={profileImageFile ? URL.createObjectURL(profileImageFile) : (profile.profileImage || '/portfolio.jpg')} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select New Photo</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setProfileImageFile(e.target.files[0])} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400 cursor-pointer" 
                    required
                  />
                </div>

                <button type="submit" disabled={isProfileUploading || !profileImageFile} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-xl disabled:opacity-50 transition-colors shadow-md mt-4">
                  {isProfileUploading ? 'Uploading Image...' : 'Update Photo'}
                 </button>
              </form>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
           <div className="space-y-4 max-w-4xl">
             {messages.map(msg => (
               <div key={msg.id} className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm flex justify-between items-start gap-6">
                 <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">{msg.name} <span className="text-sm font-normal text-primary-500">({msg.email})</span></h3>
                   <p className="mt-2 text-gray-700 dark:text-gray-300">{msg.message}</p>
                 </div>
                 <button onClick={() => handleDeleteMessage(msg.id)} className="p-3 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl"><FiTrash2 size={20} /></button>
               </div>
             ))}
           </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
