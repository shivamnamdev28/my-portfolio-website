import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Resume {
  id: string;
  filename: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
}

const ResumeManager = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error loading resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load resumes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (file: File) => {
    try {
      setUploading(true);
      
      // Upload file to Supabase storage
      const fileName = `resume_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Save to database
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          filename: file.name,
          file_url: urlData.publicUrl,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      // Deactivate other resumes
      await supabase
        .from('resumes')
        .update({ is_active: false })
        .neq('id', data.id);

      toast({
        title: "Success",
        description: "Resume uploaded successfully"
      });

      await loadResumes();
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const setActiveResume = async (id: string) => {
    try {
      // Deactivate all resumes
      await supabase
        .from('resumes')
        .update({ is_active: false })
        .neq('id', '');

      // Activate selected resume
      await supabase
        .from('resumes')
        .update({ is_active: true })
        .eq('id', id);

      toast({
        title: "Success",
        description: "Active resume updated"
      });

      await loadResumes();
    } catch (error) {
      console.error('Error updating active resume:', error);
      toast({
        title: "Error",
        description: "Failed to update active resume",
        variant: "destructive"
      });
    }
  };

  const deleteResume = async (id: string, fileUrl: string) => {
    try {
      // Delete from storage
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('resumes')
          .remove([fileName]);
      }

      // Delete from database
      await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      toast({
        title: "Success",
        description: "Resume deleted successfully"
      });

      await loadResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        uploadResume(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading resumes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Resume Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <Label htmlFor="resume-upload" className="cursor-pointer">
              <Button variant="outline" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload New Resume'}
              </Button>
            </Label>
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Upload PDF files only. Maximum size: 10MB
            </p>
          </div>
        </div>

        {/* Resumes List */}
        <div className="space-y-4">
          {resumes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No resumes uploaded yet
            </div>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                className={`p-4 border rounded-lg ${
                  resume.is_active ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{resume.filename}</h3>
                      <p className="text-sm text-muted-foreground">
                        {resume.is_active ? 'Active Resume' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!resume.is_active && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveResume(resume.id)}
                      >
                        Set Active
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resume.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteResume(resume.id, resume.file_url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="bg-secondary/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Instructions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Upload your latest resume in PDF format</li>
            <li>• Only one resume can be active at a time</li>
            <li>• The active resume will be available for download on the website</li>
            <li>• You can update your resume anytime by uploading a new one</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeManager;