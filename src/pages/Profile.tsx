import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Save, Edit } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";

// Validation schema for profile data
const profileSchema = z.object({
  full_name: z.string().max(100, "Name must be less than 100 characters").optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").regex(/^[\d\s+\-()]*$/, "Invalid phone format").optional().or(z.literal("")),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
});

interface UserProfile {
  user_id: string;
  full_name?: string;
  phone?: string;
  address?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } else {
        // Create a new profile if none exists
        const newProfile = {
          user_id: user?.id,
          full_name: user?.user_metadata?.full_name || "",
          phone: "",
          address: "",
        };
        
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        
        setProfile(created);
        setFormData({
          full_name: created.full_name || "",
          phone: created.phone || "",
          address: created.address || "",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate form data before submission
      const validationResult = profileSchema.safeParse({
        full_name: formData.full_name.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      });

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => e.message).join(", ");
        toast({
          title: "Validation Error",
          description: errors,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim().substring(0, 100) || null,
          phone: formData.phone.trim().substring(0, 20) || null,
          address: formData.address.trim().substring(0, 500) || null,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 font-display">My Profile</h1>
            <p className="text-lg text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Overview */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Member Since</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Account Status</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    {!editing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          disabled={!editing}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!editing}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!editing}
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>

                    {editing && (
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={saving}>
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              full_name: profile?.full_name || "",
                              phone: profile?.phone || "",
                              address: profile?.address || "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;