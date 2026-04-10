import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Linkedin, Globe, ChevronRight } from 'lucide-react';
import { getTeamMemberBySlug } from '../utils/actions';

// ─── Design tokens (standalone, not inheriting site theme) ───────────────────
const C = {
  accent:     '#B87C4A',
  accentSoft: '#F5EDE2',
  pageBg:     '#E6E0D8',
  cardBg:     '#FDFAF5',
  border:     '#DDD7CE',
  borderHov:  '#B87C4A',
  text:       '#17130D',
  muted:      '#8A8278',
  pillBg:     '#FFFFFF',
  tileBg:     '#FFFFFF',
  strip:      '#F2EDE5',
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Animation variants ───────────────────────────────────────────────────────
const card: Variants = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: EASE } },
};

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};

const row: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.45, ease: EASE } },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamMember {
  id: string;
  name: string;
  role?: string;
  slug: string;
  tagline?: string;
  location?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
  avatar_url?: string;
  profile_published: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Divider = () => (
  <div style={{ height: 1, background: C.border, margin: '0 24px' }} />
);

interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

const ContactRow: React.FC<ContactRowProps> = ({ icon, label, value, href }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      variants={row}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        borderRadius: 14,
        background: C.pillBg,
        border: `1.5px solid ${hovered ? C.borderHov : C.border}`,
        textDecoration: 'none',
        transition: 'border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        boxShadow: hovered
          ? `0 4px 16px rgba(184,124,74,0.10)`
          : '0 1px 4px rgba(0,0,0,0.04)',
        cursor: 'pointer',
      }}
    >
      {/* Icon */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 10,
        background: hovered ? C.accentSoft : '#F5F2ED',
        color: hovered ? C.accent : C.muted,
        flexShrink: 0,
        transition: 'background 0.22s ease, color 0.22s ease',
      }}>
        {icon}
      </span>

      {/* Text */}
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: hovered ? C.accent : C.muted,
          transition: 'color 0.22s ease',
          lineHeight: 1,
          marginBottom: 3,
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 13.5,
          color: hovered ? C.accent : C.text,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'color 0.22s ease',
          lineHeight: 1.3,
        }}>
          {value}
        </span>
      </span>

      {/* Arrow */}
      <ChevronRight
        size={16}
        style={{
          color: hovered ? C.accent : C.border,
          flexShrink: 0,
          transition: 'color 0.22s ease',
        }}
      />
    </motion.a>
  );
};

