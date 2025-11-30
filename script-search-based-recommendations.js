// StyleAI 搜索引擎推荐系统 - 使用必应、百度、谷歌搜索真实搭配建议
// 功能特点：基于搜索引擎生成个性化搭配搜索链接、提供真实购买建议

class StyleAISearchRecommendationEngine {
    constructor() {
        this.searchEngines = {
            'bing': {
                name: '必应搜索',
                baseUrl: 'https://www.bing.com/search',
                icon: '🔍',
                color: '#008373'
            },
            'baidu': {
                name: '百度搜索',
                baseUrl: 'https://www.baidu.com/s',
                icon: '🔎',
                color: '#3385ff'
            },
            'google': {
                name: '谷歌搜索',
                baseUrl: 'https://www.google.com/search',
                icon: '🌐',
                color: '#4285f4'
            },
            'sogou': {
                name: '搜狗搜索',
                baseUrl: 'https://www.sogou.com/web',
                icon: '🐕',
                color: '#ff6200'
            }
        };

        this.fashionKeywords = {
            'business': '商务正装 男性搭配',
            'casual': '休闲男装 日常穿搭',
            'smart-casual': '商务休闲男装',
            'trendy': '潮流男装 时尚搭配',
            'classic': '经典男装 复古风格'
        };

        this.colorKeywords = {
            'fair': '白皙肤色 服装颜色搭配',
            'medium': '自然肤色 暖色系搭配',
            'olive': '橄榄肤色 绿色系搭配',
            'dark': '小麦肤色 深色系搭配',
            'deep': '深肤色 亮色系搭配'
        };

        this.faceShapeKeywords = {
            'round': '圆脸适合的服装款式',
            'oval': '椭圆脸 百搭服装',
            'square': '方脸 柔和线条搭配',
            'heart': '心形脸 平衡搭配',
            'long': '长脸 横向搭配'
        };

        this.bodyTypeKeywords = {
            'slim': '瘦型身材 增肥搭配',
            'normal': '标准身材 经典搭配',
            'athletic': '运动型身材 修身搭配',
            'muscular': '肌肉型 宽松搭配',
            'heavy': '偏胖 显瘦搭配'
        };

        this.brandSearchTerms = [
            'Zara 男装', 'H&M 男装', 'Uniqlo 男装', 'COS 男装',
            'Nike 男装', 'Adidas 男装', 'Levi\'s 男装', '优衣库男装'
        ];

        this.searchCache = new Map();
    }

    // 主要推荐生成函数
    async generateRecommendations(features) {
        console.log('🔍 开始生成搜索引擎推荐搭配...');
        
        try {
            const searchTerms = this.buildSearchTerms(features);
            console.log('🎯 搜索关键词:', searchTerms);
            
            // 生成基于搜索引擎的推荐
            const outfits = await this.generateSearchBasedRecommendations(searchTerms, features);
            
            console.log('✨ 生成的搜索引擎推荐搭配:', outfits);
            return outfits;
            
        } catch (error) {
            console.error('❌ 搜索引擎搜索失败:', error);
            // 降级到本地推荐
            return this.getLocalRecommendations(features);
        }
    }

    // 构建搜索关键词
    buildSearchTerms(features) {
        const terms = [];
        
        // 基于风格的基础关键词
        if (this.fashionKeywords[features.style]) {
            terms.push(this.fashionKeywords[features.style]);
        }
        
        // 基于肤色的颜色关键词
        if (this.colorKeywords[features.skinTone]) {
            terms.push(this.colorKeywords[features.skinTone]);
        }
        
        // 基于脸型的搭配关键词
        if (this.faceShapeKeywords[features.faceShape]) {
            terms.push(this.faceShapeKeywords[features.faceShape]);
        }

        // 基于身材类型的搭配关键词
        if (this.bodyTypeKeywords[features.bodyType]) {
            terms.push(this.bodyTypeKeywords[features.bodyType]);
        }
        
        // 季节和场合关键词
        const seasonKeywords = this.getSeasonKeywords();
        if (seasonKeywords) {
            terms.push(...seasonKeywords);
        }
        
        // 生成复合搜索词
        const compositeTerms = [
            `${features.style} 男装搭配 2024`,
            `${features.bodyType}身材 男性服装`,
            `${features.faceShape}脸型 服装款式`,
            `${features.skinTone}肤色 颜色搭配`
        ];
        
        return [...new Set([...terms, ...compositeTerms, ...this.brandSearchTerms])];
    }

