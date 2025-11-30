// StyleAI - 完整修复版 JavaScript
// 包含图片上传和手工填写的完整功能

// 全局变量
let uploadedImage = null;
let analysisResults = null;

// DOM 元素
let uploadArea, fileInput, manualInputBtn, manualInputSection, manualForm, loadingSection, resultsSection, outfitsGrid;

// 应用状态
let appState = {
    isInitialized: false,
    currentOperation: null
};

console.log('🚀 StyleAI Script loaded (Complete Fixed Version)');

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOMContentLoaded triggered');
    
    // 初始化所有DOM元素
    initializeDOMElements();
    
    // 初始化应用
    if (appState.isInitialized) {
        console.log('✅ App already initialized, skipping...');
        return;
    }
    
    console.log('🔧 Starting app initialization...');
    
    try {
        // 初始化上传功能
        initializeUploadArea();
        
        // 初始化手动输入功能
        initializeManualInput();
        
        // 初始化表单提交
        initializeFormSubmission();
        
        appState.isInitialized = true;
        console.log('✅ StyleAI app initialized successfully');
        
        // 显示成功通知
        setTimeout(() => {
            showSuccess('StyleAI 已准备就绪！请选择上传图片或手动填写特征');
        }, 1000);
        
    } catch (error) {
        console.error('💥 Error initializing app:', error);
        showError('应用初始化失败，请刷新页面重试');
    }
});

// 初始化DOM元素
function initializeDOMElements() {
    console.log('🔍 Initializing DOM elements...');
    
    uploadArea = document.getElementById('uploadArea');
    fileInput = document.getElementById('fileInput');
    manualInputBtn = document.getElementById('manualInputBtn');
    manualInputSection = document.getElementById('manualInputSection');
    manualForm = document.getElementById('manualForm');
    loadingSection = document.getElementById('loadingSection');
    resultsSection = document.getElementById('resultsSection');
    outfitsGrid = document.getElementById('outfitsGrid');
    
    console.log('🔍 DOM elements status:');
    console.log('  uploadArea:', !!uploadArea);
    console.log('  fileInput:', !!fileInput);
    console.log('  manualInputBtn:', !!manualInputBtn);
    console.log('  manualInputSection:', !!manualInputSection);
    console.log('  manualForm:', !!manualForm);
    console.log('  loadingSection:', !!loadingSection);
    console.log('  resultsSection:', !!resultsSection);
    console.log('  outfitsGrid:', !!outfitsGrid);
    
    // 检查缺少的元素
    const requiredElements = [uploadArea, fileInput, manualInputSection, manualForm, loadingSection, resultsSection, outfitsGrid];
    const missingElements = requiredElements.filter(element => !element);
    
    if (missingElements.length > 0) {
        console.error('❌ Missing elements:', missingElements);
        showError('页面元素加载不完整，请刷新页面重试');
        return false;
    }
    
    console.log('✅ All DOM elements found successfully');
    return true;
}

// 初始化上传区域
function initializeUploadArea() {
    console.log('🔧 Initializing upload area...');
    
    if (!uploadArea || !fileInput) {
        console.error('❌ Upload area elements not found');
        showError('上传元素未找到，请刷新页面重试');
        return;
    }
    
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽功能
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect({ target: { files: files } });
        }
    });
    
    console.log('✅ Upload area initialized');
}

// 处理文件选择
function handleFileSelect(event) {
    console.log('📁 File selected!', event.target.files);
    
    const file = event.target.files[0];
    if (!file) {
        console.log('⚠️ No file selected');
        return;
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showError('请选择图片文件（JPG、PNG等格式）');
        return;
    }
    
    // 检查文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('文件大小不能超过10MB');
        return;
    }
    
    // 防止重复处理
    if (appState.currentOperation === 'analyzing') {
        showError('分析正在进行中，请稍候...');
        return;
    }
    
    console.log('📊 Processing image:', file.name, file.size, file.type);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        console.log('✅ Image loaded successfully');
        uploadedImage = {
            file: file,
            dataUrl: e.target.result,
            name: file.name,
            size: file.size
        };
        
        showSuccess(`✅ 图片 "${file.name}" 上传成功！`);
        
        // 开始分析图片
        analyzeImage();
    };
    
    reader.onerror = function(e) {
        console.error('❌ Error reading file:', e);
        showError('读取图片文件失败，请重试');
    };
    
    reader.readAsDataURL(file);
}

