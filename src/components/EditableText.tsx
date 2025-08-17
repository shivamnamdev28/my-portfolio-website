import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface EditableTextProps {
  id: string;
  defaultText: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  isAdmin?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  defaultText,
  className = '',
  tag = 'p',
  isAdmin = false
}) => {
  const [text, setText] = useState(defaultText);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadText();
  }, [id]);

  const loadText = async () => {
    try {
      // For now, just use default text until types are updated
      setText(defaultText);
    } catch (error) {
      console.error('Error loading text:', error);
      setText(defaultText);
    } finally {
      setIsLoading(false);
    }
  };

  const saveText = async (newText: string) => {
    try {
      // For now, just update locally until types are updated
      setText(newText);
      toast({
        title: "Text updated locally",
        description: "Database connection will be restored after types update.",
      });
    } catch (error) {
      console.error('Error saving text:', error);
      setText(newText);
      toast({
        title: "Text updated locally",
        description: "Connect Supabase to save permanently.",
      });
    }
  };

  const handleSave = () => {
    saveText(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(text); // Reset to original
    }
  };

  if (isLoading) {
    return React.createElement(tag, { className }, defaultText);
  }

  const Component = tag;

  if (isAdmin && isEditing) {
    return (
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`${className} bg-background border-2 border-primary rounded p-2 resize-none`}
          autoFocus
          style={{ minHeight: '40px' }}
        />
        <div className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
          Editing
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`${className} ${isAdmin ? 'cursor-pointer hover:bg-primary/10 rounded transition-colors' : ''}`}
      onClick={() => isAdmin && setIsEditing(true)}
      title={isAdmin ? 'Click to edit' : undefined}
    >
      {text}
    </Component>
  );
};