    // 获取季节关键词
    getSeasonKeywords() {
        const month = new Date().getMonth() + 1;
        const seasonKeywords = [];
        
        if (month >= 3 && month <= 5) {
            seasonKeywords.push('春季男装搭配', '轻薄男装', '春季色彩');
        } else if (month >= 6 && month <= 8) {
            seasonKeywords.push('夏季男装搭配', '透气男装', '夏季色彩');
        } else if (month >= 9 && month <= 11) {
            seasonKeywords.push('秋季男装搭配', '层叠搭配', '秋季色彩');
        } else {
            seasonKeywords.push('冬季男装搭配', '保暖男装', '冬季色彩');
        }
        
        return seasonKeywords;
    }

    // 生成基于搜索引擎的推荐
    async generateSearchBasedRecommendations(searchTerms, features) {
        console.log('🔍 生成搜索链接和推荐...');
        
        const outfits = [];
        const outfitCount = Math.min(6, searchTerms.length); // 生成6个推荐
        
        for (let i = 0; i < outfitCount; i++) {
            const searchTerm = searchTerms[i];
            const outfitItems = this.generateOutfitItems(features, i);
            
            const outfit = {
                id: i + 1,
                title: this.generateOutfitTitle(features, i),
                description: this.generateOutfitDescription(features, i),
                image: this.getOutfitImage(features, i),
                items: outfitItems,
                searchTerm: searchTerm,
                searchLinks: this.generateSearchLinks(searchTerm),
                searchEngines: Object.keys(this.searchEngines),
                confidence: this.calculateConfidence(features, i),
                features: features,
                searchSuggestions: this.getSearchSuggestions(searchTerm)
            };
            
            outfits.push(outfit);
        }
        
        return outfits;
    }

    // 生成搜索链接
    generateSearchLinks(searchTerm) {
        const links = {};
        
        Object.entries(this.searchEngines).forEach(([engine, config]) => {
            const encodedTerm = encodeURIComponent(searchTerm + ' site:pinterest.com OR site:zhihu.com OR site:douban.com');
            let searchUrl;
            
            switch (engine) {
                case 'bing':
                    searchUrl = `${config.baseUrl}?q=${encodedTerm}`;
                    break;
                case 'baidu':
                    searchUrl = `${config.baseUrl}?wd=${encodedTerm}`;
                    break;
                case 'google':
                    searchUrl = `${config.baseUrl}?q=${encodedTerm}`;
                    break;
                case 'sogou':
                    searchUrl = `${config.baseUrl}?query=${encodedTerm}`;
                    break;
                default:
                    searchUrl = config.baseUrl;
            }
            
            links[engine] = {
                name: config.name,
                url: searchUrl,
                icon: config.icon,
                color: config.color
            };
        });
        
        return links;
    }

    // 获取搜索建议
    getSearchSuggestions(searchTerm) {
        return [
            `${searchTerm} 搭配图片`,
            `${searchTerm} 品牌推荐`,
            `${searchTerm} 购买链接`,
            `${searchTerm} 搭配教程`
        ];
    }

    // 生成搭配标题
    generateOutfitTitle(features, index) {
        const styleNames = {
            'business': ['商务精英搭配', '职场成功造型', '专业形象设计'],
            'casual': ['休闲时尚搭配', '日常百搭造型', '轻松随性风格'],
            'smart-casual': ['精致休闲搭配', '商务休闲造型', '优雅日常风格'],
            'trendy': ['潮流前沿搭配', '时尚新锐造型', '个性表达风格'],
            'classic': ['经典复古搭配', '永不过时造型', '优雅传统风格']
        };
        
        const titles = styleNames[features.style] || ['时尚搭配', '个性造型', '风格推荐'];
        return titles[index] || titles[0];
    }

    // 生成搭配描述
    generateOutfitDescription(features, index) {
        const skinToneName = this.getSkinToneName(features.skinTone);
        const faceShapeName = this.getFaceShapeName(features.faceShape);
        const bodyTypeName = this.getBodyTypeName(features.bodyType);
        const styleName = this.getStyleName(features.style);
        
        const descriptions = [
            `专为${skinToneName}肤色的${bodyTypeName}设计，采用${styleName}风格，适合展现您的个人魅力。点击下方搜索链接查看更多搭配图片和购买建议。`,
            `基于${faceShapeName}和${bodyTypeName}精心搭配，${styleName}设计既能突出优点又能平衡整体比例。搜索更多灵感图片和品牌推荐。`,
            `${styleName}风格的经典搭配，针对${skinToneName}肤色和${bodyTypeName}进行优化，展现优雅气质。使用下方搜索引擎找到最适合的单品。`
        ];
        
        return descriptions[index] || descriptions[0];
    }

