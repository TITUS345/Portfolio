'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card } from '@/app/ui/card';
import { Button } from '@/app/ui/button';
import { Input, Textarea } from '@/app/ui/input';
import { SignupChart } from '@/app/ui/chart';
import type { AuthSession, DashboardStats, LandingSection, Project, Tool, User, Contact } from '@/app/types';
import { ShieldCheck, Trash2, Briefcase, Wrench, PhoneCall, Pencil, Mail, Globe, Phone as PhoneIcon,} from 'lucide-react';




export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sectionOrder, setSectionOrder] = useState('');

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTechStack, setProjectTechStack] = useState('');
  const [projectImageUrl, setProjectImageUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectGithubUrl, setProjectGithubUrl] = useState('');
  const [projectFeatured, setProjectFeatured] = useState(false);

  const [toolName, setToolName] = useState('');
  const [toolCategory, setToolCategory] = useState('');
  const [toolIconName, setToolIconName] = useState('');

  const [contactLabel, setContactLabel] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [contactHref, setContactHref] = useState('');
  const [contactType, setContactType] = useState('');
  const [contactIconName, setContactIconName] = useState('');

  const [loading, setLoading] = useState(true);
  const [submittingSection, setSubmittingSection] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [sessionRes, statsRes, usersRes, sectionsRes, projectsRes, toolsRes, contactsRes] = await Promise.all([
          axios.get('/api/auth/session'),
          axios.get('/api/stats'),
          axios.get('/api/users'),
          axios.get('/api/landing'),
          axios.get('/api/projects'),
          axios.get('/api/tools'),
          axios.get('/api/contacts'),
        ]);

        const sessionData = sessionRes.data.session;
        if (!sessionData || sessionData.role !== 'ADMIN') {
          router.push('/auth/login');
          return;
        }

        setSession(sessionData);
        setStats(statsRes.data);
        setUsers(usersRes.data.users);
        setSections(sectionsRes.data.sections);
        setProjects(projectsRes.data.projects ?? []);
        setTools(toolsRes.data.tools ?? []);
        setContacts(contactsRes.data.contacts ?? []);
      } catch {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  async function handleCreateSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingSection(true);
    try {
      // Sending null ensures Prisma doesn't throw a validation error for missing required strings
      await axios.post('/api/landing', { 
        title, 
        subtitle: subtitle || null,
        content, 
        buttonText: buttonText || null, 
        buttonUrl: buttonUrl || null,
        imageUrl: imageUrl || null,
        order: sectionOrder !== '' ? parseInt(sectionOrder) : sections.length 
      });
      const sectionsRes = await axios.get('/api/landing');
      setSections(sectionsRes.data.sections);
      setTitle('');
      setSubtitle('');
      setContent('');
      setButtonText('');
      setButtonUrl('');
      setImageUrl('');
      setSectionOrder('');
    } catch (error: any) {
      console.error('Error creating section:', error.response?.data || error.message);
      alert(`Error creating section: ${JSON.stringify(error.response?.data || 'Server error')}`);
    } finally {
      setSubmittingSection(false);
    }
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const techStackArray = projectTechStack.split(',').map((t) => t.trim()).filter((t) => t !== '');
      await axios.post('/api/projects', { 
        title: projectTitle, 
        description: projectDescription, 
        techStack: techStackArray,
        imageUrl: projectImageUrl || null,
        projectUrl: projectUrl || null,
        githubUrl: projectGithubUrl || null,
        featured: projectFeatured
      });
      const res = await axios.get('/api/projects');
      setProjects(res.data.projects);
      setProjectTitle('');
      setProjectDescription('');
      setProjectTechStack('');
      setProjectImageUrl('');
      setProjectUrl('');
      setProjectGithubUrl('');
      setProjectFeatured(false);
    } catch (error: any) {
      console.error('Error creating project:', error.response?.data || error.message);
      alert(`Error creating project: ${JSON.stringify(error.response?.data || 'Server error')}`);
    }
  }

  async function handleCreateTool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await axios.post('/api/tools', { name: toolName, category: toolCategory, iconName: toolIconName });
      const res = await axios.get('/api/tools');
      setTools(res.data.tools);
      setToolName('');
      setToolCategory('');
      setToolIconName('');
    } catch (error: any) {
      console.error('Error creating tool:', error.response?.data || error.message);
      alert(`Error creating tool: ${JSON.stringify(error.response?.data || 'Server error')}`);
    }
  }

  async function handleSubmitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = { 
        label: contactLabel, 
        value: contactValue, 
        href: contactHref, 
        type: contactType, 
        iconName: contactIconName 
      };

      if (editingContactId) {
        await axios.patch(`/api/contacts/${editingContactId}`, data);
      } else {
        await axios.post('/api/contacts', data);
      }

      const res = await axios.get('/api/contacts');
      setContacts(res.data.contacts);
      resetContactForm();
    } catch (error: any) {
      console.error('Error saving contact:', error.response?.data || error.message);
      alert(`Error saving contact: ${JSON.stringify(error.response?.data || 'Server error')}`);
    }
  }

  function resetContactForm() {
    setContactLabel('');
    setContactValue('');
    setContactHref('');
    setContactType('');
    setContactIconName('');
    setEditingContactId(null);
  }

  function handleEditContact(contact: Contact) {
    setEditingContactId(contact.id);
    setContactLabel(contact.label);
    setContactValue(contact.value);
    setContactHref(contact.href || '');
    setContactType(contact.type || '');
    setContactIconName(contact.iconName || '');
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleDeleteUser(userId: string) {
    await axios.delete(`/api/users/${userId}`);
    setUsers(users.filter((user) => user.id !== userId));
  }

  async function handleDeleteSection(sectionId: string) {
    await axios.delete(`/api/landing/${sectionId}`);
    setSections(sections.filter((section) => section.id !== sectionId));
  }

  async function handleDeleteProject(projectId: string) {
    await axios.delete(`/api/projects/${projectId}`);
    setProjects(projects.filter((project) => project.id !== projectId));
  }

  async function handleDeleteTool(toolId: string) {
    await axios.delete(`/api/tools/${toolId}`);
    setTools(tools.filter((tool) => tool.id !== toolId));
  }

  async function handleDeleteContact(contactId: string) {
    await axios.delete(`/api/contacts/${contactId}`);
    setContacts(contacts.filter((c) => c.id !== contactId));
  }

  // Helper to get the correct icon based on contact type
  const getContactIconComponent = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return Mail;
      case 'phone':
        return PhoneIcon;
      case 'website':
        return Globe;
      
      default:
        return PhoneCall; // Fallback icon if type is not recognized
    }
  };

  if (loading) {
    return <div className="p-10 text-gray-600">Loading admin dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-600">Admin dashboard</p>
          <h1 className="text-3xl font-bold text-blue-700">Manage portfolio content and people.</h1>
          <p className="text-sm text-gray-600">Manage users, edit landing sections, and update featured projects.</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-3 text-sm text-primary">
          <ShieldCheck size={18} />
          <span className="text-gray-800">{session?.email}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Users</p>
          <p className="text-4xl font-semibold">{stats?.totalUsers ?? 0}</p>
          <p className="text-sm text-gray-600">People who have signed in.</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Signups</p>
          <p className="text-4xl font-semibold">{stats?.totalSignups ?? 0}</p>
          <p className="text-sm text-gray-600">Total signup events captured.</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Landing sections</p>
          <p className="text-4xl font-semibold">{sections.length}</p>
          <p className="text-sm text-gray-600">Editable content blocks visible on the homepage.</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Projects</p>
          <p className="text-4xl font-semibold">{projects.length}</p>
          <p className="text-sm text-gray-600">Live projects shown in the featured list.</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Toolset</p>
          <p className="text-4xl font-semibold">{tools.length}</p>
          <p className="text-sm text-gray-600">Technologies listed in your portfolio toolset.</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Contacts</p>
          <p className="text-4xl font-semibold">{contacts.length}</p>
          <p className="text-sm text-gray-600">Active contact methods for your profile.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">User management</p>
              <h2 className="text-xl font-semibold text-blue-700">Remove users safely</h2>
            </div>
          </div>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-3xl border border-border p-4">
                <div>
                  <p className="font-semibold text-blue-700">{user.name ?? user.email}</p>
                  <p className="text-sm text-gray-600">{user.email} · {user.role}</p>
                </div>
                <Button variant="ghost" className="gap-2 text-destructive" onClick={() => handleDeleteUser(user.id)}>
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-gray-600">New section</p>
            <h2 className="text-xl font-semibold text-blue-700">Create homepage content</h2>
          <form className="grid gap-4" onSubmit={handleCreateSection}>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Section title" required />
            <Input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Section subtitle (optional)" />
            <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} placeholder="Section description" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input value={buttonText} onChange={(event) => setButtonText(event.target.value)} placeholder="Button text (optional)" />
              <Input value={buttonUrl} onChange={(event) => setButtonUrl(event.target.value)} placeholder="Button URL (optional)" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Image URL (optional)" />
              <Input type="number" value={sectionOrder} onChange={(event) => setSectionOrder(event.target.value)} placeholder={`Order (default: ${sections.length})`} />
            </div>
            <Button type="submit" disabled={submittingSection}>
              {submittingSection ? 'Creating...' : 'Create section'}
            </Button>
          </form>
          </div>
        </Card>
      </div>

      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-600">New project</p>
          <h2 className="text-xl font-semibold text-blue-700">Add a featured project</h2>
        </div>
        <form className="grid gap-4" onSubmit={handleCreateProject}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="Project title" required />
              <Input value={projectTechStack} onChange={(event) => setProjectTechStack(event.target.value)} placeholder="Tech stack (comma separated)" required />
            </div>
            <Textarea value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} rows={4} placeholder="Project description" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input value={projectImageUrl} onChange={(event) => setProjectImageUrl(event.target.value)} placeholder="Image URL (optional)" />
            <Input value={projectUrl} onChange={(event) => setProjectUrl(event.target.value)} placeholder="Live URL (optional)" />
            <Input value={projectGithubUrl} onChange={(event) => setProjectGithubUrl(event.target.value)} placeholder="GitHub URL (optional)" />
          </div>
          <div className="flex items-center gap-2 px-1">
            <input 
              type="checkbox" 
              id="featured" 
              checked={projectFeatured} 
              onChange={(e) => setProjectFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm text-gray-600">Display as featured on homepage</label>
          </div>
          <Button type="submit">Create project</Button>
        </form>
      </Card>

      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-600">New tool</p>
          <h2 className="text-xl font-semibold text-blue-700">Add a technology or tool</h2>
        </div>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleCreateTool}>
          <Input value={toolName} onChange={(event) => setToolName(event.target.value)} placeholder="Tool name (e.g. Next.js)" required />
          <Input value={toolCategory} onChange={(event) => setToolCategory(event.target.value)} placeholder="Category (e.g. Frontend)" required />
          <Input value={toolIconName} onChange={(event) => setToolIconName(event.target.value)} placeholder="Icon identifier (e.g. NEXTJS)" required />
          <Button type="submit" className="md:col-span-3">Create tool</Button>
        </form>
      </Card>

      <Card className="space-y-6" id="contact-form">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-600">{editingContactId ? 'Edit contact' : 'New contact'}</p>
          <h2 className="text-xl font-semibold text-blue-700">{editingContactId ? 'Update contact method' : 'Add a contact method'}</h2>
        </div>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmitContact}>
          <Input value={contactLabel} onChange={(event) => setContactLabel(event.target.value)} placeholder="Label (e.g. Email)" required />
          <Input value={contactValue} onChange={(event) => setContactValue(event.target.value)} placeholder="Value (e.g. user@example.com)" required />
          <Input value={contactHref} onChange={(event) => setContactHref(event.target.value)} placeholder="Href (e.g. mailto:user@example.com)" />
          <Input value={contactType} onChange={(event) => setContactType(event.target.value)} placeholder="Type (e.g. email, phone)" />
          <Input value={contactIconName} onChange={(event) => setContactIconName(event.target.value)} placeholder="Icon identifier" />
          <div className="md:col-span-3 flex gap-2">
            <Button type="submit" className="flex-1">
              {editingContactId ? 'Update contact' : 'Create contact'}
            </Button>
            {editingContactId && (
              <Button type="button" variant="ghost" onClick={resetContactForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700">Landing sections</h2>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col gap-2 rounded-3xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-blue-700">{section.title}</p>
                <p className="text-sm text-gray-600">{section.subtitle ?? section.content.slice(0, 80) + '...'}</p>
              </div>
              <Button variant="ghost" className="gap-2 text-destructive" onClick={() => handleDeleteSection(section.id)}>
                <Trash2 size={16} />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700">Featured projects</h2>
        <div className="space-y-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="flex flex-col gap-2 rounded-3xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Briefcase className={project.featured ? "text-primary" : "text-primary/40"} size={20} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-blue-700">{project.title}</p>
                      {project.featured && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Featured</span>}
                    </div>
                    <p className="text-sm text-gray-600">{project.techStack.join(' · ')}</p>
                  </div>
                </div>
                <Button variant="ghost" className="gap-2 text-destructive" onClick={() => handleDeleteProject(project.id)}>
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>
            ))
          ) : <p className="text-sm text-gray-600 italic">No projects added yet.</p>}
        </div>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700">Toolset management</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between rounded-3xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <Wrench className="text-primary/40" size={18} />
                  <div>
                    <p className="font-semibold text-sm text-blue-700">{tool.name}</p>
                    <p className="text-xs text-gray-600">{tool.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-muted px-2 py-1 text-[10px] uppercase tracking-wider font-medium">{tool.iconName}</span>
                  <Button variant="ghost" className="h-8 w-8 text-destructive p-0 flex items-center justify-center" onClick={() => handleDeleteTool(tool.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          ) : <p className="text-sm text-muted italic">No tools added yet.</p>}
        </div>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700">Contact management</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between rounded-3xl border border-border p-4 bg-white shadow-sm text-black">
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = getContactIconComponent(contact.type);
                    return <IconComponent className="text-blue-700" size={18} />;
                  })()}
                  <div>
                    <p className="font-bold text-sm">{contact.label}</p>
                    <p className="text-xs font-medium text-gray-600 truncate max-w-[120px]">{contact.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-xl bg-black px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-white">{contact.type}</span>
                  <Button  className="h-8 w-8 p-0 flex items-center justify-center border border-slate-200 hover:bg-blue-50 text-blue-700" onClick={() => handleEditContact(contact)}>
                    Edit
                    <Pencil size={14} className="text-blue-700" />
                  </Button>
                  <div>
                    <Button variant="secondary" className="h-8 w-8 p-0 flex text-red-500 items-center justify-center border border-red-100 hover:bg-red-50" onClick={() => handleDeleteContact(contact.id)}>
                      Delete
                    <Trash2 size={14} className="text-gray-900" />
                  </Button>
                  </div>
                </div>
              </div>
            ))
          ) : <p className="text-sm text-black font-medium italic">No contacts added yet.</p>}
        </div>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700">Signup trends</h2>
        {stats ? <SignupChart data={stats.signupChart} /> : <p className="text-sm text-muted">No signup chart available.</p>}
      </Card>
    </div>
  );
}
