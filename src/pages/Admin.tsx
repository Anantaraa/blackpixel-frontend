import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import type { Project, ProjectImage } from '../hooks/useProjects';
import { uploadToCloudinary } from '../utils/cloudinary';
import { supabase } from '../utils/supabase';
import { HeroSlidesManager } from '../components/admin/HeroSlidesManager';

const Admin = () => {
    const { projects, categories, loading, error, addProject, updateProject, deleteProject } = useProjects();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    // Form State
    const initialForm = {
        title: '',
        category_id: '',
        location: '',
        year: new Date().getFullYear(),
        image: '',
        description: '',
        featured: true, // Default to true
        display_order: 0,
        gallery: [] as ProjectImage[]
    };
    const [formData, setFormData] = useState(initialForm);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateProject(editingId, formData);
            } else {
                await addProject(formData);
            }
            closeForm();
        } catch (err) {
            alert('Error saving project: ' + err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, image: url }));
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Helper to toggle featured status of a gallery image
    const toggleFeaturedImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.map((img, i) =>
                i === index ? { ...img, featured: !img.featured } : img
            )
        }));
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        console.log('Starting gallery upload with files:', files);

        try {
            setIsUploading(true);
            const newImages: { url: string; featured: boolean }[] = [];
            for (let i = 0; i < files.length; i++) {
                console.log(`Uploading file ${i}...`);
                const url = await uploadToCloudinary(files[i]);
                console.log(`File ${i} uploaded. URL:`, url);

                if (!url) {
                    console.error(`Upload returned empty URL for file ${i}`);
                    continue;
                }

                newImages.push({ url, featured: false });
            }
            console.log('New images to add:', newImages);
            setFormData(prev => {
                const updated = { ...prev, gallery: [...prev.gallery, ...newImages] };
                console.log('Updated formData gallery:', updated.gallery);
                return updated;
            });
        } catch (err: any) {
            console.error('Gallery Upload error:', err);
            alert('Gallery Upload failed: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    const setMainImage = (url: string) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            category_id: project.category_id,
            location: project.location,
            year: project.year,
            image: project.image,
            description: project.description || '',
            featured: project.featured,
            display_order: project.display_order || 0,
            gallery: project.gallery || []
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteProject(id);
        }
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(initialForm);
    };

    const [activeTab, setActiveTab] = useState<'projects' | 'hero'>('projects');

    if (loading) return <div className="p-10 text-center">Loading Admin...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white text-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Content Management</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSignOut}
                            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-8">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'projects'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => setActiveTab('hero')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'hero'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        Hero Slides
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'hero' ? (
                    <HeroSlidesManager />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Projects List</h2>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                            >
                                + Add New Project
                            </button>
                        </div>

                        {/* Project List */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="p-4 border-b">Image Group</th>
                                        <th className="p-4 border-b">Title</th>
                                        <th className="p-4 border-b">Order</th>
                                        <th className="p-4 border-b">Category</th>
                                        <th className="p-4 border-b">Location</th>
                                        <th className="p-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex -space-x-4">
                                                    <img src={project.image} alt={project.title} className="w-16 h-16 object-cover rounded border-2 border-white relative z-10" />
                                                    {project.gallery?.slice(0, 3).map((img, i) => (
                                                        <div key={i} className="relative" style={{ zIndex: 9 - i }}>
                                                            <img src={img.url} alt="" className="w-16 h-16 object-cover rounded border-2 border-white" />
                                                            {img.featured && (
                                                                <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-white" title="Featured Image"></div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {(project.gallery?.length || 0) > 3 && (
                                                        <div className="w-16 h-16 rounded bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold relative z-0">
                                                            +{project.gallery.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium">{project.title} {project.featured && '⭐'}</td>
                                            <td className="p-4 font-mono">{project.display_order}</td>
                                            <td className="p-4">{project.categories?.name || 'Uncategorized'}</td>
                                            <td className="p-4">{project.location}</td>
                                            <td className="p-4 space-x-2">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Modal Form */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Project' : 'New Project'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border p-2 rounded"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select
                                            required
                                            className="w-full border p-2 rounded"
                                            value={formData.category_id}
                                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Location</label>
                                        <input
                                            type="text"
                                            className="w-full border p-2 rounded"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Year</label>
                                        <input
                                            type="number"
                                            className="w-full border p-2 rounded"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Order</label>
                                        <input
                                            type="number"
                                            className="w-full border p-2 rounded"
                                            value={formData.display_order}
                                            onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h3 className="font-bold mb-4">Project Imagery</h3>

                                    {/* Main Image */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">Main Image (Cover)</label>
                                        <div className="flex items-start gap-4">
                                            {formData.image && (
                                                <div className="relative group">
                                                    <img src={formData.image} alt="Main" className="w-32 h-20 object-cover rounded border" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="block w-full text-sm text-slate-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-violet-50 file:text-violet-700
                                                        hover:file:bg-violet-100"
                                                    disabled={isUploading}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gallery */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Gallery Images (Multiple)</label>

                                        {/* Gallery Grid */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {formData.gallery.map((img, index) => {
                                                return (
                                                    <div key={index} className="relative group aspect-video bg-gray-100 rounded overflow-hidden">
                                                        <img src={img.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />

                                                        {/* Featured Badge */}
                                                        {img.featured && (
                                                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow z-10">
                                                                Featured
                                                            </div>
                                                        )}

                                                        {/* Actions Overlay */}
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setMainImage(img.url)}
                                                                    className="text-xs bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
                                                                >
                                                                    Main
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleFeaturedImage(index)}
                                                                    className={`text-xs px-2 py-1 rounded ${img.featured
                                                                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                                                                        : 'bg-gray-600 text-white hover:bg-gray-500'
                                                                        }`}
                                                                >
                                                                    {img.featured ? 'Unfeature' : 'Feature'}
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGalleryImage(index)}
                                                                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Add New Button */}
                                            <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-video">
                                                <span className="text-2xl text-gray-400">+</span>
                                                <span className="text-xs text-gray-500">Add Images</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleGalleryUpload}
                                                    className="hidden"
                                                    disabled={isUploading}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        className="w-full border p-2 rounded h-24"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* Featured Checkbox Removed - Default True */}

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Save Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
