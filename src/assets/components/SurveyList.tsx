import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store/store';
import type { Submission } from '../../assets/lib/surveySlice';

const ITEMS_PER_PAGE = 5;

const SurveyList: React.FC = () => {
  // Get the complete list of submissions from the Redux store.
  const allSubmissions = useAppSelector((state: RootState) => state.survey.submissions);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  // States for filter options
  const [filterRole, setFilterRole] = useState('');
  const [filterTech, setFilterTech] = useState('');
  // State for the currently selected submission
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  // State for the custom message box
  // Removed unused messageBox state

  // Filter and search logic
  const filteredSubmissions = allSubmissions.filter(submission => {
    // Check if the submission matches the search term
    const nameMatch = submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const emailMatch = submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    
    const matchesSearch = searchTerm === '' || nameMatch || emailMatch;
    const matchesRole = filterRole === '' || submission.role === filterRole;
    const matchesTech = filterTech === '' ||
      submission.preferredFrontend === filterTech ||
      submission.preferredBackend === filterTech ||
      submission.preferredDatabase === filterTech ||
      submission.preferredHosting === filterTech;

    return matchesSearch && matchesRole && matchesTech;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterTech]);

  // Functions to handle UI interactions
  const viewDetails = (submission: Submission) => setSelectedSubmission(submission);
  const closeDetails = () => setSelectedSubmission(null);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // File download handler
  const handleDownloadFile = (submission: Submission) => {
  // If the submission has a file, construct the URL to download it
    const urlParts = submission.fileUrl?.split('/');
    const uniqueFileNameWithId = urlParts ? urlParts[urlParts.length - 1] : null;

    if (uniqueFileNameWithId) {
      // Construct the full URL to our backend's secure download endpoint.
      const downloadUrl = `http://localhost:7071/api/download/${uniqueFileNameWithId}`;
      window.open(downloadUrl, '_blank');
    } else {// If no file URL is present, show a message box
      alert("No file was uploaded for this submission.");
    }
  };

  return (
    <div className="container mx-auto p-6 font-sans">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Survey Submissions List</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent flex-grow text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-700"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="fullstack">Fullstack</option>
        </select>
        <select
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-700"
          value={filterTech}
          onChange={(e) => setFilterTech(e.target.value)}
        >
          <option value="">All Tech Stacks</option>
          <optgroup label="Frontend">
            <option value="React">React</option> <option value="Vue">Vue</option> <option value="Angular">Angular</option> <option value="Other">Other</option>
          </optgroup>
          <optgroup label="Backend">
            <option value="Node.js">Node.js</option> <option value="Python">Python</option> <option value="Go">Go</option> <option value="Other">Other</option>
          </optgroup>
          <optgroup label="Database">
            <option value="MongoDB">MongoDB</option> <option value="PostgreSQL">PostgreSQL</option> <option value="CosmosDB">CosmosDB</option> <option value="Other">Other</option>
          </optgroup>
          <optgroup label="Hosting">
            <option value="Vercel">Vercel</option> <option value="Azure">Azure</option> <option value="Netlify">Netlify</option> <option value="Other">Other</option>
          </optgroup>
        </select>
      </div>

      {/* Submissions Table/List */}
      {filteredSubmissions.length === 0 ? (
        <p className="text-center text-xl text-gray-600 py-10">No submissions found matching your criteria.</p>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSubmissions.map((submission, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{submission.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => viewDetails(submission)} className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-200">
                      View Details
                    </button>
                    <button
                      onClick={() => handleDownloadFile(submission)}
                      className={`text-green-600 hover:text-green-900 transition-colors duration-200 ${!submission.fileName ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!submission.fileName}
                    >
                      Download File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages === 0 ? 1 : totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Submission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
              {/* Left Column */}
              <div className="space-y-3">
                <p><strong className="font-semibold text-gray-900">Name:</strong> {selectedSubmission.name || 'N/A'}</p>
                <p><strong className="font-semibold text-gray-900">Email:</strong> {selectedSubmission.email || 'N/A'}</p>
                <p><strong className="font-semibold text-gray-900">Role:</strong> {selectedSubmission.role}</p>
              </div>

              {/* Right Column with "Other" Logic */}
              <div className="space-y-3">
                <p>
                  <strong className="font-semibold text-gray-900">Frontend:</strong> {selectedSubmission.preferredFrontend}
                  {selectedSubmission.preferredFrontend === 'Other' && (
                    <span className="text-gray-500 italic"> ({selectedSubmission.preferredFrontendOther || 'not specified'})</span>
                  )}
                </p>
                <p>
                  <strong className="font-semibold text-gray-900">Backend:</strong> {selectedSubmission.preferredBackend}
                  {selectedSubmission.preferredBackend === 'Other' && (
                    <span className="text-gray-500 italic"> ({selectedSubmission.preferredBackendOther || 'not specified'})</span>
                  )}
                </p>
                <p>
                  <strong className="font-semibold text-gray-900">Database:</strong> {selectedSubmission.preferredDatabase}
                  {selectedSubmission.preferredDatabase === 'Other' && (
                    <span className="text-gray-500 italic"> ({selectedSubmission.preferredDatabaseOther || 'not specified'})</span>
                  )}
                </p>
                <p>
                  <strong className="font-semibold text-gray-900">Hosting:</strong> {selectedSubmission.preferredHosting}
                  {selectedSubmission.preferredHosting === 'Other' && (
                    <span className="text-gray-500 italic"> ({selectedSubmission.preferredHostingOther || 'not specified'})</span>
                  )}
                </p>
              </div>
            </div>

            {selectedSubmission.fileName && (
              <div className="mt-6 pt-4 border-t">
                  <p className="text-gray-700">
                      <strong className="font-semibold text-gray-900">Uploaded File:</strong> {selectedSubmission.fileName}
                      <button 
                          onClick={() => handleDownloadFile(selectedSubmission)} 
                          className="ml-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                          Download
                      </button>
                  </p>
              </div>
            )}

            <button
              onClick={closeDetails}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyList;