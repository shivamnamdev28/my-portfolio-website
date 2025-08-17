import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, FolderPlus } from "lucide-react";
import { portfolioApi, type Category, type Subcategory } from "@/lib/supabase";
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


interface CategoryManagerProps {
  categories: Category[];
  subcategories: Subcategory[];
  onUpdate: () => void;
}

const CategoryManager = ({ categories, subcategories, onUpdate }: CategoryManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newSubcategory, setNewSubcategory] = useState({ name: "", description: "", categoryId: "" });
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  console.log("CategoryManager rendered.");
  console.log("CategoryManager: Categories prop received:", categories);
  console.log("CategoryManager: Subcategories prop received:", subcategories);


  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await portfolioApi.createCategory(newCategory.name, newCategory.description);
      toast({ title: "Category created successfully!" });
      setNewCategory({ name: "", description: "" });
      setShowCategoryDialog(false);
      onUpdate(); // Refresh data in parent
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast({ title: "Failed to create category", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await portfolioApi.updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
      });
      toast({ title: "Category updated successfully!" });
      setEditingCategory(null);
      onUpdate(); // Refresh data in parent
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast({ title: "Failed to update category", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      await portfolioApi.deleteCategory(categoryToDelete);
      toast({ title: "Category deleted successfully!" });
      setCategoryToDelete(null);
      onUpdate(); // Refresh data in parent
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast({ title: "Failed to delete category", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcategory.name.trim() || !newSubcategory.categoryId) {
      toast({ title: "Name and Category are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await portfolioApi.createSubcategory(
        newSubcategory.name,
        newSubcategory.categoryId,
        newSubcategory.description
      );
      toast({ title: "Subcategory created successfully!" });
      setNewSubcategory({ name: "", description: "", categoryId: "" });
      setShowSubcategoryDialog(false);
      onUpdate(); // Refresh data in parent
    } catch (error: any) {
      console.error("Error creating subcategory:", error);
      toast({ title: "Failed to create subcategory", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcategory || !editingSubcategory.name.trim() || !editingSubcategory.category_id) {
      toast({ title: "Name and Category are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await portfolioApi.updateSubcategory(editingSubcategory.id, {
        name: editingSubcategory.name,
        description: editingSubcategory.description,
        category_id: editingSubcategory.category_id,
      });
      toast({ title: "Subcategory updated successfully!" });
      setEditingSubcategory(null);
      onUpdate(); // Refresh data in parent
    } catch (error: any) {
      console.error("Error updating subcategory:", error);
      toast({ title: "Failed to update subcategory", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;
    setLoading(true);
    try {
      await portfolioApi.deleteSubcategory(subcategoryToDelete);
      toast({ title: "Subcategory deleted successfully!" });
      setSubcategoryToDelete(null);
      onUpdate(); // Refresh data in parent
    } catch (error: any) {
      console.error("Error deleting subcategory:", error);
      toast({ title: "Failed to delete subcategory", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Add New Category Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-gold-foreground" onClick={() => console.log("Clicked Add New Category button.")}>
                <Plus className="mr-2 h-4 w-4" /> Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Name</Label>
                  <Input
                    id="category-name"
                    value={editingCategory ? editingCategory.name : newCategory.name}
                    onChange={(e) =>
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, name: e.target.value })
                        : setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description (Optional)</Label>
                  <Textarea
                    id="category-description"
                    value={editingCategory ? editingCategory.description || "" : newCategory.description}
                    onChange={(e) =>
                      editingCategory
                        ? setEditingCategory({ ...editingCategory, description: e.target.value })
                        : setNewCategory({ ...newCategory, description: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="mt-6 space-y-3">
            {categories.length === 0 ? (
              <p className="text-muted-foreground">No categories found. Add one above!</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border border-border/50 rounded-md bg-secondary/20">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditingCategory(category);
                      setShowCategoryDialog(true);
                      console.log("Clicked Edit Category button for:", category.name);
                    }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setCategoryToDelete(category.id);
                            console.log("Clicked Delete Category button for:", category.name);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category and all associated subcategories and portfolio items.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteCategory}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manage Subcategories Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Subcategories</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={showSubcategoryDialog} onOpenChange={setShowSubcategoryDialog}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-gold-foreground" disabled={categories.length === 0} onClick={() => console.log("Clicked Add New Subcategory button.")}>
                <FolderPlus className="mr-2 h-4 w-4" /> Add New Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingSubcategory ? handleUpdateSubcategory : handleCreateSubcategory} className="space-y-4">
                <div>
                  <Label htmlFor="subcategory-name">Name</Label>
                  <Input
                    id="subcategory-name"
                    value={editingSubcategory ? editingSubcategory.name : newSubcategory.name}
                    onChange={(e) =>
                      editingSubcategory
                        ? setEditingSubcategory({ ...editingSubcategory, name: e.target.value })
                        : setNewSubcategory({ ...newSubcategory, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory-description">Description (Optional)</Label>
                  <Textarea
                    id="subcategory-description"
                    value={editingSubcategory ? editingSubcategory.description || "" : newSubcategory.description}
                    onChange={(e) =>
                      editingSubcategory
                        ? setEditingSubcategory({ ...editingSubcategory, description: e.target.value })
                        : setNewSubcategory({ ...newSubcategory, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory-category">Parent Category</Label>
                  <Select
                    value={editingSubcategory ? editingSubcategory.category_id : newSubcategory.categoryId}
                    onValueChange={(value) =>
                      editingSubcategory
                        ? setEditingSubcategory({ ...editingSubcategory, category_id: value })
                        : setNewSubcategory({ ...newSubcategory, categoryId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingSubcategory ? "Update Subcategory" : "Create Subcategory"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="mt-6 space-y-3">
            {subcategories.length === 0 ? (
              <p className="text-muted-foreground">No subcategories found. Add one above!</p>
            ) : (
              subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex items-center justify-between p-3 border border-border/50 rounded-md bg-secondary/20">
                  {editingSubcategory && editingSubcategory.id === subcategory.id ? (
                    <div className="w-full space-y-2">
                      <Input
                        value={editingSubcategory.name}
                        onChange={(e) => setEditingSubcategory({ ...editingSubcategory, name: e.target.value })}
                      />
                      <Textarea
                        value={editingSubcategory.description || ""}
                        onChange={(e) => setEditingSubcategory({ ...editingSubcategory, description: e.target.value })}
                        placeholder="Description (Optional)"
                      />
                      <Select
                        value={editingSubcategory.category_id}
                        onValueChange={(value) => setEditingSubcategory({ ...editingSubcategory, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateSubcategory} disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingSubcategory(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold">{subcategory.name}</h3>
                      {subcategory.description && (
                        <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        {subcategory.category?.name}
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
