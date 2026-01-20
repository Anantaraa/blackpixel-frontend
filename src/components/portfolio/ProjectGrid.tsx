import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    category: string;
    location: string;
    year: number;
    image: string;
}

interface ProjectGridProps {
    projects: Project[];
}

const SCATTER_POSITIONS = [
    { top: '10%', left: '10%', rotate: -12 },
    { top: '60%', left: '70%', rotate: 8 },
    { top: '15%', left: '65%', rotate: 15 },
    { top: '70%', left: '5%', rotate: -10 },
    { top: '40%', left: '80%', rotate: 5 },
    { top: '10%', left: '40%', rotate: -5 },
    { top: '80%', left: '40%', rotate: 10 },
    { top: '30%', left: '0%', rotate: -15 },
];

const ProjectCard = ({ project, i, total, progress }: {
    project: Project;
    i: number;
    total: number;
    progress: MotionValue<number>;
}) => {
    // Lifecycle Logic:
    // 0 -> Scatter (Wait)
    // Start -> Center (Focus)
    // End -> Top/Gone (Discard)

    // Divide scroll into segments. 
    // Segment Length.
    const step = 1 / (total + 1); // +1 buffer

    // Time points
    const startMove = i * step;      // Starts moving from pile
    const focusPoint = (i + 1) * step; // Arrives at center
    const exitPoint = (i + 2) * step;  // Leaves to top

    // Values
    const scatterPos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];

    // Scatter Coords relative to Center (50vw, 50vh)
    const xScatter = parseFloat(scatterPos.left) - 50;
    const yScatter = parseFloat(scatterPos.top) - 50;
    const rotateScatter = `${scatterPos.rotate + (i % 2 ? 3 : -3)}deg`;

    // TRANSFORM RANGES
    // 1. X/Y Scatter -> Center -> Exit (Up/Down?)
    // User said: "first page will be moved up, and disappear"
    // So Y: ScatterY -> 0 -> -150vh

    const range = [startMove, focusPoint, exitPoint];

    // Before startMove, it should just be at scatter.
    // After exitPoint, it continues to move up or stay gone.
    // X Movement: Scatter X -> 0 -> 0 (Stay centered while moving UP)
    const x = useTransform(progress, range, [`${xScatter}vw`, "0vw", "0vw"]);

    // Y Movement: Scatter Y -> 0 -> -120vh (Up and away)
    const y = useTransform(progress, range, [`${yScatter}vh`, "0vh", "-120vh"]);

    // Rotate: Scatter -> 0 -> 0 (Keep straight when exiting)
    const rotate = useTransform(progress, range, [rotateScatter, "0deg", "0deg"]);

    // Scale: Smallish -> 1 -> 0.8 (Maybe shrink slightly as it goes up?)
    const scale = useTransform(progress, range, [0.6, 1, 0.8]);

    // Opacity: Visible -> Visible -> Invisible
    // Maybe fade out during exit.
    const opacity = useTransform(progress, [focusPoint, exitPoint], [1, 0]);

    // Content Fade In: Only show text when near center
    // Fade in from startMove to focusPoint
    const contentOpacity = useTransform(progress, [startMove + (step * 0.5), focusPoint], [0, 1]);

    // Z-Index: Total - i. So 0 is top (Total), Last is 0.
    // This allows picking from top of pile.

    return (
        <motion.div
            style={{
                x,
                y,
                rotate,
                scale,
                opacity: i === total - 1 ? 1 : opacity, // Last card stays visible? Or fades out if needed? 
                // Let's keep last one visible if we stop scrolling.
                zIndex: total - i,
                translateX: "-50%",
                translateY: "-50%"
            }}
            className="absolute top-1/2 left-1/2 w-[80vw] md:w-[60vw] aspect-[16/10] rounded-[2rem] bg-neutral-card overflow-hidden shadow-2xl border border-white/5 origin-center pointer-events-auto"
        >
            <Link to={`/projects/${project.id}`} className="block w-full h-full relative group">
                {/* Full Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Gradient OVerlays */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

                {/* Content Overlay */}
                <motion.div
                    style={{ opacity: contentOpacity }}
                    className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end"
                >
                    <div className="flex items-center justify-between items-end">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full border border-white/30 text-xs font-mono text-white/80 backdrop-blur-md">
                                    {project.category}
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-7xl font-display font-medium text-white mb-2 leading-[0.9] tracking-tighter">
                                {project.title}
                            </h2>
                            <p className="font-sans text-sm md:text-lg tracking-wide uppercase text-white/60">
                                {project.location} • {project.year}
                            </p>
                        </div>

                        <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <div ref={container} className="relative h-[600vh] bg-neutral">
            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden perspective-1000">
                {projects.map((project, i) => {
                    return (
                        <ProjectCard
                            key={project.id}
                            i={i}
                            total={projects.length}
                            project={project}
                            progress={scrollYProgress}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectGrid;
