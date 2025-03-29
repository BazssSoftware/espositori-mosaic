
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Espositore } from "@/types/espositore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AdminPanelProps {
  onAddEspositore: (espositore: Omit<Espositore, 'id'>) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddEspositore }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fairLocation, setFairLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !description.trim() || !logoUrl.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields (Name, Description, Logo URL).",
        variant: "destructive",
      });
      return;
    }
    
    // Create new exhibitor
    const newEspositore: Omit<Espositore, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      logoUrl: logoUrl.trim(),
      website: website.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      fairLocation: fairLocation.trim() || undefined,
      category: category.trim() || undefined,
      images: images.length > 0 ? [...images] : undefined,
    };
    
    // Add the exhibitor
    onAddEspositore(newEspositore);
    
    // Reset form
    setName('');
    setDescription('');
    setLogoUrl('');
    setWebsite('');
    setPhoneNumber('');
    setFairLocation('');
    setCategory('');
    setImageUrl('');
    setImages([]);
    
    // Show success message
    toast({
      title: "Exhibitor Added",
      description: `${name} has been successfully added to the exhibitors list.`,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-wedding-dark">Add New Exhibitor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-wedding-dark">Name *</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Exhibitor Name" 
                required
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-wedding-dark">Category</Label>
              <Input 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="e.g. Abiti da Sposa, Catering, Fiori"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-wedding-dark">Description *</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Detailed description of the exhibitor" 
                required 
                rows={4}
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="text-wedding-dark">Logo URL *</Label>
              <Input 
                id="logoUrl" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)} 
                placeholder="https://example.com/logo.jpg" 
                required
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="text-wedding-dark">Website</Label>
              <Input 
                id="website" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)} 
                placeholder="https://www.example.com"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-wedding-dark">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="+39 123 456 7890"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fairLocation" className="text-wedding-dark">Fair Location</Label>
              <Input 
                id="fairLocation" 
                value={fairLocation} 
                onChange={(e) => setFairLocation(e.target.value)} 
                placeholder="e.g. Padiglione A, Stand 12"
                className="border-wedding-primary/50 focus:border-wedding-primary"
              />
            </div>
          </div>
          
          <Separator className="my-4 bg-wedding-primary/30" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-wedding-dark">Images</h3>
            
            <div className="flex gap-2">
              <Input 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="Image URL" 
                className="flex-grow border-wedding-primary/50 focus:border-wedding-primary"
              />
              <Button 
                type="button" 
                onClick={handleAddImage}
                variant="outline"
                className="border-wedding-primary/50 hover:bg-wedding-primary/20"
              >
                Add Image
              </Button>
            </div>
            
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Added Images:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="truncate flex-grow mr-2">{img}</div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveImage(index)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-wedding-gold hover:bg-wedding-gold/90 text-white min-w-32"
            >
              Add Exhibitor
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
