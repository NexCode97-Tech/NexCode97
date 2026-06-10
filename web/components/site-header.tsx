'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Monitor,
  Smartphone,
  Globe,
  LayoutDashboard,
  ShoppingCart,
  Zap,
} from 'lucide-react';
import {
  FaReact, FaNodeJs, FaDocker, FaGitAlt,
} from 'react-icons/fa';
import {
  SiNextdotjs, SiTypescript, SiTailwindcss, SiPrisma,
  SiPostgresql, SiVercel, SiCloudinary, SiRailway,
  SiFramer, SiReactquery, SiPnpm,
} from 'react-icons/si';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

const serviciosLinks: LinkItem[] = [
  { title: 'Apps web a la medida', href: '#servicios', icon: Monitor,        description: 'Plataformas con roles, dashboards y lógica propia' },
  { title: 'Apps móviles',         href: '#servicios', icon: Smartphone,     description: 'iOS y Android, nativas o multiplataforma' },
  { title: 'Páginas y landings',   href: '#servicios', icon: Globe,          description: 'Sitios de alto impacto que convierten visitas' },
  { title: 'Sistemas de gestión',  href: '#servicios', icon: LayoutDashboard,description: 'ERPs, CRMs y herramientas internas a tu medida' },
  { title: 'Tiendas en línea',     href: '#servicios', icon: ShoppingCart,   description: 'E-commerce completo con pagos y administración' },
  { title: 'Integraciones y PWA',  href: '#servicios', icon: Zap,            description: 'WhatsApp, pagos, APIs externas y apps instalables' },
];

type TechItem = {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const techGroups: { category: string; items: TechItem[] }[] = [
  {
    category: 'Frontend',
    items: [
      { label: 'React',        description: 'UI declarativa y componentizada',      icon: <FaReact />,       color: '#61DAFB' },
      { label: 'Next.js',      description: 'SSR, rutas y optimización automática', icon: <SiNextdotjs />,   color: '#ffffff' },
      { label: 'TypeScript',   description: 'Tipado estático para código robusto',  icon: <SiTypescript />,  color: '#3178C6' },
      { label: 'Tailwind CSS', description: 'Estilos utilitarios sin fricción',     icon: <SiTailwindcss />, color: '#06B6D4' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { label: 'Node.js',     description: 'Runtime JS rápido y escalable',          icon: <FaNodeJs />,     color: '#339933' },
      { label: 'PostgreSQL',  description: 'Base de datos relacional de alto nivel', icon: <SiPostgresql />, color: '#336791' },
      { label: 'Prisma ORM',  description: 'ORM moderno con tipado completo',        icon: <SiPrisma />,     color: '#5a67d8' },
      { label: 'Cloudinary',  description: 'Gestión de imágenes y archivos en nube', icon: <SiCloudinary />, color: '#3448C5' },
    ],
  },
  {
    category: 'Infraestructura',
    items: [
      { label: 'Vercel',  description: 'Deploy instantáneo con CDN global',       icon: <SiVercel />,  color: '#ffffff' },
      { label: 'Railway', description: 'Backend y bases de datos en la nube',     icon: <SiRailway />, color: '#ffffff' },
      { label: 'Docker',  description: 'Contenedores para entornos consistentes', icon: <FaDocker />,  color: '#2496ED' },
      { label: 'Git',     description: 'Control de versiones y colaboración',     icon: <FaGitAlt />,  color: '#F05032' },
    ],
  },
];

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);
  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);
  React.useEffect(() => { onScroll(); }, [onScroll]);
  return scrolled;
}

const TABS = ['Servicios', 'Tecnología', 'Nosotros'] as const;
type Tab = typeof TABS[number];

