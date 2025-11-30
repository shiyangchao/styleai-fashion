// Global variables
let uploadedImage = null;
let analysisResults = null;

// DOM elements - will be initialized in DOMContentLoaded
let uploadArea, fileInput, manualInputBtn, manualInputSection, manualForm, loadingSection, resultsSection, outfitsGrid;

// Application state
let appState = {
    isInitialized: false,
    currentOperation: null
};

// Add debug info for console
console.log('🚀 StyleAI Script loaded, waiting for DOM...');

// Upload area functionality
function initializeUploadArea() {
    if (!uploadArea || !fileInput) {
        console.error('Upload area elements not found:', { uploadArea, fileInput });
        return;
    }
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        showError('请上传图片文件（JPG、PNG等格式）');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showError('文件大小不能超过10MB');
        return;
    }

    try {
        // Show loading
        showLoading();

        // Simulate file processing and analysis
        setTimeout(() => {
            uploadedImage = file;
            simulateImageAnalysis();
        }, 2000);
    } catch (error) {
        console.error('Error processing file:', error);
        showError('文件处理失败: ' + error.message);
        hideLoading();
    }
}

function showError(message) {
    console.error('🚫 Error:', message);
    
    // Remove existing notifications
    removeExistingNotifications();
    
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: linear-gradient(135deg, #EF4444, #DC2626);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        z-index: 1000;
        animation: slideInRight 0.4s ease-out;
        max-width: 350px;
        font-size: 14px;
        line-height: 1.4;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">⚠️</div>
            <div>
                <div style="font-weight: 600; margin-bottom: 4px;">出现错误</div>
                <div style="opacity: 0.9;">${message}</div>
            </div>
        </div>
    `;
    
    errorDiv.classList.add('error-notification');
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}

function showSuccess(message) {
    console.log('✅ Success:', message);
    
    // Remove existing notifications
    removeExistingNotifications();
    
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        z-index: 1000;
        animation: slideInRight 0.4s ease-out;
        max-width: 350px;
        font-size: 14px;
        line-height: 1.4;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    `;
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 24px; height: 24px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">✅</div>
            <div>
                <div style="font-weight: 600; margin-bottom: 4px;">操作成功</div>
                <div style="opacity: 0.9;">${message}</div>
            </div>
        </div>
    `;
    
    successDiv.classList.add('success-notification');
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => successDiv.remove(), 300);
        }
    }, 3000);
}

// Utility function to remove existing notifications
function removeExistingNotifications() {
    const existingErrors = document.querySelectorAll('.error-notification');
    const existingSuccess = document.querySelectorAll('.success-notification');
    
    [...existingErrors, ...existingSuccess].forEach(notification => {
        if (notification.parentNode) {
            notification.remove();
        }
    });
}

// Manual input functionality
function initializeManualInput() {
    console.log('👤 Initializing manual input...');
    
    if (manualInputBtn && manualInputSection) {
        manualInputBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('👆 Manual input button clicked');
            
            // Show the manual input section with smooth animation
            manualInputSection.style.display = 'block';
            
            // Add visible class for animation
            setTimeout(() => {
                manualInputSection.classList.add('visible');
            }, 100);
            
            // Scroll to the form with smooth animation
            setTimeout(() => {
                manualInputSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 200);
            
            console.log('✅ Manual input section shown');
        });
        
        console.log('✅ Manual input initialized');
    } else {
        console.error('❌ Manual input elements not found:', { manualInputBtn, manualInputSection });
    }
}

// Form submission
function initializeFormSubmission() {
    console.log('🔧 Initializing form submission...');
    
    if (!manualForm) {
        console.error('❌ Manual form not found!');
        showError('表单元素未找到，请刷新页面重试');
        return;
    }
    
    manualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('📝 Form submitted!');
        
        // Prevent multiple simultaneous submissions
        if (appState.currentOperation === 'analyzing') {
            console.log('⚠️ Analysis already in progress');
            return;
        }
        
        try {
            // Get form data and validate
            const formData = getFormData();
            console.log('📊 Form data:', formData);
            
            // Validate required fields
            const validation = validateFormData(formData);
            if (!validation.isValid) {
                console.log('❌ Validation failed:', validation.errors);
                showError(validation.message);
                return;
            }

            console.log('✅ Form validation passed');
            appState.currentOperation = 'analyzing';
            
            // Show loading state
            showLoading();
            showSuccess('🔍 正在分析您的特征信息...');
            
            // Simulate analysis with progress updates
            setTimeout(() => {
                simulateManualAnalysis(formData);
            }, 2000);
            
        } catch (error) {
            console.error('💥 Error in form submission:', error);
            showError('表单提交失败: ' + error.message);
            appState.currentOperation = null;
        }
    });
    
    console.log('✅ Form submission initialized');
}

// Enhanced form data collection
function getFormData() {
    const data = {
        age: document.getElementById('age')?.value || '',
        height: document.getElementById('height')?.value || '',
        bodyType: document.getElementById('bodyType')?.value || '',
        skinTone: document.getElementById('skinTone')?.value || '',
        faceShape: document.getElementById('faceShape')?.value || '',
        style: document.getElementById('style')?.value || '',
        occupation: document.getElementById('occupation')?.value || ''
    };
    
    console.log('🔍 Collected form data:', data);
    return data;
}

// Enhanced form validation
function validateFormData(data) {
    const required = [
        { key: 'age', label: '年龄段' },
        { key: 'height', label: '身高' },
        { key: 'bodyType', label: '身材类型' },
        { key: 'skinTone', label: '肤色' },
        { key: 'faceShape', label: '脸型' },
        { key: 'style', label: '风格偏好' }
    ];
    
    const missing = [];
    
    for (const field of required) {
        const value = data[field.key];
        if (!value || value.trim() === '' || value === '') {
            missing.push(field.label);
        }
    }
    
    if (missing.length > 0) {
        return {
            isValid: false,
            errors: missing,
            message: `请填写必填字段：${missing.join('、')}`
        };
    }
    
    return { isValid: true };
}

// Analysis simulation functions
function simulateImageAnalysis() {
    // Simulate AI analysis of uploaded image
    analysisResults = {
        method: 'image',
        features: {
            age: '26-30',
            height: '175-180cm',
            bodyType: '标准型',
            skinTone: '自然',
            faceShape: '椭圆脸',
            style: '商务休闲'
        },
        confidence: 92
    };
    
    generateOutfitRecommendations();
}

function simulateManualAnalysis(formData) {
    console.log('🤖 Starting manual analysis with data:', formData);
    
    try {
        // Validate input data
        if (!formData || typeof formData !== 'object') {
            throw new Error('Invalid form data provided');
        }
        
        // Process and normalize form data
        const processedFeatures = {
            age: formData.age,
            height: formData.height,
            bodyType: formData.bodyType,
            skinTone: formData.skinTone,
            faceShape: formData.faceShape,
            style: formData.style,
            occupation: formData.occupation || '通用'
        };
        
        // Create analysis results
        analysisResults = {
            method: 'manual',
            features: processedFeatures,
            confidence: 95,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Analysis results:', analysisResults);
        
        // Generate recommendations
        generateOutfitRecommendations();
        
    } catch (error) {
        console.error('💥 Error in manual analysis:', error);
        showError('分析过程中出现错误，请重试');
        hideLoading();
        appState.currentOperation = null;
    }
}

// Outfit recommendation engine
function generateOutfitRecommendations() {
    console.log('Generating recommendations for:', analysisResults); // Debug log
    
    const features = analysisResults.features;
    
    try {
        // Define outfit templates based on style preference
        const outfitTemplates = getOutfitTemplates(features.style);
        
        if (!outfitTemplates || outfitTemplates.length === 0) {
            console.error('No templates found for style:', features.style);
            throw new Error('未找到适合的风格模板');
        }
        
        console.log('Found templates:', outfitTemplates); // Debug log
        
        // Generate 3 different outfit options
        const outfits = outfitTemplates.slice(0, 3).map((template, index) => {
            return {
                ...template,
                id: index + 1,
                image: `https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=280&fit=crop&crop=face`
            };
        });
        
        console.log('Generated outfits:', outfits); // Debug log
        
        displayResults(outfits);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        showError('生成搭配建议时出现错误，请重试');
        hideLoading();
    }
}

function getOutfitTemplates(style) {
    console.log('Getting templates for style:', style); // Debug log
    
    const templates = {
        'business': [
            {
                title: '经典商务正装',
                description: '适合正式商务场合的专业搭配，展现成熟稳重的气质',
                items: [
                    { name: '深蓝色羊毛西装', brand: 'ZARA', link: '#' },
                    { name: '白色牛津纺衬衫', brand: 'UNIQLO', link: '#' },
                    { name: '深色领带', brand: 'H&M', link: '#' },
                    { name: '黑色皮鞋', brand: 'CLARKS', link: '#' }
                ]
            },
            {
                title: '优雅商务休闲',
                description: '商务与休闲的完美平衡，既专业又不失亲和力',
                items: [
                    { name: '灰色西装外套', brand: 'Massimo Dutti', link: '#' },
                    { name: '浅蓝色衬衫', brand: 'COS', link: '#' },
                    { name: '深色休闲裤', brand: 'COS', link: '#' },
                    { name: '棕色乐福鞋', brand: 'TOD\'S', link: '#' }
                ]
            },
            {
                title: '现代商务风格',
                description: '现代感十足的商务造型，适合创新型企业和创意行业',
                items: [
                    { name: '黑色修身西装', brand: 'AllSaints', link: '#' },
                    { name: '条纹衬衫', brand: 'ARMANI', link: '#' },
                    { name: '深色牛仔裤', brand: 'LEVIS', link: '#' },
                    { name: '黑色德比鞋', brand: 'CHURCH\'S', link: '#' }
                ]
            }
        ],
        'casual': [
            {
                title: '舒适周末风',
                description: '轻松舒适的周末搭配，适合日常休闲和社交场合',
                items: [
                    { name: '白色圆领T恤', brand: 'COS', link: '#' },
                    { name: '深色牛仔裤', brand: 'LEVIS', link: '#' },
                    { name: '白色运动鞋', brand: 'NIKE', link: '#' },
                    { name: '深色休闲外套', brand: 'UNIQLO', link: '#' }
                ]
            },
            {
                title: '城市休闲漫步',
                description: '城市漫步的理想选择，既舒适又有型',
                items: [
                    { name: '条纹长袖衫', brand: 'COS', link: '#' },
                    { name: '卡其色休闲裤', brand: 'UNIQLO', link: '#' },
                    { name: '白色板鞋', brand: 'ADIDAS', link: '#' },
                    { name: '米色风衣', brand: 'Massimo Dutti', link: '#' }
                ]
            },
            {
                title: '轻松社交风',
                description: '适合朋友聚会和轻松社交场合的搭配',
                items: [
                    { name: '深色卫衣', brand: 'COS', link: '#' },
                    { name: '深蓝色休闲裤', brand: 'UNIQLO', link: '#' },
                    { name: '白色小白鞋', link: '#' },
                    { name: '深色棒球帽', brand: 'SUPREME', link: '#' }
                ]
            }
        ],
        'smart-casual': [
            {
                title: '精致休闲风',
                description: '精致的休闲造型，适合轻松的商务和社交场合',
                items: [
                    { name: '深蓝色毛衣', brand: 'COS', link: '#' },
                    { name: '深色休闲裤', brand: 'UNIQLO', link: '#' },
                    { name: '棕色皮鞋', brand: 'TIMBERLAND', link: '#' },
                    { name: '深色休闲外套', brand: 'Massimo Dutti', link: '#' }
                ]
            },
            {
                title: '现代休闲商务',
                description: '现代感十足的休闲商务造型，平衡专业与舒适',
                items: [
                    { name: '白色衬衫', brand: 'COS', link: '#' },
                    { name: '深色卡其裤', brand: 'UNIQLO', link: '#' },
                    { name: '棕色靴子', brand: 'RED WING', link: '#' },
                    { name: '深色针织衫', brand: 'Massimo Dutti', link: '#' }
                ]
            },
            {
                title: '时尚休闲风',
                description: '时尚感与舒适性的完美结合，适合多样场合',
                items: [
                    { name: '条纹POLO衫', brand: 'LACOSTE', link: '#' },
                    { name: '深色休闲裤', brand: 'COS', link: '#' },
                    { name: '白色板鞋', brand: 'CONVERSE', link: '#' },
                    { name: '休闲夹克', brand: 'UNIQLO', link: '#' }
                ]
            }
        ],
        'trendy': [
            {
                title: '潮流先锋',
                description: '紧跟潮流的时尚搭配，展现年轻活力和个性',
                items: [
                    { name: 'oversized卫衣', brand: 'OFF-WHITE', link: '#' },
                    { name: '修身牛仔裤', brand: 'BALENCIAGA', link: '#' },
                    { name: '小白鞋', brand: 'YEEZY', link: '#' },
                    { name: '潮流外套', brand: 'SUPREME', link: '#' }
                ]
            },
            {
                title: '街头时尚',
                description: '街头风格的时尚搭配，展现独特个人品味',
                items: [
                    { name: '格子衬衫', brand: 'STUSSY', link: '#' },
                    { name: '工装裤', brand: 'CARHARTT', link: '#' },
                    { name: '高帮鞋', brand: 'VANS', link: '#' },
                    { name: '棒球帽', link: '#' }
                ]
            },
            {
                title: '时尚休闲',
                description: '年轻时尚的休闲搭配，适合都市生活方式',
                items: [
                    { name: '图案T恤', brand: 'KENZO', link: '#' },
                    { name: '破洞牛仔裤', brand: 'DIESEL', link: '#' },
                    { name: '运动鞋', brand: 'JORDAN', link: '#' },
                    { name: '连帽衫', brand: 'PALACE', link: '#' }
                ]
            }
        ],
        'classic': [
            {
                title: '复古经典',
                description: '永恒的经典款式，展现成熟男士的魅力',
                items: [
                    { name: '复古西装', brand: 'HERMÈS', link: '#' },
                    { name: '经典衬衫', brand: 'BURBERRY', link: '#' },
                    { name: '经典皮鞋', brand: 'JOHN LOBB', link: '#' },
                    { name: '复古领带', link: '#' }
                ]
            },
            {
                title: '英伦风格',
                description: '经典的英伦风格，展现绅士风度和优雅气质',
                items: [
                    { name: '英式西装', brand: 'SAINT LAURENT', link: '#' },
                    { name: '条纹衬衫', brand: 'PRADA', link: '#' },
                    { name: '德比鞋', brand: 'ALDEN', link: '#' },
                    { name: '丝质领带', link: '#' }
                ]
            },
            {
                title: '传统正装',
                description: '传统的正装搭配，适合正式商务和重要场合',
                items: [
                    { name: '深色西装', brand: 'TOM FORD', link: '#' },
                    { name: '白色衬衫', brand: 'BRIONI', link: '#' },
                    { name: '真皮皮鞋', brand: 'ALLEN EDMONDS', link: '#' },
                    { name: '丝质口袋方巾', link: '#' }
                ]
            }
        ]
    };
    
    const result = templates[style] || templates['casual'];
    console.log('Templates found:', result); // Debug log
    return result;
}

// Display results
function displayResults(outfits) {
    console.log('🎨 Displaying results:', outfits);
    
    try {
        if (!outfitsGrid) {
            console.error('❌ Outfits grid not found!');
            throw new Error('Outfits grid element not found');
        }
        
        if (!outfits || !Array.isArray(outfits) || outfits.length === 0) {
            throw new Error('No outfits to display');
        }
        
        // Reset operation state
        appState.currentOperation = null;
        
        hideLoading();
        
        // Display analysis summary
        displayAnalysisSummary();
        
        // Display outfit recommendations
        outfitsGrid.innerHTML = '';
        
        outfits.forEach((outfit, index) => {
            const outfitCard = createOutfitCard(outfit);
            outfitsGrid.appendChild(outfitCard);
            
            // Add staggered animation
            setTimeout(() => {
                outfitCard.classList.add('fade-in-up');
            }, index * 200);
        });
        
        // Initialize Lucide icons for the new elements
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log('✅ Lucide icons initialized');
            }
        }, 100);
        
        showResults();
        
        console.log('✅ Results displayed successfully');
        showSuccess('🎯 搭配方案生成完成！');
        
    } catch (error) {
        console.error('💥 Error displaying results:', error);
        showError('显示结果时出现错误，请重试');
        hideLoading();
        appState.currentOperation = null;
    }
}

function createOutfitCard(outfit) {
    const card = document.createElement('div');
    card.className = 'outfit-card';
    
    card.innerHTML = `
        <div class="outfit-image">
            <img src="${outfit.image}" alt="${outfit.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="outfit-placeholder">${outfit.title} 搭配示例</div>
        </div>
        <div class="outfit-content">
            <h3 class="outfit-title">${outfit.title}</h3>
            <p class="outfit-description">${outfit.description}</p>
            <ul class="outfit-items">
                ${outfit.items.map(item => `
                    <li>
                        <span class="item-name">${item.name}</span>
                        <a href="${item.link}" class="item-link" target="_blank">
                            ${item.brand || '查看详情'}
                            <i data-lucide="external-link" class="external-link-icon"></i>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    return card;
}

function displayAnalysisSummary() {
    if (!resultsSection || !outfitsGrid) {
        console.error('Results section or outfits grid not found for summary!');
        return;
    }
    
    // Remove existing summary if any
    const existingSummary = resultsSection.querySelector('.analysis-summary');
    if (existingSummary) {
        existingSummary.remove();
    }
    
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'analysis-summary';
    
    const features = analysisResults.features;
    
    summaryContainer.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 24px;">AI分析结果</h3>
        <div class="analysis-features">
            ${Object.entries(features).map(([key, value]) => `
                <div class="feature-item">
                    <div class="feature-label">${getFeatureLabel(key)}</div>
                    <div class="feature-value">${value}</div>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 24px; color: #6B7280; font-size: 14px;">
            分析置信度: ${analysisResults.confidence}%
        </div>
    `;
    
    // Insert summary before results grid
    resultsSection.insertBefore(summaryContainer, outfitsGrid);
}

function getFeatureLabel(key) {
    const labels = {
        age: '年龄段',
        height: '身高',
        bodyType: '身材类型',
        skinTone: '肤色',
        faceShape: '脸型',
        style: '风格偏好',
        occupation: '职业类型'
    };
    return labels[key] || key;
}

// Section management
function showLoading() {
    console.log('Showing loading section'); // Debug log
    
    if (!loadingSection) {
        console.error('Loading section not found!');
        return;
    }
    
    hideAllSections();
    loadingSection.style.display = 'block';
    setTimeout(() => {
        loadingSection.classList.add('fade-in-up');
    }, 100);
}

function hideLoading() {
    if (loadingSection) {
        loadingSection.classList.remove('fade-in-up');
        loadingSection.style.display = 'none';
    }
}

function showResults() {
    if (!resultsSection) {
        console.error('Results section not found!');
        return;
    }
    
    hideAllSections();
    resultsSection.style.display = 'block';
    setTimeout(() => {
        resultsSection.classList.add('fade-in-up');
    }, 100);
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function hideAllSections() {
    if (manualInputSection) {
        manualInputSection.classList.remove('visible');
        manualInputSection.style.display = 'none';
    }
    if (loadingSection) loadingSection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
}

// Scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.outfit-card, .analysis-summary').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add custom CSS for animations
// Add custom CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .fade-in-up {
        opacity: 1;
        transform: translateY(0);
    }
    
    .outfit-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .analysis-summary {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .manual-input-section {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease-out;
    }
    
    .manual-input-section.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Application initializing...');
    
    try {
        // Initialize DOM elements
        uploadArea = document.getElementById('uploadArea');
        fileInput = document.getElementById('fileInput');
        manualInputBtn = document.getElementById('manualInputBtn');
        manualInputSection = document.getElementById('manualInputSection');
        manualForm = document.getElementById('manualForm');
        loadingSection = document.getElementById('loadingSection');
        resultsSection = document.getElementById('resultsSection');
        outfitsGrid = document.getElementById('outfitsGrid');
        
        console.log('🔍 DOM elements check:');
        console.log('  uploadArea:', !!uploadArea);
        console.log('  fileInput:', !!fileInput);
        console.log('  manualInputBtn:', !!manualInputBtn);
        console.log('  manualInputSection:', !!manualInputSection);
        console.log('  manualForm:', !!manualForm);
        console.log('  loadingSection:', !!loadingSection);
        console.log('  resultsSection:', !!resultsSection);
        console.log('  outfitsGrid:', !!outfitsGrid);
        
        // Check if all required elements exist
        const requiredElements = [uploadArea, fileInput, manualInputSection, manualForm, loadingSection, resultsSection, outfitsGrid];
        const missingElements = requiredElements.filter(element => !element);
        
        if (missingElements.length > 0) {
            console.error('❌ Missing elements:', missingElements);
            showError('页面元素加载不完整，请刷新页面');
            return;
        }
        
        console.log('✅ All DOM elements found successfully');
        
        // Initialize all components
        console.log('🔧 Initializing components...');
        initializeUploadArea();
        initializeManualInput();
        initializeFormSubmission();
        addScrollAnimations();
        
        // Mark as initialized
        appState.isInitialized = true;
        
        console.log('✅ Application initialized successfully');
        showSuccess('🎉 页面加载完成，欢迎使用 StyleAI！');
        
    } catch (error) {
        console.error('💥 Error initializing application:', error);
        showError('页面初始化失败: ' + error.message);
    }
});