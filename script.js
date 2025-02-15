// 全局变量
let mappings = null;  // 将由index.html中的fetch加载

// 辅助函数：检查所有必填字段
function validateInputs() {
    const requiredFields = [
        'age_rank', 'sex', 'education', 'race',
        'activities', 'dairy', 'fruit', 'smoke',
        'hearing', 'tinnitus', 'tg', 'cho'
    ];
    
    for (const field of requiredFields) {
        const value = document.getElementById(field).value;
        if (!value) {
            alert('请填写所有必填项');
            document.getElementById(field).focus();
            return false;
        }
    }
    return true;
}

// 辅助函数：收集并转换输入数据
function collectInputs() {
    if (!mappings || !mappings.feature_order) {
        throw new Error('映射数据未正确加载');
    }

    // 创建一个对象来存储所有输入值
    const inputs = {};
    const elements = document.querySelectorAll('select');
    elements.forEach(element => {
        inputs[element.id] = element.value;
    });

    // 根据feature_order创建输入数组
    const inputArray = mappings.feature_order.map(feature => {
        const value = inputs[feature];
        if (value === undefined) {
            throw new Error(`特征 ${feature} 未找到对应的输入值`);
        }
        
        // 获取该特征的映射值
        const featureMapping = mappings[feature];
        if (!featureMapping) {
            throw new Error(`特征 ${feature} 未找到对应的映射`);
        }

        // 返回映射后的标准化值
        return featureMapping[value];
    });

    return inputArray;
}

// 辅助函数：更新进度指示器
function updateProgressIndicator(step) {
    document.querySelectorAll('.step-number').forEach((element, index) => {
        if (index + 1 <= step) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

// 辅助函数：更新结果显示
function updateResults(probability) {
    const percentage = (probability * 100).toFixed(1);
    
    // 更新风险值显示
    document.getElementById('risk-value').textContent = percentage + '%';
    document.getElementById('risk-percentage').textContent = percentage + '%';
    
    // 显示结果容器
    const resultContainer = document.getElementById('result');
    resultContainer.classList.add('show');
    
    // 平滑滚动到结果区域
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// 主预测函数
async function predict() {
    try {
        // 验证输入
        if (!validateInputs()) {
            return;
        }

        // 更新进度指示器
        updateProgressIndicator(3);

        // 收集并转换输入数据
        const inputArray = collectInputs();

        // 调用模型进行预测
        const probability = window.predict(inputArray);

        // 更新结果显示
        updateResults(probability);

    } catch (error) {
        console.error('预测过程出错:', error);
        alert('预测过程出现错误: ' + error.message);
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 为所有select添加change事件监听器
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', function() {
            // 当用户开始填写表单时，激活第一个进度点
            updateProgressIndicator(1);
            
            // 如果第一部分的所有字段都已填写，激活第二个进度点
            const firstSection = ['age_rank', 'sex', 'education', 'race'];
            const firstSectionComplete = firstSection.every(id => 
                document.getElementById(id).value !== ''
            );
            if (firstSectionComplete) {
                updateProgressIndicator(2);
            }
        });
    });
});