// 分析上传的图片
function analyzeImage() {
    console.log('🤖 Starting image analysis...');
    
    try {
        appState.currentOperation = 'analyzing';
        
        // 显示加载状态
        showLoading();
        showSuccess('🔍 正在分析您的图片...');
        
        // 模拟AI图片分析
        setTimeout(() => {
            console.log('🔄 Processing image analysis...');
            
            // 模拟AI分析结果
            analysisResults = {
                method: 'image',
                features: {
                    age: '26-30',
                    height: '175-180',
                    bodyType: 'normal',
                    skinTone: 'medium',
                    faceShape: 'oval',
                    style: 'smart-casual',
                    occupation: '通用'
                },
                confidence: 88,
                timestamp: new Date().toISOString(),
                imageInfo: {
                    name: uploadedImage.name,
                    size: uploadedImage.size
                }
            };
            
            console.log('📊 Image analysis completed:', analysisResults);
            
            // 生成推荐
            generateRecommendations();
            
        }, 3000);
        
    } catch (error) {
        console.error('💥 Error in image analysis:', error);
        showError('图片分析失败，请重试');
        hideLoading();
        appState.currentOperation = null;
    }
}

// 初始化手动输入功能
function initializeManualInput() {
    console.log('🔧 Initializing manual input...');
    
    if (!manualInputBtn || !manualInputSection) {
        console.error('❌ Manual input elements not found');
        return;
    }
    
    // 点击手动输入按钮
    manualInputBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('📝 Manual input button clicked');
        
        // 切换显示/隐藏
        if (manualInputSection.style.display === 'none' || !manualInputSection.style.display) {
            manualInputSection.style.display = 'block';
            console.log('✅ Manual input section shown');
        } else {
            manualInputSection.style.display = 'none';
            console.log('✅ Manual input section hidden');
        }
    });
    
    console.log('✅ Manual input initialized');
}

// 初始化表单提交
function initializeFormSubmission() {
    console.log('🔧 Initializing form submission...');
    
    if (!manualForm) {
        console.error('❌ Manual form not found!');
        showError('表单元素未找到，请刷新页面重试');
        return;
    }
    
    manualForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted! (Complete Fixed Version)');
        
        // 防止重复提交
        if (appState.currentOperation === 'analyzing') {
            console.log('⚠️ Analysis already in progress');
            showError('分析正在进行中，请稍候...');
            return;
        }
        
        try {
            console.log('🔍 Starting form processing...');
            
            // 收集表单数据
            const formData = collectFormData();
            console.log('📊 Collected form data:', formData);
            
            // 验证表单数据
            const validation = validateFormData(formData);
            console.log('✅ Form validation result:', validation);
            
            if (!validation.isValid) {
                console.log('❌ Validation failed:', validation.errors);
                showError(validation.message);
                return;
            }
            
            console.log('✅ Form validation passed');
            appState.currentOperation = 'analyzing';
            
            // 显示加载状态
            showLoading();
            showSuccess('🔍 正在分析您的特征信息...');
            
            // 开始分析
            console.log('🤖 Starting analysis with data:', formData);
            analyzeManualInput(formData);
            
        } catch (error) {
            console.error('💥 Error in form submission:', error);
            showError('表单提交失败: ' + error.message);
            appState.currentOperation = null;
        }
    });
    
    console.log('✅ Form submission initialized');
}

