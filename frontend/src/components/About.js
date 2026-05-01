import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// ...existing code...

const About = () => {
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch dynamic skills
      try {
        const skillsSnap = await getDocs(collection(db, 'skills'));
        if (!skillsSnap.empty) {
          setSkills(skillsSnap.docs.map(doc => doc.data()));
        } else {
          // Fallback default skills if database is empty
          setSkills([
            { name: 'React', icon: '⚛️' },
            { name: 'JavaScript', icon: '🟡' }
          ]);
        }

        // Fetch dynamic profile
        const profSnap = await getDoc(doc(db, 'profile', 'main'));
        if (profSnap.exists()) {
          if (profSnap.data().bio) setBio(profSnap.data().bio);
          if (profSnap.data().profileImage) setProfileImage(profSnap.data().profileImage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-primary-50 via-secondary-100 to-accent-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-700">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl font-extrabold text-primary-700 dark:text-primary-300 mb-2 tracking-tight drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            About Me
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            I'm a passionate full-stack developer, eager to start my professional journey and create innovative digital solutions.
          </motion.p>
        </motion.div>

        {/* Bio Card */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-10 max-w-3xl w-full border border-primary-100 dark:border-primary-900">
            <h3 className="text-2xl font-extrabold text-primary-700 dark:text-primary-300 mb-4 tracking-tight">Who I Am</h3>
            {bio ? (
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg whitespace-pre-wrap">{bio}</p>
            ) : (
              <>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                  I'm a passionate full-stack developer, recently graduated and eager to start my professional journey. My curiosity about technology led me to pursue a degree in Computer Science, where I built a strong foundation in programming and web development.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                  I specialize in modern web technologies including React, Node.js, and cloud platforms. I love writing clean, maintainable code and creating user experiences that are both beautiful and functional. I'm excited to contribute to real-world projects and grow as a developer.
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  When I'm not coding, I enjoy exploring new technologies, learning from the developer community, and taking on personal projects that challenge my skills.
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="flex flex-row justify-center gap-8 mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-primary-100 dark:bg-primary-900 rounded-lg px-6 py-4 text-center shadow">
            <div className="text-3xl font-bold text-primary-700 dark:text-primary-300">3+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Personal Projects</div>
          </div>
        </motion.div>

        {/* Education Section */}
        <div className="flex justify-center mt-12">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-primary-100 dark:border-primary-900">
            <h3 className="text-2xl font-extrabold text-primary-700 dark:text-primary-300 mb-4 tracking-tight text-center">Education</h3>
            <div className="space-y-6">
              {/* 10th */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">10th (High School)</div>
                  <div className="text-gray-600 dark:text-gray-400">Union Public School (CBSE Board)</div>
                </div>
                <div className="text-primary-600 dark:text-primary-400 font-mono text-sm mt-2 sm:mt-0">2020-2021</div>
              </div>
              {/* 12th */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">12th (Senior Secondary)</div>
                  <div className="text-gray-600 dark:text-gray-400">Union Public School(CBSE Board)</div>
                </div>
                <div className="text-primary-600 dark:text-primary-400 font-mono text-sm mt-2 sm:mt-0">2022-2023</div>
              </div>
              {/* Graduation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">Bachelor of Computer Science</div>
                  <div className="text-gray-600 dark:text-gray-400">ABESIT collage (AKTU University)</div>
                </div>
                <div className="text-primary-600 dark:text-primary-400 font-mono text-sm mt-2 sm:mt-0">2023-2027</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Heading */}
        <motion.h3
          className="text-2xl font-extrabold text-center text-primary-700 dark:text-primary-300 mt-12 mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Skills & Technologies
        </motion.h3>
        {/* Skills Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 dark:from-primary-900 dark:via-secondary-900 dark:to-accent-900 shadow-lg hover:scale-110 hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-primary-300 dark:border-primary-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
            >
              <span className="text-2xl">{skill.icon}</span>
              <span className="font-semibold text-primary-700 dark:text-primary-300 text-lg">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
