import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Shield, Users, Settings, TrendingUp, Lock, Unlock, Mail, UserCheck, UserX, Eye, Activity, BarChart3, Globe, Power } from 'lucide-react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    accessMode: 'public', // public, private, invite_only, request_only
    allowRegistration: true,
    requireEmailVerification: false,
    maintenanceMode: false,
    product1Enabled: true,
    product2Enabled: true,
    product3Enabled: true
  });

  // Users State
  const [users, setUsers] = useState([
    { id: 1, email: 'user1@example.com', role: 'user', tier: 'professional', status: 'active', created: '2025-01-15' },
    { id: 2, email: 'user2@example.com', role: 'user', tier: 'expert', status: 'active', created: '2025-02-20' },
    { id: 3, email: 'user3@example.com', role: 'user', tier: 'trial', status: 'pending', created: '2025-03-10' }
  ]);

  // Access Requests State
  const [accessRequests, setAccessRequests] = useState([
    { id: 1, email: 'newuser1@example.com', name: 'John Doe', message: 'I want to use your platform', status: 'pending', date: '2025-10-05' },
    { id: 2, email: 'newuser2@example.com', name: 'Jane Smith', message: 'Looking forward to trying the suite', status: 'pending', date: '2025-10-06' }
  ]);

  // Invitations State
  const [invitations, setInvitations] = useState([
    { id: 1, email: 'invited1@example.com', code: 'INV-ABC123', tier: 'professional', status: 'pending', expires: '2025-10-14' },
    { id: 2, email: 'invited2@example.com', code: 'INV-XYZ789', tier: 'expert', status: 'used', expires: '2025-10-20' }
  ]);

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeUsers: 142,
    pendingRequests: 8,
    totalRevenue: 12450,
    activeCampaigns: 34,
    totalNiches: 89
  });

  // Product Settings State
  const [productSettings, setProductSettings] = useState({
    product1: { enabled: true, accessMode: 'public', name: 'NicheFinder AI Pro' },
    product2: { enabled: true, accessMode: 'public', name: 'CampaignMaster Pro' },
    product3: { enabled: true, accessMode: 'public', name: 'TrendScout Live' }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded for demo - replace with real API call
    if (email === 'owner@affiliatesuite.com' && password === 'OwnerMaster2025!') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use:\nEmail: owner@affiliatesuite.com\nPassword: OwnerMaster2025!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const updateSystemSettings = (key, value) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const approveRequest = (id) => {
    setAccessRequests(prev => prev.filter(r => r.id !== id));
    alert('Access request approved! User can now access the platform.');
  };

  const rejectRequest = (id) => {
    setAccessRequests(prev => prev.filter(r => r.id !== id));
    alert('Access request rejected.');
  };

  const createInvitation = (email, tier) => {
    const newInvite = {
      id: invitations.length + 1,
      email,
      code: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      tier,
      status: 'pending',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setInvitations(prev => [...prev, newInvite]);
    alert(`Invitation created!\nCode: ${newInvite.code}\nSend this to: ${email}`);
  };

  const updateUserStatus = (userId, newStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const updateUserTier = (userId, newTier) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, tier: newTier } : u));
  };

  const deleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('User deleted successfully.');
    }
  };

  const updateProductSettings = (productId, key, value) => {
    setProductSettings(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [key]: value }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">Owner Admin Access</CardTitle>
            <CardDescription>Sign in to manage your affiliate suite</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@affiliatesuite.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In as Owner
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Demo Credentials:<br />
                Email: owner@affiliatesuite.com<br />
                Password: OwnerMaster2025!
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Owner Dashboard</h1>
                <p className="text-xs text-slate-500">Full System Control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Power className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="system">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="requests">
              <UserCheck className="h-4 w-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="invites">
              <Mail className="h-4 w-4 mr-2" />
              Invites
            </TabsTrigger>
            <TabsTrigger value="products">
              <Globe className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.activeUsers}</div>
                  <p className="text-xs text-green-600 mt-1">91% active rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.pendingRequests}</div>
                  <p className="text-xs text-orange-600 mt-1">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-green-600 mt-1">+24% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.activeCampaigns}</div>
                  <p className="text-xs text-slate-600 mt-1">Across all users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Niches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.totalNiches}</div>
                  <p className="text-xs text-slate-600 mt-1">Discovered & tracked</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Access Mode</span>
                  <Badge variant={systemSettings.accessMode === 'public' ? 'default' : 'secondary'}>
                    {systemSettings.accessMode.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Registration</span>
                  <Badge variant={systemSettings.allowRegistration ? 'default' : 'secondary'}>
                    {systemSettings.allowRegistration ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Maintenance Mode</span>
                  <Badge variant={systemSettings.maintenanceMode ? 'destructive' : 'default'}>
                    {systemSettings.maintenanceMode ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Control who can access your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accessMode">Access Mode</Label>
                  <Select value={systemSettings.accessMode} onValueChange={(v) => updateSystemSettings('accessMode', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Unlock className="h-4 w-4" />
                          Public - Anyone can register
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Private - Only you can access
                        </div>
                      </SelectItem>
                      <SelectItem value="invite_only">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Invite Only - Requires invitation
                        </div>
                      </SelectItem>
                      <SelectItem value="request_only">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Request Only - Manual approval required
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {systemSettings.accessMode === 'public' && 'Anyone can register and use the platform'}
                    {systemSettings.accessMode === 'private' && 'Only you have access - perfect for personal use'}
                    {systemSettings.accessMode === 'invite_only' && 'Users need an invitation code to register'}
                    {systemSettings.accessMode === 'request_only' && 'Users must request access and wait for approval'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Registration</Label>
                    <p className="text-xs text-muted-foreground">Enable/disable new user signups</p>
                  </div>
                  <Switch
                    checked={systemSettings.allowRegistration}
                    onCheckedChange={(v) => updateSystemSettings('allowRegistration', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-xs text-muted-foreground">Require email verification for new users</p>
                  </div>
                  <Switch
                    checked={systemSettings.requireEmailVerification}
                    onCheckedChange={(v) => updateSystemSettings('requireEmailVerification', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Temporarily disable access for all users</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(v) => updateSystemSettings('maintenanceMode', v)}
                  />
                </div>

                <Button className="w-full">Save System Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users and their access</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Select value={user.tier} onValueChange={(v) => updateUserTier(user.id, v)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="trial">Trial</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select value={user.status} onValueChange={(v) => updateUserStatus(user.id, v)}>
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{user.created}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Requests ({accessRequests.length})</CardTitle>
                <CardDescription>Review and approve/reject access requests</CardDescription>
              </CardHeader>
              <CardContent>
                {accessRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending access requests
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accessRequests.map(request => (
                      <Card key={request.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{request.name}</p>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                              <p className="text-sm mt-2">{request.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">Requested on {request.date}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => approveRequest(request.id)}>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => rejectRequest(request.id)}>
                                <UserX className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Invitation</CardTitle>
                <CardDescription>Send invitation codes to specific users</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteForm onSubmit={createInvitation} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Invitations</CardTitle>
                <CardDescription>Manage sent invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map(invite => (
                      <TableRow key={invite.id}>
                        <TableCell>{invite.email}</TableCell>
                        <TableCell className="font-mono text-sm">{invite.code}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{invite.tier}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={invite.status === 'used' ? 'default' : 'secondary'}>
                            {invite.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{invite.expires}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {Object.entries(productSettings).map(([productId, settings]) => (
              <Card key={productId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{settings.name}</CardTitle>
                      <CardDescription>Control access and features</CardDescription>
                    </div>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(v) => updateProductSettings(productId, 'enabled', v)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Access Mode</Label>
                    <Select
                      value={settings.accessMode}
                      onValueChange={(v) => updateProductSettings(productId, 'accessMode', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private (Owner Only)</SelectItem>
                        <SelectItem value="invite_only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">Product Status</span>
                    <Badge variant={settings.enabled ? 'default' : 'secondary'}>
                      {settings.enabled ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Invite Form Component
function InviteForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('professional');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, tier);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inviteEmail">Email Address</Label>
        <Input
          id="inviteEmail"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="inviteTier">Subscription Tier</Label>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trial">Trial (14 days)</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        <Mail className="h-4 w-4 mr-2" />
        Create Invitation
      </Button>
    </form>
  );
}

export default App;
