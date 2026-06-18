// Hand-authored AI timeline (1956-2026). Every event has at least one source.

export type Category = "foundational" | "product" | "abandoned" | "policy" | "hardware";

export type BranchFate = "trunk" | "active" | "pruned" | "rejoined" | "constrains";

/** Coarse buckets used by Pulse for filtering. */
export type Family =
  | "llm"
  | "image-video"
  | "agent"
  | "coding"
  | "robotics"
  | "infra"
  | "hardware"
  | "policy"
  | "research";

export interface Source {
  label: string;
  url: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  /** Day of month — only required for items meant to appear in Pulse. */
  day?: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: Category;
  fate: BranchFate;
  nexus?: boolean;
  variantDesignation: string;
  branchFrom?: string;
  rejoinAt?: string;
  pruneYear?: number;
  sources: Source[];
  /** Family bucket (Pulse). */
  family?: Family;
  /** Lab/vendor that shipped this. */
  lab?: string;
  /** Buzz score 0-100; higher = more attention. Used to rank Pulse cards. */
  buzz?: number;
}

export const EVENTS: TimelineEvent[] = [
  // --- 1950s ---
  {
    id: "dartmouth-1956",
    year: 1956,
    month: 7,
    title: "Dartmouth Workshop",
    shortDescription: "The summer research project that coined the term 'artificial intelligence'.",
    longDescription:
      "John McCarthy, Marvin Minsky, Claude Shannon, and Nathaniel Rochester organized a two-month workshop at Dartmouth College that proposed 'every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it.' The workshop is widely cited as the founding event of AI as a research field.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-1956-DRT-000",
    sources: [
      { label: "Dartmouth College: The Dartmouth Summer Research Project", url: "https://home.dartmouth.edu/about/artificial-intelligence-ai-coined-dartmouth" },
    ],
  },
  {
    id: "perceptron-1957",
    year: 1957,
    title: "Perceptron",
    shortDescription: "Frank Rosenblatt's single-layer neural network learns to classify inputs.",
    longDescription:
      "Frank Rosenblatt at the Cornell Aeronautical Laboratory built the Mark I Perceptron, hardware that learned weights via a simple error-correction rule. It could recognize simple visual patterns and was the first learning algorithm proven to converge on a separating hyperplane. The work seeded the connectionist tradition and, decades later, deep learning.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-1957-PCT-001",
    sources: [
      { label: "Wikipedia: Perceptron", url: "https://en.wikipedia.org/wiki/Perceptron" },
    ],
  },
  {
    id: "symbolic-ai-1956",
    year: 1956,
    title: "Symbolic AI / GOFAI",
    shortDescription: "Reasoning as symbol manipulation; dominates AI research for two decades.",
    longDescription:
      "The 'Good Old-Fashioned AI' (GOFAI) program held that intelligence is rule-based symbol manipulation. Logic Theorist, General Problem Solver, and SHRDLU exemplified the approach. The program produced deep results in formal reasoning but struggled to scale to noisy real-world inputs, eventually being displaced by statistical and neural methods.",
    category: "abandoned",
    fate: "pruned",
    pruneYear: 1990,
    variantDesignation: "BRANCH-1956-SYM-001",
    branchFrom: "dartmouth-1956",
    sources: [
      { label: "Stanford Encyclopedia of Philosophy: GOFAI", url: "https://plato.stanford.edu/entries/go-fai/" },
    ],
  },

  // --- 1960s ---
  {
    id: "expert-systems-1965",
    year: 1965,
    title: "Expert Systems",
    shortDescription: "Encode human expertise as IF-THEN rules; power the first commercial AI wave.",
    longDescription:
      "Edward Feigenbaum, Bruce Buchanan, and Nobel laureate Joshua Lederberg began DENDRAL at Stanford, the first expert system, to infer molecular structures from mass spectra. Subsequent systems like MYCIN (medical diagnosis) and XCON (Digital Equipment Corp configuration) showed commercial promise but proved brittle, expensive to maintain, and unable to learn.",
    category: "abandoned",
    fate: "pruned",
    pruneYear: 1995,
    variantDesignation: "BRANCH-1965-EXP-002",
    branchFrom: "perceptron-1957",
    sources: [
      { label: "Wikipedia: Expert system", url: "https://en.wikipedia.org/wiki/Expert_system" },
    ],
  },
  {
    id: "backprop-1986",
    year: 1986,
    month: 10,
    title: "Backpropagation",
    shortDescription: "Rumelhart, Hinton & Williams show multi-layer nets can be trained by gradient descent.",
    longDescription:
      "The 1986 paper 'Learning representations by back-propagating errors' demonstrated that the chain rule could efficiently compute gradients through multi-layer networks, making deep learning tractable. The technique, known in control theory since the 1970s, became the workhorse algorithm of modern neural networks and remains so today.",
    category: "foundational",
    fate: "trunk",
    nexus: false,
    variantDesignation: "TRUNK-1986-BP-003",
    sources: [
      { label: "Nature: A 'credit assignment' problem (Rumelhart, Hinton, Williams)", url: "https://www.nature.com/articles/323533a0" },
    ],
  },

  // --- 1990s ---
  {
    id: "lstm-1997",
    year: 1997,
    month: 11,
    title: "LSTM",
    shortDescription: "Hochreiter & Schmidhuber's Long Short-Term Memory solves the vanishing gradient problem.",
    longDescription:
      "Long Short-Term Memory networks introduced a gated cell that could maintain information over thousands of timesteps. LSTMs powered speech recognition, machine translation, and handwriting recognition through the 2010s and remain a baseline for sequential modeling. The Transformer eventually displaced them for most language tasks, but the underlying ideas of gating live on in modern architectures.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-1997-LSTM-004",
    sources: [
      { label: "Original LSTM paper (Hochreiter & Schmidhuber, 1997)", url: "https://www.bioinf.jku.at/publications/older/2604.pdf" },
    ],
  },
  {
    id: "cyc-1994",
    year: 1994,
    title: "Cyc",
    shortDescription: "Hand-coded commonsense knowledge base. A 30+ year project that never generalized.",
    longDescription:
      "Douglas Lenat's Cyc project attempted to encode commonsense knowledge as logical assertions, eventually growing to over 25 million rules. Despite enormous investment, Cyc never produced a system that could reason robustly about novel situations, and is often cited as a cautionary tale about the limits of hand-engineered knowledge.",
    category: "abandoned",
    fate: "pruned",
    pruneYear: 2010,
    variantDesignation: "BRANCH-1994-CYC-005",
    branchFrom: "symbolic-ai-1956",
    sources: [
      { label: "Cycorp: About Cyc", url: "https://cyc.com/cyc/overview" },
    ],
  },

  // --- 2000s ---
  {
    id: "deep-belief-2006",
    year: 2006,
    title: "Deep Belief Networks",
    shortDescription: "Hinton's greedy layer-wise pretraining rekindles interest in deep learning.",
    longDescription:
      "Geoffrey Hinton, Simon Osindero, and Yee-Whye Teh showed that deep neural networks could be trained one layer at a time using restricted Boltzmann machines. The paper is widely credited with launching the modern 'deep learning' era, just before the data and compute caught up.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-2006-DBN-006",
    sources: [
      { label: "Hinton, Osindero, Teh (2006) - Science", url: "https://www.cs.toronto.edu/~hinton/absps/fastnc.pdf" },
    ],
  },
  {
    id: "imagenet-2009",
    year: 2009,
    title: "ImageNet",
    shortDescription: "Deng & Fei-Fei release 3.2M labeled images. The benchmark that launched the deep learning arms race.",
    longDescription:
      "Fei-Fei Li's group at Princeton published ImageNet, a dataset of over 3.2 million labeled images organized into 5,247 categories, built on the backbone of WordNet. The accompanying ImageNet Large Scale Visual Recognition Challenge (ILSVRC) became the de facto benchmark for computer vision, and the dramatic error-rate drops in 2012 reshaped the field.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-2009-IMG-007",
    sources: [
      { label: "ImageNet paper (Deng et al., 2009)", url: "https://www.image-net.org/papers/imagenet_cvpr09.pdf" },
    ],
  },

  // --- 2010s ---
  {
    id: "alexnet-2012",
    year: 2012,
    month: 9,
    title: "AlexNet",
    shortDescription: "Krizhevsky, Sutskever & Hinton crush ImageNet with a GPU-trained CNN. The deep learning moment.",
    longDescription:
      "AlexNet's eight-layer convolutional network cut the ILSVRC top-5 error rate from 26% to 15.3%, an unprecedented leap. The team trained it on two Nvidia GTX 580 GPUs for about a week. The result triggered the deep learning revolution: within two years, every serious vision team had switched to neural networks.",
    category: "foundational",
    fate: "trunk",
    nexus: true,
    variantDesignation: "NEXUS-2012-ALX-008",
    sources: [
      { label: "AlexNet paper (Krizhevsky, Sutskever, Hinton, 2012)", url: "https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" },
    ],
  },
  {
    id: "deepmind-dqn-2013",
    year: 2013,
    month: 12,
    title: "DeepMind DQN",
    shortDescription: "Deep reinforcement learning masters Atari games from raw pixels.",
    longDescription:
      "DeepMind's 'Playing Atari with Deep Reinforcement Learning' showed that a single convolutional network trained with Q-learning could exceed human performance on many Atari 2600 games using only raw pixels and scores as input. The paper cemented deep RL as a frontier and contributed to Google's acquisition of DeepMind in 2014.",
    category: "foundational",
    fate: "active",
    variantDesignation: "BRANCH-2013-DQN-009",
    branchFrom: "alexnet-2012",
    sources: [
      { label: "DeepMind DQN paper (Mnih et al., 2013)", url: "https://arxiv.org/abs/1312.5602" },
    ],
  },
  {
    id: "word2vec-2013",
    year: 2013,
    month: 10,
    title: "Word2Vec",
    shortDescription: "Mikolov's distributed word embeddings capture semantics through vector arithmetic.",
    longDescription:
      "Tomas Mikolov and colleagues at Google published two papers introducing the continuous bag-of-words and skip-gram architectures, which produced dense vector representations of words. The famous 'king - man + woman ≈ queen' example demonstrated that semantic relationships lived in linear subspaces. Word2Vec made embeddings a standard tool across NLP.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-2013-W2V-010",
    sources: [
      { label: "Word2Vec paper (Mikolov et al., 2013)", url: "https://arxiv.org/abs/1301.3781" },
    ],
  },
  {
    id: "seq2seq-2014",
    year: 2014,
    month: 6,
    title: "Seq2Seq",
    shortDescription: "Sutskever, Vinyals & Le's encoder-decoder model makes neural machine translation work.",
    longDescription:
      "The sequence-to-sequence architecture paired two LSTMs: an encoder that read a variable-length input into a fixed vector, and a decoder that generated the output. Combined with attention, the approach replaced phrase-based statistical machine translation within three years and seeded the encoder-decoder pattern used in modern Transformers.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-2014-S2S-011",
    sources: [
      { label: "Seq2Seq paper (Sutskever, Vinyals, Le, 2014)", url: "https://arxiv.org/abs/1409.3215" },
    ],
  },
  {
    id: "gan-2014",
    year: 2014,
    month: 6,
    title: "Generative Adversarial Networks",
    shortDescription: "Goodfellow's generator-vs-discriminator game produces the first convincing image synthesis.",
    longDescription:
      "Ian Goodfellow's GAN paper framed generative modeling as a two-player game between a generator and a discriminator, each improving the other. The architecture produced the first large-scale plausible image samples from neural networks, kicked off the generative modeling boom, and seeded StyleGAN, CycleGAN, BigGAN, and many more.",
    category: "foundational",
    fate: "rejoined",
    rejoinAt: "diffusion-2020",
    variantDesignation: "BRANCH-2014-GAN-012",
    branchFrom: "alexnet-2012",
    sources: [
      { label: "Original GAN paper (Goodfellow et al., 2014)", url: "https://arxiv.org/abs/1406.2661" },
    ],
  },
  {
    id: "alphago-2016",
    year: 2016,
    month: 3,
    title: "AlphaGo",
    shortDescription: "DeepMind's AlphaGo defeats Lee Sedol, 4-1. Reinforcement learning hits the cultural mainstream.",
    longDescription:
      "AlphaGo combined deep neural networks with Monte Carlo tree search and reinforcement learning from self-play. Its 4-1 victory over 18-time world champion Lee Sedol was a watershed moment for public perception of AI, and led directly to AlphaZero, which mastered chess and shogi from zero human knowledge.",
    category: "product",
    fate: "active",
    variantDesignation: "BRANCH-2016-AGZ-013",
    branchFrom: "deepmind-dqn-2013",
    sources: [
      { label: "DeepMind: AlphaGo", url: "https://deepmind.google/research/projects/alphago/" },
    ],
  },
  {
    id: "capsule-networks-2017",
    year: 2017,
    month: 10,
    title: "Capsule Networks",
    shortDescription: "Hinton's alternative to CNNs designed to encode spatial hierarchies. Did not scale.",
    longDescription:
      "Sara Sabour and Geoffrey Hinton's 'Dynamic Routing Between Capsules' proposed a new building block that preserved pose and part-whole relationships via vector activations. Despite an elegant theory, capsule networks proved hard to scale and were outperformed by well-tuned CNNs on standard benchmarks, and the approach faded from the mainstream.",
    category: "abandoned",
    fate: "pruned",
    pruneYear: 2021,
    variantDesignation: "BRANCH-2017-CAP-014",
    branchFrom: "alexnet-2012",
    sources: [
      { label: "Capsule Networks paper (Sabour & Hinton, 2017)", url: "https://arxiv.org/abs/1710.09829" },
    ],
  },
  {
    id: "transformer-2017",
    year: 2017,
    month: 6,
    title: "Attention Is All You Need",
    shortDescription: "Vaswani et al. introduce the Transformer. The architecture that defines modern AI.",
    longDescription:
      "Eight Google Brain authors proposed dropping recurrence and convolutions entirely, replacing them with multi-head self-attention. The Transformer trained faster, scaled better, and handled long-range dependencies more naturally than LSTMs. Within five years it dominated NLP, vision, speech, protein folding, and code. The paper is the single most influential AI paper of the 2010s.",
    category: "foundational",
    fate: "trunk",
    nexus: true,
    variantDesignation: "NEXUS-2017-ATN-015",
    sources: [
      { label: "Attention Is All You Need (Vaswani et al., 2017)", url: "https://arxiv.org/abs/1706.03762" },
    ],
  },
  {
    id: "bert-2018",
    year: 2018,
    month: 10,
    title: "BERT",
    shortDescription: "Bidirectional pretraining via masked language modeling. The 'pre-train, then fine-tune' era.",
    longDescription:
      "Google's BERT (Bidirectional Encoder Representations from Transformers) showed that masked language modeling on large unlabeled corpora produced representations that could be fine-tuned to state of the art on a wide range of NLP tasks with very small task-specific modifications. The pattern dominated NLP until decoder-only generative models took over.",
    category: "product",
    fate: "trunk",
    variantDesignation: "TRUNK-2018-BRT-016",
    branchFrom: "transformer-2017",
    sources: [
      { label: "BERT paper (Devlin et al., 2018)", url: "https://arxiv.org/abs/1810.04805" },
    ],
  },
  {
    id: "gpt-2-2019",
    year: 2019,
    month: 2,
    title: "GPT-2",
    shortDescription: "OpenAI demonstrates surprisingly coherent text generation. The staged-release debate begins.",
    longDescription:
      "GPT-2's 1.5B-parameter autoregressive Transformer produced text often indistinguishable from human writing. OpenAI's decision to withhold the full model under a 'staged release' strategy sparked widespread debate about responsible disclosure of powerful AI, and prefigured later policy discussions.",
    category: "product",
    fate: "trunk",
    variantDesignation: "TRUNK-2019-GPT2-017",
    branchFrom: "transformer-2017",
    sources: [
      { label: "GPT-2 paper (Radford et al., 2019)", url: "https://openai.com/index/better-language-models/" },
    ],
  },

  // --- 2020s ---
  {
    id: "alphafold-2020",
    year: 2020,
    month: 11,
    title: "AlphaFold 2",
    shortDescription: "DeepMind's AlphaFold 2 wins CASP14, solving protein structure prediction.",
    longDescription:
      "AlphaFold 2's combination of attention, evolutionary signals, and end-to-end geometric reasoning predicted protein structures to near-experimental accuracy. The release of the predicted structures for over 200 million proteins via the AlphaFold DB transformed structural biology virtually overnight.",
    category: "product",
    fate: "active",
    variantDesignation: "BRANCH-2020-AF2-018",
    branchFrom: "alphago-2016",
    sources: [
      { label: "DeepMind: AlphaFold", url: "https://deepmind.google/discover/blog/alphafold-a-solution-to-a-50-year-old-grand-challenge-in-biology/" },
    ],
  },
  {
    id: "gpt-3-2020",
    year: 2020,
    month: 5,
    title: "GPT-3",
    shortDescription: "175B parameters. Few-shot in-context learning emerges as a capability.",
    longDescription:
      "OpenAI's GPT-3 scaled the decoder Transformer to 175B parameters and showed that simply conditioning on a few examples in the prompt could solve many tasks at near-fine-tuned quality, without any gradient updates. The paper made 'prompting' a verb and launched the LLM era.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-2020-GPT3-019",
    branchFrom: "gpt-2-2019",
    sources: [
      { label: "GPT-3 paper (Brown et al., 2020)", url: "https://arxiv.org/abs/2005.14165" },
    ],
  },
  {
    id: "diffusion-2020",
    year: 2020,
    month: 5,
    title: "DDPM Diffusion Models",
    shortDescription: "Ho et al. revive diffusion for image generation. Beats GANs on FID.",
    longDescription:
      "Jonathan Ho, Ajay Jain, and Pieter Abbeel's 'Denoising Diffusion Probabilistic Models' (DDPM) demonstrated that iteratively denoising Gaussian noise could match or exceed GANs on image synthesis quality, with more stable training. Latent diffusion (Stable Diffusion, 2022) and DALL-E 2 brought the technique to consumers.",
    category: "product",
    fate: "rejoined",
    rejoinAt: "multimodal-2023",
    variantDesignation: "BRANCH-2020-DIF-020",
    branchFrom: "gan-2014",
    sources: [
      { label: "DDPM paper (Ho, Jain, Abbeel, 2020)", url: "https://arxiv.org/abs/2006.11239" },
    ],
  },
  {
    id: "tpu-v4-2021",
    year: 2021,
    month: 6,
    title: "TPU v4",
    shortDescription: "Google's TPU v4 chips accelerate large model training. Hardware becomes the moat.",
    longDescription:
      "Google's TPU v4 pods delivered roughly 1 exaflop of mixed-precision compute per pod, with optical circuit switches enabling flexible topology. The chips powered the training of PaLM, Gemini, and Imagen, and made infrastructure a key strategic asset for frontier model labs.",
    category: "hardware",
    fate: "active",
    variantDesignation: "BRANCH-2021-HW-021",
    branchFrom: "gpt-3-2020",
    sources: [
      { label: "Google: TPU v4 announcement", url: "https://cloud.google.com/blog/topics/systems/tpu-v4-launched" },
    ],
  },
  {
    id: "pure-rl-agi-2020",
    year: 2020,
    title: "Pure RL for AGI",
    shortDescription: "Hope that reward maximization alone yields general intelligence. Pruned by 2024.",
    longDescription:
      "Through the late 2010s, a school of thought held that scale and reward signal design would produce AGI without supervised fine-tuning or explicit reasoning structures. The position was influential in funding decisions and benchmarks (e.g., Gato) but was largely abandoned for language understanding once instruction tuning and RLHF proved far more effective.",
    category: "abandoned",
    fate: "pruned",
    pruneYear: 2024,
    variantDesignation: "BRANCH-2020-RL-022",
    branchFrom: "deepmind-dqn-2013",
    sources: [
      { label: "DeepMind Gato (2022)", url: "https://arxiv.org/abs/2205.06175" },
    ],
  },
  {
    id: "rlhf-2022",
    year: 2022,
    month: 3,
    title: "RLHF / InstructGPT",
    shortDescription: "Reinforcement Learning from Human Feedback aligns models to follow instructions.",
    longDescription:
      "Ouyang et al. at OpenAI described a three-step pipeline: supervised fine-tuning on human demonstrations, training a reward model from human preferences, and optimizing the policy with PPO. InstructGPT (1.3B) was preferred by human raters to the 100x-larger GPT-3. RLHF became the foundation of modern alignment.",
    category: "foundational",
    fate: "rejoined",
    rejoinAt: "chatgpt-2022",
    variantDesignation: "BRANCH-2022-RLHF-023",
    branchFrom: "gpt-3-2020",
    sources: [
      { label: "InstructGPT paper (Ouyang et al., 2022)", url: "https://arxiv.org/abs/2203.02155" },
    ],
  },
  {
    id: "chatgpt-2022",
    year: 2022,
    month: 11,
    title: "ChatGPT",
    shortDescription: "OpenAI releases a free chat interface. AI enters the cultural mainstream at scale.",
    longDescription:
      "On November 30, 2022, OpenAI launched ChatGPT, a fine-tuned GPT-3.5 model exposed via a conversational web UI. It reached 1 million users in five days and 100 million within two months, becoming the fastest-growing consumer application in history. The launch triggered the modern generative AI investment cycle and a wave of competing products.",
    category: "product",
    fate: "trunk",
    nexus: true,
    variantDesignation: "NEXUS-2022-CHT-024",
    branchFrom: "gpt-3-2020",
    sources: [
      { label: "OpenAI: Introducing ChatGPT", url: "https://openai.com/index/chatgpt/" },
    ],
  },
  {
    id: "llama-2023",
    year: 2023,
    month: 2,
    title: "LLaMA & Open-Source LLMs",
    shortDescription: "Meta's LLaMA leaks and ignites the open-weights LLM movement.",
    longDescription:
      "Meta released LLaMA, a family of open-weights foundation models from 7B to 65B parameters, intended for research. Within weeks, the weights were leaked and the open-source community rapidly produced derivative models (Alpaca, Vicuna, WizardLM, and eventually Llama 2, Mistral, Qwen). Open weights became a permanent feature of the AI landscape.",
    category: "product",
    fate: "active",
    variantDesignation: "BRANCH-2023-OS-025",
    branchFrom: "chatgpt-2022",
    sources: [
      { label: "Meta AI: LLaMA announcement", url: "https://ai.meta.com/blog/large-language-model-llama-meta-ai/" },
    ],
  },
  {
    id: "gpt4-2023",
    year: 2023,
    month: 3,
    title: "GPT-4",
    shortDescription: "OpenAI ships GPT-4: a multimodal model that passes the bar exam in the 90th percentile.",
    longDescription:
      "GPT-4, released on March 14, 2023, accepted images and text as input. OpenAI's technical report described performance at or above human levels on a wide range of professional and academic benchmarks, including a simulated bar exam in the 90th percentile. It was the first widely deployed frontier model and set a new bar for capability.",
    category: "product",
    fate: "trunk",
    nexus: true,
    variantDesignation: "NEXUS-2023-GPT4-026",
    branchFrom: "chatgpt-2022",
    sources: [
      { label: "OpenAI: GPT-4 Technical Report", url: "https://arxiv.org/abs/2303.08774" },
    ],
  },
  {
    id: "moe-2023",
    year: 2023,
    month: 12,
    title: "Mixture-of-Experts Returns",
    shortDescription: "Mixtral 8x7B and Gemini 1.0 show sparse MoE scales better than dense models.",
    longDescription:
      "Sparse Mixture-of-Experts models, popular in the 1990s and abandoned for training instability, returned with new routing schemes and scale. Mistral's Mixtral 8x7B (December 2023) and Google's Gemini 1.0 (also MoE) showed that conditionally activating a few expert sub-networks per token dramatically improved compute efficiency at frontier scale.",
    category: "foundational",
    fate: "rejoined",
    rejoinAt: "multimodal-2023",
    variantDesignation: "BRANCH-2023-MOE-027",
    branchFrom: "gpt-3-2020",
    sources: [
      { label: "Mixtral 8x7B paper (Mistral AI, 2023)", url: "https://arxiv.org/abs/2401.04088" },
    ],
  },
  {
    id: "eu-ai-act-2024",
    year: 2024,
    month: 8,
    title: "EU AI Act",
    shortDescription: "The first comprehensive horizontal regulation of AI. The 'constrains' branch is born.",
    longDescription:
      "The European Union's AI Act, formally adopted in 2024, became the world's first comprehensive horizontal law regulating AI systems. It introduced a risk-based classification (unacceptable, high, limited, minimal) with obligations for transparency, data governance, and human oversight. It constrains the trunk without pruning it, requiring systemic-risk evaluation for the largest models.",
    category: "policy",
    fate: "constrains",
    variantDesignation: "CONSTRAINT-2024-REG-028",
    branchFrom: "chatgpt-2022",
    sources: [
      { label: "European Commission: AI Act", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
    ],
  },
  {
    id: "multimodal-2023",
    year: 2023,
    month: 9,
    title: "Multimodal Agents",
    shortDescription: "GPT-4V and Gemini bring vision into foundation models. The agent era begins.",
    longDescription:
      "GPT-4V (vision) and Google's Gemini 1.0 (natively multimodal) integrated images, audio, and text into a single model. Combined with tool use and chain-of-thought, these models powered the first generation of agentic systems capable of browsing the web, writing code, and operating computers.",
    category: "product",
    fate: "trunk",
    nexus: true,
    variantDesignation: "NEXUS-2023-MM-029",
    branchFrom: "gpt4-2023",
    sources: [
      { label: "Google: Gemini", url: "https://deepmind.google/technologies/gemini/" },
    ],
  },
  {
    id: "robotics-2024",
    year: 2024,
    month: 2,
    title: "Embodied / Robotics AI",
    shortDescription: "Foundation models meet robots. RT-2, Figure 01, Optimus Gen 2.",
    longDescription:
      "Google DeepMind's RT-2 showed that vision-language-action models trained on internet-scale data could be turned directly into robot policies. Figure AI's humanoid demos and Tesla's Optimus Gen 2 brought the embodied-AI story into mainstream coverage, suggesting that the same scaling laws that produced LLMs may produce generalist robots.",
    category: "product",
    fate: "active",
    variantDesignation: "BRANCH-2024-ROB-030",
    branchFrom: "multimodal-2023",
    sources: [
      { label: "DeepMind: RT-2", url: "https://robotics-transformer2.github.io/" },
    ],
  },
  {
    id: "reasoning-2024",
    year: 2024,
    month: 9,
    title: "Reasoning Models (o1)",
    shortDescription: "OpenAI o1 demonstrates test-time compute scaling. A new axis of progress.",
    longDescription:
      "OpenAI's o1 (September 2024) and the o-series that followed scaled 'thinking time' rather than raw parameters, training with reinforcement learning over chain-of-thought traces. The models dramatically improved performance on math, code, and science benchmarks, establishing a second axis of progress: scaling compute at inference time, not just training time.",
    category: "product",
    fate: "trunk",
    variantDesignation: "TRUNK-2024-RSN-031",
    branchFrom: "multimodal-2023",
    sources: [
      { label: "OpenAI: Learning to Reason with LLMs", url: "https://openai.com/index/learning-to-reason-with-llms/" },
    ],
  },
  {
    id: "agentic-2025",
    year: 2025,
    month: 1,
    title: "Agentic AI Inflection",
    shortDescription: "Tool-using autonomous agents become deployable products.",
    longDescription:
      "By early 2025, the combination of reasoning models, computer-use APIs, and tool-calling protocols converged into a deployable product category. Anthropic's Claude with computer use, OpenAI's Operator, and a wave of coding agents (Devin, Cursor, Claude Code) reached reliability levels sufficient for limited autonomous task completion.",
    category: "product",
    fate: "trunk",
    nexus: true,
    variantDesignation: "NEXUS-2025-AGT-032",
    branchFrom: "reasoning-2024",
    sources: [
      { label: "Anthropic: Computer use", url: "https://www.anthropic.com/news/3-5-models-and-computer-use" },
    ],
  },
  {
    id: "frontier-act-2025",
    year: 2025,
    month: 6,
    title: "US Frontier Model Safety Policy",
    shortDescription: "Federal posture crystallizes: voluntary commitments, compute thresholds, export controls.",
    longDescription:
      "The US government's 2025 AI policy posture combined voluntary safety commitments from frontier labs, mandatory reporting for models trained above defined compute thresholds, and tightened export controls on advanced GPUs. Together with the EU AI Act, this layer of policy visibly constrains the trajectory of the trunk without arresting it.",
    category: "policy",
    fate: "constrains",
    variantDesignation: "CONSTRAINT-2025-POL-033",
    branchFrom: "eu-ai-act-2024",
    sources: [
      { label: "White House: AI Executive Orders", url: "https://www.whitehouse.gov/presidential-actions/2025/01/advancing-united-states-leadership-in-artificial-intelligence-infrastructure/" },
    ],
  },
  {
    id: "present-2026",
    year: 2026,
    month: 6,
    title: "Present Day",
    shortDescription: "Frontier models, deployed agents, and an emerging regulatory layer. The mainline continues into uncharted territory.",
    longDescription:
      "As of mid-2026, the canonical lineage of modern AI — from the 1957 perceptron through Transformer-based foundation models, RLHF alignment, multimodal agents, and test-time-compute reasoning — runs in production at planetary scale. The mainline continues. New branches fork off every week. Beyond this point, the map is blank.",
    category: "foundational",
    fate: "trunk",
    variantDesignation: "TRUNK-2026-PRES-034",
    branchFrom: "agentic-2025",
    sources: [
      { label: "Stanford AI Index 2026", url: "https://aiindex.stanford.edu/report/" },
    ],
  },

  // --- Minor expeditions: smaller landmarks added so the map reads densely. ---

  {
    id: "eliza-1966",
    year: 1966,
    title: "ELIZA",
    shortDescription: "Joseph Weizenbaum's pattern-matching chatbot that fooled users into believing it understood them.",
    longDescription:
      "ELIZA, written by Joseph Weizenbaum at MIT, simulated a Rogerian psychotherapist by reflecting user inputs back as questions. It had no real understanding, but users famously confided in it — a result so disturbing to Weizenbaum that he later wrote 'Computer Power and Human Reason' warning against anthropomorphising machines.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-1966-ELZ-A01",
    branchFrom: "dartmouth-1956",
    sources: [
      { label: "Weizenbaum: ELIZA (Communications of the ACM, 1966)", url: "https://dl.acm.org/doi/10.1145/365153.365168" },
    ],
  },
  {
    id: "ai-winter-1974",
    year: 1974,
    title: "First AI Winter",
    shortDescription: "The Lighthill Report and DARPA cutbacks freeze government AI funding for years.",
    longDescription:
      "James Lighthill's 1973 report to the UK Science Research Council concluded that AI had failed to deliver on its promises, particularly in machine translation and combinatorial search. Combined with DARPA's withdrawal from speech understanding research, the report triggered a sharp drop in AI funding across the Anglophone world that lasted into the early 1980s.",
    category: "abandoned",
    fate: "pruned",
    pruneYear: 1980,
    variantDesignation: "PRUNED-1974-WIN-A02",
    branchFrom: "expert-systems-1965",
    sources: [
      { label: "Lighthill Report (1973)", url: "https://en.wikipedia.org/wiki/Lighthill_report" },
    ],
  },
  {
    id: "mycin-1976",
    year: 1976,
    title: "MYCIN",
    shortDescription: "A Stanford expert system that diagnosed bacterial infections better than junior doctors.",
    longDescription:
      "MYCIN, developed at Stanford by Edward Shortliffe, used a rule-based inference engine and certainty factors to recommend antibiotic treatments. It outperformed human residents in trials but was never deployed clinically because of liability concerns. MYCIN's separation of knowledge base from inference engine became the template for expert-system shells.",
    category: "product",
    fate: "rejoined",
    rejoinAt: "expert-systems-1965",
    variantDesignation: "REJOINED-1976-MYC-A03",
    branchFrom: "expert-systems-1965",
    sources: [
      { label: "Wikipedia: MYCIN", url: "https://en.wikipedia.org/wiki/Mycin" },
    ],
  },
  {
    id: "fifth-generation-1982",
    year: 1982,
    title: "Japan's Fifth Generation Project",
    shortDescription: "An ambitious 10-year national program to build parallel logic-programming machines.",
    longDescription:
      "MITI's Fifth Generation Computer Systems project committed Japan to building massively parallel computers running Prolog. The US and Europe launched competing programs (the Strategic Computing Initiative, ESPRIT) in response. By 1992 the project had largely failed to produce its intended breakthroughs — the assumption that logic programming would scale to natural intelligence did not survive contact with real-world ambiguity.",
    category: "abandoned",
    fate: "pruned",
    pruneYear: 1992,
    variantDesignation: "PRUNED-1982-FGN-A04",
    branchFrom: "expert-systems-1965",
    sources: [
      { label: "Wikipedia: Fifth Generation Computer Systems", url: "https://en.wikipedia.org/wiki/Fifth_generation_computer" },
    ],
  },
  {
    id: "nettalk-1987",
    year: 1987,
    title: "NETtalk",
    shortDescription: "Sejnowski and Rosenberg's neural net that learned to pronounce English text.",
    longDescription:
      "NETtalk was a feedforward network with one hidden layer that learned to convert English text to phonemes. Its babbling-to-speech learning curve became one of the most famous demonstrations of connectionism in the 1980s and helped seed renewed interest in neural networks ahead of the deep-learning era.",
    category: "foundational",
    fate: "rejoined",
    rejoinAt: "backprop-1986",
    variantDesignation: "REJOINED-1987-NTK-A05",
    branchFrom: "backprop-1986",
    sources: [
      { label: "Sejnowski & Rosenberg: NETtalk (1987)", url: "https://papers.cnl.salk.edu/PDFs/Parallel%20Networks%20that%20Learn%20to%20Pronounce%20English%20Text%201987-3562.pdf" },
    ],
  },
  {
    id: "tdgammon-1992",
    year: 1992,
    title: "TD-Gammon",
    shortDescription: "Gerald Tesauro's backgammon player learned world-class play through self-play and TD-learning.",
    longDescription:
      "TD-Gammon used temporal-difference learning on a neural network value function, trained by playing millions of games against itself. By 1995 it played at the level of the world's best human players and changed expert backgammon theory. It was the first practical demonstration that self-play + reinforcement learning could exceed hand-coded systems.",
    category: "foundational",
    fate: "rejoined",
    rejoinAt: "alphago-2016",
    variantDesignation: "REJOINED-1992-TDG-A06",
    branchFrom: "backprop-1986",
    sources: [
      { label: "Tesauro: TD-Gammon (1995)", url: "https://www.bkgm.com/articles/tesauro/tdl.html" },
    ],
  },
  {
    id: "svm-1995",
    year: 1995,
    title: "Support Vector Machines",
    shortDescription: "Cortes and Vapnik's kernel methods dominate machine learning for a decade.",
    longDescription:
      "Support Vector Machines, formalised by Corinna Cortes and Vladimir Vapnik, combined a margin-maximising classifier with the kernel trick to handle nonlinear data. SVMs became the default classifier for text, vision, and biology applications until deep learning surpassed them after 2012.",
    category: "foundational",
    fate: "active",
    variantDesignation: "ACTIVE-1995-SVM-A07",
    branchFrom: "perceptron-1957",
    sources: [
      { label: "Cortes & Vapnik: Support-Vector Networks (1995)", url: "https://link.springer.com/article/10.1007/BF00994018" },
    ],
  },
  {
    id: "deepblue-1997",
    year: 1997,
    month: 5,
    title: "Deep Blue defeats Kasparov",
    shortDescription: "IBM's chess machine wins a six-game match against the reigning world champion.",
    longDescription:
      "IBM's Deep Blue, a custom 30-node parallel computer with chess-specific VLSI evaluators, defeated Garry Kasparov 3.5–2.5 in May 1997. It evaluated ~200 million positions per second using alpha-beta search with extensive opening books. Deep Blue was a tour de force of engineered search, not learning — the lesson AlphaGo would later invert.",
    category: "hardware",
    fate: "rejoined",
    rejoinAt: "alphago-2016",
    variantDesignation: "REJOINED-1997-DBL-A08",
    branchFrom: "expert-systems-1965",
    sources: [
      { label: "IBM: Deep Blue", url: "https://www.ibm.com/history/deep-blue" },
    ],
  },
  {
    id: "watson-2011",
    year: 2011,
    month: 2,
    title: "IBM Watson wins Jeopardy!",
    shortDescription: "IBM's question-answering system beats Ken Jennings and Brad Rutter on live TV.",
    longDescription:
      "Watson combined statistical NLP, an ensemble of question-answering algorithms, and a 16-terabyte knowledge corpus to win at Jeopardy! against the show's two best human champions. The system signalled that hybrid statistical methods could handle open-domain language tasks — five years before deep learning would absorb the rest of the field.",
    category: "product",
    fate: "rejoined",
    rejoinAt: "transformer-2017",
    variantDesignation: "REJOINED-2011-WTS-A09",
    branchFrom: "expert-systems-1965",
    sources: [
      { label: "IBM Research: Watson", url: "https://research.ibm.com/blog/watson-jeopardy" },
    ],
  },
  {
    id: "siri-2011",
    year: 2011,
    month: 10,
    title: "Siri ships on iPhone 4S",
    shortDescription: "Apple's voice assistant brings conversational AI to a billion phones.",
    longDescription:
      "Spun out of SRI's CALO project and acquired by Apple in 2010, Siri shipped with the iPhone 4S in October 2011. It was the first widely deployed consumer voice assistant and seeded the assistant arms race: Google Now (2012), Cortana (2014), Alexa (2014).",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2011-SRI-A10",
    branchFrom: "expert-systems-1965",
    sources: [
      { label: "Apple: Introducing Siri (2011)", url: "https://www.apple.com/newsroom/2011/10/04Apple-Launches-iPhone-4S-iOS-5-iCloud/" },
    ],
  },
  {
    id: "alphazero-2017",
    year: 2017,
    month: 12,
    title: "AlphaZero",
    shortDescription: "DeepMind's self-play system masters chess, shogi, and Go from zero knowledge.",
    longDescription:
      "AlphaZero learned chess, shogi, and Go to superhuman strength purely through self-play, with no opening books or endgame tables. It dethroned Stockfish in chess after just four hours of training. The result generalised the AlphaGo recipe and pointed at self-play as a path to capability that doesn't depend on human data.",
    category: "foundational",
    fate: "rejoined",
    rejoinAt: "transformer-2017",
    variantDesignation: "REJOINED-2017-AZR-A11",
    branchFrom: "alphago-2016",
    sources: [
      { label: "Silver et al.: AlphaZero (Science, 2018)", url: "https://www.science.org/doi/10.1126/science.aar6404" },
    ],
  },
  {
    id: "gpt-2019",
    year: 2018,
    month: 6,
    title: "GPT-1",
    shortDescription: "OpenAI's first decoder-only Transformer language model — 117M parameters.",
    longDescription:
      "Generative Pre-Training (GPT) by Radford et al. demonstrated that a decoder-only Transformer pretrained on unlabelled text and fine-tuned per task could match or beat specialised models on benchmarks. It established the pretrain-then-finetune paradigm that GPT-2, GPT-3, and the entire LLM lineage followed.",
    category: "foundational",
    fate: "rejoined",
    rejoinAt: "gpt-3-2020",
    variantDesignation: "REJOINED-2018-GP1-A12",
    branchFrom: "transformer-2017",
    sources: [
      { label: "Radford et al.: Improving Language Understanding (2018)", url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
    ],
  },
  {
    id: "clip-2021",
    year: 2021,
    month: 1,
    title: "CLIP",
    shortDescription: "OpenAI's contrastive image-text model that learned visual concepts from web captions.",
    longDescription:
      "CLIP (Contrastive Language–Image Pre-training) trained a paired image and text encoder on 400M (image, caption) pairs from the web. It enabled zero-shot image classification by computing similarity between an image and a textual prompt, and became a building block of Stable Diffusion, DALL-E 2, and most multimodal systems that followed.",
    category: "foundational",
    fate: "active",
    variantDesignation: "ACTIVE-2021-CLP-A13",
    branchFrom: "transformer-2017",
    sources: [
      { label: "Radford et al.: CLIP (2021)", url: "https://openai.com/research/clip" },
    ],
  },
  {
    id: "dalle-2-2022",
    year: 2022,
    month: 4,
    title: "DALL-E 2",
    shortDescription: "OpenAI's diffusion-based text-to-image model rewires the design industry.",
    longDescription:
      "DALL-E 2 combined CLIP's text encoder with a diffusion image decoder to generate high-fidelity images from natural-language prompts. Its public waitlist drew millions and triggered the year of generative imagery — Midjourney, Stable Diffusion, Imagen — and the first round of debates about copyright, style theft, and consent in training data.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2022-DL2-A14",
    branchFrom: "diffusion-2020",
    sources: [
      { label: "OpenAI: DALL-E 2", url: "https://openai.com/index/dall-e-2/" },
    ],
  },
  {
    id: "stable-diffusion-2022",
    year: 2022,
    month: 8,
    title: "Stable Diffusion released",
    shortDescription: "Stability AI open-sources a competitive text-to-image diffusion model.",
    longDescription:
      "Stable Diffusion, developed at LMU Munich with Stability AI compute, was released with weights and code on 22 August 2022. Unlike DALL-E 2, it ran on consumer GPUs and could be freely fine-tuned. Within weeks it had spawned a forks-and-LoRAs ecosystem that turned text-to-image into a hobbyist medium.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2022-SDF-A15",
    branchFrom: "diffusion-2020",
    sources: [
      { label: "Stability AI: Stable Diffusion Public Release", url: "https://stability.ai/news/stable-diffusion-public-release" },
    ],
  },
  {
    id: "github-copilot-2021",
    year: 2021,
    month: 6,
    title: "GitHub Copilot",
    shortDescription: "A Codex-powered IDE assistant that writes code from comments and context.",
    longDescription:
      "GitHub Copilot, built on OpenAI Codex, became the first widely deployed code-completion product backed by a large language model. It changed how engineers write code, triggered the still-ongoing debate about training on public source repositories, and presaged Cursor, Codeium, and Claude Code.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2021-CPL-A16",
    branchFrom: "transformer-2017",
    sources: [
      { label: "GitHub: Copilot announcement", url: "https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/" },
    ],
  },
  {
    id: "claude-2023",
    year: 2023,
    month: 3,
    title: "Anthropic's Claude",
    shortDescription: "A constitutional-AI assistant from Anthropic, trained with RLHF + harmlessness rules.",
    longDescription:
      "Anthropic released Claude as a general-purpose assistant trained with Constitutional AI — a method that uses a written constitution and AI feedback to reduce harms without exhaustive human labelling. Claude established Anthropic as a frontier lab alongside OpenAI, Google DeepMind, and Meta AI.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2023-CLD-A17",
    branchFrom: "rlhf-2022",
    sources: [
      { label: "Anthropic: Claude launch", url: "https://www.anthropic.com/news/introducing-claude" },
    ],
  },
  {
    id: "gemini-2023",
    year: 2023,
    month: 12,
    title: "Google Gemini",
    shortDescription: "Google's natively multimodal frontier model family — Ultra, Pro, Nano.",
    longDescription:
      "Gemini was Google DeepMind's first model trained from the start on text, code, images, audio, and video. The Ultra tier reportedly outscored GPT-4 on a majority of benchmarks at launch. Gemini consolidated Google's previously fragmented model teams (Bard, PaLM, LaMDA) into one lineage.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2023-GEM-A18",
    branchFrom: "transformer-2017",
    sources: [
      { label: "Google: Introducing Gemini", url: "https://blog.google/technology/ai/google-gemini-ai/" },
    ],
  },
  {
    id: "mistral-2023",
    year: 2023,
    month: 9,
    title: "Mistral 7B",
    shortDescription: "A French startup's 7B open-weights model outperforms larger LLaMA variants.",
    longDescription:
      "Mistral AI, founded by alumni of Meta and DeepMind, released Mistral 7B under Apache 2.0 in September 2023. It beat LLaMA 2 13B on most benchmarks despite being half the size, showing how much room remained in pretraining recipes — and that European labs could ship competitive open-weights models.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2023-MST-A19",
    branchFrom: "llama-2023",
    sources: [
      { label: "Mistral AI: Mistral 7B", url: "https://mistral.ai/news/announcing-mistral-7b/" },
    ],
  },
  {
    id: "sora-2024",
    year: 2024,
    month: 2,
    title: "OpenAI Sora",
    shortDescription: "A diffusion-Transformer text-to-video model that produces minute-long, coherent clips.",
    longDescription:
      "Sora, previewed in February 2024, generated up to 60-second 1080p video clips from text prompts using a diffusion model over spacetime patches with a Transformer backbone. Its physics consistency and shot composition surprised the industry and reset expectations for generative video.",
    category: "product",
    fate: "active",
    variantDesignation: "ACTIVE-2024-SOR-A20",
    branchFrom: "diffusion-2020",
    sources: [
      { label: "OpenAI: Sora technical report", url: "https://openai.com/index/sora/" },
    ],
  },
  {
    id: "nvidia-h100-2022",
    year: 2022,
    month: 9,
    title: "NVIDIA H100",
    shortDescription: "The Hopper-architecture GPU that became the de-facto frontier-training chip.",
    longDescription:
      "The H100 introduced FP8 precision, a Transformer Engine, and NVLink 4.0 — making it ~6× faster than A100 on large-model training. Through 2023 and 2024 it was the most acutely supply-constrained chip in the industry, and the unit of measurement for frontier AI capex.",
    category: "hardware",
    fate: "rejoined",
    rejoinAt: "gpt4-2023",
    variantDesignation: "REJOINED-2022-H100-A21",
    branchFrom: "tpu-v4-2021",
    sources: [
      { label: "NVIDIA: H100 announcement", url: "https://nvidianews.nvidia.com/news/nvidia-announces-hopper-architecture-the-next-generation-of-accelerated-computing" },
    ],
  },
  {
    id: "nvidia-blackwell-2024",
    year: 2024,
    month: 3,
    title: "NVIDIA Blackwell (B200)",
    shortDescription: "The successor to Hopper — 208B transistors and a new wave of training capacity.",
    longDescription:
      "Blackwell B200 GPUs combine two reticle-limited dies via a 10 TB/s NV-HBI link and ship in racks (GB200 NVL72) that act as one accelerator. Blackwell underpins the 2025 training runs that produced the next generation of frontier models.",
    category: "hardware",
    fate: "active",
    variantDesignation: "ACTIVE-2024-BLK-A22",
    branchFrom: "tpu-v4-2021",
    sources: [
      { label: "NVIDIA: Blackwell architecture", url: "https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing" },
    ],
  },
  {
    id: "alphafold-3-2024",
    year: 2024,
    month: 5,
    title: "AlphaFold 3",
    shortDescription: "DeepMind extends protein-structure prediction to ligands, DNA, RNA, and antibodies.",
    longDescription:
      "AlphaFold 3 replaced the AF2 evoformer with a diffusion-based architecture and predicts the joint structure of proteins together with nucleic acids and small-molecule ligands. It made structural biology a routine in-silico exercise and changed early-stage drug discovery workflows.",
    category: "foundational",
    fate: "active",
    variantDesignation: "ACTIVE-2024-AF3-A23",
    branchFrom: "alphafold-2020",
    sources: [
      { label: "Google DeepMind: AlphaFold 3", url: "https://deepmind.google/discover/blog/alphafold-3-predicts-the-structure-and-interactions-of-all-of-lifes-molecules/" },
    ],
  },
  {
    id: "executive-order-14110",
    year: 2023,
    month: 10,
    title: "US Executive Order 14110",
    shortDescription: "President Biden's order on safe, secure, and trustworthy AI — reporting thresholds and red-teaming.",
    longDescription:
      "Executive Order 14110, signed 30 October 2023, required developers of frontier dual-use foundation models above a compute threshold to share safety test results with the US government and directed NIST to publish red-teaming guidance. The Trump administration rescinded EO 14110 in January 2025; its reporting framework was partly replaced by industry voluntary commitments.",
    category: "policy",
    fate: "pruned",
    pruneYear: 2025,
    variantDesignation: "PRUNED-2023-EO14110-A24",
    branchFrom: "rlhf-2022",
    sources: [
      { label: "White House: Executive Order 14110 (2023)", url: "https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence" },
    ],
  },
  {
    id: "mcp-2024",
    year: 2024,
    month: 11,
    title: "Model Context Protocol",
    shortDescription: "Anthropic open-sources MCP — a standard for connecting LLMs to tools and data sources.",
    longDescription:
      "MCP defines a JSON-RPC protocol for exposing tools, prompts, and resources to language models. Within months it was adopted by Cursor, Zed, Sourcegraph, and the major IDE-assistant vendors as the lingua franca for agent–tool integration — analogous to LSP for editors.",
    category: "foundational",
    fate: "active",
    variantDesignation: "ACTIVE-2024-MCP-A25",
    branchFrom: "agentic-2025",
    sources: [
      { label: "Anthropic: Introducing the Model Context Protocol", url: "https://www.anthropic.com/news/model-context-protocol" },
    ],
  },
];

export const TRUNK_IDS: string[] = EVENTS.filter((e) => e.fate === "trunk").map((e) => e.id);
export const NEXUS_IDS: string[] = EVENTS.filter((e) => e.nexus).map((e) => e.id);
