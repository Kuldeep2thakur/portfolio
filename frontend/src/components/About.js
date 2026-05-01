import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const CERT_DESC_LIMIT = 100;

const CertCard = ({ cert, idx }) => {
  const [expanded, setExpanded] = React.useState(false);
  const isLong = cert.description && cert.description.length > CERT_DESC_LIMIT;

  return (
    <motion.div key={cert.id} className="bg-white dark:bg-dark-800 rounded-2xl shadow-md border border-primary-100 dark:border-primary-900 hover:shadow-xl hover:border-primary-400 transition-all duration-300 flex flex-col overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}>
      {cert.image ? (
        <div className="w-full h-48 overflow-hidden">
          <img src={cert.image} alt={cert.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-primary-50 dark:bg-primary-900/20">
          <span className="text-5xl">{cert.uploadType === 'pdf' ? '📄' : '🏅'}</span>
        </div>
      )}
      <div className="p-5 flex flex-col gap-2 flex-grow">
        <h4 className="font-bold text-gray-900 dark:text-white leading-snug">{cert.title}</h4>
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{cert.issuer}</p>
        <p className="text-xs text-gray-400">{cert.date}</p>
        {cert.description && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {isLong && !expanded ? cert.description.slice(0, CERT_DESC_LIMIT) + '...' : cert.description}
            </p>
            {isLong && (
              <button onClick={() => setExpanded(!expanded)} className="mt-1 text-xs font-semibold text-primary-500 hover:text-primary-700 transition-colors">
                {expanded ? 'See less ↑' : 'See more ↓'}
              </button>
            )}
          </div>
        )}
        <div className="mt-auto pt-2">
          {cert.uploadType === 'url' && cert.link && (
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              🔗 View Certificate →
            </a>
          )}
          {cert.uploadType === 'pdf' && cert.pdf && (
            <a href={cert.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
              📄 Open PDF →
            </a>
          )}
          {cert.uploadType === 'image' && cert.image && (
            <a href={cert.image} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-700 transition-colors">
              🖼️ View Full Image →
            </a>
          )}
          {!cert.uploadType && cert.link && (
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary-500 hover:text-primary-700 transition-colors">
              View Certificate →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SKILL_CATEGORIES = [
  { key: 'Frontend', label: 'Frontend', color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20 dark:border-blue-500/20', badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { key: 'Backend', label: 'Backend', color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20', badge: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { key: 'Database', label: 'Database', color: 'from-green-500/10 to-emerald-500/10 border-green-500/20', badge: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { key: 'Tools', label: 'Tools & Others', color: 'from-orange-500/10 to-yellow-500/10 border-orange-500/20', badge: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
];

const About = () => {
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsSnap = await getDocs(collection(db, 'skills'));
        setSkills(skillsSnap.docs.map(d => d.data()));

        const certSnap = await getDocs(collection(db, 'certificates'));
        setCertificates(certSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const profSnap = await getDoc(doc(db, 'profile', 'main'));
        if (profSnap.exists() && profSnap.data().bio) setBio(profSnap.data().bio);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-primary-50 via-secondary-100 to-accent-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-700">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div className="flex flex-col items-center mb-12" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.h2 className="text-4xl font-extrabold text-primary-700 dark:text-primary-300 mb-2 tracking-tight drop-shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            About Me
          </motion.h2>
          <motion.p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl font-medium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            I'm a passionate full-stack developer, eager to start my professional journey and create innovative digital solutions.
          </motion.p>
        </motion.div>

        {/* Bio Card */}
        <motion.div className="flex justify-center mb-10" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-10 max-w-3xl w-full border border-primary-100 dark:border-primary-900">
            <h3 className="text-2xl font-extrabold text-primary-700 dark:text-primary-300 mb-4 tracking-tight">Who I Am</h3>
            {bio ? (
              <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-wrap">{bio}</p>
            ) : (
              <>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">I'm a passionate full-stack developer, recently graduated and eager to start my professional journey.</p>
                <p className="text-gray-700 dark:text-gray-300 text-lg">I specialize in modern web technologies including React, Node.js, and cloud platforms.</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="flex flex-row justify-center gap-8 mb-12" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
          <div className="bg-primary-100 dark:bg-primary-900 rounded-lg px-6 py-4 text-center shadow">
            <div className="text-3xl font-bold text-primary-700 dark:text-primary-300">3+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Personal Projects</div>
          </div>
          <div className="bg-primary-100 dark:bg-primary-900 rounded-lg px-6 py-4 text-center shadow">
            <div className="text-3xl font-bold text-primary-700 dark:text-primary-300">{certificates.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Certificates</div>
          </div>
        </motion.div>

        {/* Education */}
        <div className="flex justify-center mb-14">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-primary-100 dark:border-primary-900">
            <h3 className="text-2xl font-extrabold text-primary-700 dark:text-primary-300 mb-2 tracking-tight text-center">Education</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full mb-6"></div>
            <div className="space-y-6">
              {[
                { degree: '10th (High School)', school: 'Union Public School (CBSE Board)', year: '2020-2021' },
                { degree: '12th (Senior Secondary)', school: 'Union Public School (CBSE Board)', year: '2022-2023' },
                { degree: 'Bachelor of Computer Science', school: 'ABESIT College (AKTU University)', year: '2023-2027' },
              ].map((edu, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">{edu.degree}</div>
                    <div className="text-gray-600 dark:text-gray-400">{edu.school}</div>
                  </div>
                  <div className="text-primary-600 dark:text-primary-400 font-mono text-sm mt-2 sm:mt-0">{edu.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills by Category */}
        <motion.h3 className="text-2xl font-extrabold text-center text-primary-700 dark:text-primary-300 mb-2 tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          Skills &amp; Technologies
        </motion.h3>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full mb-8"></div>
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {SKILL_CATEGORIES.map(cat => {
            const catSkills = skills.filter(s => s.category === cat.key);
            if (catSkills.length === 0) return null;
            return (
              <motion.div key={cat.key} className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 backdrop-blur-sm`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">{cat.label}</h4>
                <div className="flex flex-wrap gap-3">
                  {catSkills.map((skill, idx) => (
                    <motion.span key={idx} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cat.badge} font-semibold text-sm shadow-sm`} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                      <span>{skill.icon}</span> {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
          {/* Uncategorized / legacy skills */}
          {(() => {
            const uncategorized = skills.filter(s => !s.category);
            if (uncategorized.length === 0) return null;
            return (
              <motion.div className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 border border-gray-500/20 rounded-2xl p-6 backdrop-blur-sm md:col-span-2" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Other Skills</h4>
                <div className="flex flex-wrap gap-3">
                  {uncategorized.map((skill, idx) => (
                    <motion.span key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 font-semibold text-sm shadow-sm" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                      {skill.icon && <span>{skill.icon}</span>} {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <>
            <motion.h3 className="text-2xl font-extrabold text-center text-primary-700 dark:text-primary-300 mb-2 tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              Certifications
            </motion.h3>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, idx) => (
                <CertCard key={cert.id} cert={cert} idx={idx} />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default About;
