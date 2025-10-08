import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AnimatedBackground from './components/AnimatedBackground';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import AdminLoginForm from './components/Auth/AdminLoginForm';
import Navbar from './components/Navbar';
import IssueList from './components/IssueList';
import IssueForm from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import AdminDashboard from './components/AdminDashboard';
import Analytics from './components/Analytics';
import NotificationPanel from './components/NotificationPanel';
import { Issue, Comment, Notification } from './types';
import { issuesAPI, commentsAPI, notificationsAPI } from './lib/api';

function AppContent() {
  const { user } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState<'login' | 'register' | 'admin'>('login');
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'analytics'>('home');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch issues on mount and when user changes
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await issuesAPI.getAll();
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [user]);

  // Fetch notifications when user is logged in
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const data = await notificationsAPI.getAll();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  // Fetch comments when issue is selected
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedIssue) return;
      try {
        const data = await commentsAPI.getByIssueId(selectedIssue.id);
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [selectedIssue]);

  const handleSubmitIssue = async (issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newIssue = await issuesAPI.create(issueData);
      setIssues([newIssue, ...issues]);
      setShowIssueForm(false);
    } catch (error) {
      console.error('Failed to create issue:', error);
      alert('Failed to create issue. Please try again.');
    }
  };

  const handleAddComment = async (issueId: string, content: string) => {
    if (!user) return;

    try {
      const newComment = await commentsAPI.create(issueId, content, user.full_name);
      setComments([...comments, newComment]);
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleUpdateStatus = async (issueId: string, status: Issue['status']) => {
    try {
      const updatedIssue = await issuesAPI.updateStatus(issueId, status);
      setIssues(issues.map((issue) => (issue.id === issueId ? updatedIssue : issue)));
      
      // Update selected issue if it's the one being updated
      if (selectedIssue?.id === issueId) {
        setSelectedIssue(updatedIssue);
      }

      // Refresh notifications
      if (user) {
        const data = await notificationsAPI.getAll();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read && n.user_id === user?.id).length;
  const userNotifications = notifications.filter((n) => n.user_id === user?.id);

  if (!user) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center p-4">
          {showAuthForm === 'login' && (
            <LoginForm 
              onToggleForm={() => setShowAuthForm('register')} 
              onAdminLogin={() => setShowAuthForm('admin')}
            />
          )}
          {showAuthForm === 'register' && (
            <RegisterForm onToggleForm={() => setShowAuthForm('login')} />
          )}
          {showAuthForm === 'admin' && (
            <AdminLoginForm onBackToUserLogin={() => setShowAuthForm('login')} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen relative">
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          onNewIssue={() => setShowIssueForm(true)}
          unreadNotifications={unreadCount}
          onNotificationsClick={() => setShowNotifications(true)}
        />

        <main className="container mx-auto px-4 py-8">
          {currentView === 'home' && (
            <>
              {showIssueForm ? (
                <IssueForm
                  onSubmit={handleSubmitIssue}
                  onCancel={() => setShowIssueForm(false)}
                />
              ) : (
                <IssueList issues={issues} onIssueClick={handleIssueClick} />
              )}
            </>
          )}

          {currentView === 'admin' && user.role === 'admin' && (
            <AdminDashboard issues={issues} onIssueClick={handleIssueClick} />
          )}

          {currentView === 'analytics' && <Analytics issues={issues} />}
        </main>

        {selectedIssue && (
          <IssueDetail
            issue={selectedIssue}
            comments={comments.filter((c) => c.issue_id === selectedIssue.id)}
            onClose={() => setSelectedIssue(null)}
            onAddComment={handleAddComment}
            onUpdateStatus={user.role === 'admin' ? handleUpdateStatus : undefined}
          />
        )}

        {showNotifications && (
          <NotificationPanel
            notifications={userNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
