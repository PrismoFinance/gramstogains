
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Building, Edit, Trash2 } from 'lucide-react';
import { mockDispensaries as initialMockDispensaries } from '@/lib/mock-data';
import type { Dispensary } from '@/lib/types';
import { DispensaryDialog } from '@/components/dispensaries/DispensaryDialog'; // New component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

export default function DispensariesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dispensaries, setDispensaries] = useState<Dispensary[]>(initialMockDispensaries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDispensary, setEditingDispensary] = useState<Dispensary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.role !== 'administrator') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'administrator') {
    return <p className="text-center py-10">Access Denied. Administrator role required.</p>;
  }

  const handleAddDispensary = () => {
    setEditingDispensary(null);
    setIsDialogOpen(true);
  };

  const handleEditDispensary = (dispensary: Dispensary) => {
    setEditingDispensary(dispensary);
    setIsDialogOpen(true);
  };

  const handleDeleteDispensary = (dispensaryId: string) => {
    setDispensaries(dispensaries.filter(d => d.id !== dispensaryId));
    // In a real app, call API to delete
  };

  const handleSaveDispensary = (dispensary: Dispensary) => {
    if (editingDispensary) {
      setDispensaries(dispensaries.map(d => (d.id === dispensary.id ? dispensary : d)));
    } else {
      setDispensaries([...dispensaries, { ...dispensary, id: dispensary.id || `disp${Date.now()}` }]);
    }
    // In a real app, call API to save
  };
  
  const filteredDispensaries = dispensaries.filter(dispensary => 
    dispensary.dispensaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispensary.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispensary.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispensary.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold flex items-center">
            <Building className="mr-3 h-8 w-8 text-primary" />
            Dispensary Management
          </h1>
          <p className="text-muted-foreground">Manage your wholesale dispensary clients.</p>
        </div>
        <Button onClick={handleAddDispensary} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Dispensary
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filter Dispensaries</CardTitle>
          <CardDescription>Search by name, license, contact, or address.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search dispensaries..."
            className="w-full p-2 border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:ring-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Dispensary List</CardTitle>
            <CardDescription>Showing {filteredDispensaries.length} of {dispensaries.length} dispensaries.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>License #</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDispensaries.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No dispensaries match your search.</TableCell></TableRow>
                        ) : (
                            filteredDispensaries.map(d => (
                                <TableRow key={d.id}>
                                    <TableCell className="font-medium">{d.dispensaryName}</TableCell>
                                    <TableCell>{d.licenseNumber}</TableCell>
                                    <TableCell>{d.contactPerson || 'N/A'}</TableCell>
                                    <TableCell>{d.contactEmail || 'N/A'}</TableCell>
                                    <TableCell>{d.contactPhoneNumber || 'N/A'}</TableCell>
                                    <TableCell>{d.address || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditDispensary(d)} className="hover:text-accent mr-2">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the dispensary "{d.dispensaryName}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteDispensary(d.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                                Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>


      <DispensaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveDispensary}
        dispensary={editingDispensary}
      />
    </div>
  );
}
