// src/components/admin/PortfolioManager.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, Eye, Star, Image, Video, FileText, FolderOpen, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { portfolioApi, type Category, type Subcategory, type PortfolioItem } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PortfolioManagerProps {
  portfolioItems: PortfolioItem[];
  categories: Category[];
  subcategories: Subcategory[];
  onUpdate: () => void;
}

// Define a type for a generic media item
interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

const PortfolioManager = ({ portfolioItems, categories, subcategories, onUpdate }: PortfolioManagerProps) => {
  const [filter, setFilter] = useState({ category: "", subcategory: "", featured: "" });
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  // States for full-screen media viewer
  const [fullScreenMedia, setFullScreenMedia] = useState<MediaItem | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);


  useEffect(() => {
    console.log("PortfolioManager: Component mounted/re-rendered.");
    console.log("PortfolioManager: Received portfolioItems:", portfolioItems);
    console.log("PortfolioManager: Received categories:", categories);
    console.log("PortfolioManager: Received subcategories:", subcategories);
  }, [portfolioItems, categories, subcategories]);

  // Effect for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (fullScreenMedia && viewingItem) {
        if (event.key === 'ArrowLeft') {
          goToPreviousMedia();
        } else if (event.key === 'ArrowRight') {
          goToNextMedia();
        }
      }
    };

    // Add event listener when fullScreenMedia is active
    if (fullScreenMedia) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Clean up event listener when fullScreenMedia becomes null
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullScreenMedia, viewingItem, currentMediaIndex]); // Dependencies for the effect

  // Filter subcategories based on the selected main category
  const filteredSubcategoriesForDisplay = subcategories.filter(
    sub => sub.category_id === filter.category
  );
  console.log("PortfolioManager: filteredSubcategoriesForDisplay:", filteredSubcategoriesForDisplay);


  // Filter portfolio items based on category, subcategory (if selected), and featured status
  const filteredItems = portfolioItems.filter(item => {
    // If a specific subcategory is selected to view items, filter by it
    if (selectedSubcategoryId && item.subcategory_id !== selectedSubcategoryId) {
      return false;
    }
    // If no specific subcategory is selected (showing subcategories or all items),
    // but a category filter is active, apply it.
    if (!selectedSubcategoryId && filter.category && item.category_id !== filter.category) {
      return false;
    }
    // Apply featured filter
    if (filter.featured === "true" && !item.featured) {
      return false;
    }
    if (filter.featured === "false" && item.featured) {
      return false;
    }
    // If no category filter is applied and no subcategory is selected, show all items
    if (!filter.category && !selectedSubcategoryId) {
      return true;
    }
    // If a category is selected (and potentially a subcategory for item display)
    // and the item matches the category (and subcategory if applicable)
    return item.category_id === filter.category || !filter.category;
  });
  console.log("PortfolioManager: filteredItems after filtering:", filteredItems);


  const handleToggleFeatured = async (id: string, featured: boolean) => {
    console.log(`handleToggleFeatured: Toggling featured for item ID: ${id} to ${featured}`);
    try {
      setLoading(true);
      await portfolioApi.updatePortfolioItem(id, { featured });
      onUpdate();
      toast({
        title: "Success",
        description: `Item ${featured ? "featured" : "unfeatured"} successfully`
      });
      console.log("handleToggleFeatured: Update successful.");
    } catch (error: any) {
      console.error("handleToggleFeatured: Error updating item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log("handleToggleFeatured: Loading state set to false.");
    }
  };

  const confirmDeleteItem = async () => {
    console.log(`confirmDeleteItem: Confirming deletion for item ID: ${itemToDelete}`);
    if (!itemToDelete) {
      console.warn("confirmDeleteItem: No item ID to delete.");
      return;
    }

    try {
      setLoading(true);
      await portfolioApi.deletePortfolioItem(itemToDelete);
      onUpdate();
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully (from database).",
      });
      console.log("confirmDeleteItem: Item deleted successfully.");
    } catch (error: any) {
      console.error("confirmDeleteItem: Error deleting item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete item. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setItemToDelete(null);
      console.log("confirmDeleteItem: Loading state and itemToDelete reset.");
    }
  };

  const handleUpdateItem = async () => {
    console.log("handleUpdateItem: Attempting to update item:", editingItem);
    if (!editingItem || !editingItem.title.trim() || !editingItem.category_id) {
      toast({
        title: "Validation Error",
        description: "Title and Category are mandatory.",
        variant: "destructive"
      });
      console.log("handleUpdateItem: Validation failed.");
      return;
    }

    try {
      setLoading(true);
      await portfolioApi.updatePortfolioItem(editingItem.id, {
        title: editingItem.title,
        description: editingItem.description,
        category_id: editingItem.category_id,
        subcategory_id: editingItem.subcategory_id,
        project_type: editingItem.project_type,
        sector: editingItem.sector,
        featured: editingItem.featured,
        order_index: editingItem.order_index,
        image_url: editingItem.image_url,
        video_url: editingItem.video_url,
        file_urls: editingItem.file_urls,
      });
      setEditingItem(null);
      onUpdate();
      toast({
        title: "Success",
        description: "Portfolio item updated successfully"
      });
      console.log("handleUpdateItem: Update successful.");
    } catch (error: any) {
      console.error("handleUpdateItem: Error updating portfolio item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update portfolio item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log("handleUpdateItem: Loading state set to false.");
    }
  };

  const getMediaIcon = (item: PortfolioItem) => {
    if (item.video_url) return Video;
    if (item.image_url) return Image;
    return FileText;
  };

  // Utility to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
    const match = url.match(regExp);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&playsinline=1` : null;
  };

  // Utility to get Vimeo embed URL
  const getVimeoEmbedUrl = (url: string) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(?:video\/|)(\d+)(?:\S+)?/;
    const match = url.match(regExp);
    return match && match[1] ? `https://player.vimeo.com/video/${match[1]}?autoplay=1&playsinline=1` : null;
  };

  // Helper to get all media URLs (images and videos) for a given portfolio item
  const getAllMediaItems = (item: PortfolioItem): MediaItem[] => {
    const media: MediaItem[] = [];

    // Add primary image
    if (item.image_url) {
      media.push({ type: 'image', url: item.image_url });
    }

    // Add primary video
    if (item.video_url) {
      media.push({ type: 'video', url: item.video_url });
    }

    // Add additional files/urls from file_urls array
    if (item.file_urls && item.file_urls.length > 0) {
      item.file_urls.forEach(url => {
        // Simple check for common image extensions
        if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
          media.push({ type: 'image', url: url });
        }
        // Check for common video extensions or known embed platforms
        else if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i) || getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url)) {
          media.push({ type: 'video', url: url });
        }
        // If neither, we might skip it or handle as generic file
      });
    }
    return media;
  };

  // Navigate to the next media item in the full-screen viewer
  const goToNextMedia = () => {
    if (viewingItem) {
      const allMedia = getAllMediaItems(viewingItem);
      setCurrentMediaIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        if (newIndex < allMedia.length) {
          setFullScreenMedia(allMedia[newIndex]);
          console.log(`goToNextMedia: New index: ${newIndex}, New media URL: ${allMedia[newIndex].url}`);
          return newIndex;
        }
        console.log("goToNextMedia: Already at the last media item.");
        return prevIndex; // Stay at current index if already at end
      });
    }
  };

  // Navigate to the previous media item in the full-screen viewer
  const goToPreviousMedia = () => {
    if (viewingItem) {
      const allMedia = getAllMediaItems(viewingItem);
      setCurrentImageIndex(prevIndex => {
        const newIndex = prevIndex - 1;
        if (newIndex >= 0) {
          setFullScreenMedia(allMedia[newIndex]);
          console.log(`goToPreviousMedia: New index: ${newIndex}, New media URL: ${allMedia[newIndex].url}`);
          return newIndex;
        }
        console.log("goToPreviousMedia: Already at the first media item.");
        return prevIndex; // Stay at current index if already at beginning
      });
    }
  };

  console.log("PortfolioManager: Rendering component.");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Portfolio Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Select
                value={filter.category}
                onValueChange={(value) => {
                  setFilter(prev => ({ ...prev, category: value === "all-categories" ? "" : value, subcategory: "" }));
                  setSelectedSubcategoryId(null); // Reset selected subcategory when category changes
                }}
              >
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory filter dropdown - only visible if a category is selected and no specific subcategory is being viewed */}
            {filter.category && !selectedSubcategoryId && (
              <div>
                <Select
                  value={filter.subcategory}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, subcategory: value === "all-subcategories" ? "" : value }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="All subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-subcategories">All subcategories</SelectItem>
                    {filteredSubcategoriesForDisplay.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Select value={filter.featured} onValueChange={(value) => setFilter(prev => ({ ...prev, featured: value === "all-items" ? "" : value }))}>
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                  <SelectValue placeholder="All items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-items">All items</SelectItem>
                  <SelectItem value="true">Featured only</SelectItem>
                  <SelectItem value="false">Not featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">
                {selectedSubcategoryId ? `${filteredItems.length} items` : `${filteredSubcategoriesForDisplay.length} subcategories`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditional Display Area */}
      {filter.category && !selectedSubcategoryId ? (
        // Display Subcategories when a category is selected but no specific subcategory is clicked
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Subcategories in {categories.find(c => c.id === filter.category)?.name}</h2>
          {filteredSubcategoriesForDisplay.length === 0 ? (
            <Card className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No subcategories found</h3>
              <p className="text-muted-foreground">
                Create subcategories for this category in the "Categories" tab.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubcategoriesForDisplay.map((sub) => (
                <Card
                  key={sub.id}
                  className="p-6 cursor-pointer hover:bg-muted transition-colors flex items-center justify-between"
                  onClick={() => {
                    setSelectedSubcategoryId(sub.id);
                    setFilter(prev => ({ ...prev, subcategory: sub.id })); // Also set filter.subcategory
                    console.log("Selected subcategory:", sub.name, sub.id);
                  }}
                >
                  <div className="flex items-center">
                    <FolderOpen className="h-6 w-6 text-primary mr-3" />
                    <div>
                      <h3 className="font-semibold text-lg">{sub.name}</h3>
                      <p className="text-sm text-muted-foreground">{portfolioItems.filter(item => item.subcategory_id === sub.id).length} items</p> {/* Count items in subcategory */}
                    </div>
                  </div>
                  <ArrowLeft className="h-5 w-5 rotate-180 text-muted-foreground" />
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Display Portfolio Items (either all, or filtered by category/subcategory)
        <div className="space-y-4">
          {selectedSubcategoryId && (
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSubcategoryId(null);
                  setFilter(prev => ({ ...prev, subcategory: "" })); // Clear subcategory filter
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Subcategories
              </Button>
              <h2 className="text-xl font-semibold">
                Items in {subcategories.find(s => s.id === selectedSubcategoryId)?.name}
              </h2>
            </div>
          )}
          {!filter.category && !selectedSubcategoryId && ( // If no category or subcategory is selected, show all items
            <h2 className="text-xl font-semibold">All Portfolio Items</h2>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <Card className="md:col-span-3 lg:col-span-3">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No portfolio items found</h3>
                  <p className="text-muted-foreground">
                    {portfolioItems.length === 0
                      ? "Upload your first portfolio item using the 'Portfolio Upload' tab"
                      : "Try adjusting your filters or selecting a different subcategory"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredItems.map((item) => {
                console.log("PortfolioManager: Rendering item:", item.title, "Category:", item.category?.name, "Subcategory:", item.subcategory?.name);
                const MediaIcon = getMediaIcon(item);
                
                return (
                  <Card key={item.id} className="portfolio-card group">
                    <div className="relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : item.video_url ? (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {item.featured && (
                        <Badge className="absolute top-2 left-2 gold-gradient text-gold-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}

                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            console.log("PortfolioManager: Opening view dialog for item:", item);
                            setViewingItem(item);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            console.log("PortfolioManager: Opening edit dialog for item:", item);
                            setEditingItem(item);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setItemToDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your portfolio item from the database.
                                Note: The associated file on Cloudinary will NOT be automatically deleted and must be removed manually if desired.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDeleteItem}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{item.category?.name}</Badge>
                        {item.subcategory && (
                          <Badge variant="secondary">{item.subcategory.name}</Badge>
                        )}
                        {item.sector && (
                          <Badge variant="outline">{item.sector}</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.featured}
                            onCheckedChange={(checked) => handleToggleFeatured(item.id, checked)}
                            disabled={loading}
                          />
                          <span className="text-sm text-muted-foreground">Featured</span>
                        </div>
                        
                        <div className="flex gap-1">
                          {item.image_url && <Image className="h-4 w-4 text-muted-foreground" />}
                          {item.video_url && <Video className="h-4 w-4 text-muted-foreground" />}
                          {item.file_urls && item.file_urls.length > 0 && (
                            <span className="text-xs text-muted-foreground">+{item.file_urls.length}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* View Item Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingItem?.title}</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              {/* Display all media (primary image, primary video, and additional files/urls) in an equal-sized grid */}
              {(getAllMediaItems(viewingItem).length > 0 || viewingItem.video_url) && (
                <div>
                  <h4 className="font-semibold mb-2">Media:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getAllMediaItems(viewingItem).map((mediaItem, index) => (
                      <div
                        key={index}
                        className="w-full h-32 rounded-lg overflow-hidden border border-border cursor-pointer flex items-center justify-center bg-muted"
                        onClick={() => {
                          setFullScreenMedia(mediaItem);
                          setCurrentImageIndex(index);
                        }}
                      >
                        {mediaItem.type === 'image' ? (
                          <img
                            src={mediaItem.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          // Display a video icon or a small preview for videos
                          <Video className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!viewingItem.image_url && !viewingItem.video_url && (!viewingItem.file_urls || viewingItem.file_urls.length === 0) && (
                <div className="w-full h-48 bg-muted flex items-center justify-center rounded-lg">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground ml-2">No media preview available</p>
                </div>
              )}

              {viewingItem.description && (
                <p className="text-muted-foreground">{viewingItem.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge>{viewingItem.category?.name}</Badge>
                {viewingItem.subcategory && (
                  <Badge variant="secondary">{viewingItem.subcategory.name}</Badge>
                )}
                {viewingItem.sector && <Badge variant="outline">{viewingItem.sector}</Badge>}
                {viewingItem.project_type && <Badge variant="outline">{viewingItem.project_type}</Badge>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full-Screen Media Viewer Dialog */}
      <Dialog open={!!fullScreenMedia} onOpenChange={() => setFullScreenMedia(null)}>
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0 flex flex-col bg-black/70 backdrop-blur-sm">
          {fullScreenMedia && viewingItem && (
            <div className="relative flex-1 flex items-center justify-center">
              {fullScreenMedia.type === 'image' ? (
                <img
                  src={fullScreenMedia.url}
                  alt={`Full screen image ${currentMediaIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                (() => {
                  const youtubeEmbedUrl = getYouTubeEmbedUrl(fullScreenMedia.url);
                  const vimeoEmbedUrl = getVimeoEmbedUrl(fullScreenMedia.url);

                  if (youtubeEmbedUrl) {
                    return (
                      <div className="relative w-full h-full">
                        <iframe
                          src={youtubeEmbedUrl}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                        ></iframe>
                      </div>
                    );
                  } else if (vimeoEmbedUrl) {
                    return (
                      <div className="relative w-full h-full">
                        <iframe
                          src={vimeoEmbedUrl}
                          title="Vimeo video player"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                        ></iframe>
                      </div>
                    );
                  } else {
                    // Fallback for direct video URLs
                    return (
                      <video
                        src={fullScreenMedia.url}
                        controls
                        className="w-full h-full rounded-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                })()
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToPreviousMedia}
                disabled={currentMediaIndex === 0}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToNextMedia}
                disabled={currentMediaIndex === getAllMediaItems(viewingItem).length - 1}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setFullScreenMedia(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 text-white text-lg">
                {currentMediaIndex + 1} / {getAllMediaItems(viewingItem).length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ""} // Handle null
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingItem.category_id}
                  onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, category_id: value, subcategory_id: null } : null)}
                >
                  <SelectTrigger>
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
              <div>
                <Label htmlFor="edit-subcategory">Subcategory</Label>
                <Select
                  value={editingItem.subcategory_id || ""}
                  onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, subcategory_id: value } : null)}
                  disabled={!editingItem.category_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem> {/* This value can be empty because it's for the edit dialog, not a filter */}
                    {subcategories.filter(sub => sub.category_id === editingItem.category_id).map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-project-type">Project Type</Label>
                <Input
                  id="edit-project-type"
                  value={editingItem.project_type || ""} // Handle null
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, project_type: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-sector">Sector</Label>
                <Input
                  id="edit-sector"
                  value={editingItem.sector || ""} // Handle null
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, sector: e.target.value } : null)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={editingItem.featured}
                  onCheckedChange={(checked) => setEditingItem(prev => prev ? { ...prev, featured: checked } : null)}
                />
                <Label htmlFor="edit-featured">Featured</Label>
              </div>
              <Button onClick={handleUpdateItem} disabled={loading} className="w-full">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioManager;
