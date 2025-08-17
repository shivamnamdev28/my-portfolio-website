// src/components/admin/PortfolioUpload.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { portfolioApi, type Category, type Subcategory } from "@/lib/supabase";
import { uploadFileToCloudinary } from "@/lib/cloudinary"; // Import the new Cloudinary utility

interface PortfolioUploadProps {
  categories: Category[];
  subcategories: Subcategory[];
  onUpload: () => void;
}

const PortfolioUpload = ({ categories, subcategories, onUpload }: PortfolioUploadProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    subcategory_id: "",
    video_url: "" // This will now store Cloudinary video URLs
  });
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [contentType, setContentType] = useState<'image' | 'video'>('image'); // State to toggle between image/video upload

  // Log filtered subcategories whenever dependencies change
  const filteredSubcategories = subcategories.filter(
    sub => sub.category_id === formData.category_id
  );
  console.log("PortfolioUpload: filteredSubcategories:", filteredSubcategories);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files)); // Captures all selected files
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit: Form submission initiated.");

    if (!formData.title.trim() || !formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Title and Category are mandatory.",
        variant: "destructive",
      });
      console.log("handleSubmit: Validation failed (title or category missing).");
      return;
    }

    setUploading(true);
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    let fileUrls: string[] | null = null;

    try {
      if (contentType === 'image' && images.length > 0) {
        console.log("handleSubmit: Content type is image, attempting Cloudinary upload for primary image.");
        // Upload the first image for image_url
        imageUrl = await uploadFileToCloudinary(images[0]);
        console.log("handleSubmit: Primary image uploaded. URL:", imageUrl);

        if (images.length > 1) {
          console.log("handleSubmit: Uploading additional images to Cloudinary.");
          // Upload additional images to Cloudinary and collect their URLs
          const additionalImageUrls = await Promise.all(
            images.slice(1).map(file => uploadFileToCloudinary(file))
          );
          fileUrls = additionalImageUrls;
          console.log("handleSubmit: Additional images uploaded. URLs:", fileUrls);
        }
      } else if (contentType === 'video' && formData.video_url) {
        console.log("handleSubmit: Content type is video, using provided video URL.");
        videoUrl = formData.video_url;
      }

      // Prepare the item data for Supabase
      const itemToCreate = {
        title: formData.title,
        description: null, // Removed from form, set to null
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        image_url: imageUrl,
        video_url: videoUrl,
        file_urls: fileUrls, // Stores array of additional file URLs
        project_type: null, // Removed from form, set to null
        sector: null, // Removed from form, set to null
        featured: false, // Removed from form, default to false
        order_index: 0, // Removed from form, default to 0
      };

      console.log("handleSubmit: Attempting to create portfolio item in Supabase with data:", itemToCreate);
      await portfolioApi.createPortfolioItem(itemToCreate);
      console.log("handleSubmit: Portfolio item created successfully in Supabase.");

      toast({
        title: "Success",
        description: "Portfolio item uploaded successfully!",
      });
      // Reset form
      setFormData({
        title: "",
        category_id: "",
        subcategory_id: "",
        video_url: ""
      });
      setImages([]);
      setContentType('image'); // Reset to default
      onUpload(); // Trigger data reload in AdminDashboard
      console.log("handleSubmit: Form reset and data reload triggered.");
    } catch (error: any) {
      console.error("handleSubmit: Caught an error during upload process:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your portfolio item.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      console.log("handleSubmit: Uploading state set to false.");
    }
  };

  return (
    <Card className="glass-card p-8">
      <CardHeader>
        <CardTitle className="text-2xl">Upload New Portfolio Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Modern E-commerce Website"
              className="bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => {
                console.log("PortfolioUpload: Category selected. New category_id:", value);
                setFormData(prev => ({ ...prev, category_id: value, subcategory_id: "" }));
                console.log("PortfolioUpload: formData after category change:", { ...formData, category_id: value, subcategory_id: "" });
              }}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.category_id && ( // Only render if a category is selected
            <div>
              <Label htmlFor="subcategory">Subcategory (Optional)</Label>
              <Select
                value={formData.subcategory_id}
                onValueChange={(value) => {
                  // If "none-selected" is chosen, set subcategory_id to empty string
                  setFormData(prev => ({ ...prev, subcategory_id: value === "none-selected" ? "" : value }));
                }}
              >
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none-selected">None</SelectItem> {/* Changed value to a distinct string */}
                  {filteredSubcategories.length > 0 ? (
                    filteredSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))
                  ) : (
                    // Display as a plain div/p, not a SelectItem, if no subcategories exist
                    <div className="py-2 px-3 text-sm text-muted-foreground">No subcategories for this category</div>
                  )}
                </SelectContent>
              </Select>
              {filteredSubcategories.length === 0 && formData.category_id && (
                <p className="text-sm text-muted-foreground mt-1">
                  No subcategories available for the selected category.
                </p>
              )}
            </div>
          )}

          {/* Content Type Selector */}
          <div className="flex items-center space-x-4">
            <Label>Content Type:</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={contentType === 'image' ? 'default' : 'outline'}
                onClick={() => setContentType('image')}
              >
                Image
              </Button>
              <Button
                type="button"
                variant={contentType === 'video' ? 'default' : 'outline'}
                onClick={() => setContentType('video')}
              >
                Video (URL)
              </Button>
            </div>
          </div>

          {contentType === 'image' && (
            <div>
              <Label htmlFor="images">Project Images (Upload to Cloudinary)</Label>
              <Input
                id="images"
                type="file"
                multiple // This attribute allows selecting multiple files
                accept="image/*"
                onChange={handleFileChange}
                className="bg-background/50 border-border/50 focus:border-primary file:text-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload one or more images. The first image will be used as the primary.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {images.map((file, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contentType === 'video' && (
            <div>
              <Label htmlFor="video_url">Video URL (YouTube, Vimeo, or direct link)</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="e.g., https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                className="bg-background/50 border-border/50 focus:border-primary"
              />
              <p className="text-sm text-muted-foreground">
                Paste YouTube, Vimeo, or direct video URL. This keeps your site lightweight and loads faster.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            disabled={uploading}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white"
          >
            {uploading ? (
              <>
                <Upload className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload Portfolio Item
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PortfolioUpload;
