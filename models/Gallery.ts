import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    caption: {
        type: String,
        required: [true, 'Please provide a caption'],
        maxlength: [100, 'Caption cannot be more than 100 characters'],
    },
    category: {
        type: String,
        enum: ['summit', 'path', 'valley', 'temple', 'other'],
        default: 'other',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
