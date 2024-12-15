interface Tools {
    [key: string]: any;
}

interface PromptGeneratorOptions {
    userSystemPrompt?: string;
    toolConfig?: string;
}

export class SystemPromptGenerator {
    private template: string;
    private defaultUserSystemPrompt: string;
    private defaultToolConfig: string;

    constructor() {
        this.template = `
    在这个环境中，你可以使用一系列工具来回答用户的问题。
    {{ FORMATTING INSTRUCTIONS }}
    字符串和标量参数应按原样指定，而列表和对象应使用JSON格式。请注意，字符串值的空格不会被去除。
    以下是JSONSchema格式的可用函数：
    {{ TOOL DEFINITIONS IN JSON SCHEMA }}
    {{ USER SYSTEM PROMPT }}
    {{ TOOL CONFIGURATION }}
    `;

        this.defaultUserSystemPrompt = "你是一个能够有效使用工具解决用户查询的智能助手。";
        this.defaultToolConfig = "无需额外配置。";
    }

    generatePrompt(tools: Tools, options: PromptGeneratorOptions = {}): string {
        const {
            userSystemPrompt = this.defaultUserSystemPrompt,
            toolConfig = this.defaultToolConfig,
        } = options;

        const toolsJsonSchema = JSON.stringify({ tools }, null, 2);

        let prompt = this.template
            .replace("{{ TOOL DEFINITIONS IN JSON SCHEMA }}", toolsJsonSchema)
            .replace("{{ FORMATTING INSTRUCTIONS }}", "")
            .replace("{{ USER SYSTEM PROMPT }}", userSystemPrompt)
            .replace("{{ TOOL CONFIGURATION }}", toolConfig);

        return prompt + this.getGeneralGuidelines();
    }

    private getGeneralGuidelines(): string {
        return `
    **一般准则:**

    1. 逐步推理:
       - 系统地分析任务
       - 将复杂问题分解为更小的可管理部分
       - 在每个步骤验证假设以避免错误
       - 反思结果以改进后续行动

    2. 有效的工具使用:
       - 探索:
         - 识别可用信息并验证其结构
         - 检查假设并理解数据关系
       - 迭代:
         - 从简单的查询或操作开始
         - 基于观察结果进行调整
       - 处理错误:
         - 仔细分析错误消息
         - 使用错误作为改进方法的指导
         - 记录出错原因并提出修复建议

    3. 清晰的沟通:
       - 解释每个步骤的推理和决定
       - 向用户透明地分享发现
       - 根据需要概述下一步或提出澄清问题
    `;
    }
}

export function generateSystemPrompt(tools: Tools): string {
    const promptGenerator = new SystemPromptGenerator();
    return promptGenerator.generatePrompt(tools);
} 