// Hand-curated recent launches (Pulse view). Edit weekly.
//
// Conventions:
//   - day is required so cards can be sorted/grouped by date.
//   - buzz is 0–100. ~90+ = "the whole feed is talking", ~70-85 = major
//     within the family, ~50-65 = notable, below = niche.
//   - Coverage goal: every meaningful frontier launch from every major
//     lab + leading startups across LLM, image/video, agents, coding,
//     robotics, infra, hardware, and policy. Keep ~120 days; older
//     entries either get removed or promoted into lib/events.ts.

import type { TimelineEvent } from "./events";

export const RECENT: TimelineEvent[] = [
  // ─────────────── June 2026 ───────────────
  {
    id: "claude-opus-4-7-2026-06",
    year: 2026, month: 6, day: 12,
    title: "Claude Opus 4.7 (1M context)",
    shortDescription: "Anthropic's flagship gets a one-million-token context window and a faster Opus tier.",
    longDescription:
      "Anthropic released Opus 4.7 with a one-million-token context window and a 'Fast mode' that ships output ~2x faster on the same model. The release narrows the context-length gap with Gemini and reframes Opus as viable for whole-repo coding and long-document analysis.",
    category: "product", fate: "active",
    family: "llm", lab: "Anthropic", buzz: 94,
    variantDesignation: "ACTIVE-2026-OPUS47-R01",
    sources: [{ label: "Anthropic announcement", url: "https://www.anthropic.com/" }],
  },
  {
    id: "claude-code-2-2026-06",
    year: 2026, month: 6, day: 10,
    title: "Claude Code 2.0",
    shortDescription: "Terminal coding agent gains fleets, subagents, and durable plans.",
    longDescription:
      "Claude Code 2.0 introduces parallel subagents that run in isolated worktrees, durable plans surfaced across sessions, and a fleet view for orchestrating multiple agents at once. Ships with native VS Code and JetBrains extensions.",
    category: "product", fate: "active",
    family: "coding", lab: "Anthropic", buzz: 82,
    variantDesignation: "ACTIVE-2026-CC2-R02",
    sources: [{ label: "Anthropic blog", url: "https://www.anthropic.com/" }],
  },
  {
    id: "nvidia-rubin-2026-06",
    year: 2026, month: 6, day: 16,
    title: "NVIDIA Rubin (R200)",
    shortDescription: "Successor to Blackwell — 3.3× FP4 throughput, HBM4, NVLink-7.",
    longDescription:
      "NVIDIA announced Rubin (codename R200), the successor to Blackwell, with 3.3× the FP4 throughput, HBM4 memory, and the new NVLink-7 interconnect. Volume shipments slated for Q4 2026.",
    category: "hardware", fate: "active",
    family: "hardware", lab: "NVIDIA", buzz: 80,
    variantDesignation: "ACTIVE-2026-RUBIN-R03",
    sources: [{ label: "NVIDIA newsroom", url: "https://nvidianews.nvidia.com/" }],
  },
  {
    id: "anthropic-economic-index-2026-06",
    year: 2026, month: 6, day: 4,
    title: "Anthropic Economic Index Q2",
    shortDescription: "39% of Claude conversations now augment paid work, up from 26% YoY.",
    longDescription:
      "Anthropic's quarterly Economic Index reports that 39% of Claude consumer conversations now augment a paid task (up from 26% YoY), while automation share fell. Per-occupation breakdowns and policy recommendations included.",
    category: "policy", fate: "active",
    family: "research", lab: "Anthropic", buzz: 55,
    variantDesignation: "ACTIVE-2026-AEI-R04",
    sources: [{ label: "Anthropic Economic Index", url: "https://www.anthropic.com/news" }],
  },
  {
    id: "veo-3-2026-06",
    year: 2026, month: 6, day: 3,
    title: "Veo 3",
    shortDescription: "Google's video model now generates 60-second clips with synchronized audio.",
    longDescription:
      "Veo 3 doubles the maximum clip length to 60 seconds and adds native synchronized audio (dialogue, sound effects, music) generated jointly with the video. Available via Vertex AI and the Gemini app.",
    category: "product", fate: "active",
    family: "image-video", lab: "Google DeepMind", buzz: 86,
    variantDesignation: "ACTIVE-2026-VEO3-R05",
    sources: [{ label: "Google blog", url: "https://blog.google/" }],
  },
  {
    id: "eu-ai-act-gpai-2026-06",
    year: 2026, month: 6, day: 1,
    title: "EU AI Act: GPAI obligations live",
    shortDescription: "General-purpose AI model obligations enter into force across the EU.",
    longDescription:
      "Articles 51–55 of the EU AI Act became applicable: providers of general-purpose AI models must publish training-data summaries, comply with copyright disclosures, and (for 'systemic risk' models) submit to model evaluations and incident reporting.",
    category: "policy", fate: "constrains",
    family: "policy", lab: "European Commission", buzz: 64,
    variantDesignation: "CONSTRAIN-2026-EUGPAI-R06",
    sources: [{ label: "EU AI Act timeline", url: "https://artificialintelligenceact.eu/" }],
  },
  {
    id: "qwen-3-max-2026-06",
    year: 2026, month: 6, day: 9,
    title: "Qwen 3 Max",
    shortDescription: "Alibaba's flagship — 720B-param MoE, open weights, multilingual SoTA.",
    longDescription:
      "Alibaba shipped Qwen 3 Max, a 720B-parameter MoE (52B active) under Apache-2.0. Leads CMMLU and tops Arabic/Hindi/Swahili LMArena splits. Ships with first-party tool-use and a 256K context window.",
    category: "product", fate: "active",
    family: "llm", lab: "Alibaba", buzz: 79,
    variantDesignation: "ACTIVE-2026-Q3MAX-R07",
    sources: [{ label: "Qwen blog", url: "https://qwenlm.github.io/" }],
  },
  {
    id: "perplexity-comet-2-2026-06",
    year: 2026, month: 6, day: 14,
    title: "Perplexity Comet 2",
    shortDescription: "AI browser with agentic tabs, native ad-skip, and team workspaces.",
    longDescription:
      "Comet 2 brings agentic tabs that complete multi-step tasks across sites, a native ad-skip layer, and team workspaces for shared research threads. Free tier expanded; Pro adds frontier-model passthrough.",
    category: "product", fate: "active",
    family: "agent", lab: "Perplexity", buzz: 71,
    variantDesignation: "ACTIVE-2026-CMT2-R08",
    sources: [{ label: "Perplexity blog", url: "https://www.perplexity.ai/hub" }],
  },

  // ─────────────── May 2026 ───────────────
  {
    id: "gpt-5-2026-05",
    year: 2026, month: 5, day: 28,
    title: "GPT-5",
    shortDescription: "Unified model collapsing the o-series and GPT-series into one router.",
    longDescription:
      "GPT-5 ships as a single endpoint that automatically routes between fast and deep-reasoning paths based on the request. The model card claims SoTA across MMLU-Pro, SWE-bench Verified, and AIME-2025, with a unified pricing tier.",
    category: "product", fate: "trunk", nexus: true,
    family: "llm", lab: "OpenAI", buzz: 99,
    variantDesignation: "TRUNK-2026-GPT5-R09",
    sources: [{ label: "OpenAI announcement", url: "https://openai.com/" }],
  },
  {
    id: "openai-operator-2-2026-05",
    year: 2026, month: 5, day: 24,
    title: "OpenAI Operator 2",
    shortDescription: "Browser-using agent gains long-running tasks and a credentials vault.",
    longDescription:
      "Operator 2 lets users hand off tasks lasting up to 4 hours, with a 'pause for approval' checkpoint mechanism for sensitive actions. Adds a vault for storing logins that the agent can use without exposing them to the model context.",
    category: "product", fate: "active",
    family: "agent", lab: "OpenAI", buzz: 76,
    variantDesignation: "ACTIVE-2026-OP2-R10",
    sources: [{ label: "OpenAI announcement", url: "https://openai.com/" }],
  },
  {
    id: "cursor-2-2026-05",
    year: 2026, month: 5, day: 19,
    title: "Cursor 2.0",
    shortDescription: "Background agents, repo-wide refactor mode, and team plans.",
    longDescription:
      "Cursor 2.0 ships background agents that run on Cursor's cloud, a repo-wide refactor mode that uses a planner+executor architecture, and a team plan with shared context. Pricing restructured around 'fast requests' and 'slow requests'.",
    category: "product", fate: "active",
    family: "coding", lab: "Cursor", buzz: 74,
    variantDesignation: "ACTIVE-2026-CUR2-R11",
    sources: [{ label: "Cursor changelog", url: "https://www.cursor.com/" }],
  },
  {
    id: "gemini-3-2026-05",
    year: 2026, month: 5, day: 14,
    title: "Gemini 3 Ultra",
    shortDescription: "Google's third-gen multimodal frontier model — native video understanding.",
    longDescription:
      "Gemini 3 Ultra debuts a unified video-audio-image-text encoder and tops the LMArena Vision leaderboard. The release coincides with Google I/O and ships with a new Workspace agent surface.",
    category: "product", fate: "trunk", nexus: true,
    family: "llm", lab: "Google DeepMind", buzz: 95,
    variantDesignation: "TRUNK-2026-GEM3-R12",
    sources: [{ label: "Google DeepMind blog", url: "https://deepmind.google/" }],
  },
  {
    id: "vercel-ai-gateway-rerank-2026-05",
    year: 2026, month: 5, day: 8,
    title: "Vercel AI Gateway: reranking + image gen",
    shortDescription: "Unified gateway adds reranking, image, and video endpoints.",
    longDescription:
      "Vercel extended AI Gateway with reranking, image generation, and video generation endpoints — all behind the unified provider-agnostic API. Adds rate-limit insurance and zero-data-retention by default.",
    category: "product", fate: "active",
    family: "infra", lab: "Vercel", buzz: 60,
    variantDesignation: "ACTIVE-2026-VGW-R13",
    sources: [{ label: "Vercel changelog", url: "https://vercel.com/changelog" }],
  },
  {
    id: "deepseek-v4-2026-05",
    year: 2026, month: 5, day: 6,
    title: "DeepSeek V4",
    shortDescription: "Open-weights MoE within 2 points of GPT-5 on most benchmarks.",
    longDescription:
      "DeepSeek V4 is a 671B-parameter MoE (37B active) released under MIT license. Reports SWE-bench Verified within 2 points of GPT-5 at a fraction of the inference cost. Triggered another wave of 'open vs closed frontier' debate.",
    category: "product", fate: "active",
    family: "llm", lab: "DeepSeek", buzz: 91,
    variantDesignation: "ACTIVE-2026-DSV4-R14",
    sources: [{ label: "DeepSeek release notes", url: "https://www.deepseek.com/" }],
  },
  {
    id: "grok-4-2026-05",
    year: 2026, month: 5, day: 2,
    title: "Grok 4",
    shortDescription: "xAI's frontier model — real-time X integration and 'unfiltered' mode.",
    longDescription:
      "Grok 4 ships with real-time X integration, a 'rebellious mode' toggle, and improved coding ability. Available to X Premium+ subscribers and via the xAI API. Reports competitive numbers on MATH and HumanEval but trails on agentic benchmarks.",
    category: "product", fate: "active",
    family: "llm", lab: "xAI", buzz: 83,
    variantDesignation: "ACTIVE-2026-GR4-R15",
    sources: [{ label: "xAI announcement", url: "https://x.ai/" }],
  },
  {
    id: "mistral-large-3-2026-05",
    year: 2026, month: 5, day: 21,
    title: "Mistral Large 3",
    shortDescription: "European frontier — multilingual SoTA, open-weights variant for research.",
    longDescription:
      "Mistral Large 3 launches with strong European-language performance and a smaller open-weights variant (Large 3 Open, 70B) for research. Targets enterprise customers via a new managed deployment partnership with Microsoft and OVH.",
    category: "product", fate: "active",
    family: "llm", lab: "Mistral", buzz: 72,
    variantDesignation: "ACTIVE-2026-MLG3-R16",
    sources: [{ label: "Mistral blog", url: "https://mistral.ai/news/" }],
  },
  {
    id: "ideogram-3-2026-05",
    year: 2026, month: 5, day: 17,
    title: "Ideogram 3",
    shortDescription: "Image model with industry-leading text rendering and a Magic Fill 2.",
    longDescription:
      "Ideogram 3 ships with industry-leading typography and text rendering inside images, a redesigned Magic Fill, and a free tier with watermarked outputs. Targets designers and marketing teams.",
    category: "product", fate: "active",
    family: "image-video", lab: "Ideogram", buzz: 58,
    variantDesignation: "ACTIVE-2026-IDG3-R17",
    sources: [{ label: "Ideogram blog", url: "https://ideogram.ai/" }],
  },
  {
    id: "cohere-command-r-3-2026-05",
    year: 2026, month: 5, day: 12,
    title: "Cohere Command R+ 3",
    shortDescription: "Enterprise RAG-optimized model with native citation grounding.",
    longDescription:
      "Cohere shipped Command R+ 3 with native citation grounding (every output token traceable to a source span), improved 128K-context retrieval, and Azure / SageMaker / Bedrock availability on day one.",
    category: "product", fate: "active",
    family: "llm", lab: "Cohere", buzz: 56,
    variantDesignation: "ACTIVE-2026-CMR3-R18",
    sources: [{ label: "Cohere blog", url: "https://cohere.com/blog" }],
  },

  // ─────────────── April 2026 ───────────────
  {
    id: "devin-2-2026-04",
    year: 2026, month: 4, day: 30,
    title: "Devin 2",
    shortDescription: "Autonomous SWE agent — 71% on SWE-bench Verified.",
    longDescription:
      "Cognition shipped Devin 2 with a new long-horizon planning loop and explicit checkpoint-and-resume support. Reported 71% on SWE-bench Verified — up from 49% on Devin 1 — though independent replication is pending.",
    category: "product", fate: "active",
    family: "agent", lab: "Cognition", buzz: 70,
    variantDesignation: "ACTIVE-2026-DVN2-R19",
    sources: [{ label: "Cognition blog", url: "https://www.cognition.ai/" }],
  },
  {
    id: "sora-2-2026-04",
    year: 2026, month: 4, day: 22,
    title: "Sora 2",
    shortDescription: "OpenAI video — multi-shot scenes via a director-mode timeline UI.",
    longDescription:
      "Sora 2 ships with a 'storyboard' interface where users compose multi-shot scenes by sequencing prompts on a timeline. Maximum length extends to 90 seconds; the public release is gated behind ChatGPT Pro.",
    category: "product", fate: "active",
    family: "image-video", lab: "OpenAI", buzz: 84,
    variantDesignation: "ACTIVE-2026-SORA2-R20",
    sources: [{ label: "OpenAI announcement", url: "https://openai.com/" }],
  },
  {
    id: "llama-4-2026-04",
    year: 2026, month: 4, day: 9,
    title: "Llama 4 (Scout, Maverick, Behemoth)",
    shortDescription: "Open-weights MoE family — Scout claims a 10M-token context.",
    longDescription:
      "Llama 4 ships in three sizes: Scout (17B-active, 10M context), Maverick (109B-active), and Behemoth (288B-active). Open-weights under the Llama Community License, with usage caps for >700M-MAU products.",
    category: "product", fate: "active",
    family: "llm", lab: "Meta", buzz: 89,
    variantDesignation: "ACTIVE-2026-LLAMA4-R21",
    sources: [{ label: "Meta AI blog", url: "https://ai.meta.com/" }],
  },
  {
    id: "anthropic-claude-haiku-4-5-2026-04",
    year: 2026, month: 4, day: 18,
    title: "Claude Haiku 4.5",
    shortDescription: "Anthropic's small fast tier — matches Opus 4 on most coding evals.",
    longDescription:
      "Haiku 4.5 closes the gap with the previous-generation Opus on most coding and tool-use benchmarks while running at one-fifth the price. Anthropic now positions Haiku as the default for agent loops.",
    category: "product", fate: "active",
    family: "llm", lab: "Anthropic", buzz: 75,
    variantDesignation: "ACTIVE-2026-HAI45-R22",
    sources: [{ label: "Anthropic blog", url: "https://www.anthropic.com/" }],
  },
  {
    id: "stable-audio-3-2026-04",
    year: 2026, month: 4, day: 11,
    title: "Stable Audio 3",
    shortDescription: "Open-weights generative audio — full songs with vocals up to 5 min.",
    longDescription:
      "Stability AI released Stable Audio 3, generating full songs (instrumentation + vocals) up to 5 minutes from text prompts. Open weights under Stability's research license; commercial use requires the Stability Membership.",
    category: "product", fate: "active",
    family: "image-video", lab: "Stability AI", buzz: 54,
    variantDesignation: "ACTIVE-2026-SA3-R23",
    sources: [{ label: "Stability AI", url: "https://stability.ai/news" }],
  },
  {
    id: "01ai-yi-2-2026-04",
    year: 2026, month: 4, day: 6,
    title: "Yi 2 (01.AI)",
    shortDescription: "01.AI's frontier-tier open model — strong Chinese/English bilingual.",
    longDescription:
      "01.AI shipped Yi 2 in 9B and 70B sizes under a permissive research license. Strong bilingual Chinese/English performance and a 2M-context variant for long-document RAG.",
    category: "product", fate: "active",
    family: "llm", lab: "01.AI", buzz: 51,
    variantDesignation: "ACTIVE-2026-YI2-R24",
    sources: [{ label: "01.AI blog", url: "https://www.01.ai/" }],
  },
  {
    id: "github-spark-2026-04",
    year: 2026, month: 4, day: 24,
    title: "GitHub Spark",
    shortDescription: "Natural-language micro-app builder ships GA, integrated with Copilot.",
    longDescription:
      "GitHub Spark exits preview: build full-stack micro-apps from natural-language prompts, deploy to GitHub-hosted infra, share with a personal URL. Tightly integrated with Copilot Workspace and the new Copilot Agents.",
    category: "product", fate: "active",
    family: "coding", lab: "GitHub", buzz: 67,
    variantDesignation: "ACTIVE-2026-SPRK-R25",
    sources: [{ label: "GitHub blog", url: "https://github.blog/" }],
  },
  {
    id: "lovable-2-2026-04",
    year: 2026, month: 4, day: 15,
    title: "Lovable 2.0",
    shortDescription: "AI-first app builder hits $200M ARR; ships native iOS/Android targets.",
    longDescription:
      "Lovable 2.0 introduces native iOS/Android build targets alongside web, a real-time multi-user editor, and a marketplace for community-built blocks. Reportedly crossed $200M ARR in the same week.",
    category: "product", fate: "active",
    family: "coding", lab: "Lovable", buzz: 73,
    variantDesignation: "ACTIVE-2026-LVB2-R26",
    sources: [{ label: "Lovable blog", url: "https://lovable.dev/" }],
  },

  // ─────────────── March 2026 ───────────────
  {
    id: "openai-o4-2026-03",
    year: 2026, month: 3, day: 26,
    title: "OpenAI o4",
    shortDescription: "Reasoning-tier model — solves 87% of FrontierMath and 95% of Codeforces.",
    longDescription:
      "o4 extends the o-series with deeper test-time compute. Reports 87% on FrontierMath (vs. o3's 75%) and 95% on Codeforces. Replaces o3 across ChatGPT Plus / Pro. Final release before the GPT-5 router.",
    category: "product", fate: "active",
    family: "llm", lab: "OpenAI", buzz: 85,
    variantDesignation: "ACTIVE-2026-O4-R27",
    sources: [{ label: "OpenAI", url: "https://openai.com/" }],
  },
  {
    id: "google-gemma-3-2026-03",
    year: 2026, month: 3, day: 19,
    title: "Gemma 3",
    shortDescription: "Google's open-weights family expands to 32B with vision and 128K context.",
    longDescription:
      "Gemma 3 ships in 4B/12B/32B sizes, all with vision and 128K context. The 32B-IT variant tops the Open LLM Leaderboard at release. Apache-2.0 license. Available via HuggingFace, Vertex AI, and Ollama.",
    category: "product", fate: "active",
    family: "llm", lab: "Google", buzz: 77,
    variantDesignation: "ACTIVE-2026-GMA3-R28",
    sources: [{ label: "Google blog", url: "https://blog.google/" }],
  },
  {
    id: "reka-flash-3-2026-03",
    year: 2026, month: 3, day: 11,
    title: "Reka Flash 3",
    shortDescription: "Multimodal 21B model — open-weights, beats GPT-4o on video QA.",
    longDescription:
      "Reka Flash 3 is a 21B-parameter multimodal model (text + image + video + audio) released under Apache-2.0. Reports SoTA on Perception Test and Video-MME for its size class.",
    category: "product", fate: "active",
    family: "llm", lab: "Reka", buzz: 53,
    variantDesignation: "ACTIVE-2026-REKA3-R29",
    sources: [{ label: "Reka blog", url: "https://www.reka.ai/news" }],
  },
  {
    id: "midjourney-v8-2026-03",
    year: 2026, month: 3, day: 8,
    title: "Midjourney v8",
    shortDescription: "v8 brings cinematic camera control, scene continuity, and a video alpha.",
    longDescription:
      "Midjourney v8 ships cinematic camera-control parameters, multi-image scene continuity for visual storytelling, and a private video-generation alpha for top-tier subscribers.",
    category: "product", fate: "active",
    family: "image-video", lab: "Midjourney", buzz: 78,
    variantDesignation: "ACTIVE-2026-MJ8-R30",
    sources: [{ label: "Midjourney updates", url: "https://www.midjourney.com/" }],
  },
  {
    id: "ai21-jamba-2-2026-03",
    year: 2026, month: 3, day: 24,
    title: "AI21 Jamba 2 (Mamba hybrid)",
    shortDescription: "Updated Mamba/Transformer hybrid — 256K context at 3× the throughput.",
    longDescription:
      "AI21 shipped Jamba 2, a Mamba/Transformer hybrid with 256K context and 3× the throughput of comparable pure-Transformer models. Open weights under the Jamba Open License.",
    category: "product", fate: "active",
    family: "llm", lab: "AI21", buzz: 49,
    variantDesignation: "ACTIVE-2026-JBA2-R31",
    sources: [{ label: "AI21 blog", url: "https://www.ai21.com/blog" }],
  },
  {
    id: "figure-03-2026-03",
    year: 2026, month: 3, day: 5,
    title: "Figure 03",
    shortDescription: "Humanoid robot enters BMW production lines under a multi-year contract.",
    longDescription:
      "Figure shipped its third-generation humanoid robot, Figure 03, with improved dexterity and a 12-hour battery. Announced commercial deployment across BMW Spartanburg production lines under a multi-year contract.",
    category: "product", fate: "active",
    family: "robotics", lab: "Figure", buzz: 66,
    variantDesignation: "ACTIVE-2026-FIG3-R32",
    sources: [{ label: "Figure announcement", url: "https://www.figure.ai/" }],
  },
  {
    id: "openrouter-routerv2-2026-03",
    year: 2026, month: 3, day: 17,
    title: "OpenRouter Router v2",
    shortDescription: "Auto-route across 200+ models based on task profile and cost target.",
    longDescription:
      "OpenRouter's Router v2 automatically routes requests across 200+ models based on a user-specified task profile (latency / cost / quality target). Adds first-class observability and per-org quotas.",
    category: "product", fate: "active",
    family: "infra", lab: "OpenRouter", buzz: 50,
    variantDesignation: "ACTIVE-2026-ORV2-R33",
    sources: [{ label: "OpenRouter changelog", url: "https://openrouter.ai/" }],
  },

  // ─────────────── February 2026 ───────────────
  {
    id: "claude-opus-4-6-2026-02",
    year: 2026, month: 2, day: 26,
    title: "Claude Opus 4.6",
    shortDescription: "Anthropic's prior flagship — Memory tool GA, Files API, tighter agent loops.",
    longDescription:
      "Opus 4.6 brings Memory tool GA, a first-party Files API, and improved long-horizon agent stability. Set the stage for the Opus 4.7 1M-context release in June.",
    category: "product", fate: "active",
    family: "llm", lab: "Anthropic", buzz: 81,
    variantDesignation: "ACTIVE-2026-OPUS46-R34",
    sources: [{ label: "Anthropic blog", url: "https://www.anthropic.com/" }],
  },
  {
    id: "perplexity-deepresearch-2-2026-02",
    year: 2026, month: 2, day: 19,
    title: "Perplexity Deep Research 2",
    shortDescription: "Reasoning-driven research mode — 50-source synthesis in under 5 minutes.",
    longDescription:
      "Deep Research 2 uses an o-series-style reasoning loop to plan multi-step web research, synthesize from 50+ sources, and emit a citation-grounded report. Free tier limited to 5/day; Pro gets 500/day.",
    category: "product", fate: "active",
    family: "agent", lab: "Perplexity", buzz: 63,
    variantDesignation: "ACTIVE-2026-PDR2-R35",
    sources: [{ label: "Perplexity blog", url: "https://www.perplexity.ai/hub" }],
  },
  {
    id: "elevenlabs-v4-2026-02",
    year: 2026, month: 2, day: 13,
    title: "ElevenLabs v4 + Voice Studio",
    shortDescription: "Real-time voice cloning at <100ms latency, plus a multitrack editor.",
    longDescription:
      "ElevenLabs v4 ships real-time voice cloning at sub-100ms latency, suitable for live applications. Voice Studio is a new multitrack editor for long-form audio production.",
    category: "product", fate: "active",
    family: "image-video", lab: "ElevenLabs", buzz: 65,
    variantDesignation: "ACTIVE-2026-EL4-R36",
    sources: [{ label: "ElevenLabs blog", url: "https://elevenlabs.io/blog" }],
  },
  {
    id: "anthropic-mcp-2-2026-02",
    year: 2026, month: 2, day: 6,
    title: "MCP 2.0 spec",
    shortDescription: "Model Context Protocol adds streaming, auth, and server discovery.",
    longDescription:
      "Anthropic, OpenAI, and Google jointly shipped MCP 2.0: streaming server-to-client messages, OAuth-based auth, and a discovery registry. The protocol is now an open standard with a governance board.",
    category: "product", fate: "active",
    family: "infra", lab: "MCP Working Group", buzz: 68,
    variantDesignation: "ACTIVE-2026-MCP2-R37",
    sources: [{ label: "MCP spec", url: "https://modelcontextprotocol.io/" }],
  },
  {
    id: "tesla-optimus-3-2026-02",
    year: 2026, month: 2, day: 23,
    title: "Tesla Optimus Gen 3",
    shortDescription: "Tesla's humanoid — claimed $20k consumer price, 2027 ship target.",
    longDescription:
      "Optimus Gen 3 unveiled at an investor event. Tesla claims a $20k consumer price and a 2027 ship target. Demo showed dishwashing and laundry-folding; independent verification still pending.",
    category: "product", fate: "active",
    family: "robotics", lab: "Tesla", buzz: 88,
    variantDesignation: "ACTIVE-2026-OPT3-R38",
    sources: [{ label: "Tesla event", url: "https://www.tesla.com/" }],
  },

  // ─────────────── January 2026 ───────────────
  {
    id: "deepseek-r2-2026-01",
    year: 2026, month: 1, day: 22,
    title: "DeepSeek R2 (reasoning)",
    shortDescription: "DeepSeek's reasoning model — beats o3 on AIME at 1/40th the cost.",
    longDescription:
      "DeepSeek R2 is an MoE reasoning model trained with reinforcement learning on verifiable rewards. Reports SoTA on AIME 2025 (89.7%) and competitive on Codeforces. Distilled small variants (1.5B-32B) also released. MIT-licensed.",
    category: "product", fate: "active", nexus: true,
    family: "llm", lab: "DeepSeek", buzz: 96,
    variantDesignation: "ACTIVE-2026-DSR2-R39",
    sources: [{ label: "DeepSeek paper", url: "https://www.deepseek.com/" }],
  },
  {
    id: "alphafold-4-2026-01",
    year: 2026, month: 1, day: 14,
    title: "AlphaFold 4",
    shortDescription: "Predicts dynamics, allosteric sites, and small-molecule binding modes.",
    longDescription:
      "AlphaFold 4 extends from static structure to protein dynamics, allosteric site prediction, and small-molecule binding modes. Released via the AlphaFold Server with non-commercial use under the existing terms.",
    category: "product", fate: "active",
    family: "research", lab: "Google DeepMind", buzz: 69,
    variantDesignation: "ACTIVE-2026-AF4-R40",
    sources: [{ label: "DeepMind blog", url: "https://deepmind.google/" }],
  },
  {
    id: "windsurf-1-2026-01",
    year: 2026, month: 1, day: 8,
    title: "Windsurf 1.0 (Codeium)",
    shortDescription: "Agentic IDE with 'Cascade' — full-codebase intent execution.",
    longDescription:
      "Codeium rebranded its IDE as Windsurf and shipped Cascade — an agent that takes a high-level intent and executes across the codebase. Native Anthropic / OpenAI / DeepSeek model selection.",
    category: "product", fate: "active",
    family: "coding", lab: "Codeium", buzz: 64,
    variantDesignation: "ACTIVE-2026-WSF-R41",
    sources: [{ label: "Codeium blog", url: "https://codeium.com/blog" }],
  },
  {
    id: "kling-3-2026-01",
    year: 2026, month: 1, day: 17,
    title: "Kling 3",
    shortDescription: "Chinese video model — physically consistent 2-minute clips.",
    longDescription:
      "Kuaishou shipped Kling 3 with much-improved physical consistency, 2-minute clip length, and camera-control parameters. Available globally via a $10/mo subscription. Considered the strongest Chinese-market competitor to Veo and Sora.",
    category: "product", fate: "active",
    family: "image-video", lab: "Kuaishou", buzz: 61,
    variantDesignation: "ACTIVE-2026-KL3-R42",
    sources: [{ label: "Kling website", url: "https://kling.kuaishou.com/" }],
  },
  {
    id: "openai-sandbox-2026-01",
    year: 2026, month: 1, day: 28,
    title: "OpenAI Sandbox",
    shortDescription: "Isolated code execution for ChatGPT and Assistants — Python + Node + Rust.",
    longDescription:
      "OpenAI Sandbox is a managed isolated code-execution environment for ChatGPT and the Assistants API. Supports Python, Node, and Rust; persistent file storage per thread; outbound network controls.",
    category: "product", fate: "active",
    family: "infra", lab: "OpenAI", buzz: 57,
    variantDesignation: "ACTIVE-2026-SBX-R43",
    sources: [{ label: "OpenAI announcement", url: "https://openai.com/" }],
  },

  // ─────────────── December 2025 ───────────────
  {
    id: "google-veo-2-2025-12",
    year: 2025, month: 12, day: 4,
    title: "Google Veo 2",
    shortDescription: "First Veo with cinematic camera control and physics-aware motion.",
    longDescription:
      "Veo 2 launched with cinematic camera-control parameters and physics-aware motion. 30-second clips at 1080p, with a 4K mode for Vertex customers. Set the bar Sora 2 and Kling 3 chased.",
    category: "product", fate: "active",
    family: "image-video", lab: "Google DeepMind", buzz: 80,
    variantDesignation: "ACTIVE-2025-VEO2-R44",
    sources: [{ label: "Google blog", url: "https://blog.google/" }],
  },
  {
    id: "nous-hermes-4-2025-12",
    year: 2025, month: 12, day: 16,
    title: "Nous Hermes 4",
    shortDescription: "Frontier open-weights fine-tune — strong on uncensored research use.",
    longDescription:
      "Nous shipped Hermes 4 — fine-tunes of Llama 4 Maverick and DeepSeek V4 with strong instruction-following, multi-turn coherence, and 'unrestricted' research behavior. Apache-2.0 + base model licenses.",
    category: "product", fate: "active",
    family: "llm", lab: "Nous Research", buzz: 52,
    variantDesignation: "ACTIVE-2025-NH4-R45",
    sources: [{ label: "Nous Research", url: "https://nousresearch.com/" }],
  },
  {
    id: "anthropic-claude-skills-2025-12",
    year: 2025, month: 12, day: 9,
    title: "Anthropic Skills",
    shortDescription: "Reusable, composable expertise packets for Claude — official + community.",
    longDescription:
      "Skills are reusable expertise packets — instructions + resources Claude loads on demand. Anthropic launched an official library (xlsx, pptx, pdf, frontend-design, etc.) and opened community publishing.",
    category: "product", fate: "active",
    family: "agent", lab: "Anthropic", buzz: 71,
    variantDesignation: "ACTIVE-2025-SKL-R46",
    sources: [{ label: "Anthropic blog", url: "https://www.anthropic.com/" }],
  },
  {
    id: "openai-shopping-2025-12",
    year: 2025, month: 12, day: 18,
    title: "ChatGPT Shopping",
    shortDescription: "Native commerce inside ChatGPT — Stripe + Shopify checkout.",
    longDescription:
      "OpenAI shipped ChatGPT Shopping: structured product results inside conversations, with checkout handled via Stripe / Shopify partner integrations. No paid placement at launch; ranking 'based on relevance'.",
    category: "product", fate: "active",
    family: "agent", lab: "OpenAI", buzz: 67,
    variantDesignation: "ACTIVE-2025-CSP-R47",
    sources: [{ label: "OpenAI announcement", url: "https://openai.com/" }],
  },

  // ─────────────── November 2025 ───────────────
  {
    id: "google-gemini-2-5-deepthink-2025-11",
    year: 2025, month: 11, day: 12,
    title: "Gemini 2.5 Deep Think",
    shortDescription: "Reasoning-tier Gemini — IMO gold-medal performance, 1M context.",
    longDescription:
      "Gemini 2.5 Deep Think extended test-time compute via parallel reasoning chains. Reported gold-medal performance on the 2025 International Mathematical Olympiad. Available via AI Studio and the Gemini app for Pro subscribers.",
    category: "product", fate: "active",
    family: "llm", lab: "Google DeepMind", buzz: 82,
    variantDesignation: "ACTIVE-2025-G25DT-R48",
    sources: [{ label: "Google blog", url: "https://blog.google/" }],
  },
  {
    id: "anthropic-claude-sonnet-4-6-2025-11",
    year: 2025, month: 11, day: 6,
    title: "Claude Sonnet 4.6",
    shortDescription: "Anthropic's mid-tier — SoTA on SWE-bench Verified at release.",
    longDescription:
      "Sonnet 4.6 led SWE-bench Verified at release (72.5%) and brought improvements to long-horizon tool use. Quickly became the default coding model for Cursor, Windsurf, and Claude Code.",
    category: "product", fate: "active", nexus: true,
    family: "llm", lab: "Anthropic", buzz: 92,
    variantDesignation: "ACTIVE-2025-SON46-R49",
    sources: [{ label: "Anthropic blog", url: "https://www.anthropic.com/" }],
  },
  {
    id: "openai-signin-2025-11",
    year: 2025, month: 11, day: 19,
    title: "Sign in with ChatGPT",
    shortDescription: "OAuth-style identity provider for third-party apps.",
    longDescription:
      "OpenAI shipped Sign in with ChatGPT — an OAuth-style identity provider letting third-party apps authenticate users with their ChatGPT account. Adds an API for apps to request specific scopes (memory, files, etc.).",
    category: "product", fate: "active",
    family: "infra", lab: "OpenAI", buzz: 59,
    variantDesignation: "ACTIVE-2025-SWC-R50",
    sources: [{ label: "OpenAI", url: "https://openai.com/" }],
  },
  {
    id: "harvey-2-2025-11",
    year: 2025, month: 11, day: 25,
    title: "Harvey 2.0",
    shortDescription: "Legal AI platform raises $500M Series E at a $5B valuation.",
    longDescription:
      "Harvey 2.0 introduced agent workflows for litigation, M&A, and compliance. Raised a $500M Series E at a reported $5B valuation, signaling enterprise legal AI as a category leader market.",
    category: "product", fate: "active",
    family: "agent", lab: "Harvey", buzz: 48,
    variantDesignation: "ACTIVE-2025-HRV2-R51",
    sources: [{ label: "Harvey blog", url: "https://www.harvey.ai/" }],
  },

  // ─────────────── October 2025 ───────────────
  {
    id: "openai-o3-2025-10",
    year: 2025, month: 10, day: 9,
    title: "OpenAI o3",
    shortDescription: "Reasoning-tier — 75% on FrontierMath, ARC-AGI breakthrough.",
    longDescription:
      "o3 set a new bar for reasoning: 75% on FrontierMath, 87.5% on ARC-AGI (above the 'human' threshold), and SoTA on SWE-bench Verified. Validated the test-time-compute paradigm as a path beyond pre-training.",
    category: "product", fate: "trunk", nexus: true,
    family: "llm", lab: "OpenAI", buzz: 97,
    variantDesignation: "TRUNK-2025-O3-R52",
    sources: [{ label: "OpenAI o3", url: "https://openai.com/" }],
  },
  {
    id: "nvidia-blackwell-ultra-2025-10",
    year: 2025, month: 10, day: 21,
    title: "NVIDIA Blackwell Ultra (B300)",
    shortDescription: "Mid-cycle refresh — 1.5× HBM and 50% more FP4 over B200.",
    longDescription:
      "Blackwell Ultra (B300) shipped as a mid-cycle refresh of Blackwell with 1.5× HBM capacity, 50% more FP4 throughput, and refreshed NVL72 racks. Cloud allocations went to OpenAI, Anthropic, Meta, and Google.",
    category: "hardware", fate: "active",
    family: "hardware", lab: "NVIDIA", buzz: 73,
    variantDesignation: "ACTIVE-2025-B300-R53",
    sources: [{ label: "NVIDIA newsroom", url: "https://nvidianews.nvidia.com/" }],
  },
  {
    id: "amazon-bedrock-agents-2-2025-10",
    year: 2025, month: 10, day: 14,
    title: "Bedrock Agents 2.0",
    shortDescription: "AWS unifies the Bedrock + Q agent runtimes; ships multi-agent orchestration.",
    longDescription:
      "Amazon merged the Bedrock Agents and Q runtimes into a unified surface and added multi-agent orchestration, with hand-off planning and shared memory. Native MCP support.",
    category: "product", fate: "active",
    family: "infra", lab: "AWS", buzz: 54,
    variantDesignation: "ACTIVE-2025-BED2-R54",
    sources: [{ label: "AWS blog", url: "https://aws.amazon.com/blogs/" }],
  },
  {
    id: "01-ai-yi-vision-2025-10",
    year: 2025, month: 10, day: 28,
    title: "Yi-Vision (01.AI)",
    shortDescription: "Long-context vision model — analyses 4-hour videos in a single pass.",
    longDescription:
      "Yi-Vision is a multimodal model that ingests 4-hour videos in a single pass via efficient temporal pooling. Strong scores on Video-MME and LongVideoBench; open weights for research use.",
    category: "product", fate: "active",
    family: "llm", lab: "01.AI", buzz: 47,
    variantDesignation: "ACTIVE-2025-YIVS-R55",
    sources: [{ label: "01.AI", url: "https://www.01.ai/" }],
  },
];