interface SocialTileProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const SocialTile: React.FC<SocialTileProps> = ({ icon, label, href }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variants={row}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 8px',
        borderRadius: 14,
        background: C.tileBg,
        border: `1.5px solid ${hovered ? C.accent : C.border}`,
        textDecoration: 'none',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 24px rgba(184,124,74,0.14)`
          : '0 1px 4px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        minWidth: 0,
      }}
    >
      <span style={{
        color: hovered ? C.accent : C.muted,
        transition: 'color 0.22s ease',
        lineHeight: 1,
      }}>
        {icon}
      </span>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: hovered ? C.accent : C.muted,
        transition: 'color 0.22s ease',
        lineHeight: 1,
      }}>
        {label}
      </span>
    </motion.a>
  );
};

// ─── Not Found ────────────────────────────────────────────────────────────────
const NotFound = () => (
  <div style={{
    minHeight: '100svh',
    background: C.pageBg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    gap: 12,
    padding: 24,
  }}>
    <span style={{ fontSize: 48, letterSpacing: -2, fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: C.text }}>404</span>
    <p style={{ color: C.muted, fontSize: 15, textAlign: 'center' }}>This profile doesn't exist or hasn't been published yet.</p>
    <a href="/" style={{ marginTop: 8, fontSize: 13, color: C.accent, textDecoration: 'none', fontWeight: 600 }}>← Back to BlackPixel Studio</a>
  </div>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const Loading = () => (
  <div style={{
    minHeight: '100svh',
    background: C.pageBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width: 32,
      height: 32,
      border: `2.5px solid ${C.border}`,
      borderTop: `2.5px solid ${C.accent}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const MeCard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<TeamMember | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) { setMember(null); return; }
    getTeamMemberBySlug(slug).then(setMember);
  }, [slug]);

  if (member === undefined) return <Loading />;
  if (member === null)      return <NotFound />;

  const currentYear = new Date().getFullYear();

  const contactItems = [
    member.phone    && { icon: <Phone size={17} />,   label: 'Phone',    value: member.phone,    href: `tel:${member.phone}` },
    member.email    && { icon: <Mail size={17} />,    label: 'Email',    value: member.email,    href: `mailto:${member.email}` },
    member.location && { icon: <MapPin size={17} />,  label: 'Location', value: member.location, href: `https://maps.google.com/?q=${encodeURIComponent(member.location)}` },
  ].filter(Boolean) as ContactRowProps[];

  const socialItems = [
    member.instagram && { icon: <Instagram size={20} />, label: 'Instagram', href: member.instagram.startsWith('http') ? member.instagram : `https://instagram.com/${member.instagram}` },
    member.linkedin  && { icon: <Linkedin size={20} />,  label: 'LinkedIn',  href: member.linkedin.startsWith('http')  ? member.linkedin  : `https://linkedin.com/in/${member.linkedin}` },
    member.website   && { icon: <Globe size={20} />,     label: 'Website',   href: member.website.startsWith('http')   ? member.website   : `https://${member.website}` },
  ].filter(Boolean) as SocialTileProps[];

  return (
    <div style={{
      minHeight: '100svh',
      background: C.pageBg,
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 20% -10%, rgba(184,124,74,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 110%, rgba(184,124,74,0.06) 0%, transparent 60%)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
    }}>
      {/* Card */}
      <motion.div
        variants={card}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: 440,
          background: C.cardBg,
          borderRadius: 24,
          boxShadow: `
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 12px rgba(0,0,0,0.06),
            0 16px 48px rgba(0,0,0,0.08),
            0 0 0 1px rgba(0,0,0,0.04)
          `,
          overflow: 'hidden',
        }}
      >
        <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* ── Section 1: Studio branding ── */}
          <motion.div
            variants={row}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '18px 24px',
            }}
          >
            <span style={{
              fontSize: 17,
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: C.text,
            }}>
              BP.
            </span>
            <span style={{
              width: 1,
              height: 14,
              background: C.border,
              display: 'block',
            }} />
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: C.muted,
              letterSpacing: '0.04em',
            }}>
              BlackPixel Studio
            </span>
          </motion.div>

          <Divider />

          {/* ── Section 2: Identity ── */}
          <motion.div
            variants={row}
            style={{
              padding: '32px 28px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 6,
            }}
          >
            {/* Avatar */}
            {member.avatar_url && (
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: 10,
                border: `2px solid ${C.border}`,
                boxShadow: `0 2px 12px rgba(0,0,0,0.08)`,
              }}>
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Name */}
            <h1 style={{
              margin: 0,
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 8vw, 36px)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: C.text,
            }}>
              {member.name}
            </h1>

            {/* Role */}
            {member.role && (
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: C.accent,
                marginTop: 2,
              }}>
                {member.role}
              </span>
            )}
          </motion.div>

          {/* ── Section 3: Tagline ── */}
          {member.tagline && (
            <>
              <Divider />
              <motion.div
                variants={row}
                style={{ padding: '20px 28px', textAlign: 'center' }}
              >
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: C.muted,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}>
                  "{member.tagline}"
                </p>
              </motion.div>
            </>
          )}

          {/* ── Section 4: Contact rows ── */}
          {contactItems.length > 0 && (
            <>
              <Divider />
              <motion.div
                variants={stagger}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '20px 20px',
                }}
              >
                {contactItems.map((item) => (
                  <ContactRow key={item.label} {...item} />
                ))}
              </motion.div>
            </>
          )}

          {/* ── Section 5: Social tiles ── */}
          {socialItems.length > 0 && (
            <>
              <Divider />
              <motion.div
                variants={stagger}
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '20px 20px',
                }}
              >
                {socialItems.map((item) => (
                  <SocialTile key={item.label} {...item} />
                ))}
              </motion.div>
            </>
          )}

          {/* ── Section 6: Footer strip ── */}
          <Divider />
          <motion.div
            variants={row}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 24px',
              background: C.strip,
            }}
          >
            <a
              href="https://blackpixel3d.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                color: C.accent,
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              blackpixel3d.com
            </a>
            <span style={{
              fontSize: 12,
              color: C.muted,
              fontWeight: 400,
            }}>
              © {currentYear} BlackPixel Studio
            </span>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default MeCard;