// 收集表单数据（完整修复版）
function collectFormData() {
    console.log('🔍 Collecting form data...');
    
    // 安全的元素获取
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        const value = element ? element.value : '';
        console.log(`  ${id}: "${value}" (element: ${!!element})`);
        return value;
    };
    
    const data = {
        age: getElementValue('age'),
        height: getElementValue('height'),
        bodyType: getElementValue('bodyType'),
        skinTone: getElementValue('skinTone'),
        faceShape: getElementValue('faceShape'),
        style: getElementValue('style'),
        occupation: getElementValue('occupation')
    };
    
    console.log('📊 Final collected data:', data);
    return data;
}

// 表单验证（完整修复版）
function validateFormData(data) {
    console.log('🔍 Validating form data:', data);
    
    const required = [
        { key: 'age', label: '年龄段' },
        { key: 'height', label: '身高' },
        { key: 'bodyType', label: '身材类型' },
        { key: 'skinTone', label: '肤色' },
        { key: 'faceShape', label: '脸型' },
        { key: 'style', label: '风格偏好' }
    ];
    
    const missing = [];
    const emptyFields = [];
    
    for (const field of required) {
        const value = data[field.key];
        console.log(`  Checking ${field.label} (${field.key}): "${value}"`);
        
        if (!value || value.trim() === '' || value === '') {
            missing.push(field.label);
            emptyFields.push(field.key);
            console.log(`    ❌ ${field.label} is empty`);
        } else {
            console.log(`    ✅ ${field.label} has value`);
        }
    }
    
    if (missing.length > 0) {
        return {
            isValid: false,
            errors: missing,
            emptyFields: emptyFields,
            message: `请填写必填字段：${missing.join('、')}`
        };
    }
    
    console.log('✅ All required fields are filled');
    return { isValid: true };
}

// 分析手工输入
function analyzeManualInput(formData) {
    console.log('🤖 Starting manual analysis...');
    
    try {
        // 模拟AI分析
        setTimeout(() => {
            console.log('🔄 Processing analysis...');
            
            // 创建分析结果
            analysisResults = {
                method: 'manual',
                features: {
                    age: formData.age,
                    height: formData.height,
                    bodyType: formData.bodyType,
                    skinTone: formData.skinTone,
                    faceShape: formData.faceShape,
                    style: formData.style,
                    occupation: formData.occupation || '通用'
                },
                confidence: 95,
                timestamp: new Date().toISOString()
            };
            
            console.log('📊 Analysis completed:', analysisResults);
            
            // 生成推荐
            generateRecommendations();
            
        }, 2000);
        
    } catch (error) {
        console.error('💥 Error in manual analysis:', error);
        showError('分析过程中出现错误，请重试');
        hideLoading();
        appState.currentOperation = null;
    }
}

// 生成推荐（搜索引擎增强版 - 使用必应、百度、谷歌等真实搜索）
async function generateRecommendations() {
    console.log('🎨 Generating search-based recommendations with real search engines...');
    
    try {
        const features = analysisResults.features;
        console.log('🎯 Using features:', features);
        
        // 检查基于搜索引擎的推荐引擎是否可用
        if (window.styleAISearchRecommendationEngine) {
            console.log('🔍 Using Search-Based Recommendation Engine...');
            showSuccess('正在生成搜索引擎推荐的搭配方案...');
            
            // 使用搜索引擎推荐引擎生成真实推荐
            const outfits = await window.styleAISearchRecommendationEngine.generateRecommendations(features);
            
            console.log('✨ Generated search-based outfits:', outfits);
            
            // 显示结果
            displayRecommendations(outfits);
        } else if (window.styleAIRecommendationEngine) {
            console.log('🚀 Using Enhanced Recommendation Engine (fallback)...');
            showSuccess('正在从网上搜索最佳搭配建议...');
            
            // 使用增强推荐引擎生成真实推荐
            const outfits = await window.styleAIRecommendationEngine.generateRecommendations(features);
            
            console.log('✨ Generated enhanced outfits:', outfits);
            
            // 显示结果
            displayRecommendations(outfits);
        } else {
            console.log('📚 Falling back to local templates...');
            
            // 降级到本地推荐模板
            const templates = getRecommendationTemplates(features.style);
            console.log('📋 Found templates:', templates);
            
            if (!templates || templates.length === 0) {
                console.error('❌ No templates found for style:', features.style);
                throw new Error('未找到适合的风格模板');
            }
            
            // 生成3个推荐搭配
            const outfits = templates.slice(0, 3).map((template, index) => {
                return {
                    ...template,
                    id: index + 1,
                    image: `https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=280&fit=crop&crop=face`,
                    confidence: 0.7
                };
            });
            
            console.log('✨ Generated outfits:', outfits);
            
            // 显示结果
            displayRecommendations(outfits);
        }
        
    } catch (error) {
        console.error('💥 Error generating recommendations:', error);
        showError('生成搭配建议时出现错误，请重试');
        hideLoading();
        appState.currentOperation = null;
    }
}

