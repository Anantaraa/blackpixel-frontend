                                                                                                                                                                                                                    import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../hooks/useProjects';
import { uploadToCloudinary } from '../utils/cloudinary';
import { supabase } from '../utils/supabase';

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
        featured: false,
        display_order: 0,
        gallery: [] as string[] // simplified for now
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

    if (loading) return <div className="p-10 text-center">Loading Admin...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white text-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Project CMS</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSignOut}
                            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                        >
                            + Add New Project
                        </button>
                    </div>
                </div>


                {/* Project List */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-4 border-b">Image</th>
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
                                        <img src={project.image} alt={project.title} className="w-16 h-16 object-cover rounded" />
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

                                <div>
                                    <label className="block text-sm font-medium mb-1">Main Image</label>

                                    {/* Image Preview */}
                                    {formData.image && (
                                        <div className="mb-2">
                                            <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded border" />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                            disabled={isUploading}
                                        />
                                        {isUploading && <span className="text-sm text-blue-600">Uploading...</span>}

                                        <input
                                            type="url"
                                            placeholder="Or paste image URL"
                                            className="w-full border p-2 rounded text-sm"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        />
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

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                    />
                                    <label htmlFor="featured">Featured Project</label>
                                </div>

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
