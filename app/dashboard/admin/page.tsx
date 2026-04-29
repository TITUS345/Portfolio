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
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
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

  async function handleSubmitSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingSection(true);
    try {
      const data = { 
        title, 
        subtitle: subtitle || null,
        content, 
        buttonText: buttonText || null, 
        buttonUrl: buttonUrl || null,
        imageUrl: imageUrl || null,
        order: sectionOrder !== '' ? parseInt(sectionOrder) : sections.length 
      };

      if (editingSectionId) {
        await axios.patch(`/api/landing/${editingSectionId}`, data);
      } else {
        await axios.post('/api/landing', data);
      }

      const sectionsRes = await axios.get('/api/landing');
      setSections(sectionsRes.data.sections);
      resetSectionForm();
    } catch (error: any) {
      console.error('Error saving section:', error.response?.data || error.message);
      alert(`Error saving section: ${JSON.stringify(error.response?.data || 'Server error')}`);
    } finally {
      setSubmittingSection(false);
    }
  }

  function resetSectionForm() {
      setTitle('');
      setSubtitle('');
      setContent('');
      setButtonText('');
      setButtonUrl('');
      setImageUrl('');
      setSectionOrder('');
      setEditingSectionId(null);
  }

  function handleEditSection(section: LandingSection) {
    setEditingSectionId(section.id);
    setTitle(section.title);
    setSubtitle(section.subtitle || '');
    setContent(section.content);
    setButtonText(section.buttonText || '');
    setButtonUrl(section.buttonUrl || '');
    setImageUrl(section.imageUrl || '');
    setSectionOrder(section.order.toString());
    document.getElementById('section-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSubmitProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const techStackArray = projectTechStack.split(',').map((t) => t.trim()).filter((t) => t !== '');
      const data = { 
        title: projectTitle, 
        description: projectDescription, 
        techStack: techStackArray,
        imageUrl: projectImageUrl || null,
        projectUrl: projectUrl || null,
        githubUrl: projectGithubUrl || null,
        featured: projectFeatured
      };

      if (editingProjectId) {
        await axios.patch(`/api/projects/${editingProjectId}`, data);
      } else {
        await axios.post('/api/projects', data);
      }

      const res = await axios.get('/api/projects');
      setProjects(res.data.projects);
      resetProjectForm();
    } catch (error: any) {
      console.error('Error saving project:', error.response?.data || error.message);
      alert(`Error saving project: ${JSON.stringify(error.response?.data || 'Server error')}`);
    }
  }

  function resetProjectForm() {
      setProjectTitle('');
      setProjectDescription('');
      setProjectTechStack('');
      setProjectImageUrl('');
      setProjectUrl('');
      setProjectGithubUrl('');
      setProjectFeatured(false);
      setEditingProjectId(null);
  }

  function handleEditProject(project: Project) {
    setEditingProjectId(project.id);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectTechStack(project.techStack.join(', '));
    setProjectImageUrl(project.imageUrl || '');
    setProjectUrl(project.projectUrl || '');
    setProjectGithubUrl(project.githubUrl || '');
    setProjectFeatured(project.featured);
    document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSubmitTool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = { name: toolName, category: toolCategory, iconName: toolIconName };
      if (editingToolId) {
        await axios.patch(`/api/tools/${editingToolId}`, data);
      } else {
        await axios.post('/api/tools', data);
      }
      const res = await axios.get('/api/tools');
      setTools(res.data.tools);
      resetToolForm();
    } catch (error: any) {
      console.error('Error saving tool:', error.response?.data || error.message);
      alert(`Error saving tool: ${JSON.stringify(error.response?.data || 'Server error')}`);
    }
  }

  function resetToolForm() {
    setToolName('');
    setToolCategory('');
    setToolIconName('');
    setEditingToolId(null);
  }

  function handleEditTool(tool: Tool) {
    setEditingToolId(tool.id);
    setToolName(tool.name);
    setToolCategory(tool.category);
    setToolIconName(tool.iconName || '');
    document.getElementById('tool-form')?.scrollIntoView({ behavior: 'smooth' });
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

  async function handleSubmitUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingUserId) return;
    try {
      await axios.patch(`/api/users/${editingUserId}`, { name: userName, role: userRole });
      const usersRes = await axios.get('/api/users');
      setUsers(usersRes.data.users);
      resetUserForm();
    } catch (error: any) {
      console.error('Error saving user:', error.response?.data || error.message);
    }
  }

  function handleEditUser(user: User) {
    setEditingUserId(user.id);
    setUserName(user.name || '');
    setUserRole(user.role);
    document.getElementById('user-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  function resetUserForm() {
    setEditingUserId(null);
    setUserName('');
    setUserRole('');
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
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-3xl border border-border p-4 gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-blue-700">{user.name ?? user.email}</p>
                  <p className="text-sm text-gray-600">{user.email} · {user.role}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                  <Button variant="secondary" onClick={() => handleEditUser(user)}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {editingUserId && (
            <div id="user-form" className="mt-4 p-4 border rounded-2xl bg-muted/30 space-y-4">
              <h3 className="font-semibold">Edit User: {userName}</h3>
              <form className="flex gap-4" onSubmit={handleSubmitUser}>
                <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User name" />
                <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="rounded-md border p-2 text-sm">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <Button type="submit">Update</Button>
                <Button type="button" variant="ghost" onClick={resetUserForm}>Cancel</Button>
              </form>
            </div>
          )}
        </Card>

        <Card id="section-form">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-gray-600">{editingSectionId ? 'Edit section' : 'New section'}</p>
            <h2 className="text-xl font-semibold text-blue-700">{editingSectionId ? 'Update homepage content' : 'Create homepage content'}</h2>
          <form className="grid gap-4" onSubmit={handleSubmitSection}>
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
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={submittingSection}>
                {submittingSection ? 'Saving...' : (editingSectionId ? 'Update section' : 'Create section')}
              </Button>
              {editingSectionId && (
                <Button type="button" variant="ghost" onClick={resetSectionForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
          </div>
        </Card>
      </div>

      <Card className="space-y-6" id="project-form">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-600">{editingProjectId ? 'Edit project' : 'New project'}</p>
          <h2 className="text-xl font-semibold text-blue-700">{editingProjectId ? 'Update featured project' : 'Add a featured project'}</h2>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmitProject}>
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
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingProjectId ? 'Update project' : 'Create project'}
            </Button>
            {editingProjectId && (
              <Button type="button" variant="ghost" onClick={resetProjectForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="space-y-6" id="tool-form">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-600">{editingToolId ? 'Edit tool' : 'New tool'}</p>
          <h2 className="text-xl font-semibold text-blue-700">{editingToolId ? 'Update technology or tool' : 'Add a technology or tool'}</h2>
        </div>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmitTool}>
          <Input value={toolName} onChange={(event) => setToolName(event.target.value)} placeholder="Tool name (e.g. Next.js)" required />
          <Input value={toolCategory} onChange={(event) => setToolCategory(event.target.value)} placeholder="Category (e.g. Frontend)" required />
          <Input value={toolIconName} onChange={(event) => setToolIconName(event.target.value)} placeholder="Icon identifier (e.g. NEXTJS)" required />
          <div className="md:col-span-3 flex gap-2">
            <Button type="submit" className="flex-1">
              {editingToolId ? 'Update tool' : 'Create tool'}
            </Button>
            {editingToolId && (
              <Button type="button" variant="ghost" onClick={resetToolForm}>
                Cancel
              </Button>
            )}
          </div>
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
            <div key={section.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-3xl border border-border p-4">
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-blue-700">{section.title}</p>
                <p className="text-sm text-gray-600">{section.subtitle ?? section.content.slice(0, 80) + '...'}</p>
              </div>
                <div className="flex gap-2 flex-wrap justify-end mt-2 sm:mt-0">
                  <Button variant="secondary" onClick={() => handleEditSection(section)}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="text-destructive" onClick={() => handleDeleteSection(section.id)}>
                    Delete
                  </Button>
                </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700">Featured projects</h2>
        <div className="space-y-3">
          {projects.length > 0 ? (
            projects.map((project) => ( 
              <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-3xl border border-border p-4">
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <Briefcase className={project.featured ? "text-primary" : "text-primary/40"} size={20} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-blue-700">{project.title}</p>
                      {project.featured && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Featured</span>}
                    </div>
                    <p className="text-sm text-gray-600">{project.techStack.join(' · ')}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end mt-2 sm:mt-0">
                  <Button variant="secondary" onClick={() => handleEditProject(project)}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="text-destructive" onClick={() => handleDeleteProject(project.id)}>
                    Delete
                  </Button>
                </div>
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
              <div key={tool.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-3xl border border-border p-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Wrench className="text-primary/40" size={18} />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-blue-700">{tool.name}</p>
                    <p className="text-xs text-gray-600 truncate">{tool.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                  <span className="rounded-xl bg-muted px-2 py-1 text-[10px] uppercase tracking-wider font-medium">{tool.iconName}</span>
                  <Button variant="secondary" className="h-8 px-3 flex items-center justify-center border border-slate-200 hover:bg-blue-50 text-blue-700" onClick={() => handleEditTool(tool)}>
                    Edit
                  </Button>
                  <Button variant="ghost" className="h-8 px-3 text-destructive flex items-center justify-center" onClick={() => handleDeleteTool(tool.id)}>
                    Delete
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
              <div key={contact.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-3xl border border-border p-4 bg-white shadow-sm text-black gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {(() => {
                    const IconComponent = getContactIconComponent(contact.type);
                    return <IconComponent className="text-blue-700" size={18} />;
                  })()}
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{contact.label}</p>
                    <p className="text-xs font-medium text-gray-600 truncate">{contact.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                  <span className="rounded-xl bg-black px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-white shrink-0">{contact.type}</span>
                  <Button variant="secondary" className="h-8 px-3 flex items-center justify-center border border-slate-200 hover:bg-blue-50 text-blue-700" onClick={() => handleEditContact(contact)}>
                    Edit
                  </Button>
                  <Button variant="secondary" className="h-8 px-3 flex text-red-500 items-center justify-center border border-red-100 hover:bg-red-50" onClick={() => handleDeleteContact(contact.id)}>
                    Delete
                  </Button>
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