    // 获取搭配图片
    getOutfitImage(features, index) {
        const imageTemplates = [
            `https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=280&fit=crop&crop=face`,
            `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=280&fit=crop&crop=face`,
            `https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=280&fit=crop&crop=face`,
            `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=280&fit=crop&crop=face`,
            `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=280&fit=crop&crop=face`,
            `https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=280&fit=crop&crop=face`
        ];
        
        return imageTemplates[index % imageTemplates.length];
    }

    // 生成搭配单品
    generateOutfitItems(features, index) {
        const items = {
            'business': [
                { name: '修身西装外套', brand: 'Zara', type: '外套', price: '¥899', searchTerm: 'Zara 男装 西装' },
                { name: '白色牛津纺衬衫', brand: 'Uniqlo', type: '上装', price: '¥199', searchTerm: '优衣库 男装 白衬衫' },
                { name: '深色西装裤', brand: 'H&M', type: '下装', price: '¥399', searchTerm: 'H&M 男装 西裤' },
                { name: '黑色皮鞋', brand: 'Clarks', type: '鞋履', price: '¥1299', searchTerm: 'Clarks 男装皮鞋' }
            ],
            'casual': [
                { name: '纯色圆领T恤', brand: 'Uniqlo', type: '上装', price: '¥99', searchTerm: '优衣库 男装 T恤' },
                { name: '修身牛仔裤', brand: 'Levi\'s', type: '下装', price: '¥599', searchTerm: 'Levi\'s 男装牛仔裤' },
                { name: '白色运动鞋', brand: 'Nike', type: '鞋履', price: '¥899', searchTerm: 'Nike 男装运动鞋' },
                { name: '简约手表', brand: 'Casio', type: '配饰', price: '¥299', searchTerm: 'Casio 男装手表' }
            ],
            'smart-casual': [
                { name: '针织开衫', brand: 'COS', type: '外套', price: '¥699', searchTerm: 'COS 男装针织衫' },
                { name: '条纹衬衫', brand: 'Massimo Dutti', type: '上装', price: '¥299', searchTerm: 'Massimo Dutti 男装衬衫' },
                { name: '卡其色休闲裤', brand: 'Uniqlo', type: '下装', price: '¥399', searchTerm: '优衣库 男装休闲裤' },
                { name: '乐福鞋', brand: 'Clarks', type: '鞋履', price: '¥1099', searchTerm: 'Clarks 男装乐福鞋' }
            ],
            'trendy': [
                { name: 'oversized外套', brand: 'Zara', type: '外套', price: '¥799', searchTerm: 'Zara 男装oversize' },
                { name: '印花T恤', brand: 'H&M', type: '上装', price: '¥199', searchTerm: 'H&M 男装印花T恤' },
                { name: '工装裤', brand: 'Uniqlo', type: '下装', price: '¥499', searchTerm: '优衣库 男装工装裤' },
                { name: '厚底运动鞋', brand: 'Adidas', type: '鞋履', price: '¥1299', searchTerm: 'Adidas 男装厚底鞋' }
            ],
            'classic': [
                { name: '羊毛大衣', brand: 'Massimo Dutti', type: '外套', price: '¥1599', searchTerm: 'Massimo Dutti 男装大衣' },
                { name: '针织毛衣', brand: 'COS', type: '上装', price: '¥599', searchTerm: 'COS 男装毛衣' },
                { name: '经典西裤', brand: 'H&M', type: '下装', price: '¥499', searchTerm: 'H&M 男装西裤' },
                { name: '德比鞋', brand: 'Clarks', type: '鞋履', price: '¥1199', searchTerm: 'Clarks 男装德比鞋' }
            ]
        };
        
        return items[features.style] || items['casual'];
    }

    // 计算推荐置信度
    calculateConfidence(features, index) {
        let confidence = 0.7; // 基础置信度
        
        // 根据风格类型调整
        if (['business', 'classic'].includes(features.style)) {
            confidence += 0.1; // 经典风格置信度更高
        }
        
        // 根据脸型调整
        if (['oval', 'rectangular'].includes(features.faceShape)) {
            confidence += 0.1; // 适合大多数风格的脸型
        }
        
        return Math.min(0.95, confidence + (index * 0.03));
    }

