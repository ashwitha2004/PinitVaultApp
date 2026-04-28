import { useState, useRef, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';

interface ProfileData {
  fullName: string;
  email: string;
  age: string;
  gender: string;
  phoneNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  internships: string[];
  projects: string[];
  profileImage: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Ashwitha',
    email: 'example@email.com',
    age: '',
    gender: '',
    phoneNumber: '',
    linkedinUrl: '',
    githubUrl: '',
    internships: [],
    projects: [],
    profileImage: ''
  });
  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data and generate user ID on mount
  useEffect(() => {
    // Load existing profile data
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
      setTempProfileData(parsed);
    }

    // Generate or load user ID
    let savedUserId = localStorage.getItem('user_id');
    if (!savedUserId) {
      savedUserId = 'PIN' + Math.floor(Math.random() * 900000 + 100000);
      localStorage.setItem('user_id', savedUserId);
    }
    setUserId(savedUserId);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setTempProfileData(prev => ({ ...prev, profileImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    setTempProfileData(profileData);
    setIsEditMode(true);
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    setIsEditMode(false);
    
    // Save to localStorage with the requested structure
    const profileObject = {
      name: tempProfileData.fullName,
      email: tempProfileData.email,
      age: tempProfileData.age,
      gender: tempProfileData.gender,
      phone: tempProfileData.phoneNumber,
      linkedin: tempProfileData.linkedinUrl,
      github: tempProfileData.githubUrl,
      avatar: tempProfileData.profileImage
    };
    
    localStorage.setItem('user_profile', JSON.stringify(profileObject));
  };

  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setIsEditMode(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setTempProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddInternship = () => {
    const internship = prompt('Enter internship details:');
    if (internship) {
      setTempProfileData(prev => ({
        ...prev,
        internships: [...prev.internships, internship]
      }));
    }
  };

  const handleAddProject = () => {
    const project = prompt('Enter project details:');
    if (project) {
      setTempProfileData(prev => ({
        ...prev,
        projects: [...prev.projects, project]
      }));
    }
  };

  const handleRemoveInternship = (index: number) => {
    setTempProfileData(prev => ({
      ...prev,
      internships: prev.internships.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveProject = (index: number) => {
    setTempProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            {/* Profile Image */}
            <div className="relative">
              {isEditMode ? (
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    {tempProfileData.profileImage ? (
                      <img 
                        src={tempProfileData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">A</span>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {profileData.profileImage ? (
                    <img 
                      src={profileData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">A</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Info Block */}
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tempProfileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={tempProfileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{profileData.fullName}</h2>
                  <p className="text-gray-600 mb-1">{profileData.email}</p>
                  <p className="text-sm text-gray-500">piniT ID: {userId}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="mt-3">
                {isEditMode ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('Profile')}
              className={`px-4 py-3 text-center font-medium transition-colors whitespace-nowrap ${
                activeTab === 'Profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('Security')}
              className={`px-4 py-3 text-center font-medium transition-colors whitespace-nowrap ${
                activeTab === 'Security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('Digital Identity')}
              className={`px-4 py-3 text-center font-medium transition-colors whitespace-nowrap ${
                activeTab === 'Digital Identity'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Digital Identity
            </button>
            <button
              onClick={() => setActiveTab('Subscription')}
              className={`px-4 py-3 text-center font-medium transition-colors whitespace-nowrap ${
                activeTab === 'Subscription'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Subscription
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'Profile' && (
              <div className="space-y-6">
                {/* Basic Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Basic Details</h3>
                  <div className="space-y-3">
                    {isEditMode ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={tempProfileData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            value={tempProfileData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            value={tempProfileData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={tempProfileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={tempProfileData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Full Name</span>
                          <span className="text-sm font-medium text-gray-900">{profileData.fullName || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Age</span>
                          <span className="text-sm font-medium text-gray-900">{profileData.age || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Gender</span>
                          <span className="text-sm font-medium text-gray-900">{profileData.gender || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Email</span>
                          <span className="text-sm font-medium text-gray-900">{profileData.email}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">Phone Number</span>
                          <span className="text-sm font-medium text-gray-900">{profileData.phoneNumber || 'Not set'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Professional Links */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Professional Links</h3>
                  <div className="space-y-3">
                    {isEditMode ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                          <input
                            type="url"
                            value={tempProfileData.linkedinUrl}
                            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                          <input
                            type="url"
                            value={tempProfileData.githubUrl}
                            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">LinkedIn</span>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {profileData.linkedinUrl || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">GitHub</span>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {profileData.githubUrl || 'Not set'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Career Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Career Info</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Internships</span>
                        {isEditMode && (
                          <button
                            onClick={handleAddInternship}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                      {profileData.internships.length === 0 && !isEditMode && (
                        <p className="text-sm text-gray-500 text-center py-4">No internships added</p>
                      )}
                      <div className="space-y-2">
                        {(isEditMode ? tempProfileData : profileData).internships.map((internship, index) => (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                            <span className="text-sm text-gray-900 flex-1">{internship}</span>
                            {isEditMode && (
                              <button
                                onClick={() => handleRemoveInternship(index)}
                                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Projects</span>
                        {isEditMode && (
                          <button
                            onClick={handleAddProject}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Add
                          </button>
                        )}
                      </div>
                      {profileData.projects.length === 0 && !isEditMode && (
                        <p className="text-sm text-gray-500 text-center py-4">No projects added</p>
                      )}
                      <div className="space-y-2">
                        {(isEditMode ? tempProfileData : profileData).projects.map((project, index) => (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                            <span className="text-sm text-gray-900 flex-1">{project}</span>
                            {isEditMode && (
                              <button
                                onClick={() => handleRemoveProject(index)}
                                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'Security' && (
              <div className="space-y-4">
                <div className="text-center text-gray-500">
                  <p>Security settings</p>
                  <p className="text-sm mt-2">Manage your password and security preferences</p>
                </div>
              </div>
            )}
            
            {activeTab === 'Digital Identity' && (
              <div className="space-y-4">
                <div className="text-center text-gray-500">
                  <p>Digital Identity</p>
                  <p className="text-sm mt-2">Your digital credentials and verifications</p>
                </div>
              </div>
            )}
            
            {activeTab === 'Subscription' && (
              <div className="space-y-4">
                <div className="text-center text-gray-500">
                  <p>Subscription details</p>
                  <p className="text-sm mt-2">View and manage your subscription plan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