// 获取推荐模板
function getRecommendationTemplates(style) {
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
                description: '介于正式与休闲之间的完美平衡，适合大部分商务环境',
                items: [
                    { name: '深灰色西装外套', brand: 'H&M', link: '#' },
                    { name: '蓝色条纹衬衫', brand: 'ZARA', link: '#' },
                    { name: '深色休闲裤', brand: 'UNIQLO', link: '#' },
                    { name: '棕色商务鞋', brand: 'CLARKS', link: '#' }
                ]
            },
            {
                title: '现代商务风格',
                description: '融入时尚元素的商务搭配，既专业又具有个人风格',
                items: [
                    { name: '深色修身西装', brand: 'COS', link: '#' },
                    { name: '白色衬衫', brand: 'MASSIMO DUTTI', link: '#' },
                    { name: '深色西裤', brand: 'H&M', link: '#' },
                    { name: '黑色牛津鞋', brand: 'CLARKS', link: '#' }
                ]
            }
        ],
        'casual': [
            {
                title: '休闲舒适搭配',
                description: '轻松随性的日常穿搭，适合放松的休闲时光',
                items: [
                    { name: '纯色T恤', brand: 'UNIQLO', link: '#' },
                    { name: '牛仔裤', brand: 'LEVIS', link: '#' },
                    { name: '运动鞋', brand: 'NIKE', link: '#' },
                    { name: '简约手表', brand: 'CASIO', link: '#' }
                ]
            },
            {
                title: '休闲时尚风',
                description: '舒适与时尚的完美结合，展现年轻活力',
                items: [
                    { name: '印花T恤', brand: 'ZARA', link: '#' },
                    { name: '休闲裤', brand: 'H&M', link: '#' },
                    { name: '小白鞋', brand: 'ADIDAS', link: '#' },
                    { name: '棒球帽', brand: 'NEW ERA', link: '#' }
                ]
            },
            {
                title: '周末休闲装',
                description: '专为周末放松时光设计的舒适搭配',
                items: [
                    { name: '连帽卫衣', brand: 'UNIQLO', link: '#' },
                    { name: '运动裤', brand: 'ADIDAS', link: '#' },
                    { name: '休闲鞋', brand: 'CONVERSE', link: '#' },
                    { name: '背包', brand: 'HERSCHEL', link: '#' }
                ]
            }
        ],
        'smart-casual': [
            {
                title: '商务休闲经典',
                description: '轻松又不失正式感的搭配，适合各种非正式商务场合',
                items: [
                    { name: 'POLO衫', brand: 'RALPH LAUREN', link: '#' },
                    { name: '卡其色休闲裤', brand: 'MASSIMO DUTTI', link: '#' },
                    { name: '乐福鞋', brand: 'TOD\'S', link: '#' },
                    { name: '简约手表', brand: 'SEIKO', link: '#' }
                ]
            },
            {
                title: '优雅休闲风',
                description: '精致的休闲搭配，体现品味与格调',
                items: [
                    { name: '牛津衬衫', brand: 'BROOKS BROTHERS', link: '#' },
                    { name: '深色牛仔裤', brand: '7 FOR ALL MANKIND', link: '#' },
                    { name: '德比鞋', brand: 'CLARKS', link: '#' },
                    { name: '皮夹克', brand: 'LEATHER JACKET', link: '#' }
                ]
            },
            {
                title: '都市休闲装',
                description: '适合城市生活的现代休闲搭配',
                items: [
                    { name: '针织开衫', brand: 'COS', link: '#' },
                    { name: '休闲西装裤', brand: 'H&M', link: '#' },
                    { name: '休闲皮鞋', brand: 'COLE HAAN', link: '#' },
                    { name: '时尚背包', brand: 'MANSUR GAVRIEL', link: '#' }
                ]
            }
        ],
        'trendy': [
            {
                title: '潮流前卫风',
                description: '紧跟时尚潮流的大胆搭配，展现个性与创意',
                items: [
                    { name: '设计感外套', brand: 'BALENCIAGA', link: '#' },
                    { name: '潮流T恤', brand: 'OFF-WHITE', link: '#' },
                    { name: '时尚运动鞋', brand: 'YEEZY', link: '#' },
                    { name: '时尚配饰', brand: 'SUPREME', link: '#' }
                ]
            },
            {
                title: '街头潮流风',
                description: '街头文化与时尚的融合，展现年轻态度',
                items: [
                    { name: '卫衣', brand: 'STUSSY', link: '#' },
                    { name: '束脚裤', brand: 'VETEMENTS', link: '#' },
                    { name: '运动鞋', brand: 'AIR JORDAN', link: '#' },
                    { name: '棒球帽', brand: '47 BRAND', link: '#' }
                ]
            },
            {
                title: '现代时尚风',
                description: '简约而不简单的现代时尚搭配',
                items: [
                    { name: '设计师外套', brand: 'ACNE STUDIOS', link: '#' },
                    { name: '简约上衣', brand: 'COS', link: '#' },
                    { name: '时尚裤装', brand: 'MAISON KITSUNE', link: '#' },
                    { name: '时尚鞋履', brand: 'COMME DES GARCONS', link: '#' }
                ]
            }
        ],
        'classic': [
            {
                title: '英伦经典风',
                description: '永恒的英式经典搭配，体现绅士风度',
                items: [
                    { name: '英式西装', brand: 'HACKETT', link: '#' },
                    { name: '格子衬衫', brand: 'BURBERRY', link: '#' },
                    { name: '马甲', brand: 'PAUL SMITH', link: '#' },
                    { name: '牛津鞋', brand: 'CHURCH\'S', link: '#' }
                ]
            },
            {
                title: '复古绅士风',
                description: '经典复古元素与现代剪裁的完美结合',
                items: [
                    { name: '复古西装', brand: 'TOM FORD', link: '#' },
                    { name: '经典衬衫', brand: 'ETON', link: '#' },
                    { name: '复古领带', brand: 'HERMES', link: '#' },
                    { name: '复古皮鞋', brand: 'JOHN LOBB', link: '#' }
                ]
            },
            {
                title: '传统正装风',
                description: '传统而正式的搭配，展现成熟男性魅力',
                items: [
                    { name: '经典西装', brand: 'GIEVES & HAWKES', link: '#' },
                    { name: '正装衬衫', brand: 'CHARLES TYRWHITT', link: '#' },
                    { name: '丝质领带', brand: 'ERMENEGILDO ZEGNA', link: '#' },
                    { name: '正装皮鞋', brand: 'ALDEN', link: '#' }
                ]
            }
        ]
    };
    
    return templates[style] || templates['smart-casual'];
}

