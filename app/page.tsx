'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';
import SiteSidebar from '../components/site-sidebar';
import { AnimatedText } from './ui/animated-text';
import { Section } from './ui/section';
import { Card } from './ui/card';
import { Button } from './ui/button';
import type { Contact, LandingSection, Project, Tool } from '@/app/types';
import { ArrowRight, Briefcase, Database, Layers, MessageCircle, Mail, Globe, Phone, PhoneCall } from 'lucide-react';

export default function HomePage() {
  const [landing, setLanding] = useState<LandingSection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [landingRes, projectsRes, toolsRes, contactsRes] = await Promise.all([
        axios.get('/api/landing'),
        axios.get('/api/projects'),
        axios.get('/api/tools'),
        axios.get('/api/contacts'),
      ]);

      setLanding(landingRes.data.sections ?? []);
      setProjects(projectsRes.data.projects ?? []);
      setTools(toolsRes.data.tools ?? []);
      setContacts(contactsRes.data.contacts ?? []);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 text-gray-800 m-0 p-0">
      <SiteSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-6 pb-16 w-full">
          <section className="grid gap-10 pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <AnimatedText text="Build with purpose, scale with confidence." className="text-4xl font-bold leading-tight sm:text-5xl text-blue-700" />
              <p className="max-w-2xl text-lg text-gray-800">``I am a fullstack developer experienced in frontend and backend systems, CI/CD, containerization,Git,GitHub and REST API-driven projects ``.</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" onClick={() => window.location.assign('/auth/signup')}>Start the journey</Button>
                <Button variant="secondary" onClick={() => window.location.assign('/dashboard')} className="border border-transparent hover:border-blue-700 transition-all">Dashboard preview</Button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-gray-400 bg-gray-300 p-8 shadow-xl shadow-slate-900/5">
              <div className="grid gap-5">
                <div className="rounded-3xl bg-primary/10 p-6 text-primary">
                  <p className="text-sm uppercase tracking-[0.35em] text-gray-700">What I bring</p>
                  <h2 className="mt-3 text-2xl text-blue-700 font-semibold">Fullstack systems with real product thinking.</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <div className="flex items-center gap-3 text-primary"><Database size={24} /></div>
                    <p className="mt-4 text-sm text-gray-800">Database services with PostgreSQL, MongoDB, Neon, and SQL Server-ready designs.</p>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3 text-primary"><Layers size={24} /></div>
                    <p className="mt-4 text-sm text-gray-800">Polished frontend flows, accessible UI, and reusable components with Shadcn design tokens.Tailwind.Form Validators with Zod..</p>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3 text-primary"><MessageCircle size={24} /></div>
                    <p className="mt-4 text-sm text-gray-800">Notification-ready signup flows, authenticated dashboards, and admin controls.</p>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-3 text-primary"><Briefcase size={24} /></div>
                    <p className="mt-4 text-sm text-gray-800">Backend services with .NET, Next.js.Typescript</p>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <Section title="Landing copy" description="Editable portfolio content driven by APIs for texts, hero sections, and marketing messages.">
            <div className="grid gap-6 md:grid-cols-2">
              {landing.length > 0 ? (
                [...landing].sort((a, b) => a.order - b.order).map((section) => (
                  <Card key={section.id} className="space-y-4">
                    {section.imageUrl && (
                      <img src={section.imageUrl} alt={section.title} className="aspect-video w-full rounded-xl object-cover" />
                    )}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-700">{section.title}</h3>
                        {section.subtitle ? <p className="text-sm text-gray-800">{section.subtitle}</p> : null}
                      </div>
                      <ArrowRight className="text-primary" />
                    </div>
                    <p className="text-sm text-gray-800">{section.content}</p>
                    {section.buttonText ? (
                      <a href={section.buttonUrl ?? '#'} className="text-sm font-semibold text-primary hover:text-primary/80">
                        {section.buttonText}
                      </a>
                    ) : null}
                  </Card>
                ))
              ) : ( 
                <p className="text-sm text-gray-600">No landing sections found yet. Add data through the admin dashboard.</p>
              )}
            </div>
          </Section>

          <Section title="Featured projects" description="Projects and case studies that illustrate my tooling, architecture, and growth mindset.">
            <div className="grid gap-6 xl:grid-cols-3">
              {projects.filter(p => p.featured).length > 0 ? (
                projects.filter(p => p.featured).map((project) => (
                  <Card key={project.id} className="space-y-4">
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="aspect-video w-full rounded-xl object-cover" />
                    )}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-blue-700">{project.title}</h3>
                      <p className="text-sm text-gray-800">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="rounded-full bg-muted/70 px-3 py-1">{tech}</span>
                      ))}
                    </div>
                    {(project.projectUrl || project.githubUrl) && (
                      <div className="flex gap-4 pt-2">
                        {project.projectUrl && (
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:text-primary/80">
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                            Source Code
                          </a>
                        )}
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-10">
                  <p className="text-sm text-gray-600 italic">No featured projects found. Add projects and mark them as featured in the admin dashboard.</p>
                </div>
              )}
            </div>
          </Section>

          <Section title="Toolset" description="Technologies and workflows that help me ship fast, maintain quality, and support scale.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Card key={tool.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-blue-700">{tool.name}</p>
                    <p className="text-sm text-gray-800">{tool.category}</p>
                  </div>
                  <span className="rounded-2xl bg-muted px-3 py-2 text-xs uppercase tracking-[0.2em]">{tool.iconName}</span>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Contact" description="Reach out through email, WhatsApp, phone, or future platforms as this portfolio scales.">
            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((contact) => {
                const IconComponent = (() => {
                  switch (contact.type?.toLowerCase()) {
                    case 'email': return Mail;
                    case 'phone': return Phone;
                    case 'website': return Globe;
                    default: return PhoneCall;
                  }
                })();

                return (
                  <Card key={contact.id} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                      <IconComponent size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-blue-700">{contact.label}</p>
                      <a href={contact.href || '#'} className="text-primary hover:underline block truncate text-sm">
                        {contact.value}
                      </a>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Section>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
