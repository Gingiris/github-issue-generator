// GitHub Issue Generator - Gingiris
// Based on 75% response rate outreach tactics

console.log('GitHub Issue Generator loaded');

let repoData = null;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetchBtn')?.addEventListener('click', analyzeRepo);
    document.getElementById('urlInput')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') { e.preventDefault(); analyzeRepo(); }
    });
    document.getElementById('issueForm')?.addEventListener('submit', e => {
        e.preventDefault();
        generateIssues();
    });
});

async function analyzeRepo() {
    const url = document.getElementById('urlInput')?.value.trim();
    if (!url) { alert('Please enter a GitHub URL'); return; }

    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (!match) { alert('Invalid GitHub URL'); return; }

    const btn = document.getElementById('fetchBtn');
    btn.querySelector('.btn-text')?.classList.add('hidden');
    btn.querySelector('.btn-loading')?.classList.remove('hidden');
    btn.disabled = true;

    try {
        const [, owner, repo] = match;
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) throw new Error('GitHub API error');
        
        repoData = await response.json();
        displayRepoInfo(repoData);
        
        document.getElementById('repoInfo')?.classList.remove('hidden');
        document.getElementById('issueForm')?.classList.remove('hidden');
        document.getElementById('issueForm')?.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error(error);
        alert('Could not fetch repo info. Check the URL.');
    } finally {
        btn.querySelector('.btn-text')?.classList.remove('hidden');
        btn.querySelector('.btn-loading')?.classList.add('hidden');
        btn.disabled = false;
    }
}

function displayRepoInfo(data) {
    // Name
    document.getElementById('repoName').textContent = data.name;
    
    // Stars with formatting
    const stars = data.stargazers_count;
    document.getElementById('repoStars').textContent = 
        stars >= 1000 ? (stars / 1000).toFixed(1) + 'k' : stars;
    
    // Age
    const created = new Date(data.created_at);
    const months = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24 * 30));
    document.getElementById('repoAge').textContent = 
        months < 12 ? months + ' months' : Math.floor(months / 12) + ' years';
    
    // Stage analysis
    let stage = 'Early';
    if (stars < 100) stage = '🌱 Early';
    else if (stars < 500) stage = '📈 Growing';
    else if (stars < 2000) stage = '🚀 Scaling';
    else stage = '⭐ Established';
    document.getElementById('repoStage').textContent = stage;
    
    // Description
    document.getElementById('repoDesc').textContent = data.description || 'No description';
}

function generateIssues() {
    if (!repoData) { alert('Please analyze a repo first'); return; }
    
    const yourProject = document.getElementById('yourProject')?.value.trim() || '';
    const issueType = document.getElementById('issueType')?.value || 'growth';
    
    // Generate two versions
    const issue1 = generateDirectValue(repoData, yourProject);
    const issue2 = generateCollaborative(repoData, yourProject);
    
    displayIssue(1, issue1);
    displayIssue(2, issue2);
    
    document.getElementById('results')?.classList.remove('hidden');
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
}

function displayIssue(num, issue) {
    const card = document.getElementById('issue' + num);
    if (!card) return;
    card.querySelector('.issue-title').textContent = issue.title;
    card.querySelector('.issue-body').textContent = issue.body;
}

// ===== Issue Templates =====

function generateDirectValue(repo, yourProject) {
    const name = repo.name;
    const stars = repo.stargazers_count;
    const desc = repo.description || 'this project';
    const isChineseOwner = isChinese(repo.owner?.login) || isChinese(repo.description);
    
    let title, body;
    
    if (isChineseOwner) {
        // Chinese template
        title = `💡 建议: ${name} 社区增长与可见性策略`;
        body = `你好！👋

我注意到 ${name} 是一个很棒的项目 (${formatStars(stars)} stars)。

作为一个专注于开源项目增长的人，我想分享一些针对你们项目的建议：

**针对 ${name} 的具体建议：**

1. **README 优化** — 添加更多视觉元素（GIF 演示、架构图）
2. **社区建设** — 考虑创建 Discord/微信群，增强用户粘性
3. **内容营销** — 在掘金、知乎、即刻等平台分享技术文章
4. **出海策略** — 如果有国际化计划，可以考虑 Product Hunt、Reddit 等渠道

如果你们感兴趣，我可以整理一份完整的 GROWTH.md 文档，包含具体的执行步骤和模板。

想先了解更多背景：你们目前的增长重点是什么？国内还是海外？

---
参考资源：[开源出海增长指南](https://github.com/Gingiris/gingiris-opensource)`;
    } else {
        // English template
        title = `💡 Proposal: Community Growth & Visibility Strategy for ${name}`;
        body = `Hi there! 👋

I came across ${name} and I'm impressed by what you've built (${formatStars(stars)} stars, ${desc}).

I focus on open source growth strategies and wanted to share some observations specific to your project:

**Suggestions for ${name}:**

1. **README Enhancement** — Add GIF demos, architecture diagrams for better first impression
2. **Community Building** — Consider Discord/Slack for real-time engagement
3. **Content Strategy** — Technical blog posts, case studies, "built with ${name}" showcases
4. **Launch Opportunities** — Product Hunt, Hacker News timing strategies

If you're interested, I'd be happy to put together a comprehensive GROWTH.md with:
- Step-by-step action items
- Templates (Reddit posts, PH comments)
- Timeline recommendations

**Quick question:** What's your current growth priority — more contributors, or more users?

---
Reference: [Open Source Growth Playbook](https://github.com/Gingiris/gingiris-opensource)`;
    }
    
    return { title, body };
}

