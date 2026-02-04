import { motion } from 'framer-motion';

export const SkeletonCard = () => {
  return (
    <motion.div 
      className="premium-card skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="skeleton-shimmer">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-button"></div>
        </div>
        <div className="skeleton-content">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    </motion.div>
  );
};

export const SkeletonDashboard = () => {
  return (
    <div className="dashboard-grid">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
