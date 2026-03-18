import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface RoadmapPhase {
  title: string;
  desc: string;
}

interface RoadmapProps {
  t: {
    roadmap: {
      title: string;
      phases: RoadmapPhase[];
    };
  };
}

const Roadmap: React.FC<RoadmapProps> = ({ t }) => {
  return (
    <section id="roadmap" className="section container roadmap-section-max-width">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <h2 className="text-center margin-bottom-50">{t.roadmap.title}</h2>
        <div className="roadmap-timeline">
          {t.roadmap.phases.map((phase: RoadmapPhase, i: number) => (
            <div key={i} className={`roadmap-item ${i === 0 ? 'active' : ''}`}>
              <h3 className={i === 0 ? "roadmap-title-active" : "roadmap-title-normal"}>{phase.title}</h3>
              <p className="text-muted-color">{phase.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Roadmap;
