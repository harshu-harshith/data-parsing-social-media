document.addEventListener('DOMContentLoaded', () => {

    // Function to handle Instagram file upload and ZIP processing
    function handleInstagram() {
        const fileInput = document.getElementById('fileInputInstagram');
        const uploadButton = document.getElementById('uploadButtonInstagram');
        const dataSection = document.getElementById('dataSectionInstagram');
        const dataOptions = document.getElementById('dataOptionsInstagram');

        if (!fileInput || !uploadButton || !dataSection || !dataOptions) {
            console.error('One or more Instagram elements are missing from the DOM.');
            return;
        }

        // Event Listener for Instagram Upload Button
        uploadButton.addEventListener('click', async () => {
            if (fileInput.files.length === 0) {
                alert('Please select a ZIP file.');
                return;
            }

            const file = fileInput.files[0];

            if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
                alert('Please upload a ZIP file.');
                return;
            }

            const zip = new JSZip();
            const reader = new FileReader();

            reader.onload = async function (event) {
                try {
                    const content = event.target.result;
                    const zipContent = await zip.loadAsync(content);

                    dataOptions.innerHTML = ''; // Clear previous options

                    const fileList = [];

                    // Build the file list
                    zipContent.forEach((relativePath, zipEntry) => {
                        fileList.push({
                            path: relativePath,
                            isDir: zipEntry.dir,
                            name: zipEntry.name,
                        });
                    });

                    // Modified renderFiles function to exclude folders and format names
                    const renderFiles = (filterFn = null, isGallery = false, nameFormatter = (file) => file.name) => {
                        dataOptions.innerHTML = '';
                        const filteredFiles = filterFn ? fileList.filter(filterFn) : fileList;

                        // Exclude directories (folders) from display
                        const nonDirFiles = filteredFiles.filter((file) => !file.isDir);

                        if (isGallery) {
                            const galleryDiv = document.createElement('div');
                            galleryDiv.classList.add('gallery');

                            nonDirFiles.forEach(async (file) => {
                                const fileType = file.name.split('.').pop().toLowerCase();
                                const zipEntry = zipContent.file(file.path);
                                const fileBlob = await zipEntry.async('blob');
                                const fileURL = URL.createObjectURL(fileBlob);

                                let mediaElement;
                                if (fileType === 'mp4') {
                                    mediaElement = document.createElement('video');
                                    mediaElement.controls = true;
                                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
                                    mediaElement = document.createElement('img');
                                }

                                if (mediaElement) {
                                    mediaElement.src = fileURL;
                                    mediaElement.style.width = '150px';
                                    mediaElement.style.height = '150px';
                                    mediaElement.classList.add('gallery-item');

                                    mediaElement.addEventListener('click', () => {
                                        const modal = document.createElement('div');
                                        modal.classList.add('modal');
                                        const fullMedia = mediaElement.cloneNode(true);
                                        fullMedia.style.width = 'auto';
                                        fullMedia.style.height = 'auto';
                                        fullMedia.classList.add('full-media');
                                        modal.appendChild(fullMedia);
                                        document.body.appendChild(modal);

                                        modal.addEventListener('click', () => {
                                            document.body.removeChild(modal);
                                        });
                                    });

                                    galleryDiv.appendChild(mediaElement);
                                }
                            });

                            dataOptions.appendChild(galleryDiv);
                        } else {
                            const ul = document.createElement('ul');
                            nonDirFiles.forEach((file) => {
                                const li = document.createElement('li');
                                li.textContent = nameFormatter(file);  // Use the nameFormatter here
                                li.classList.add('file');
                                li.addEventListener('click', async () => {
                                    const zipEntry = zipContent.file(file.path);
                                    const fileContent = await zipEntry.async('text');

                                    alert(fileContent); // Display the file content in an alert
                                });
                                ul.appendChild(li);
                            });

                            dataOptions.appendChild(ul);
                        }

                        dataSection.style.display = 'block'; // Show the data section
                    };

                    // Show all images by default in gallery view
                    renderFiles((file) => /\.(jpg|jpeg|png|gif)$/i.test(file.name), true);

                    // Event Listeners for Filter Buttons
                    document.getElementById('showAllFilesInstagram').addEventListener('click', () => renderFiles());
                    document.getElementById('showMessagesInstagram').addEventListener('click', () => {
                        renderFiles((file) => file.path.includes('messages'));
                    });
                    document.getElementById('showLoginDetailsInstagram').addEventListener('click', () => {
                        renderFiles((file) => file.path.includes('login'), false, (file) => {
                            // Custom formatter for login details: remove path, extension, and replace underscores with spaces
                            return file.name.replace('.html', '').replace('security_and_login_information/login_and_profile_creation/', '').replace(/_/g, ' ');
                        });
                    });
                    document.getElementById('showAllImagesInstagram').addEventListener('click', () => {
                        renderFiles((file) => /\.(jpg|jpeg|png|gif)$/i.test(file.name), true);
                    });
                    document.getElementById('showAllVideosInstagram').addEventListener('click', () => {
                        renderFiles((file) => /\.(mp4|mkv|avi)$/i.test(file.name), true);
                    });

                } catch (error) {
                    console.error('Error extracting ZIP file:', error);
                    alert('Error extracting ZIP file.');
                }
            };

            reader.readAsArrayBuffer(file);
        });
    }

    // Placeholder function for WhatsApp (to be implemented later)
    function handleWhatsApp() {
        return null; // Will implement later
    }

    // Placeholder function for Facebook (to be implemented later)
    function handleFacebook() {
        return 0; // Will implement later
    }

    // Function to switch between platforms
    function showPlatform(platform) {
        let platforms = ['instagramPage', 'whatsappPage', 'facebookPage'];
        platforms.forEach(id => {
            document.getElementById(id).classList.remove('visible');
            document.getElementById(id).style.display = 'none'; // Hide all sections
        });

        // Show the relevant section
        if (platform === 'instagram') {
            document.getElementById('instagramPage').classList.add('visible');
            document.getElementById('instagramPage').style.display = 'block';
            handleInstagram(); // Initialize Instagram functionality
        } else if (platform === 'whatsapp') {
            document.getElementById('whatsappPage').classList.add('visible');
            document.getElementById('whatsappPage').style.display = 'block';
            handleWhatsApp(); // Placeholder for WhatsApp functionality
        } else if (platform === 'facebook') {
            document.getElementById('facebookPage').classList.add('visible');
            document.getElementById('facebookPage').style.display = 'block';
            handleFacebook(); // Placeholder for Facebook functionality
        }
    }

    // Event Listeners for Platform Buttons
    document.getElementById('instagramButton').addEventListener('click', () => showPlatform('instagram'));
    document.getElementById('whatsappButton').addEventListener('click', () => showPlatform('whatsapp'));
    document.getElementById('facebookButton').addEventListener('click', () => showPlatform('facebook'));

});