// 显示推荐结果（完整修复版）
function displayRecommendations(outfits) {
    console.log('🎨 Displaying recommendations...');
    
    try {
        if (!outfitsGrid) {
            console.error('❌ Outfits grid not found!');
            throw new Error('Outfits grid element not found');
        }
        
        if (!outfits || !Array.isArray(outfits) || outfits.length === 0) {
            throw new Error('No outfits to display');
        }
        
        // 清除加载状态
        hideLoading();
        appState.currentOperation = null;
        
        // 显示分析摘要
        displayAnalysisSummary();
        
        // 清空并填充推荐内容
        outfitsGrid.innerHTML = '';
        
        outfits.forEach((outfit, index) => {
            const outfitCard = createOutfitCard(outfit);
            outfitsGrid.appendChild(outfitCard);
            
            // 动画效果
            setTimeout(() => {
                outfitCard.classList.add('fade-in-up');
            }, index * 200);
        });
        
        console.log('✅ Recommendations displayed successfully');
        
    } catch (error) {
        console.error('💥 Error displaying recommendations:', error);
        showError('显示推荐结果时出现错误，请重试');
        hideLoading();
        appState.currentOperation = null;
    }
}

// 创建搭配卡片（搜索引擎增强版）
function createOutfitCard(outfit) {
    const card = document.createElement('div');
    card.className = 'outfit-card';
    
    // 获取购买链接
    const getShoppingLink = (item) => {
        if (window.styleAISearchRecommendationEngine && outfit.searchLinks) {
            return window.styleAISearchRecommendationEngine.getShoppingLinks(item);
        }
        if (window.styleAIRecommendationEngine && outfit.searchTerm) {
            return window.styleAIRecommendationEngine.getShoppingLinks(item);
        }
        return item.link || '#';
    };
    
    // 获取价格显示
    const getPriceDisplay = (item) => {
        return item.price ? `<span class="item-price">${item.price}</span>` : '';
    };
    
    // 置信度显示
    const confidenceDisplay = outfit.confidence ? `
        <div class="confidence-badge">
            <span class="confidence-text">匹配度: ${Math.round(outfit.confidence * 100)}%</span>
        </div>
    ` : '';
    
    // 搜索引擎链接显示
    const searchEnginesDisplay = outfit.searchLinks ? `
        <div class="search-engines-section">
            <h4 class="search-engines-title">🔍 搜索引擎</h4>
            <div class="search-engines-grid">
                ${Object.entries(outfit.searchLinks).map(([engine, link]) => `
                    <a href="${link.url}" target="_blank" rel="noopener" class="search-engine-link" style="--engine-color: ${link.color}">
                        <span class="engine-icon">${link.icon}</span>
                        <span class="engine-name">${link.name}</span>
                    </a>
                `).join('')}
            </div>
            <button class="open-all-searches-btn" onclick="openAllSearches(${JSON.stringify(outfit.searchLinks).replace(/"/g, '&quot;')})">
                <i data-lucide="globe"></i> 批量搜索
            </button>
        </div>
    ` : '';
    
    // 搜索建议显示
    const searchSuggestionsDisplay = outfit.searchSuggestions ? `
        <div class="search-suggestions">
            <h5 class="suggestions-title">💡 搜索建议</h5>
            <ul class="suggestions-list">
                ${outfit.searchSuggestions.map(suggestion => `
                    <li class="suggestion-item">
                        <a href="https://www.baidu.com/s?wd=${encodeURIComponent(suggestion)}" target="_blank" rel="noopener">
                            ${suggestion}
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';
    
    card.innerHTML = `
        <div class="outfit-image">
            <img src="${outfit.image}" alt="${outfit.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="outfit-placeholder">${outfit.title} 搭配示例</div>
            ${confidenceDisplay}
        </div>
        <div class="outfit-content">
            <h3 class="outfit-title">${outfit.title}</h3>
            <p class="outfit-description">${outfit.description}</p>
            
            ${outfit.searchTerm ? `
                <div class="search-info">
                    <span class="search-source">🔍 基于"${outfit.searchTerm}"搜索生成</span>
                </div>
            ` : ''}
            
            ${searchEnginesDisplay}
            ${searchSuggestionsDisplay}
            
            <ul class="outfit-items">
                ${outfit.items.map(item => `
                    <li class="outfit-item">
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <div class="item-meta">
                                <span class="item-type">${item.type || '服装'}</span>
                                ${getPriceDisplay(item)}
                            </div>
                        </div>
                        <div class="item-actions">
                            <a href="${getShoppingLink(item)}" class="item-link" target="_blank" rel="noopener">
                                <span class="brand-name">${item.brand || '查看详情'}</span>
                                <i data-lucide="external-link" class="external-link-icon"></i>
                            </a>
                            ${item.searchTerm ? `
                                <button class="search-item-btn" onclick="searchSpecificItem(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                    <i data-lucide="search"></i>
                                </button>
                            ` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>
            
            ${outfit.searchTerm ? `
                <div class="outfit-actions">
                    <button class="action-btn secondary" onclick="searchSimilar('${outfit.searchTerm}')">
                        <i data-lucide="search"></i> 搜索类似搭配
                    </button>
                    <button class="action-btn primary" onclick="saveOutfit(${outfit.id})">
                        <i data-lucide="heart"></i> 收藏搭配
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    // 初始化Lucide图标
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
    
    return card;
}

// 显示分析摘要
function displayAnalysisSummary() {
    if (!resultsSection || !outfitsGrid) {
        console.error('Results section or outfits grid not found for summary!');
        return;
    }
    
    // 移除现有的摘要
    const existingSummary = resultsSection.querySelector('.analysis-summary');
    if (existingSummary) {
        existingSummary.remove();
    }
    
    // 创建新的摘要
    const summary = document.createElement('div');
    summary.className = 'analysis-summary';
    
    const features = analysisResults.features;
    summary.innerHTML = `
        <div class="summary-content">
            <h2 class="summary-title">👔 AI智能分析结果</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="summary-label">分析方法:</span>
                    <span class="summary-value">${analysisResults.method === 'image' ? '图片分析' : '手工填写'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">年龄段:</span>
                    <span class="summary-value">${features.age}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">身高:</span>
                    <span class="summary-value">${features.height}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">身材类型:</span>
                    <span class="summary-value">${getBodyTypeName(features.bodyType)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">肤色:</span>
                    <span class="summary-value">${getSkinToneName(features.skinTone)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">脸型:</span>
                    <span class="summary-value">${getFaceShapeName(features.faceShape)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">风格偏好:</span>
                    <span class="summary-value">${getStyleName(features.style)}</span>
                </div>
                ${features.occupation && features.occupation !== '通用' ? `
                <div class="summary-item">
                    <span class="summary-label">职业类型:</span>
                    <span class="summary-value">${features.occupation}</span>
                </div>
                ` : ''}
            </div>
            <div class="confidence-info">
                <span class="confidence-label">匹配度:</span>
                <span class="confidence-value">${analysisResults.confidence}%</span>
            </div>
        </div>
    `;
    
    // 在结果网格前插入摘要
    resultsSection.insertBefore(summary, outfitsGrid);
    
    console.log('✅ Analysis summary displayed');
}

// 辅助函数
function getBodyTypeName(type) {
    const names = {
        'slim': '偏瘦型',
        'normal': '标准型',
        'muscular': '肌肉型',
        'full-figured': '偏胖型'
    };
    return names[type] || type;
}

function getSkinToneName(tone) {
    const names = {
        'fair': '白皙',
        'medium': '自然',
        'olive': '橄榄色',
        'dark': '小麦色',
        'deep': '深色'
    };
    return names[tone] || tone;
}

function getFaceShapeName(shape) {
    const names = {
        'round': '圆脸',
        'oval': '椭圆脸',
        'square': '方脸',
        'heart': '心形脸',
        'long': '长脸'
    };
    return names[shape] || shape;
}

function getStyleName(style) {
    const names = {
        'business': '商务正装',
        'casual': '休闲舒适',
        'smart-casual': '商务休闲',
        'trendy': '时尚潮流',
        'classic': '经典复古'
    };
    return names[style] || style;
}

// 显示/隐藏功能
function showLoading() {
    if (loadingSection) {
        loadingSection.style.display = 'block';
        resultsSection.style.display = 'none';
    }
}

function hideLoading() {
    if (loadingSection) {
        loadingSection.style.display = 'none';
    }
    if (resultsSection) {
        resultsSection.style.display = 'block';
    }
}

function showSuccess(message) {
    console.log('✅ Success:', message);
    // 创建成功提示
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function showError(message) {
    console.error('❌ Error:', message);
    // 创建错误提示
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

console.log('✅ StyleAI Script (Complete Fixed Version) loaded successfully');