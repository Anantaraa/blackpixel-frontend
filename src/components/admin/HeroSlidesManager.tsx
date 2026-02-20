import React, { useState } from 'react';
import { useHeroSlides } from '../../hooks/useHeroSlides';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { Trash2, Plus } from 'lucide-react';

export const HeroSlidesManager: React.FC = () => {
    const { slides, loading, error, addSlide, deleteSlide, refresh } = useHeroSlides();
    const [isUploading, setIsUploading] = useState(false);

    // Inline form state
    const [newSlideImage, setNewSlideImage] = useState('');
    const [newSlideCaption, setNewSlideCaption] = useState('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await uploadToCloudinary(file);
            setNewSlideImage(url);
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddSlide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSlideImage) return;

        try {
            await addSlide({
                image_url: newSlideImage,
                caption: newSlideCaption, // Caption is no longer collected via input, but still part of the slide object
            });
            setNewSlideImage('');
            setNewSlideCaption(''); // Resetting caption, though not directly from input
            refresh();
        } catch (err: any) {
            alert('Error adding slide: ' + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this slide?')) {
            await deleteSlide(id);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Slides...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-4">Hero Slides (3D Cube)</h2>

            {/* Slide List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {slides.map((slide) => (
                    <div key={slide.id} className="relative group aspect-video bg-gray-100 rounded overflow-hidden border">
                        <img src={slide.image_url} alt="Slide" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => handleDelete(slide.id)}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                            Order: {slide.display_order}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Form */}
            <form onSubmit={handleAddSlide} className="flex flex-col gap-4 border-t pt-4">
                <div>
                    <label className="block text-sm font-medium mb-1">New Slide Image</label>

                    {/* Image Preview */}
                    {newSlideImage && (
                        <div className="mb-2">
                            <img src={newSlideImage} alt="Preview" className="w-32 h-20 object-cover rounded border" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
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
                        {isUploading && <span className="text-sm text-primary">Uploading...</span>}

                        <input
                            type="url"
                            placeholder="Or paste image URL"
                            className="w-full border p-2 rounded text-sm"
                            value={newSlideImage}
                            onChange={(e) => setNewSlideImage(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!newSlideImage || isUploading}
                        className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                    >
                        <Plus size={16} /> Add Slide
                    </button>
                </div>
            </form>
        </div>
    );
};
