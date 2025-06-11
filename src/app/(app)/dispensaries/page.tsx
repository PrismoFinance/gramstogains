
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { PlusCircle, Building, Edit, Trash2, Search, Loader2, Star, UserCheck } from 'lucide-react';
import { mockDispensaries as initialMockDispensaries, mockAllPotentialDispensaries } from '@/lib/mock-data';
import type { Dispensary } from '@/lib/types';
import { DispensaryDialog } from '@/components/dispensaries/DispensaryDialog';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function DispensariesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // State for managing existing clients
  const [dispensaries, setDispensaries] = useState<Dispensary[]>(initialMockDispensaries);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [editingDispensary, setEditingDispensary] = useState<Dispensary | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  // State for prospecting new dispensaries
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [prospectResults, setProspectResults] = useState<Dispensary[]>([]);
  const [isLoadingProspects, setIsLoadingProspects] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'administrator') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'administrator') {
    return <p className="text-center py-10">Access Denied. Administrator role required.</p>;
  }

  // Client Management Functions
  const handleAddClientDispensary = () => {
    setEditingDispensary(null);
    setIsClientDialogOpen(true);
  };

  const handleEditClientDispensary = (dispensary: Dispensary) => {
    setEditingDispensary(dispensary);
    setIsClientDialogOpen(true);
  };

  const handleDeleteClientDispensary = (dispensaryId: string) => {
    setDispensaries(dispensaries.filter(d => d.id !== dispensaryId));
    toast({ title: "Client Deleted", description: "Dispensary removed from your client list." });
  };

  const handleSaveClientDispensary = (dispensaryData: Dispensary) => {
    const dispensaryToSave = { ...dispensaryData, state: dispensaryData.state || 'N/A' }; // Ensure state is present
    if (editingDispensary) {
      setDispensaries(dispensaries.map(d => (d.id === dispensaryToSave.id ? dispensaryToSave : d)));
    } else {
      const newDispensary = { ...dispensaryToSave, id: dispensaryToSave.id || `disp${Date.now()}` };
      setDispensaries([...dispensaries, newDispensary]);
    }
    toast({ title: editingDispensary ? "Client Updated" : "Client Added", description: `${dispensaryToSave.dispensaryName} saved.` });
  };
  
  const filteredClientDispensaries = dispensaries.filter(dispensary => 
    dispensary.dispensaryName.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    dispensary.licenseNumber.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    dispensary.state.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    dispensary.contactPerson?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    dispensary.address?.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  // Prospecting Functions
  const handleSearchProspects = async () => {
    if (!stateSearchTerm.trim()) {
      toast({ title: "Enter State", description: "Please enter a state to search.", variant: "destructive" });
      return;
    }
    setIsLoadingProspects(true);
    setProspectResults([]);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const searchState = stateSearchTerm.trim().toUpperCase();
    const results = mockAllPotentialDispensaries
      .filter(d => d.state.toUpperCase() === searchState)
      .map(d => ({
        ...d,
        isExistingClient: dispensaries.some(client => client.id === d.id || client.licenseNumber === d.licenseNumber),
      }));
    
    setProspectResults(results);
    setIsLoadingProspects(false);
    if (results.length === 0) {
      toast({ title: "No Prospects Found", description: `No dispensaries found for state: ${searchState}.` });
    } else {
      toast({ title: "Prospects Loaded", description: `${results.length} dispensaries found for ${searchState}.`});
    }
  };

  const handleAddProspectToClients = (prospect: Dispensary) => {
    if (dispensaries.some(client => client.id === prospect.id || client.licenseNumber === prospect.licenseNumber)) {
        toast({ title: "Already Client", description: `${prospect.dispensaryName} is already in your client list.`, variant: "default" });
        return;
    }
    const newClient: Dispensary = { ...prospect, id: prospect.id || `disp${Date.now()}`}; // ensure ID
    setDispensaries(prev => [...prev, newClient]);
    // Update prospect list to reflect new client status
    setProspectResults(prev => prev.map(p => p.id === newClient.id ? {...p, isExistingClient: true } : p));
    toast({ title: "Prospect Added", description: `${prospect.dispensaryName} added to your client list.` });
  };


  return (
    <div className="space-y-8">
      {/* Client Management Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-headline font-bold flex items-center">
              <UserCheck className="mr-3 h-8 w-8 text-primary" />
              Client Dispensary Management
            </h1>
            <p className="text-muted-foreground">Manage your existing wholesale dispensary clients.</p>
          </div>
          <Button onClick={handleAddClientDispensary} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Client
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Filter Your Clients</CardTitle>
            <CardDescription>Search by name, license, state, contact, or address.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search your clients..."
              className="w-full p-2 border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:ring-ring focus:ring-2"
              value={clientSearchTerm}
              onChange={(e) => setClientSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg mt-6">
          <CardHeader>
              <CardTitle>Client List</CardTitle>
              <CardDescription>Showing {filteredClientDispensaries.length} of {dispensaries.length} clients.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="rounded-md border overflow-x-auto">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>License #</TableHead>
                              <TableHead>State</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Address</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredClientDispensaries.length === 0 ? (
                              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No clients match your search or none added.</TableCell></TableRow>
                          ) : (
                              filteredClientDispensaries.map(d => (
                                  <TableRow key={d.id}>
                                      <TableCell className="font-medium">{d.dispensaryName}</TableCell>
                                      <TableCell>{d.licenseNumber}</TableCell>
                                      <TableCell><Badge variant="outline">{d.state}</Badge></TableCell>
                                      <TableCell>{d.contactPerson || 'N/A'}</TableCell>
                                      <TableCell>{d.contactEmail || 'N/A'}</TableCell>
                                      <TableCell>{d.contactPhoneNumber || 'N/A'}</TableCell>
                                      <TableCell>{d.address || 'N/A'}</TableCell>
                                      <TableCell className="text-right">
                                          <Button variant="ghost" size="icon" onClick={() => handleEditClientDispensary(d)} className="hover:text-accent mr-2">
                                              <Edit className="h-4 w-4" />
                                              <span className="sr-only">Edit Client</span>
                                          </Button>
                                          <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="hover:text-destructive">
                                                  <Trash2 className="h-4 w-4" />
                                                  <span className="sr-only">Delete Client</span>
                                              </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                  This action cannot be undone. This will permanently delete the client "{d.dispensaryName}".
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                  <AlertDialogAction onClick={() => handleDeleteClientDispensary(d.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
      </section>

      {/* Dispensary Prospecting Section */}
      <section className="mt-12 pt-8 border-t">
        <div className="mb-6">
            <h2 className="text-2xl font-headline font-bold flex items-center">
                <Search className="mr-3 h-7 w-7 text-primary" />
                Dispensary Prospecting
            </h2>
            <p className="text-muted-foreground">Find new potential dispensary clients by state.</p>
        </div>
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle>Search for Prospects</CardTitle>
                <CardDescription>Enter a state abbreviation (e.g., CO, CA, NV) to find dispensaries.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                    <Input 
                        placeholder="Enter State (e.g., CA)"
                        value={stateSearchTerm}
                        onChange={(e) => setStateSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={handleSearchProspects} disabled={isLoadingProspects} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                        {isLoadingProspects ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Search Prospects
                    </Button>
                </div>
            </CardContent>
             {prospectResults.length > 0 && (
                <CardFooter className="flex-col items-start gap-4">
                    <h3 className="text-lg font-semibold">Prospect Results for {stateSearchTerm.toUpperCase()}</h3>
                    <div className="rounded-md border overflow-x-auto w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>License #</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prospectResults.map(prospect => (
                                    <TableRow key={prospect.id} className={!prospect.isExistingClient ? 'bg-accent/10 hover:bg-accent/20' : 'hover:bg-muted/50'}>
                                        <TableCell className="font-medium">{prospect.dispensaryName}</TableCell>
                                        <TableCell>{prospect.licenseNumber}</TableCell>
                                        <TableCell>
                                            {prospect.isExistingClient ? (
                                                <Badge variant="secondary"><UserCheck className="h-3 w-3 mr-1"/>Client</Badge>
                                            ) : (
                                                <Badge variant="default" className="bg-primary hover:bg-primary/90"><Star className="h-3 w-3 mr-1"/>Prospect</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{prospect.contactPerson || 'N/A'}</TableCell>
                                        <TableCell>{prospect.contactEmail || 'N/A'}</TableCell>
                                        <TableCell>{prospect.contactPhoneNumber || 'N/A'}</TableCell>
                                        <TableCell>{prospect.address || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            {!prospect.isExistingClient && (
                                                <Button size="sm" variant="outline" onClick={() => handleAddProspectToClients(prospect)} className="text-xs">
                                                    <PlusCircle className="mr-1 h-3 w-3"/> Add to Clients
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardFooter>
            )}
            {isLoadingProspects && (
                <CardContent className="text-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground mt-2">Searching for dispensaries...</p>
                </CardContent>
            )}
        </Card>
      </section>

      <DispensaryDialog
        isOpen={isClientDialogOpen}
        onClose={() => setIsClientDialogOpen(false)}
        onSave={handleSaveClientDispensary}
        dispensary={editingDispensary}
      />
    </div>
  );
}