function MobileMenuPortal({ open, activeTab, setActiveTab, onClose }: {
  open: boolean;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();

  const iosEase = [0.32, 0.72, 0, 1] as [number, number, number, number];
  const strongEaseOut = [0.23, 1, 0.32, 1] as [number, number, number, number];

  const menuVariants = {
    hidden:  { y: prefersReduced ? 0 : '-100%' as const, opacity: prefersReduced ? 0 : 1 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: iosEase } },
    exit:    { y: prefersReduced ? 0 : '-100%' as const, opacity: prefersReduced ? 0 : 1, transition: { duration: 0.35, ease: iosEase } },
  };

  const contentVariants = {
    hidden:  { opacity: 0, scale: prefersReduced ? 1 : 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: strongEaseOut } },
    exit:    { opacity: 0, scale: prefersReduced ? 1 : 0.97, transition: { duration: 0.12, ease: 'easeIn' as const } },
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          key="mobile-menu"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden"
          style={{ background: 'rgba(9,9,14,0.98)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          {/* Tab bar */}
          <div className="flex gap-2 px-4 pt-4 pb-2 shrink-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-150"
                  style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.35)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.5)' }}
                      transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-4 h-px shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-4"
              >
                {activeTab === 'Servicios' && (
                  <div className="flex flex-col gap-1">
                    <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                      ¿Qué necesitas?
                    </p>
                    {serviciosLinks.map((link) => (
                      <a
                        key={link.title}
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-white/5 cursor-pointer"
                      >
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
                        >
                          <link.icon className="size-4" style={{ color: '#a78bfa' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{link.title}</p>
                          {link.description && (
                            <p className="text-xs leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                              {link.description}
                            </p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {activeTab === 'Tecnología' && (
                  <div className="flex flex-col gap-4">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                      Nuestro stack
                    </p>
                    {techGroups.map((group) => (
                      <div key={group.category}>
                        <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {group.category}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {group.items.map((tech) => (
                            <div
                              key={tech.label}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-white/5"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                              <span className="text-base shrink-0" style={{ color: tech.color }}>{tech.icon}</span>
                              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{tech.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'Nosotros' && (
                  <div className="flex flex-col gap-3">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                      El equipo
                    </p>
                    {/* Card equipo */}
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                          <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>N</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">NexCode97</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Software a la medida · Colombia</p>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        No vendemos plantillas. Construimos la solución exacta que tu negocio necesita, sin mensualidades y con código que tú posees.
                      </p>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Proyectos', value: '15+' },
                        { label: 'Satisfacción', value: '100%' },
                        { label: 'Experiencia', value: '5+ años' },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-xl p-3 text-center"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p className="text-base font-extrabold text-white">{stat.value}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Link nosotros */}
                    <a
                      href="#nosotros"
                      onClick={onClose}
                      className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-white/5 cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-sm font-semibold text-white">Conocer más sobre nosotros</span>
                      <span style={{ color: '#a78bfa' }}>→</span>
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA fijo abajo */}
          <div className="p-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new Event('open:contact-form'));
              }}
              className="w-full rounded-full py-3.5 text-sm font-bold cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.97]"
              style={{ background: '#FFF200', color: '#09090e' }}
            >
              Comenzar proyecto
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ListItem({ title, description, icon: Icon, href, className }: LinkItem & { className?: string }) {
  return (
    <NavigationMenuLink asChild>
      <a
        href={href}
        className={cn(
          'flex flex-row gap-3 rounded-lg p-2.5 transition-colors duration-150 hover:bg-white/6 cursor-pointer',
          className,
        )}
      >
        <div
          className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-md"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <Icon className="size-4" style={{ color: '#a78bfa' }} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-white">{title}</span>
          {description && <span className="text-xs text-white/45 leading-tight mt-0.5">{description}</span>}
        </div>
      </a>
    </NavigationMenuLink>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<Tab>('Servicios');
  const scrolled = useScroll(10);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300',
        scrolled && 'border-white/8',
      )}
      style={{
        background: '#09090e',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <nav className="mx-auto flex h-16 md:h-14 w-full max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <a href="/" className="flex items-center rounded-lg p-1 transition-opacity hover:opacity-80">
          <Image
            src="/logo-nuevo.png"
            alt="NexCode97"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </a>

        {/* Nav desktop — solo se monta en pantallas md+ para evitar conflicto de foco en móvil */}
        {isDesktop && <NavigationMenu className="flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <span style={{ color: '#FFF200' }}>
                  Nex
                </span>
                Technology
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[580px] p-4">
                  {/* Encabezado */}
                  <div className="mb-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <p className="text-sm font-bold text-white">Stack tecnológico</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Las herramientas que usamos para construir cada proyecto
                    </p>
                  </div>
                  {/* Grupos */}
                  <div className="flex flex-col gap-4">
                    {techGroups.map((group) => (
                      <div key={group.category}>
                        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>
                          {group.category}
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {group.items.map((tech) => (
                            <div
                              key={tech.label}
                              className="flex flex-col items-center gap-2 rounded-lg p-2.5 text-center cursor-pointer"
                              style={{ transition: 'background 100ms ease-out' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
                                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.18)', color: tech.color }}
                              >
                                {tech.icon}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-white leading-tight">{tech.label}</p>
                                <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{tech.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ver todas */}
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <a
                      href="/tecnologias"
                      className="flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors duration-150 group"
                      style={{ color: '#ffffff' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span>Ver todas las tecnologías</span>
                      <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                    </a>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[520px] grid-cols-2 gap-1.5 p-3">
                  {serviciosLinks.map((item) => (
                    <li key={item.title}>
                      <ListItem {...item} />
                    </li>
                  ))}
                </ul>
                <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <p className="text-xs text-white/40">
                    ¿Tienes un proyecto en mente?{' '}
                    <a
                      href="https://wa.me/573006359008"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold transition-colors hover:text-violet-400"
                      style={{ color: '#a78bfa' }}
                    >
                      Contacta a ventas
                    </a>
                  </p>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a
                  href="#nosotros"
                  className="inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white"
                >
                  Nosotros
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>}

        {/* Auth + hamburger */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white hover:bg-white/8 cursor-pointer">
              Log in
            </button>
            <button className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 cursor-pointer"
              style={{ background: '#FFF200', color: '#09090e' }}>
              Sign up
            </button>
          </div>

          <a
            href="/login"
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl border transition-colors hover:bg-white/8 cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
            aria-label="Iniciar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl border transition-colors hover:bg-white/8 cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} className="size-6" duration={300} />
          </button>
        </div>
      </nav>

      <MobileMenuPortal
        open={open}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}
