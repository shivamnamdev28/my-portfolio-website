// src/components/Portfolio.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Keep Select for potential future use or if needed elsewhere
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image, Video, FileText, X, ChevronLeft, ChevronRight, FolderOpen, ArrowLeft, ChevronRight as RightArrowIcon } from 'lucide-react'; // Added FolderOpen, ArrowLeft, RightArrowIcon
import { portfolioApi, type Category, type Subcategory, type PortfolioItem } from '@/lib/supabase';

// Define a type for a generic media item
interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for viewing media
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
  const [fullScreenMedia, setFullScreenMedia] = useState<MediaItem | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);

  // New state to control which set of buttons is visible
  const [currentView, setCurrentView] = useState<'categories' | 'subcategories' | 'items'>('categories');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [items, cats, subs] = await Promise.all([
          portfolioApi.getPortfolioItems(),
          portfolioApi.getCategories(),
          portfolioApi.getSubcategories(),
        ]);
        setPortfolioItems(items);
        setCategories(cats);
        setSubcategories(subs);
      } catch (err: any) {
        console.error('Failed to fetch portfolio data:', err);
        setError('Failed to load portfolio. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

    if (fullScreenMedia) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullScreenMedia, viewingItem, currentMediaIndex]); // Dependencies for the effect

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
          return newIndex;
        }
        return prevIndex; // Stay at current index if already at end
      });
    }
  };

  // Navigate to the previous media item in the full-screen viewer
  const goToPreviousMedia = () => {
    if (viewingItem) {
      const allMedia = getAllMediaItems(viewingItem);
      setCurrentMediaIndex(prevIndex => {
        const newIndex = prevIndex - 1;
        if (newIndex >= 0) {
          setFullScreenMedia(allMedia[newIndex]);
          return newIndex;
        }
        return prevIndex; // Stay at current index if already at beginning
      });
    }
  };

  // Filter subcategories based on the selected main category
  const subcategoriesForCurrentCategory = subcategories.filter(
    (sub) => sub.category_id === filterCategory
  );

  // Filter portfolio items based on selected category and subcategory
  const filteredPortfolioItems = portfolioItems.filter((item) => {
    const matchesCategory = filterCategory === '' || item.category_id === filterCategory;
    const matchesSubcategory = filterSubcategory === '' || item.subcategory_id === filterSubcategory;
    return matchesCategory && matchesSubcategory;
  });

  // Handlers for button-based navigation
  const handleCategoryClick = (categoryId: string) => {
    setFilterCategory(categoryId);
    setFilterSubcategory(''); // Reset subcategory filter when category changes
    setCurrentView('subcategories'); // Move to subcategory buttons view
  };

  const handleAllCategoriesClick = () => {
    setFilterCategory('');
    setFilterSubcategory('');
    setCurrentView('categories'); // Stay in categories view, showing all items
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setFilterSubcategory(subcategoryId);
    setCurrentView('items'); // Move to items view
  };

  const handleAllSubcategoriesClick = () => {
    setFilterSubcategory('');
    setCurrentView('items'); // Show all items for the current category
  };

  const handleBackToCategories = () => {
    setFilterCategory('');
    setFilterSubcategory('');
    setCurrentView('categories');
  };

  const handleBackToSubcategories = () => {
    setFilterSubcategory('');
    setCurrentView('subcategories');
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary">Our Portfolio</h2>

      {/* Filter Buttons Section (Categories, Subcategories, or Back Buttons) */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {currentView === 'categories' && (
          <>
            <Button
              variant={filterCategory === '' ? 'default' : 'outline'}
              onClick={handleAllCategoriesClick}
              className={filterCategory === '' ? "gold-gradient text-gold-foreground" : ""}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filterCategory === category.id ? 'default' : 'outline'}
                onClick={() => handleCategoryClick(category.id)}
                className={filterCategory === category.id ? "gold-gradient text-gold-foreground" : ""}
              >
                {category.name}
              </Button>
            ))}
          </>
        )}

        {currentView === 'subcategories' && (
          <>
            <Button variant="outline" onClick={handleBackToCategories}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Categories
            </Button>
            <Button
              variant={filterSubcategory === '' ? 'default' : 'outline'}
              onClick={handleAllSubcategoriesClick}
              className={filterSubcategory === '' ? "gold-gradient text-gold-foreground" : ""}
            >
              All {categories.find(c => c.id === filterCategory)?.name} Subcategories
            </Button>
            {subcategoriesForCurrentCategory.map((sub) => (
              <Button
                key={sub.id}
                variant={filterSubcategory === sub.id ? 'default' : 'outline'}
                onClick={() => handleSubcategoryClick(sub.id)}
                className={filterSubcategory === sub.id ? "gold-gradient text-gold-foreground" : ""}
              >
                {sub.name}
              </Button>
            ))}
          </>
        )}

        {/* This section will only show if we are in 'items' view and need a back button */}
        {currentView === 'items' && filterSubcategory && ( // If viewing items of a specific subcategory
          <Button variant="outline" onClick={handleBackToSubcategories}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Subcategories
          </Button>
        )}
        {currentView === 'items' && !filterSubcategory && filterCategory && ( // If viewing all items of a category (no subcategory selected)
          <Button variant="outline" onClick={handleBackToCategories}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Categories
          </Button>
        )}
      </div>

      {/* Conditional Display: Subcategories or Portfolio Items */}
      {currentView === 'subcategories' ? (
        // Display Subcategories as cards
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center mb-6">Subcategories in {categories.find(c => c.id === filterCategory)?.name}</h3>
          {subcategoriesForCurrentCategory.length === 0 ? (
            <Card className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No subcategories found</h3>
              <p className="text-muted-foreground">
                There are no subcategories for this category yet.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategoriesForCurrentCategory.map((sub) => (
                <Card
                  key={sub.id}
                  className="p-6 cursor-pointer hover:bg-muted transition-colors flex items-center justify-between"
                  onClick={() => {
                    handleSubcategoryClick(sub.id); // Click subcategory card to show items
                  }}
                >
                  <div className="flex items-center">
                    <FolderOpen className="h-6 w-6 text-primary mr-3" />
                    <div>
                      <h3 className="font-semibold text-lg">{sub.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {portfolioItems.filter(item => item.subcategory_id === sub.id).length} items
                      </p>
                    </div>
                  </div>
                  <RightArrowIcon className="h-5 w-5 text-muted-foreground" />
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Display Portfolio Items (for 'categories' view with no category selected, or 'items' view)
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center mb-6">
            {filterSubcategory
              ? `Items in ${subcategories.find(s => s.id === filterSubcategory)?.name}`
              : filterCategory
                ? `All items in ${categories.find(c => c.id === filterCategory)?.name}`
                : 'All Portfolio Items'}
          </h3>
          {filteredPortfolioItems.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No portfolio items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPortfolioItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => setViewingItem(item)} // Open view dialog on card click
                >
                  <div className="relative w-full h-56 bg-muted flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : item.video_url ? (
                      <Video className="h-16 w-16 text-muted-foreground" />
                    ) : (
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    )}
                    {item.featured && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-semibold mb-2 truncate">{item.title}</CardTitle>
                    {item.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm">
                      {item.category?.name && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          {item.category.name}
                        </span>
                      )}
                      {item.subcategory?.name && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          {item.subcategory.name}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
                          setCurrentMediaIndex(index);
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
                {viewingItem.category?.name && <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{viewingItem.category.name}</span>}
                {viewingItem.subcategory?.name && <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{viewingItem.subcategory.name}</span>}
                {viewingItem.sector && <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{viewingItem.sector}</span>}
                {viewingItem.project_type && <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{viewingItem.project_type}</span>}
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
                  alt={`Full screen media ${currentMediaIndex + 1}`}
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
    </div>
  );
};

export default Portfolio;
