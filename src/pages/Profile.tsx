
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserCircle } from "lucide-react";

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.username + "@example.com",
      username: user?.username || "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, this would send the data to the server
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal information and account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-3">
                <UserCircle className="w-20 h-20 text-primary" />
              </div>
              <h3 className="text-lg font-medium">{user?.displayName}</h3>
              <p className="text-sm text-muted-foreground">{user?.role}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your display name"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your password and security preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Password</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Last changed: Never</p>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Status: Not Enabled</p>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">Current browser session</p>
              <Button variant="outline" size="sm" className="w-full">
                Sign Out All Devices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
