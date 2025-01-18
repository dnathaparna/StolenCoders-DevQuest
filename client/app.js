const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://your-backend-domain.com';  // Update this with your actual backend domain

let currentUser = null;
        let stream = null;

        // Initialize
        function init() {
            updateUIForAuth(null);
            setupEventListeners();
        }

        // Event Listeners
        function setupEventListeners() {
            document.getElementById('startCamera').addEventListener('click', startVideoStream);
            document.getElementById('switchCamera').addEventListener('click', switchCamera);
            document.getElementById('capture').addEventListener('click', captureImage);
            document.getElementById('signupBtn').addEventListener('click', () => openSignupModal());
            document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        }

        // Navigation
        function showSection(sectionId) {
            if (!currentUser && (sectionId === 'scan' || sectionId === 'profile' || sectionId === 'dashboard')) {
                openSignupModal();
                return;
            }

            ['home', 'scan', 'profile', 'dashboard'].forEach(id => {
                document.getElementById(id).classList.add('hidden');
            });
            document.getElementById(sectionId).classList.remove('hidden');

            if (sectionId === 'dashboard' && currentUser?.role === 'expert') {
                loadDashboardData();
            }
        }

        // Authentication
        async function handleSignup() {
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('userRole').value;

            try {
                const response = await fetch(`${API_URL}/api/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fullName, email, password, role })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Signup failed');
                }

                currentUser = await response.json();
                updateUIForAuth(currentUser);
                closeModal();
                showSection('home');
            } catch (error) {
                alert(error.message || 'Signup failed. Please try again.');
            }
        }

        function handleLogout() {
            currentUser = null;
            updateUIForAuth(null);
            showSection('home');
        }

        // UI Updates
        function updateUIForAuth(user) {
            const scanLink = document.querySelector('.scan-link');
            const expertView = document.querySelector('.expert-view');
            const profileLink = document.querySelector('.profile-link');
            const signupBtn = document.getElementById('signupBtn');
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');

            if (user) {
                signupBtn.classList.add('hidden');
                loginBtn.classList.add('hidden');
                logoutBtn.classList.remove('hidden');
                profileLink.classList.remove('hidden');
                
                if (user.role === 'expert') {
                    expertView.classList.remove('hidden');
                    scanLink.classList.add('hidden');
                } else {
                    scanLink.classList.remove('hidden');
                    expertView.classList.add('hidden');
                }

                updateProfile(user);
            } else {
                signupBtn.classList.remove('hidden');
                loginBtn.classList.remove('hidden');
                logoutBtn.classList.add('hidden');
                scanLink.classList.add('hidden');
                expertView.classList.add('hidden');
                profileLink.classList.add('hidden');
            }
        }

        // Camera Functions
        async function startVideoStream() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = document.getElementById('video');
                video.srcObject = stream;
                video.classList.remove('hidden');
                document.getElementById('canvas').classList.add('hidden');
                document.getElementById('scanOverlay').classList.add('hidden');
                video.play();
                document.getElementById('capture').disabled = false;
            } catch (err) {
                console.error('Error accessing camera:', err);
                alert('Error accessing camera. Please ensure you have granted camera permissions.');
            }
        }

        async function switchCamera() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                const video = document.getElementById('video');
                video.srcObject = null;
            }
            await startVideoStream();
        }

        function captureImage() {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            video.classList.add('hidden');
            canvas.classList.remove('hidden');

            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            performAnalysis();
        }

        // Analysis Functions
        async function performAnalysis() {
            const results = document.getElementById('results');
            results.classList.remove('hidden');

            // Mock analysis results
            const analysisResults = document.getElementById('analysisResults');
            analysisResults.innerHTML = `
                <div class="space-y-4">
                    <div class="flex items-center">
                        <i class="bi bi-palette text-teal-600 text-xl mr-2"></i>
                        <div>
                            <p class="font-semibold">Skin Tone Analysis</p>
                            <p class="text-gray-600">Medium with warm undertones</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <i class="bi bi-droplet text-teal-600 text-xl mr-2"></i>
                        <div>
                            <p class="font-semibold">Dosha Analysis</p>
                            <p class="text-gray-600">Dominant Pitta characteristics</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <i class="bi bi-clipboard2-pulse text-teal-600 text-xl mr-2"></i>
                        <div>
                            <p class="font-semibold">Health Indicators</p>
                            <p class="text-gray-600">Slight dryness detected, possible Vata imbalance</p>
                        </div>
                    </div>
                    <div class="mt-4 p-4 bg-teal-50 rounded-lg">
                        <p class="font-semibold text-teal-800">Recommendations:</p>
                        <ul class="list-disc list-inside text-gray-600 mt-2">
                            <li>Increase water intake</li>
                            <li>Consider cooling herbs</li>
                            <li>Balance Pitta with appropriate diet</li>
                        </ul>
                    </div>
                </div>
            `;
        }

        // Profile Functions
        function updateProfile(user) {
            document.getElementById('profileName').textContent = user.fullName;
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileRole').textContent = user.role;
            document.getElementById('profileJoinDate').textContent = new Date(user.joinDate).toLocaleDateString();
            
            const scanHistory = document.getElementById('scanHistory');
            if (user.scanHistory.length === 0) {
                scanHistory.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="bi bi-inbox text-4xl mb-2"></i>
                        <p>No scan history available yet</p>
                    </div>
                `;
            } else {
                scanHistory.innerHTML = user.scanHistory.map(scan => `
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-semibold">${scan.date}</p>
                                <p class="text-gray-600">${scan.analysis}</p>
                            </div>
                            <button class="text-teal-600 hover:text-teal-700">
                                <i class="bi bi-arrow-right-circle"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Expert Dashboard Functions
        function loadDashboardData() {
            const patientGrid = document.getElementById('patientGrid');
            // Mock patient data
            const patients = [
                { id: 1, name: 'Patient 1', lastScan: '2023-11-01', condition: 'Pitta imbalance', status: 'pending' },
                { id: 2, name: 'Patient 2', lastScan: '2023-11-02', condition: 'Vata excess', status: 'reviewed' }
            ];

            patientGrid.innerHTML = patients.map(patient => `
                <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-bold text-lg">${patient.name}</h3>
                            <p class="text-gray-600">Last Scan: ${patient.lastScan}</p>
                        </div>
                        <span class="px-2 py-1 rounded ${
                            patient.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }">${patient.status}</span>
                    </div>
                    <p class="text-gray-600 mb-4">Condition: ${patient.condition}</p>
                    <button onclick="viewPatientDetails(${patient.id})" class="w-full bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                        View Details
                    </button>
                </div>
            `).join('');
        }

        function viewPatientDetails(patientId) {
            // Mock function to view patient details
            alert(`Viewing details for patient ${patientId}`);
        }

        // Modal Functions
        function openSignupModal(defaultRole = 'patient') {
            document.getElementById('userRole').value = defaultRole;
            document.getElementById('signupModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('signupModal').classList.add('hidden');
        }

        // Add this function after the navigation functions
        function checkAuthForScan() {
            if (currentUser) {
                showSection('scan');
            } else {
                openSignupModal('patient');
            }
        }

        async function saveScanResults() {
            if (!currentUser) return;

            const canvas = document.getElementById('canvas');
            const analysisResults = document.getElementById('analysisResults').innerHTML;

            try {
                // Compress the image by reducing quality
                const compressedImage = canvas.toDataURL('image/jpeg', 0.5); // Added quality parameter of 0.5

                const response = await fetch(`${API_URL}/api/scans`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        scanData: {
                            image: compressedImage,
                            analysis: analysisResults,
                            timestamp: new Date().toISOString() // Added timestamp for better tracking
                        }
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to save scan results');
                }

                alert('Scan results saved successfully!');
                showSection('profile');
            } catch (error) {
                console.error('Error saving scan:', error);
                alert(error.message || 'Failed to save scan results. Please try again.');
            }
        }

        function openLoginModal() {
            document.getElementById('loginModal').classList.remove('hidden');
        }

        function closeLoginModal() {
            document.getElementById('loginModal').classList.add('hidden');
        }

        async function handleLogin() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log('Attempting login with:', { email }); // Don't log passwords

            try {
                const response = await fetch(`${API_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                console.log('Login response status:', response.status);

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Login failed');
                }

                currentUser = await response.json();
                console.log('Login successful:', currentUser);
                
                updateUIForAuth(currentUser);
                closeLoginModal();
                showSection('home');
            } catch (error) {
                console.error('Login error:', error);
                alert(error.message || 'Login failed. Please try again.');
            }
        }

        // Initialize the application
        init();