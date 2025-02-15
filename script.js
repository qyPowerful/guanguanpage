// 主预测函数 - 改名为submitPredict
async function submitPredict() {
    console.log('开始预测流程...');
    try {
        // 检查mappings是否已加载
        if (!mappings) {
            throw new Error('数据未加载完成，请刷新页面重试');
        }

        // 验证输入
        if (!validateInputs()) {
            return;
        }

        // 更新进度指示器
        updateProgressIndicator(3);

        // 收集并转换输入数据
        const inputArray = collectInputs();
        
        // 验证输入数组
        if (!Array.isArray(inputArray)) {
            throw new Error('输入数据格式错误');
        }
        if (inputArray.length !== 12) {
            throw new Error(`输入数组长度错误: ${inputArray.length}, 应为12`);
        }
        
        // 验证model.js的predict函数是否存在
        if (typeof window.predict !== 'function') {
            throw new Error('预测模型未正确加载');
        }

        // 调用model.js的predict函数进行预测
        console.log('调用模型进行预测...');
        const probability = window.predict(inputArray);
        console.log('预测结果:', probability);

        // 验证预测结果
        if (typeof probability !== 'number' || isNaN(probability)) {
            throw new Error('预测结果无效');
        }

        // 更新结果显示
        updateResults(probability);

    } catch (error) {
        console.error('预测过程出错:', error);
        alert('预测过程出现错误: ' + error.message);
    }
}

// 只导出必要的函数
window.submitPredict = submitPredict;
window.updateProgressIndicator = updateProgressIndicator;