function generateCollaborative(repo, yourProject) {
    const name = repo.name;
    const stars = repo.stargazers_count;
    const topics = repo.topics || [];
    const isChineseOwner = isChinese(repo.owner?.login) || isChinese(repo.description);
    
    let title, body;
    
    if (isChineseOwner) {
        title = `🤝 讨论: 帮助 ${name} 扩大社区影响力`;
        body = `Hi 维护者们! 👋

我最近在研究优秀的开源项目，发现了 ${name}。

**我注意到的亮点：**
- ${formatStars(stars)} stars，说明项目有真实价值
- ${topics.length > 0 ? '技术栈: ' + topics.slice(0, 3).join(', ') : '技术实现很扎实'}

**一个想法：**

我一直在整理开源项目的增长案例（参考 AFFiNE 18个月 33k stars 的经验），想问一下：

你们是否有兴趣获得一些增长方面的建议？我可以根据 ${name} 的特点，提供：

- 针对性的 Reddit/HN 发布策略
- README 优化建议
- 社区运营技巧

不需要任何费用，纯粹是想帮助优秀的开源项目获得更多关注。

如果感兴趣，我可以先分享一些初步想法，然后再决定是否深入？

期待你们的回复！🙏`;
    } else {
        title = `🤝 Discussion: Helping ${name} reach more users`;
        body = `Hi maintainers! 👋

I've been researching great open source projects and discovered ${name}.

**What caught my attention:**
- ${formatStars(stars)} stars — clearly providing real value
- ${topics.length > 0 ? 'Tech: ' + topics.slice(0, 3).join(', ') : 'Solid technical implementation'}

**A thought:**

I've been documenting growth patterns for OSS projects (learned from AFFiNE's journey to 33k stars in 18 months).

I'm curious: would you be interested in some visibility/growth suggestions? Based on ${name}'s characteristics, I could share:

- Targeted Reddit/HN launch strategies
- README optimization ideas  
- Community building tactics

No cost involved — I genuinely enjoy helping great projects get the attention they deserve.

If interested, I could share some initial thoughts first, then we can decide if it's worth going deeper?

Looking forward to hearing from you! 🙏

---
For context: [Open Source Growth Playbook](https://github.com/Gingiris/gingiris-opensource)`;
    }
    
    return { title, body };
}

// ===== Helpers =====

function formatStars(stars) {
    return stars >= 1000 ? (stars / 1000).toFixed(1) + 'k' : stars.toString();
}

function isChinese(text) {
    if (!text) return false;
    return /[\u4e00-\u9fa5]/.test(text);
}

function restart() {
    repoData = null;
    ['results', 'issueForm', 'repoInfo'].forEach(id => 
        document.getElementById(id)?.classList.add('hidden')
    );
    const urlInput = document.getElementById('urlInput');
    if (urlInput) { urlInput.value = ''; urlInput.focus(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyIssue(num) {
    const card = document.getElementById('issue' + num);
    if (!card) return;
    
    const title = card.querySelector('.issue-title')?.textContent || '';
    const body = card.querySelector('.issue-body')?.textContent || '';
    const text = `Title: ${title}\n\n${body}`;
    
    navigator.clipboard.writeText(text).then(() => {
        document.getElementById('toast')?.classList.remove('hidden');
        const btn = card.querySelector('.btn-copy');
        if (btn) {
            btn.textContent = '✓ Copied!';
            btn.classList.add('copied');
        }
        setTimeout(() => {
            document.getElementById('toast')?.classList.add('hidden');
            if (btn) {
                btn.textContent = '📋 Copy All';
                btn.classList.remove('copied');
            }
        }, 2000);
    }).catch(err => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied!');
    });
}