    // 获取本地推荐（降级方案）
    getLocalRecommendations(features) {
        console.log('📚 使用本地推荐模板');
        
        const templates = this.getLocalTemplates(features.style);
        const outfits = templates.slice(0, 3).map((template, index) => {
            return {
                ...template,
                id: index + 1,
                image: this.getOutfitImage(features, index),
                confidence: 0.8,
                searchLinks: this.generateSearchLinks(template.title),
                searchTerm: template.title
            };
        });
        
        return outfits;
    }

    // 本地模板
    getLocalTemplates(style) {
        const templates = {
            'business': [
                {
                    title: '经典商务搭配',
                    description: '专业的商务装扮，展现成熟稳重的气质。使用搜索引擎查找更多商务男装搭配图片和品牌推荐。',
                    items: [
                        { name: '深蓝色西装', brand: 'Zara', price: '¥899', searchTerm: 'Zara 男装西装' },
                        { name: '白色衬衫', brand: 'Uniqlo', price: '¥199', searchTerm: '优衣库 男装白衬衫' },
                        { name: '深色领带', brand: 'H&M', price: '¥99', searchTerm: 'H&M 男装领带' },
                        { name: '黑色皮鞋', brand: 'Clarks', price: '¥1299', searchTerm: 'Clarks 男装皮鞋' }
                    ]
                }
            ],
            'casual': [
                {
                    title: '舒适休闲搭配',
                    description: '轻松随性的日常穿搭，适合各种休闲场合。搜索休闲男装搭配获取更多灵感。',
                    items: [
                        { name: '纯色T恤', brand: 'Uniqlo', price: '¥99', searchTerm: '优衣库 男装T恤' },
                        { name: '牛仔裤', brand: 'Levi\'s', price: '¥599', searchTerm: 'Levi\'s 男装牛仔裤' },
                        { name: '运动鞋', brand: 'Nike', price: '¥899', searchTerm: 'Nike 男装运动鞋' },
                        { name: '简约手表', brand: 'Casio', price: '¥299', searchTerm: 'Casio 男装手表' }
                    ]
                }
            ]
        };
        
        return templates[style] || templates['casual'];
    }

    // 获取购买链接
    getShoppingLinks(item) {
        const searchTerms = {
            'Zara': 'site:zara.com 男装',
            'H&M': 'site:hm.com 男装',
            'Uniqlo': 'site:uniqlo.com 男装',
            'COS': 'site:cosstores.com 男装',
            'Massimo Dutti': 'site:massimodutti.com 男装',
            'Nike': 'site:nike.com 男装',
            'Adidas': 'site:adidas.com 男装',
            'Levi\'s': 'site:levi.com 男装',
            'Clarks': 'site:clarks.com 男装',
            'Casio': 'site:casio.com 男装'
        };
        
        const searchTerm = searchTerms[item.brand] || `${item.brand} ${item.name}`;
        
        // 使用百度搜索作为默认购买搜索
        return `https://www.baidu.com/s?wd=${encodeURIComponent(searchTerm)}`;
    }

    // 获取肤色名称
    getSkinToneName(tone) {
        const names = {
            'fair': '白皙',
            'medium': '自然',
            'olive': '橄榄色',
            'dark': '小麦色',
            'deep': '深色'
        };
        return names[tone] || tone;
    }

    // 获取脸型名称
    getFaceShapeName(shape) {
        const names = {
            'round': '圆脸',
            'oval': '椭圆脸',
            'square': '方脸',
            'heart': '心形脸',
            'long': '长脸'
        };
        return names[shape] || shape;
    }

    // 获取身材类型名称
    getBodyTypeName(type) {
        const names = {
            'slim': '瘦削',
            'normal': '标准',
            'athletic': '运动型',
            'muscular': '肌肉型',
            'heavy': '偏胖'
        };
        return names[type] || type;
    }

    // 获取风格名称
    getStyleName(style) {
        const names = {
            'business': '商务正装',
            'casual': '休闲舒适',
            'smart-casual': '商务休闲',
            'trendy': '时尚潮流',
            'classic': '经典复古'
        };
        return names[style] || style;
    }

    // 批量打开搜索链接
    openSearchLinks(searchLinks) {
        Object.values(searchLinks).forEach((link, index) => {
            setTimeout(() => {
                window.open(link.url, '_blank');
            }, index * 500); // 每个链接延迟500ms打开
        });
    }

    // 搜索特定商品
    searchSpecificItem(item) {
        const searchTerm = item.searchTerm || `${item.brand} ${item.name}`;
        const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchTerm)}`;
        window.open(searchUrl, '_blank');
    }
}

// 全局实例
window.styleAISearchRecommendationEngine = new StyleAISearchRecommendationEngine();

console.log('✅ StyleAI Search-Based Recommendation Engine loaded');