'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const categories = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Video Editing',
  'Data Analysis',
  'AI & Machine Learning',
  'Blockchain',
  'Other'
];

export default function CreateServicePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('3');
  const [revisions, setRevisions] = useState('1');
  const [coverUrl, setCoverUrl] = useState('');
  const [features, setFeatures] = useState(['']);
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account/services/create');
    }
  }, [user, router]);
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Only image files are allowed',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      setCoverUrl(data.url);
      
      toast({
        title: 'Image uploaded',
        description: 'Your cover image has been uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle feature input
  const addFeature = () => {
    setFeatures([...features, '']);
  };
  
  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };
  
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  
  // Handle tag input
  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !description || !category || !priceFrom || !deliveryDays || features.filter(f => f).length === 0) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priceFrom: parseFloat(priceFrom),
          priceTo: priceTo ? parseFloat(priceTo) : null,
          deliveryDays: parseInt(deliveryDays),
          revisions: parseInt(revisions),
          coverUrl,
          features: features.filter(f => f),
          tags
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create service');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Service created',
        description: 'Your service has been created successfully',
      });
      
      // Redirect to service page
      router.push(`/services/${data.service.id}`);
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: 'Failed to create service',
        description: error.message || 'An error occurred while creating your service',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container max-w-4xl py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create a New Service</h1>
        <p className="text-gray-400">Share your skills and start earning by creating a service that clients can purchase</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Basic Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              placeholder="I will create a stunning website for your business"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="bg-gray-900/50 border-gray-800"
            />
            <p className="text-xs text-gray-500">{title.length}/100 characters</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your service in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="bg-gray-900/50 border-gray-800"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-gray-900/50 border-gray-800">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Pricing & Delivery */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Pricing & Delivery</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceFrom">Starting Price ($)</Label>
              <Input
                id="priceFrom"
                type="number"
                min="5"
                step="0.01"
                placeholder="29.99"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="bg-gray-900/50 border-gray-800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceTo">Maximum Price ($) (Optional)</Label>
              <Input
                id="priceTo"
                type="number"
                min={priceFrom ? parseFloat(priceFrom) : 5}
                step="0.01"
                placeholder="99.99"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className="bg-gray-900/50 border-gray-800"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryDays">Delivery Time (Days)</Label>
              <Input
                id="deliveryDays"
                type="number"
                min="1"
                max="30"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className="bg-gray-900/50 border-gray-800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="revisions">Number of Revisions</Label>
              <Input
                id="revisions"
                type="number"
                min="1"
                max="10"
                value={revisions}
                onChange={(e) => setRevisions(e.target.value)}
                className="bg-gray-900/50 border-gray-800"
              />
            </div>
          </div>
        </div>
        
        {/* Cover Image */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Cover Image</h2>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              {coverUrl ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <img 
                    src={coverUrl} 
                    alt="Service cover" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                  <Upload className="h-8 w-8 text-gray-500 mb-2" />
                  <p className="text-gray-400 mb-4">Upload a cover image for your service</p>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      className="relative"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Choose Image'
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Features</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="border-gray-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </Button>
          </div>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Feature ${index + 1}`}
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="bg-gray-900/50 border-gray-800"
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Tags (Optional)</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="bg-gray-900/50 border-gray-800"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="border-gray-700"
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="px-3 py-1">
                    {t}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeTag(t)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Service...
              </>
            ) : (
              'Create Service'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
