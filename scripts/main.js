// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const originalDimensions = document.getElementById('originalDimensions');
const compressedSize = document.getElementById('compressedSize');
const compressedDimensions = document.getElementById('compressedDimensions');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadButton = document.getElementById('downloadButton');

// 当前处理的图片数据
let currentFile = null;

// 文件拖放处理
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#0071e3';
    dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#86868b';
    dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#86868b';
    dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

// 文件选择处理
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// 质量滑块处理
qualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    qualityValue.textContent = quality + '%';
    if (currentFile) {
        compressImage(currentFile, quality / 100);
    }
});

// 处理图片上传
function handleImageUpload(file) {
    currentFile = file;
    
    // 显示预览区域
    previewSection.style.display = 'block';
    
    // 显示原始图片信息
    const reader = new FileReader();
    reader.onload = (e) => {
        // 显示原始图片
        originalImage.src = e.target.result;
        originalSize.textContent = formatFileSize(file.size);
        
        // 获取图片尺寸
        const img = new Image();
        img.onload = () => {
            originalDimensions.textContent = `${img.width} x ${img.height}`;
            // 压缩图片
            compressImage(file, qualitySlider.value / 100);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(file, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // 创建 canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 压缩图片
            const compressedDataUrl = canvas.toDataURL(file.type, quality);
            
            // 显示压缩后的图片
            compressedImage.src = compressedDataUrl;
            
            // 计算压缩后的大小
            const compressedSize = Math.round(compressedDataUrl.length * 3 / 4);
            document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
            document.getElementById('compressedDimensions').textContent = `${img.width} x ${img.height}`;
            
            // 更新下载按钮
            downloadButton.onclick = () => {
                const link = document.createElement('a');
                link.download = `compressed_${file.name}`;
                link.href = compressedDataUrl;
                link.click();
            };
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 添加页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
}); 